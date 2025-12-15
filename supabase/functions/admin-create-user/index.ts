import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Error codes for generic error responses
const ERROR_CODES = {
  UNAUTHORIZED: { code: 'ERR_AUTH_001', message: 'عدم دسترسی' },
  FORBIDDEN: { code: 'ERR_AUTH_002', message: 'دسترسی غیرمجاز' },
  INVALID_INPUT: { code: 'ERR_INPUT_001', message: 'اطلاعات ورودی نامعتبر است' },
  EMAIL_EXISTS: { code: 'ERR_INPUT_002', message: 'کاربری با این ایمیل قبلاً ثبت شده است' },
  SERVER_ERROR: { code: 'ERR_SRV_001', message: 'خطا در پردازش درخواست' },
  RATE_LIMITED: { code: 'ERR_RATE_001', message: 'تعداد درخواست‌ها بیش از حد مجاز است' },
};

// Input sanitization: Remove potentially dangerous characters
function sanitizeText(input: string, maxLength: number = 255): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>'"`;\\]/g, '') // Remove potentially dangerous chars
    .replace(/\s+/g, ' '); // Normalize whitespace
}

// Validate and sanitize input fields
function validateInputs(data: Record<string, unknown>): { 
  valid: boolean; 
  sanitized?: { 
    email: string; 
    password: string; 
    name: string; 
    department?: string; 
    role: string; 
    phone?: string;
    organization_id?: string;
  }; 
  error?: string 
} {
  const { email, password, name, department, role, phone, organization_id } = data;

  // Type checks
  if (typeof email !== 'string' || typeof password !== 'string' || 
      typeof name !== 'string' || typeof role !== 'string') {
    return { valid: false, error: 'INVALID_INPUT' };
  }

  // Required fields
  if (!email || !password || !name || !role) {
    return { valid: false, error: 'INVALID_INPUT' };
  }

  // Validate email format (strict regex)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email) || email.length > 254) {
    return { valid: false, error: 'INVALID_INPUT' };
  }

  // Validate password strength
  if (password.length < 6 || password.length > 128) {
    return { valid: false, error: 'INVALID_INPUT' };
  }

  // Validate role
  const validRoles = ['developer', 'admin', 'senior_manager', 'supervisor', 'safety_officer', 'medical_officer', 'viewer'];
  if (!validRoles.includes(role)) {
    return { valid: false, error: 'INVALID_INPUT' };
  }

  // Validate name length
  if (name.length < 2 || name.length > 100) {
    return { valid: false, error: 'INVALID_INPUT' };
  }

  // Sanitize text fields
  const sanitizedName = sanitizeText(name, 100);
  const sanitizedDepartment = department ? sanitizeText(String(department), 100) : undefined;

  // Validate phone if provided
  let sanitizedPhone: string | undefined;
  if (phone && typeof phone === 'string') {
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    // Only allow digits and + at start
    if (!/^\+?\d{7,15}$/.test(cleanPhone)) {
      return { valid: false, error: 'INVALID_INPUT' };
    }
    sanitizedPhone = cleanPhone;
  }

  // Validate organization_id if provided
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (organization_id && typeof organization_id === 'string' && !uuidRegex.test(organization_id)) {
    return { valid: false, error: 'INVALID_INPUT' };
  }

  return {
    valid: true,
    sanitized: {
      email: email.toLowerCase().trim(),
      password,
      name: sanitizedName,
      department: sanitizedDepartment,
      role,
      phone: sanitizedPhone,
      organization_id: organization_id as string | undefined,
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Verify the requesting user is authenticated and has admin/developer role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: ERROR_CODES.UNAUTHORIZED.message, code: ERROR_CODES.UNAUTHORIZED.code }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a client with the user's token to verify their role
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user: requestingUser }, error: userError } = await userClient.auth.getUser();
    if (userError || !requestingUser) {
      return new Response(JSON.stringify({ error: ERROR_CODES.UNAUTHORIZED.message, code: ERROR_CODES.UNAUTHORIZED.code }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if requesting user has admin or developer role
    const { data: roleData, error: roleError } = await userClient
      .from('user_roles')
      .select('role')
      .eq('user_id', requestingUser.id)
      .single();

    if (roleError || !roleData) {
      console.error('Role check failed for user:', requestingUser.id);
      return new Response(JSON.stringify({ error: ERROR_CODES.FORBIDDEN.message, code: ERROR_CODES.FORBIDDEN.code }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const allowedRoles = ['admin', 'developer'];
    if (!allowedRoles.includes(roleData.role)) {
      return new Response(JSON.stringify({ error: ERROR_CODES.FORBIDDEN.message, code: ERROR_CODES.FORBIDDEN.code }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse and validate request body
    let requestData: Record<string, unknown>;
    try {
      requestData = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: ERROR_CODES.INVALID_INPUT.message, code: ERROR_CODES.INVALID_INPUT.code }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate and sanitize all inputs
    const validation = validateInputs(requestData);
    if (!validation.valid || !validation.sanitized) {
      return new Response(JSON.stringify({ error: ERROR_CODES.INVALID_INPUT.message, code: ERROR_CODES.INVALID_INPUT.code }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { email, password, name, department, role, phone, organization_id } = validation.sanitized;

    // Create admin client with service role key
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Format phone to E.164 if provided
    let formattedPhone: string | undefined;
    if (phone) {
      let cleanPhone = phone;
      // Convert Iranian format to E.164
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '+98' + cleanPhone.substring(1);
      } else if (!cleanPhone.startsWith('+')) {
        cleanPhone = '+98' + cleanPhone;
      }
      // Validate E.164 format
      if (/^\+[1-9]\d{6,14}$/.test(cleanPhone)) {
        formattedPhone = cleanPhone;
      }
    }

    // Create user using admin API (email is auto-confirmed)
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      phone: formattedPhone,
      phone_confirm: formattedPhone ? true : undefined,
      user_metadata: {
        name,
      }
    });

    if (createError) {
      console.error('User creation error:', createError.code);
      
      // Handle email exists error
      if (createError.message?.includes('already been registered') || createError.code === 'email_exists') {
        return new Response(JSON.stringify({ 
          error: ERROR_CODES.EMAIL_EXISTS.message, 
          code: ERROR_CODES.EMAIL_EXISTS.code 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: ERROR_CODES.SERVER_ERROR.message, code: ERROR_CODES.SERVER_ERROR.code }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!newUser.user) {
      return new Response(JSON.stringify({ error: ERROR_CODES.SERVER_ERROR.message, code: ERROR_CODES.SERVER_ERROR.code }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get requesting user's organization
    const { data: requestingUserProfile } = await userClient
      .from('user_profiles')
      .select('organization_id')
      .eq('user_id', requestingUser.id)
      .single();

    const userOrgId = organization_id || requestingUserProfile?.organization_id;

    // Update user profile with additional data
    const { error: profileError } = await adminClient
      .from('user_profiles')
      .update({
        name,
        department: department || null,
        organization_id: userOrgId,
        phone: phone || null,
      })
      .eq('user_id', newUser.user.id);

    if (profileError) {
      console.error('Profile update failed for user:', newUser.user.id);
    }

    // Delete default viewer role and assign new role
    await adminClient
      .from('user_roles')
      .delete()
      .eq('user_id', newUser.user.id);

    const { error: roleInsertError } = await adminClient
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: role,
      });

    if (roleInsertError) {
      console.error('Role assignment failed for user:', newUser.user.id);
      return new Response(JSON.stringify({ error: ERROR_CODES.SERVER_ERROR.message, code: ERROR_CODES.SERVER_ERROR.code }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('User created successfully:', newUser.user.id);

    return new Response(JSON.stringify({ 
      success: true,
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        name,
        role,
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error in admin-create-user');
    return new Response(JSON.stringify({ error: ERROR_CODES.SERVER_ERROR.message, code: ERROR_CODES.SERVER_ERROR.code }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
