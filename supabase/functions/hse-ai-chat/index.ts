import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Error codes for generic error responses
const ERROR_CODES = {
  UNAUTHORIZED: { code: 'ERR_AUTH_001', message: 'عدم دسترسی' },
  FORBIDDEN: { code: 'ERR_AUTH_002', message: 'دسترسی غیرمجاز' },
  INVALID_INPUT: { code: 'ERR_INPUT_001', message: 'اطلاعات ورودی نامعتبر است' },
  RATE_LIMITED: { code: 'ERR_RATE_001', message: 'تعداد درخواست‌ها بیش از حد مجاز است' },
  SERVER_ERROR: { code: 'ERR_SRV_001', message: 'خطا در پردازش درخواست' },
  AI_ERROR: { code: 'ERR_AI_001', message: 'خطا در ارتباط با سرویس هوش مصنوعی' },
  CREDIT_ERROR: { code: 'ERR_AI_002', message: 'اعتبار تمام شده است' },
};

// Input validation and sanitization
const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES = 50;
const MAX_PAGE_CONTEXT_LENGTH = 8000;

// Sanitize text input to prevent prompt injection
function sanitizeInput(input: string, maxLength: number): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize whitespace (preserve intentional newlines)
    .replace(/[^\S\n]+/g, ' ');
}

// Validate message structure
function validateMessages(messages: unknown): { valid: boolean; sanitized?: Array<{role: string; content: string}> } {
  if (!Array.isArray(messages)) return { valid: false };
  if (messages.length === 0 || messages.length > MAX_MESSAGES) return { valid: false };

  const sanitized: Array<{role: string; content: string}> = [];
  
  for (const msg of messages) {
    if (typeof msg !== 'object' || msg === null) return { valid: false };
    
    const { role, content } = msg as Record<string, unknown>;
    
    if (typeof role !== 'string' || typeof content !== 'string') return { valid: false };
    if (!['user', 'assistant'].includes(role)) return { valid: false };
    if (content.length === 0 || content.length > MAX_MESSAGE_LENGTH) return { valid: false };

    sanitized.push({
      role,
      content: sanitizeInput(content, MAX_MESSAGE_LENGTH)
    });
  }

  return { valid: true, sanitized };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: ERROR_CODES.UNAUTHORIZED.message, code: ERROR_CODES.UNAUTHORIZED.code }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with user's JWT token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Validate JWT token and get user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed');
      return new Response(JSON.stringify({ error: ERROR_CODES.UNAUTHORIZED.message, code: ERROR_CODES.UNAUTHORIZED.code }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Authorization: Check user role
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || !roleData) {
      console.error('Role check failed for user:', user.id);
      return new Response(JSON.stringify({ error: ERROR_CODES.FORBIDDEN.message, code: ERROR_CODES.FORBIDDEN.code }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const allowedRoles = ['admin', 'senior_manager', 'developer', 'safety_officer', 'supervisor', 'medical_officer'];
    if (!allowedRoles.includes(roleData.role)) {
      console.log('User role not authorized:', roleData.role);
      return new Response(JSON.stringify({ error: ERROR_CODES.FORBIDDEN.message, code: ERROR_CODES.FORBIDDEN.code }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    let requestData: Record<string, unknown>;
    try {
      requestData = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: ERROR_CODES.INVALID_INPUT.message, code: ERROR_CODES.INVALID_INPUT.code }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { messages, pageContext } = requestData;
    
    // Validate and sanitize messages
    const validation = validateMessages(messages);
    if (!validation.valid || !validation.sanitized) {
      return new Response(JSON.stringify({ error: ERROR_CODES.INVALID_INPUT.message, code: ERROR_CODES.INVALID_INPUT.code }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize pageContext if provided
    let sanitizedPageContext: string | undefined;
    if (pageContext && typeof pageContext === 'string') {
      sanitizedPageContext = sanitizeInput(pageContext, MAX_PAGE_CONTEXT_LENGTH);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(JSON.stringify({ error: ERROR_CODES.SERVER_ERROR.message, code: ERROR_CODES.SERVER_ERROR.code }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `شما یک متخصص خبره در زمینه ایمنی و بهداشت حرفه‌ای (HSE - Health, Safety, and Environment) هستید. 

مسئولیت‌های شما شامل موارد زیر است:
- پاسخگویی به سوالات مرتبط با ارزیابی ریسک، مجوزهای کار، حوادث، آموزش‌های ایمنی
- راهنمایی در خصوص استانداردهای ایمنی و بهداشت حرفه‌ای
- تحلیل و بررسی گزارش‌های روزانه HSE
- ارائه توصیه‌های کاربردی برای بهبود شرایط ایمنی
- پاسخگویی به سوالات عمومی فراتر از حوزه HSE

${sanitizedPageContext ? `\n\nمحتوای صفحه فعلی کاربر:\n${sanitizedPageContext}\n\nشما می‌توانید در پاسخ‌های خود به این محتوا اشاره کنید و راهنمایی‌های مرتبط ارائه دهید.` : ''}

لطفاً پاسخ‌های خود را به زبان فارسی و به صورت واضح، حرفه‌ای و کاربردی ارائه دهید.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...validation.sanitized,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: ERROR_CODES.RATE_LIMITED.message, code: ERROR_CODES.RATE_LIMITED.code }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: ERROR_CODES.CREDIT_ERROR.message, code: ERROR_CODES.CREDIT_ERROR.code }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", response.status);
      return new Response(JSON.stringify({ error: ERROR_CODES.AI_ERROR.message, code: ERROR_CODES.AI_ERROR.code }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Unexpected error in hse-ai-chat");
    return new Response(JSON.stringify({ error: ERROR_CODES.SERVER_ERROR.message, code: ERROR_CODES.SERVER_ERROR.code }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
