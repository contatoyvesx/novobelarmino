import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve caminho correto em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega .env da raiz do projeto
dotenv.config({
  path: path.resolve(__dirname, "..", ".env"),
});

// Fail fast: variáveis obrigatórias
const requiredEnvs = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_TOKEN",
];

for (const key of requiredEnvs) {
  if (!process.env[key]) {
    console.error(`❌ Variável de ambiente ausente: ${key}`);
    process.exit(1);
  }
}
