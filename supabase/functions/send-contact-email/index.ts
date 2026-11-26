const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const BodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify(parsed.error), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, email, message } = parsed.data;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${name} <onboarding@resend.dev>`,
        to: ["arpitkhemka22@gmail.com"],
        reply_to: email,
        subject: `New Enquiry from ${name} — mktpvt.ltd`,
        html: `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <style>
    :root { color-scheme: light; }
    body { margin: 0 !important; padding: 0 !important; background-color: #f4f4f5 !important; }
    * { -webkit-text-size-adjust: none; }
    @media (prefers-color-scheme: dark) {
      body { background-color: #f4f4f5 !important; }
      .card { background-color: #ffffff !important; }
      .body-text { color: #1a1a2e !important; }
      .label-text { color: #6b7280 !important; }
      .msg-bg { background-color: #f9fafb !important; color: #374151 !important; }
      .reply-bg { background-color: #eff6ff !important; color: #4b5563 !important; }
      .dark-header { background-color: #1a1a2e !important; }
      .dark-footer { background-color: #1a1a2e !important; }
      .gold-banner { background-color: #c9a84c !important; }
    }
  </style>
</head>
<body style="margin:0;padding:20px 0;background-color:#f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;">
    <tr><td align="center" style="padding:20px 16px;">

      <table class="card" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td class="dark-header" style="background-color:#1a1a2e;padding:32px;text-align:center;">
            <img src="https://mktpvt.ltd/mkt-logo.png" alt="M Khemka Trading" width="72" style="display:block;margin:0 auto 12px;height:auto;" />
            <p style="margin:0;color:#c9a84c;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;font-family:Arial,sans-serif;">We Serve Trust</p>
          </td>
        </tr>

        <!-- Gold banner -->
        <tr>
          <td class="gold-banner" style="background-color:#c9a84c;padding:12px 32px;text-align:center;">
            <p style="margin:0;color:#1a1a2e;font-size:12px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;font-family:Arial,sans-serif;">New Website Enquiry</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td class="card" style="background-color:#ffffff;padding:32px;">

            <!-- Name row -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid #f3f4f6;margin-bottom:0;">
              <tr>
                <td class="label-text" width="90" style="padding:14px 0;color:#9ca3af;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:Arial,sans-serif;vertical-align:top;">Name</td>
                <td class="body-text" style="padding:14px 0;font-size:15px;font-weight:600;color:#1a1a2e;font-family:Arial,sans-serif;">${name}</td>
              </tr>
            </table>

            <!-- Email row -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid #f3f4f6;margin-bottom:0;">
              <tr>
                <td class="label-text" width="90" style="padding:14px 0;color:#9ca3af;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:Arial,sans-serif;vertical-align:top;">Email</td>
                <td style="padding:14px 0;font-size:15px;font-family:Arial,sans-serif;"><a href="mailto:${email}" style="color:#1a1a2e;text-decoration:none;">${email}</a></td>
              </tr>
            </table>

            <!-- Message -->
            <p class="label-text" style="margin:24px 0 8px;color:#9ca3af;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-family:Arial,sans-serif;">Message</p>
            <div class="msg-bg" style="background-color:#f9fafb;border-left:3px solid #c9a84c;padding:16px 18px;font-size:15px;line-height:1.8;white-space:pre-wrap;color:#374151;font-family:Arial,sans-serif;">${message}</div>

            <!-- Reply hint -->
            <div class="reply-bg" style="margin-top:24px;padding:14px 16px;background-color:#eff6ff;border-radius:4px;">
              <p style="margin:0;font-size:12px;color:#4b5563;font-family:Arial,sans-serif;">Hit <strong>Reply</strong> to respond directly to ${name} at <a href="mailto:${email}" style="color:#1a1a2e;">${email}</a>.</p>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td class="dark-footer" style="background-color:#1a1a2e;padding:24px 32px;text-align:center;">
            <img src="https://mktpvt.ltd/mkt-logo.png" alt="MKT" width="36" style="display:block;margin:0 auto 10px;height:auto;opacity:0.6;" />
            <p style="margin:0 0 4px;font-size:11px;color:#6b7280;font-family:Arial,sans-serif;letter-spacing:0.08em;">office@mktpvt.ltd &nbsp;·&nbsp; +91 83340 38247</p>
            <p style="margin:0;font-size:10px;color:#4b5563;font-family:Arial,sans-serif;">5th Floor, Onex Central, 12 Syed Salley St, Barabazar, Kolkata 700073</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
      }),
    });

    const result = await resendRes.json();

    if (!resendRes.ok) {
      return new Response(JSON.stringify(result), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("FUNCTION ERROR:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});