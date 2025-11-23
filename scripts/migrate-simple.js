import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("╔════════════════════════════════════════╗");
console.log("║   SegVision - Supabase Migration      ║");
console.log("╚════════════════════════════════════════╝\n");

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://xyfkyqkhflgeosjtunkd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Erro: SUPABASE_SERVICE_ROLE_KEY não definida!\n");
  console.log("Para executar, você precisa da service role key:\n");
  console.log(
    "1. Acesse: https://supabase.com/dashboard/project/xyfkyqkhflgeosjtunkd/settings/api"
  );
  console.log('2. Copie a "service_role" key (secret)');
  console.log("3. Execute:\n");
  console.log(
    "   SUPABASE_SERVICE_ROLE_KEY=sua_service_key node scripts/migrate-simple.js\n"
  );
  console.log("   Ou no Windows PowerShell:");
  console.log(
    '   $env:SUPABASE_SERVICE_ROLE_KEY="sua_service_key"; node scripts/migrate-simple.js\n'
  );
  process.exit(1);
}

const sqlPath = join(__dirname, "..", "supabase-migrations.sql");
console.log("📄 Lendo arquivo SQL...");

let sqlContent;
try {
  sqlContent = readFileSync(sqlPath, "utf-8");
  console.log(`✓ Arquivo carregado (${sqlContent.length} caracteres)\n`);
} catch (error) {
  console.error("❌ Erro ao ler arquivo:", error.message);
  process.exit(1);
}

console.log("🚀 Executando SQL no Supabase via Postgres Meta API...\n");

const executeSQL = async () => {
  try {
    const response = await fetch(`${SUPABASE_URL}/postgres/v1/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sqlContent }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    console.log("✅ SQL executado com sucesso!\n");
    console.log("🎯 Migration concluída!\n");
    console.log("Próximos passos:");
    console.log("  1. Configure a VITE_SUPABASE_ANON_KEY no .env/.env.local");
    console.log("  2. Execute: npm run dev");
    console.log("  3. Teste cadastro e login!\n");
  } catch (error) {
    console.error("❌ Erro ao executar SQL:", error.message);
    console.log(
      "\n⚠️  Se falhar, execute o SQL manualmente no dashboard:\n  https://supabase.com/dashboard/project/xyfkyqkhflgeosjtunkd/sql/new\n"
    );
    process.exit(1);
  }
};

executeSQL();
