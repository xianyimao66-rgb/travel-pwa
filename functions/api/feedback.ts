// @ts-nocheck

interface Env {
  EMAIL_USER?: string;
  EMAIL_PASS?: string;
}

interface FeedbackEntry {
  id: string;
  text: string;
  timestamp: string;
  page: string;
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers, status: 204 });
  }

  try {
    if (context.request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { headers, status: 405 });
    }

    const { text, page } = await context.request.json() as { text?: string; page?: string };

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: "Feedback text is required" }), { headers, status: 400 });
    }

    const entry: FeedbackEntry = {
      id: crypto.randomUUID(),
      text: text.trim(),
      timestamp: new Date().toISOString(),
      page: page || "unknown",
    };

    // Forward to QQ email via SMTP
    try {
      await sendSmtpMail(
        context.env.EMAIL_USER || "330261196@qq.com",
        context.env.EMAIL_PASS || "",
        "330261196@qq.com",
        `💬 Travel Planner Feedback — ${entry.page}`,
        buildFeedbackEmail(entry)
      );
    } catch (emailErr: any) {
      console.error("Failed to email feedback:", emailErr);
      return new Response(JSON.stringify({
        success: true,
        note: "Feedback received but email notification failed — check server SMTP config",
      }), { headers, status: 201 });
    }

    return new Response(JSON.stringify({ success: true, id: entry.id }), { headers, status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), { headers, status: 500 });
  }
}

function buildFeedbackEmail(entry: FeedbackEntry): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:16px;">
  <div style="background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:12px;padding:20px;color:white;margin-bottom:16px;">
    <h1 style="margin:0;font-size:18px;">💬 New Feedback</h1>
    <p style="margin:4px 0 0 0;opacity:0.8;font-size:13px;">${entry.page}</p>
  </div>
  <div style="background:white;border-radius:12px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;white-space:pre-wrap;">${escapeHtml(entry.text)}</p>
  </div>
  <div style="text-align:center;padding:16px 0;color:#9ca3af;font-size:11px;">
    <p style="margin:0;">${new Date(entry.timestamp).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</p>
    <p style="margin:4px 0 0 0;">ID: ${entry.id}</p>
  </div>
</div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function sendSmtpMail(user: string, pass: string, to: string, subject: string, html: string): Promise<void> {
  const { connect } = await import('cloudflare:sockets');

  const sock = connect({ host: 'smtp.qq.com', port: 587, tls: true });
  const writer = sock.writable.getWriter();
  const reader = sock.readable.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let buf = '';
  async function readLine(): Promise<string> {
    while (!buf.includes('\n')) {
      const { value, done } = await reader.read();
      if (done) throw new Error('Connection closed');
      buf += decoder.decode(value, { stream: true });
    }
    const idx = buf.indexOf('\n');
    const line = buf.slice(0, idx).replace(/\r$/, '');
    buf = buf.slice(idx + 1);
    return line;
  }

  async function send(cmd: string, expected: number): Promise<string> {
    if (cmd) await writer.write(encoder.encode(cmd + '\r\n'));
    while (true) {
      const line = await readLine();
      const match = line.match(/^(\d{3})/);
      if (!match) continue;
      const code = parseInt(match[1], 10);
      if (line[3] === ' ' && code === expected) return line;
      if (code >= 400) throw new Error(`SMTP error: ${line}`);
    }
  }

  try {
    await send(null, 220);
    await send(`EHLO travel-planner`, 250);
    await send(`AUTH LOGIN`, 334);
    await send(btoa(user), 334);
    await send(btoa(pass), 235);

    await send(`MAIL FROM:<${user}>`, 250);
    await send(`RCPT TO:<${to}>`, 250);
    await send(`DATA`, 354);

    const boundary = `----=_Part_${Date.now()}`;
    const emailBody = [
      `From: "Travel Planner Feedback" <${user}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset="UTF-8"`,
      ``,
      html,
      ``,
      `.`,
    ].join('\r\n');

    await writer.write(encoder.encode(emailBody + '\r\n'));
    await readLine();
    await send(`QUIT`, 221);
  } finally {
    writer.close().catch(() => {});
  }
}
