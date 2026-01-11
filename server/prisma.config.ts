// server/prisma/schema.prisma (o en tu caso prisma.config.ts)
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Usamos el helper 'env' que garantiza que sea un string válido
    url: env("DATABASE_URL"),
  },
});