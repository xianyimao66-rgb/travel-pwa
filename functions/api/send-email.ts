// @ts-nocheck

interface Env {
  EMAIL_USER: string;
  EMAIL_PASS: string;
}

interface DayPlan {
  day: number;
  title: string;
  intro?: string;
  description: string;
  activities: { time: string; name: string; description: string; duration: string; cost: number }[];
  meals: { type: string; recommendation: string; estimatedCost: number }[];
  transportTips?: string;
}

interface TripPlan {
  destination: string;
  days: number;
  travelers: number;
  travelType: string;
  budgetLevel: string;
  preferences: string[];
  overview: string;
  dayPlans: DayPlan[];
  totalEstimatedCost: number;
  tips: string[];
}

function buildEmailHtml(plan: TripPlan): string {
  let daysHtml = '';
  for (const day of plan.dayPlans) {
    const introHtml = day.intro
      ? `<p style="font-style:italic;color:#6b7280;border-left:3px solid #93c5fd;padding-left:12px;margin:0 0 12px 0;font-size:14px;line-height:1.6;">${escapeHtml(day.intro)}</p>`
      : '';
    
    let actsHtml = '';
    for (const a of day.activities) {
      actsHtml += `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">
            <span style="background:#eff6ff;color:#1d4ed8;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;">🕐 ${escapeHtml(a.time)}</span>
            <span style="color:#9ca3af;font-size:12px;">· ${escapeHtml(a.duration)}</span>
            <span style="margin-left:auto;color:#6b7280;font-size:12px;">💰 ~¥${a.cost}</span>
          </div>
          <div style="font-weight:600;font-size:14px;color:#111827;">📍 ${escapeHtml(a.name)}</div>
          <p style="margin:4px 0 0 0;font-size:13px;color:#4b5563;line-height:1.5;">${escapeHtml(a.description)}</p>
        </td>
      </tr>`;
    }

    const transportHtml = day.transportTips
      ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px;margin:12px 0;">
          <div style="font-weight:700;font-size:11px;color:#b45309;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">🚖 Getting Around</div>
          <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">${escapeHtml(day.transportTips)}</p>
        </div>`
      : '';

    let mealsHtml = '';
    for (const m of day.meals) {
      const mealIcon = m.type === 'Breakfast' ? '🌅' : m.type === 'Lunch' ? '☀️' : '🌙';
      mealsHtml += `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#f9fafb;border-radius:8px;margin-bottom:4px;">
        <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
          <span style="background:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;color:#4b5563;border:1px solid #e5e7eb;white-space:nowrap;">${mealIcon} ${m.type}</span>
          <span style="font-size:13px;color:#374151;">${escapeHtml(m.recommendation)}</span>
        </div>
        <span style="font-size:12px;color:#6b7280;white-space:nowrap;margin-left:8px;">¥${m.estimatedCost}</span>
      </div>`;
    }

    daysHtml += `<div style="background:white;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#eff6ff,#eef2ff);padding:12px 16px;display:flex;align-items:center;gap:10px;">
        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#6366f1);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${day.day}</div>
        <div style="font-weight:700;font-size:15px;color:#111827;">${escapeHtml(day.title)}</div>
      </div>
      <div style="padding:12px 16px;">
        ${introHtml}
        <p style="margin:0 0 12px 0;font-size:13px;color:#374151;line-height:1.6;">${escapeHtml(day.description)}</p>
        <table style="width:100%;border-collapse:collapse;">${actsHtml}</table>
        ${transportHtml}
        ${mealsHtml ? `<div style="margin-top:12px;">${mealsHtml}</div>` : ''}
      </div>
    </div>`;
  }

  const tipsHtml = plan.tips?.length
    ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-top:16px;">
        <h4 style="margin:0 0 8px 0;font-size:14px;color:#92400e;">💡 Travel Tips</h4>
        <ul style="margin:0;padding-left:20px;">
          ${plan.tips.map(t => `<li style="font-size:13px;color:#78350f;line-height:1.5;margin-bottom:4px;">${escapeHtml(t)}</li>`).join('')}
        </ul>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:16px;">
  <div style="background:linear-gradient(135deg,#3b82f6,#6366f1,#7c3aed);border-radius:16px;padding:24px;color:white;margin-bottom:16px;">
    <h1 style="margin:0 0 4px 0;font-size:22px;">🗺️ ${escapeHtml(plan.destination)}</h1>
    <p style="margin:0 0 8px 0;opacity:0.9;font-size:14px;">${plan.travelers} traveler(s) · ${plan.days} days · ${escapeHtml(plan.travelType)} trip</p>
    <p style="margin:0;opacity:0.85;font-size:13px;line-height:1.5;">${escapeHtml(plan.overview)}</p>
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
      <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:12px;font-size:11px;">📅 ${plan.days} Days</span>
      <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:12px;font-size:11px;">💰 ¥${plan.totalEstimatedCost?.toLocaleString() || '0'} Total</span>
      <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:12px;font-size:11px;">🏷️ ${escapeHtml(plan.budgetLevel)}</span>
    </div>
  </div>
  ${daysHtml}
  ${tipsHtml}
  <div style="text-align:center;padding:24px 0;color:#9ca3af;font-size:12px;">
    <p style="margin:0;">Generated by Travel Planner</p>
    <p style="margin:4px 0 0 0;"><a href="https://travel-pwa.pages.dev" style="color:#3b82f6;text-decoration:none;">travel-pwa.pages.dev</a></p>
  </div>
</div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function sendSmtpMail(user: string, pass: string, to: string, subject: string, html: string): Promise<void> {
  // Use QQ SMTP via direct socket connection
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
      // Multi-line: last line has space after code
      if (line[3] === ' ' && code === expected) return line;
      if (code >= 400) throw new Error(`SMTP error: ${line}`);
    }
  }

  try {
    await send(null, 220);
    await send(`EHLO travel-planner`, 250);
    
    // AUTH LOGIN
    await send(`AUTH LOGIN`, 334);
    await send(Buffer.from(user).toString('base64'), 334);
    await send(Buffer.from(pass).toString('base64'), 235);
    
    await send(`MAIL FROM:<${user}>`, 250);
    await send(`RCPT TO:<${to}>`, 250);
    await send(`DATA`, 354);

    const boundary = `----=_Part_${Date.now()}`;
    const emailBody = [
      `From: "Travel Planner" <${user}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      Buffer.from(`Travel Itinerary\n\nView this itinerary in a HTML-capable email client.\n\n---\nGenerated by Travel Planner`).toString('base64'),
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset="UTF-8"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      Buffer.from(html).toString('base64'),
      ``,
      `--${boundary}--`,
    ].join('\r\n');

    // Send email body line by line (SMTP DATA ends with \r\n.\r\n)
    for (const part of emailBody.split('\r\n')) {
      await writer.write(encoder.encode(part + '\r\n'));
    }
    await writer.write(encoder.encode('\r\n.\r\n'));
    await readLine(); // 250 Ok
    
    await send(`QUIT`, 221);
  } finally {
    writer.close().catch(() => {});
  }
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (context.request.method === "OPTIONS") return new Response(null, { headers, status: 204 });
  if (context.request.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { headers, status: 405 });

  try {
    const { to, subject, plan } = await context.request.json() as { to: string; plan: TripPlan; subject: string };

    if (!to || !to.includes('@') || !plan) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { headers, status: 400 });
    }

    const html = buildEmailHtml(plan);
    
    await sendSmtpMail(context.env.EMAIL_USER, context.env.EMAIL_PASS, to, subject, html);

    return new Response(JSON.stringify({ success: true }), { headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), { headers, status: 500 });
  }
}
