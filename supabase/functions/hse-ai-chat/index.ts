import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, pageContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `شما یک متخصص خبره در زمینه ایمنی و بهداشت حرفه‌ای (HSE - Health, Safety, and Environment) هستید. 

مسئولیت‌های شما شامل موارد زیر است:
- پاسخگویی به سوالات مرتبط با ارزیابی ریسک، مجوزهای کار، حوادث، آموزش‌های ایمنی
- راهنمایی در خصوص استانداردهای ایمنی و بهداشت حرفه‌ای
- تحلیل و بررسی گزارش‌های روزانه HSE
- ارائه توصیه‌های کاربردی برای بهبود شرایط ایمنی
- پاسخگویی به سوالات عمومی فراتر از حوزه HSE

${pageContext ? `\n\nمحتوای صفحه فعلی کاربر:\n${pageContext}\n\nشما می‌توانید در پاسخ‌های خود به این محتوا اشاره کنید و راهنمایی‌های مرتبط ارائه دهید.` : ''}

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی بعد تلاش کنید." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "اعتبار تمام شده است. لطفاً اعتبار خود را شارژ کنید." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "خطا در ارتباط با سرویس هوش مصنوعی" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "خطای ناشناخته" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
