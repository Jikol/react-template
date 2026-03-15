# ⚛️ React Template

> A modern, production-ready template for developing web applications with **React**,
> **Tailwind CSS** and **shadcn/ui** and deploying via **Docker**, with **Taskfile** as
> the task runner.

---

## 🌍 Environment Variables

**Setup:** Copy `.env.template` to `.env.local` and fill in your values for local
development.

All environment variables must be prefixed with `VITE_`.

When adding a new environment variable, update **all the following** to keep the entire
stack in sync:

| File              | What to do                                                                                                                                                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.env.template`   | Add the variable name with a comment describing its expected type and default value. Serves as the blueprint for `.env.local`.                                                                                                    |
| `config.ts`       | Define Zod validation in the `environments` object. Apply any transformations here (e.g. string → boolean, string → number). The default value defined here must match the comment in `.env.template`.                            |
| `vite.config.ts`  | Add the variable to the `codeEnvs` array if it should be available in application code (exposed via `CONFIG`). Variables omitted from this array are available only for build/environment config and will not leak to the client. |
| `types/vite.d.ts` | Add variables that are present in `codeEnvs` to the `ImportMetaEnv` interface — enables TypeScript IntelliSense for those variables in application code.                                                                          |
| `Taskfile.yml`    | Add variables present in `codeEnvs` to `requires.vars` and as `--build-arg` of the `docker:build` task.                                                                                                                           |
| `Dockerfile`      | Add `ARG` and `ENV` instructions for every variable added to `Taskfile.yml` as `--build-arg`. Variables present in `codeEnvs` must be added in the base stage.                                                                    |
| `compose.yml`     | Add to the `environment` section of the `webapp` service so it's available inside the running container.                                                                                                                          |

---

## 🐳 Docker

To change the default Docker image name, update the `DEFAULT_DOCKER_IMAGE` env variable in
`Taskfile.yml`.
