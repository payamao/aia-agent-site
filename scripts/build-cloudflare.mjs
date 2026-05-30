import { spawnSync } from "node:child_process";

const hasTinaCloud =
  Boolean(process.env.TINA_PUBLIC_CLIENT_ID) && Boolean(process.env.TINA_TOKEN);

run("astro", ["check"]);

if (hasTinaCloud) {
  run("tinacms", ["build"]);
} else {
  console.warn(
    "Tina Cloud env is missing; building site without /admin. Set TINA_PUBLIC_CLIENT_ID and TINA_TOKEN to enable Tina Cloud admin.",
  );
}

run("astro", ["build"]);

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      ASTRO_TELEMETRY_DISABLED: "1",
    },
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
