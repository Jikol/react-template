import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), quiet: true });

const constants = {
  ROOT_PATH: path.resolve(import.meta.dirname),
  ENV_PREFIX: "_",
  DEBOUNCE_TIMEOUTMS: 500
} as const;

const environments = z.object({
  _WEBAPP_DEBUG: z
    .string()
    .default("true")
    .transform((val) => val === "true"),
  _WEBAPP_HTTP_PORT: z
    .string()
    .default("1234")
    .transform((port) => +port),
  _WEBAPP_HTTPS_PORT: z
    .string()
    .default("4321")
    .transform((port) => +port),
  _WEBAPP_SSL_CERT_PATH: z
    .string()
    .default("./config/ssl/selfsigned-cert.pem")
    .transform((_path) => path.resolve(_path)),
  _WEBAPP_SSL_KEY_PATH: z
    .string()
    .default("./config/ssl/selfsigned-key.pem")
    .transform((_path) => path.resolve(_path))
});

export const handleEnv = (
  envs: Record<string, string | undefined>
): z.infer<typeof environments> => {
  const parseResult = environments.safeParse(
    Object.entries(envs).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value === "" ? undefined : value }),
      {}
    )
  );

  if (!parseResult.success) {
    throw new Error(parseResult.error.issues.map((issue) => issue.message).join("\n"));
  }

  return parseResult.data;
};

export default { CONST: constants, ENVS: handleEnv(process.env) } as {
  CONST: typeof constants;
  ENVS: z.infer<typeof environments>;
};
