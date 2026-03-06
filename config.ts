import cryptoRandomString from "crypto-random-string";
import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const constants = {
  ROOT_PATH: path.resolve(__dirname),
  ENV_PREFIX: "RETINA_WEBAPP_",
  DEBOUNCE_TIMEOUTMS: 500
} as const;

const environments = z.object({
  RETINA_WEBAPP_DEBUG: z
    .string()
    .default("true")
    .transform((val) => val === "true"),
  RETINA_WEBAPP_HTTP_PORT: z
    .string()
    .default("80")
    .transform((port) => +port),
  RETINA_WEBAPP_HTTPS_PORT: z
    .string()
    .default("443")
    .transform((port) => +port),
  RETINA_WEBAPP_VIEW: z
    .union([z.literal("retina"), z.literal("showcase")])
    .default("retina"),
  RETINA_WEBAPP_API_URL: z.string().url().default("https://example.com"),
  RETINA_WEBAPP_API_STAGINGUSER_EMAIL: z.string().default("johndoe@example.com"),
  RETINA_WEBAPP_API_STAGINGUSER_PASSWD: z
    .string()
    .default(cryptoRandomString({ length: 12, type: "alphanumeric" })),
  RETINA_WEBAPP_SSL_CERT_PATH: z
    .string()
    .default("/etc/ssl/certs/selfsigned-cert.pem")
    .transform((_path) => path.resolve(_path)),
  RETINA_WEBAPP_SSL_KEY_PATH: z
    .string()
    .default("/etc/ssl/private/selfsigned-key.pem")
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
    throw new Error(parseResult.error.message);
  }

  return parseResult.data;
};

export default { CONST: constants, ENVS: handleEnv(process.env) } as {
  CONST: typeof constants;
  ENVS: z.infer<typeof environments>;
};
