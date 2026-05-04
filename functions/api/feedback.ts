// @ts-nocheck

/**
 * Feedback API — lightweight SMTP sender.
 * Receives user feedback, fire-and-forgets it to Eddy's QQ via SMTP.
 * No KV, no database, no external dependencies.
 */

export async function onRequest(context) {
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
    if (context.request.method === "POST") {
      const body = await context.request.json();
      const text = (body?.text || "").trim();
      if (!text) {
        return new Response(JSON.stringify({ error: "Feedback text is required" }), { headers, status: 400 });
      }

      const feedbackEmail = context.env.EMAIL_USER || "330261196@qq.com";
      const emailPass = context.env.EMAIL_PASS;

      if (emailPass) {
        const subject = `💬 Feedback: ${body?.page || "unknown"} [${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}]`;
        context.waitUntil(
          sendMail(feedbackEmail, emailPass, feedbackEmail, subject, text)
            .catch(e => console.error("SMTP error:", e))
        );
      }

      return new Response(JSON.stringify({ success: true, note: "Feedback sent! Thanks 🐙" }), { headers, status: 201 });
    }

    // Admin GET — returns empty list but confirms endpoint works
    if (context.request.method === "GET") {
      const auth = context.request.headers.get("X-Admin-Token");
      const expectedToken = context.env.ADMIN_TOKEN || "";
      if (expectedToken && auth !== expectedToken) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { headers, status: 401 });
      }
      return new Response(JSON.stringify({ status: "ok", note: "Feedback goes directly to email" }), { headers });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { headers, status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Internal error" }), { headers, status: 500 });
  }
}

/**
 * Minimal SMTP sender over TCP (cloudflare:sockets API)
 */
async function sendMail(from, pass, to, subject, body) {
  // Use the CF runtime connect API
  const socket = new Socket();
  await socket.connect({ hostname: "smtp.qq.com", port: 587 });
  socket.startTls(); // upgrade to TLS

  const enc = new TextEncoder();
  const dec = new TextDecoder();

  let buffer = "";
  const readResp = async () => {
    while (!buffer.includes("\r\n")) {
      const chunk = await socket.read();
      if (!chunk) break;
      buffer += dec.decode(chunk);
    }
    const line = buffer.slice(0, buffer.indexOf("\r\n"));
    buffer = buffer.slice(buffer.indexOf("\r\n") + 2);
    return line;
  };

  const writeRead = async (cmd) => {
    socket.write(enc.encode(cmd + "\r\n"));
    return readResp();
  };

  await writeRead("EHLO travel-pwa");
  await writeRead("AUTH LOGIN");
  await writeRead(btoa(from));
  await writeRead(btoa(pass));
  await writeRead(`MAIL FROM:<${from}>`);
  await writeRead(`RCPT TO:<${to}>`);
  await writeRead("DATA");

  const msg =
    `From: ${from}\r\n` +
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    `Content-Type: text/plain; charset=utf-8\r\n` +
    `\r\n` +
    `${body}\r\n` +
    `.\r\n`;
  socket.write(enc.encode(msg));
  await readResp();

  await writeRead("QUIT");
  socket.close();
}
