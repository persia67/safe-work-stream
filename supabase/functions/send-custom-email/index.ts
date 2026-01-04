import React from 'https://esm.sh/react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'https://esm.sh/resend@4.0.0'
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22'
import { ConfirmationEmail } from './_templates/confirmation.tsx'
import { RecoveryEmail } from './_templates/recovery.tsx'
import { InviteEmail } from './_templates/invite.tsx'
import { MagicLinkEmail } from './_templates/magic-link.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  
  let webhookData: any

  // Try to verify webhook signature if secret is configured
  if (hookSecret) {
    try {
      const wh = new Webhook(hookSecret)
      webhookData = wh.verify(payload, headers)
    } catch (error) {
      console.error('Webhook verification failed:', error)
      return new Response(
        JSON.stringify({ error: { message: 'Invalid webhook signature' } }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
  } else {
    // If no hook secret, parse JSON directly (for testing)
    try {
      webhookData = JSON.parse(payload)
    } catch (error) {
      return new Response(
        JSON.stringify({ error: { message: 'Invalid JSON payload' } }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
  }

  try {
    const {
      user,
      email_data: {
        token,
        token_hash,
        redirect_to,
        email_action_type,
        site_url,
      },
    } = webhookData as {
      user: { email: string }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    
    // Build the verification URL with the correct site URL
    const verificationUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to || site_url}`

    let html: string
    let subject: string

    switch (email_action_type) {
      case 'signup':
      case 'email_confirmation':
        html = await renderAsync(
          React.createElement(ConfirmationEmail, {
            confirmation_url: verificationUrl,
            token,
          })
        )
        subject = 'تأیید ایمیل - سامانه ایمنی و بهداشت'
        break

      case 'recovery':
        html = await renderAsync(
          React.createElement(RecoveryEmail, {
            recovery_url: verificationUrl,
            token,
          })
        )
        subject = 'بازیابی رمز عبور - سامانه ایمنی و بهداشت'
        break

      case 'invite':
        html = await renderAsync(
          React.createElement(InviteEmail, {
            invite_url: verificationUrl,
            token,
          })
        )
        subject = 'دعوت به سامانه ایمنی و بهداشت'
        break

      case 'magiclink':
        html = await renderAsync(
          React.createElement(MagicLinkEmail, {
            magic_link_url: verificationUrl,
            token,
          })
        )
        subject = 'لینک ورود - سامانه ایمنی و بهداشت'
        break

      default:
        // Default to confirmation email for unknown types
        html = await renderAsync(
          React.createElement(ConfirmationEmail, {
            confirmation_url: verificationUrl,
            token,
          })
        )
        subject = 'سامانه ایمنی و بهداشت'
    }

    const { data, error } = await resend.emails.send({
      from: 'سامانه ایمنی و بهداشت <noreply@resend.dev>',
      to: [user.email],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error: any) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code || 500,
          message: error.message || 'Failed to send email',
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
