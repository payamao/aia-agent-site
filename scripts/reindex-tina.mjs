const clientId =
  process.env.TINA_PUBLIC_CLIENT_ID ||
  process.env.TINA_CLIENT_ID ||
  "";
const branch =
  process.env.TINA_PUBLIC_BRANCH ||
  process.env.TINA_BRANCH ||
  "main";
const token = process.env.TINA_TOKEN || "";
const host = process.env.TINA_CONTENT_HOST || "content.tinajs.io";

if (!clientId) {
  fail("TINA_PUBLIC_CLIENT_ID is missing.");
}

if (!token) {
  fail("TINA_TOKEN is missing.");
}

const resetUrl = new URL(`https://${host}/db/${clientId}/reset/${encodeURIComponent(branch)}`);
resetUrl.searchParams.set("refreshSchema", "true");
resetUrl.searchParams.set("skipIfSchemaCurrent", "false");

console.log(`Requesting Tina Cloud reindex for branch '${branch}'...`);
await requestJson(resetUrl, { method: "POST" });

const statusUrl = `https://${host}/db/${clientId}/status/${encodeURIComponent(branch)}`;
let lastStatus = "unknown";

for (let attempt = 1; attempt <= 60; attempt += 1) {
  const status = await requestJson(statusUrl);
  lastStatus = status.status || "unknown";

  if (lastStatus === "complete") {
    console.log("Tina Cloud reindex complete.");
    await verifyContentApi();
    process.exit(0);
  }

  if (lastStatus === "failed") {
    fail(`Tina Cloud reindex failed: ${status.error || "unknown error"}`);
  }

  console.log(`Index status: ${lastStatus}; waiting...`);
  await sleep(5000);
}

fail(`Timed out waiting for Tina Cloud reindex. Last status: ${lastStatus}`);

async function verifyContentApi() {
  const url = `https://${host}/2.4/content/${clientId}/github/${encodeURIComponent(branch)}`;
  const result = await requestJson(url, {
    method: "POST",
    body: JSON.stringify({
      query: "{ collections { name slug } }",
      variables: {},
    }),
  });

  const collections = result?.data?.collections || [];
  console.log(`Verified Tina Content API. Collections: ${collections.map((item) => item.name).join(", ")}`);
}

async function requestJson(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": token,
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    fail(`Tina Cloud returned non-JSON response with status ${response.status}.`);
  }

  if (!response.ok || json.errors) {
    const message =
      json.message ||
      json.errors?.map((error) => error.message).join("; ") ||
      response.statusText ||
      "unknown error";
    fail(`Tina Cloud request failed with status ${response.status}: ${message}`);
  }

  return json;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
