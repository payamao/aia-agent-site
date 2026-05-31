import { spawnSync } from "node:child_process";

const hasTinaCloud =
  Boolean(process.env.TINA_PUBLIC_CLIENT_ID) && Boolean(process.env.TINA_TOKEN);

run("astro", ["check"]);

if (hasTinaCloud) {
  const tinaBuild = run(
    "tinacms",
    ["build", "--skip-cloud-checks", "--skip-indexing", "--skip-search-index"],
    { exitOnError: false },
  );
  if (tinaBuild.status !== 0) {
    console.warn(
      "Tina Cloud admin build failed. Continuing with the public site so production deploy is not blocked. Check Tina Cloud project configuration and branch indexing.",
    );
  }
} else {
  console.warn(
    "Tina Cloud env is missing; building site without /admin. Set TINA_PUBLIC_CLIENT_ID and TINA_TOKEN to enable Tina Cloud admin.",
  );
}

run("astro", ["build"]);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      ASTRO_TELEMETRY_DISABLED: "1",
    },
    shell: process.platform === "win32",
  });

  if (result.status !== 0 && options.exitOnError !== false) {
    process.exit(result.status ?? 1);
  }

  return result;
}
