# React Template Project

This project serves as a template for creating web applications in React using Tailwind
CSS and shadcn components.

## Environment Variables

**Setup**: Create a `.env.local` file based on `template.env` to configure environment
variables for your local development.

When adding new environment variables, changes must be made in the following files to
ensure proper functionality across the entire stack (development, build, docker, types):

- **`template.env`**: Add the name of the new variable with a comment about the expected
  type and default value. It serves as a pattern for `.env.local`.
- **`config.ts`**: Define validation for the new variable using Zod in the `environments`
  object. Transformations (e.g., string to boolean or number) are also performed here.
- **`types/vite.d.ts`**: Add variables that are intended to be used in the application
  code to the `ImportMetaEnv` interface. This ensures they are available with IntelliSense
  and TypeScript. Only "code-level" variables should be here.
- **`vite.config.ts`**: All environment variables that do NOT belong in the application
  code and are used only for development/environment configuration (e.g., ports, SSL
  paths) MUST be destructured and removed from the `handledViteEnvs` object. This prevents
  them from being exposed in the client-side `CONFIG` object. For example, `_WEBAPP_DEBUG`
  is kept for the code, but ports are destructured out.
- **`Dockerfile`**: Add `ARG` and `ENV` instructions for the new variable so it's
  available during build or in the running container.
- **`Taskfile.yml`**: In the `requires.vars` section and in the `docker build` command
  arguments (or exports in `docker:compose`), add the new variable so that the `task` tool
  passes it correctly to Docker.
- **`compose.yml`**: Add the variable to the `environment` section of the `webapp` service
  to make it available for the container started via Docker Compose.

All environment variables in this project should start with the `_WEBAPP_` prefix (defined
in `config.ts`).
