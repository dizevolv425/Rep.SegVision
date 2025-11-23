import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

console.log(`${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.blue}║   SegVision - Supabase Migration      ║${colors.reset}`);
console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`);

// Lê as variáveis de ambiente
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://xyfkyqkhflgeosjtunkd.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error(`${colors.red}❌ Erro: SUPABASE_SERVICE_ROLE_KEY não definida!${colors.reset}\n`);
  console.log(`${colors.yellow}Para executar as migrations, você precisa da service role key (não use a anon key).${colors.reset}\n`);
  console.log(`${colors.yellow}1. Acesse: https://supabase.com/dashboard/project/xyfkyqkhflgeosjtunkd/settings/api${colors.reset}`);
  console.log(`${colors.yellow}2. Copie a "service_role" key (secret)${colors.reset}`);
  console.log(`${colors.yellow}3. Execute:${colors.reset}`);
  console.log(`   ${colors.blue}SUPABASE_SERVICE_ROLE_KEY=sua_service_key node scripts/migrate.js${colors.reset}\n`);
  process.exit(1);
}

console.log(`${colors.blue}📡 Conectando ao Supabase...${colors.reset}`);
console.log(`   URL: ${SUPABASE_URL}\n`);

// Cria cliente com service role key (bypassa RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Lê o arquivo SQL
const sqlPath = join(__dirname, '..', 'supabase-migrations.sql');
console.log(`${colors.blue}📄 Lendo arquivo de migration...${colors.reset}`);
console.log(`   ${sqlPath}\n`);

let sqlContent;
try {
  sqlContent = readFileSync(sqlPath, 'utf-8');
  console.log(`${colors.green}✓ Arquivo carregado com sucesso (${sqlContent.length} caracteres)${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}❌ Erro ao ler arquivo SQL:${colors.reset}`, error.message);
  process.exit(1);
}

// Executa a migration
console.log(`${colors.blue}🚀 Executando migration...${colors.reset}\n`);

// Divide o SQL em comandos individuais (separados por ;)
// Remove comentários e linhas vazias
const commands = sqlContent
  .split(';')
  .map(cmd => cmd.trim())
  .filter(cmd => cmd && !cmd.startsWith('--'));

let successCount = 0;
let errorCount = 0;

for (let i = 0; i < commands.length; i++) {
  const command = commands[i];

  if (!command) continue;

  // Extrai o tipo de comando para mostrar no log
  const commandType = command.split(/\s+/)[0].toUpperCase();

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: command });

    if (error) {
      // Tenta executar diretamente via API REST
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ sql: command })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    }

    console.log(`${colors.green}✓${colors.reset} ${commandType} [${i + 1}/${commands.length}]`);
    successCount++;
  } catch (error) {
    // Alguns erros são esperados (ex: tipo já existe)
    if (error.message.includes('already exists') || error.message.includes('já existe')) {
      console.log(`${colors.yellow}⚠${colors.reset} ${commandType} [${i + 1}/${commands.length}] - Já existe (ignorado)`);
      successCount++;
    } else {
      console.error(`${colors.red}✗${colors.reset} ${commandType} [${i + 1}/${commands.length}]`);
      console.error(`   ${colors.red}Erro: ${error.message}${colors.reset}`);
      errorCount++;
    }
  }
}

console.log(`\n${colors.blue}════════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}║          Resultado da Migration       ║${colors.reset}`);
console.log(`${colors.blue}════════════════════════════════════════${colors.reset}`);
console.log(`${colors.green}✓ Sucesso: ${successCount} comandos${colors.reset}`);
if (errorCount > 0) {
  console.log(`${colors.red}✗ Erros: ${errorCount} comandos${colors.reset}`);
}
console.log(`${colors.blue}════════════════════════════════════════${colors.reset}\n`);

if (errorCount === 0) {
  console.log(`${colors.green}🎉 Migration concluída com sucesso!${colors.reset}\n`);
  console.log(`${colors.yellow}Próximos passos:${colors.reset}`);
  console.log(`  1. Configure a VITE_SUPABASE_ANON_KEY no .env.local`);
  console.log(`  2. Execute: npm run dev`);
  console.log(`  3. Acesse: http://localhost:3000\n`);
  process.exit(0);
} else {
  console.log(`${colors.red}⚠ Migration concluída com erros. Revise os logs acima.${colors.reset}\n`);
  process.exit(1);
}
