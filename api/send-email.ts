export default async function handler(
  req: { method: string; body: { name?: string; email?: string; message?: string } },
  res: { status: (code: number) => { json: (data: unknown) => void } }
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "Missing RESEND_API_KEY" });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: ["arpitkhemka22@gmail.com"],
      subject: `New Contact Message from ${name}`,
      html: `<h2>New Contact Message</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(500).json({ error: (data as { message?: string }).message ?? "Failed to send email" });
  }

  return res.status(200).json({ success: true });
}
