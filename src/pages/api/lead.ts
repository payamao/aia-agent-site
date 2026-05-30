import type { APIRoute } from "astro";
import { site } from "@/site";

export const prerender = false;

type LeadPayload = {
  name?: string;
  phone?: string;
  channel?: string;
  interest?: string;
  message?: string;
  website?: string;
};

type NotifyResult = {
  provider: "line" | "email" | "dry-run";
  ok: boolean;
  status?: number;
  error?: string;
};

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
};

type RuntimeEnv = {
  LINE_CHANNEL_ACCESS_TOKEN?: string;
  LINE_TO_ID?: string;
  RESEND_API_KEY?: string;
  LEAD_EMAIL_TO?: string;
  LEAD_EMAIL_FROM?: string;
};

export const POST: APIRoute = async ({ request, locals, url }) => {
  const env = getRuntimeEnv(locals);

  // CSRF: block cross-site browser submissions. Browsers always send Origin on
  // a fetch POST; non-browser clients (no Origin) are not a CSRF vector.
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) {
    return json({ message: "ไม่อนุญาตคำขอจากภายนอก" }, 403);
  }

  // Enforce JSON so the endpoint can't be driven with form-like content types.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ message: "รูปแบบข้อมูลไม่ถูกต้อง" }, 415);
  }

  // Defense-in-depth body cap before buffering the payload into memory.
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 10_000) {
    return json({ message: "ข้อมูลมีขนาดใหญ่เกินไป" }, 413);
  }

  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ message: "รูปแบบข้อมูลไม่ถูกต้อง" }, 400);
  }

  if (payload.website) {
    return json({ ok: true });
  }

  const lead = normalizeLead(payload);
  const validation = validateLead(lead);
  if (validation) {
    return json({ message: validation }, 400);
  }

  const text = formatLeadMessage(lead);
  const results = await Promise.all([sendLine(text, env), sendEmail(lead, text, env)]);
  const configuredResults = results.filter(Boolean) as NotifyResult[];

  if (configuredResults.length === 0) {
    console.info("Lead received without notification provider configured");
    return json({
      ok: true,
      mode: "dry-run",
      results: [{ provider: "dry-run", ok: true }],
    });
  }

  if (!configuredResults.some((result) => result.ok)) {
    console.error(
      "Lead notification failed",
      configuredResults.map((result) => ({
        provider: result.provider,
        ok: result.ok,
        status: result.status,
      })),
    );
    return json(
      {
        message:
          "รับข้อมูลแล้ว แต่ระบบแจ้งเตือนมีปัญหา กรุณาโทรติดต่อโดยตรงหากเป็นเรื่องเร่งด่วน",
      },
      502,
    );
  }

  return json({ ok: true });
};

function normalizeLead(payload: LeadPayload) {
  return {
    name: (payload.name || "").trim(),
    phone: (payload.phone || "").trim(),
    channel: (payload.channel || "โทรศัพท์").trim(),
    interest: (payload.interest || "ยังไม่แน่ใจ อยากปรึกษาก่อน").trim(),
    message: (payload.message || "").trim(),
  };
}

function validateLead(lead: ReturnType<typeof normalizeLead>) {
  const phoneDigits = lead.phone.replace(/\D/g, "");

  if (lead.name.length < 2) {
    return "กรุณากรอกชื่อ-นามสกุล";
  }

  if (phoneDigits.length < 9 || phoneDigits.length > 10) {
    return "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง";
  }

  if (lead.message.length > 1000) {
    return "ข้อความเพิ่มเติมยาวเกินไป";
  }

  return "";
}

function formatLeadMessage(lead: ReturnType<typeof normalizeLead>) {
  const lines = [
    "มี lead ใหม่จากเว็บไซต์ AIA Agent",
    `ชื่อ: ${lead.name}`,
    `โทร: ${lead.phone}`,
    `ช่องทางติดต่อ: ${lead.channel}`,
    `สนใจ: ${lead.interest}`,
  ];

  if (lead.message) {
    lines.push(`ข้อความ: ${lead.message}`);
  }

  lines.push(`แหล่งที่มา: ${site.url}`);
  return lines.join("\n");
}

async function sendLine(
  text: string,
  env: RuntimeEnv,
): Promise<NotifyResult | null> {
  const token = env.LINE_CHANNEL_ACCESS_TOKEN;
  const to = env.LINE_TO_ID;

  if (!token || !to) {
    return null;
  }

  try {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        to,
        messages: [{ type: "text", text }],
      }),
    });

    return {
      provider: "line",
      ok: response.ok,
      status: response.status,
      error: response.ok ? undefined : await response.text(),
    };
  } catch (error) {
    return {
      provider: "line",
      ok: false,
      error: error instanceof Error ? error.message : "Unknown LINE error",
    };
  }
}

async function sendEmail(
  lead: ReturnType<typeof normalizeLead>,
  text: string,
  env: RuntimeEnv,
): Promise<NotifyResult | null> {
  const apiKey = env.RESEND_API_KEY;
  const to = env.LEAD_EMAIL_TO;
  const from = env.LEAD_EMAIL_FROM || "AIA Agent <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return null;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Lead ใหม่: ${lead.name} (${lead.interest})`,
        text,
      }),
    });

    return {
      provider: "email",
      ok: response.ok,
      status: response.status,
      error: response.ok ? undefined : await response.text(),
    };
  } catch (error) {
    return {
      provider: "email",
      ok: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    };
  }
}

function getRuntimeEnv(locals: App.Locals): RuntimeEnv {
  const runtimeEnv = locals.runtime?.env ?? {};

  return {
    LINE_CHANNEL_ACCESS_TOKEN:
      runtimeEnv.LINE_CHANNEL_ACCESS_TOKEN ?? import.meta.env.LINE_CHANNEL_ACCESS_TOKEN,
    LINE_TO_ID: runtimeEnv.LINE_TO_ID ?? import.meta.env.LINE_TO_ID,
    RESEND_API_KEY: runtimeEnv.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY,
    LEAD_EMAIL_TO: runtimeEnv.LEAD_EMAIL_TO ?? import.meta.env.LEAD_EMAIL_TO,
    LEAD_EMAIL_FROM: runtimeEnv.LEAD_EMAIL_FROM ?? import.meta.env.LEAD_EMAIL_FROM,
  };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });
}
