#!/usr/bin/env node

/**
 * Script de verificação pré-deploy
 * Valida se todas as configurações necessárias estão prontas
 */

const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const { green, red, yellow, cyan, bold, reset } = colors;

console.log(`\n${cyan}${bold}🔍 SegVision - Verificação Pré-Deploy${reset}\n`);

let errors = 0;
let warnings = 0;

// 1. Verificar se .env existe (local)
console.log(`${bold}1. Verificando arquivo .env...${reset}`);
if (fs.existsSync('.env')) {
  console.log(`   ${green}✓${reset} Arquivo .env encontrado`);

  const envContent = fs.readFileSync('.env', 'utf-8');

  // Verificar variáveis necessárias
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_SUPABASE_PROJECT_ID'
  ];

  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`   ${green}✓${reset} ${varName} configurado`);
    } else {
      console.log(`   ${red}✗${reset} ${varName} NÃO encontrado`);
      errors++;
    }
  });
} else {
  console.log(`   ${yellow}⚠${reset} Arquivo .env não encontrado (OK para Vercel)`);
  warnings++;
}

// 2. Verificar package.json
console.log(`\n${bold}2. Verificando package.json...${reset}`);
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  if (pkg.scripts?.build) {
    console.log(`   ${green}✓${reset} Script 'build' encontrado: ${pkg.scripts.build}`);
  } else {
    console.log(`   ${red}✗${reset} Script 'build' NÃO encontrado`);
    errors++;
  }

  if (pkg.dependencies?.['@supabase/supabase-js']) {
    console.log(`   ${green}✓${reset} Supabase client instalado`);
  } else {
    console.log(`   ${red}✗${reset} Supabase client NÃO instalado`);
    errors++;
  }

  if (pkg.dependencies?.['react']) {
    console.log(`   ${green}✓${reset} React instalado`);
  } else {
    console.log(`   ${red}✗${reset} React NÃO instalado`);
    errors++;
  }
} else {
  console.log(`   ${red}✗${reset} package.json NÃO encontrado`);
  errors++;
}

// 3. Verificar vite.config.ts
console.log(`\n${bold}3. Verificando vite.config.ts...${reset}`);
if (fs.existsSync('vite.config.ts')) {
  console.log(`   ${green}✓${reset} vite.config.ts encontrado`);
} else {
  console.log(`   ${red}✗${reset} vite.config.ts NÃO encontrado`);
  errors++;
}

// 4. Verificar estrutura de pastas
console.log(`\n${bold}4. Verificando estrutura de pastas...${reset}`);
const requiredFolders = [
  'src',
  'src/components',
  'src/hooks',
  'src/lib',
  'supabase/migrations'
];

requiredFolders.forEach(folder => {
  if (fs.existsSync(folder)) {
    console.log(`   ${green}✓${reset} ${folder}/`);
  } else {
    console.log(`   ${red}✗${reset} ${folder}/ NÃO encontrado`);
    errors++;
  }
});

// 5. Verificar migrations críticas
console.log(`\n${bold}5. Verificando migrations...${reset}`);
const criticalMigrations = [
  'create_security_settings.sql',
  'create_security_logs.sql',
  'create_storage_buckets_and_policies.sql',
  'create_user_notification_preferences.sql'
];

const migrationsPath = 'supabase/migrations';
if (fs.existsSync(migrationsPath)) {
  criticalMigrations.forEach(migration => {
    const migrationPath = path.join(migrationsPath, migration);
    if (fs.existsSync(migrationPath)) {
      console.log(`   ${green}✓${reset} ${migration}`);
    } else {
      console.log(`   ${yellow}⚠${reset} ${migration} não encontrado (verifique se já foi executado)`);
      warnings++;
    }
  });
} else {
  console.log(`   ${yellow}⚠${reset} Pasta migrations não encontrada`);
  warnings++;
}

// 6. Verificar arquivo de configuração Supabase
console.log(`\n${bold}6. Verificando supabase client...${reset}`);
if (fs.existsSync('src/lib/supabase.ts')) {
  const supabaseContent = fs.readFileSync('src/lib/supabase.ts', 'utf-8');

  if (supabaseContent.includes('createClient')) {
    console.log(`   ${green}✓${reset} Supabase client configurado`);
  } else {
    console.log(`   ${red}✗${reset} Supabase client mal configurado`);
    errors++;
  }

  if (supabaseContent.includes('VITE_SUPABASE_URL')) {
    console.log(`   ${green}✓${reset} Usando variáveis de ambiente corretas`);
  } else {
    console.log(`   ${red}✗${reset} Variáveis de ambiente não encontradas`);
    errors++;
  }
} else {
  console.log(`   ${red}✗${reset} src/lib/supabase.ts NÃO encontrado`);
  errors++;
}

// 7. Verificar .gitignore
console.log(`\n${bold}7. Verificando .gitignore...${reset}`);
if (fs.existsSync('.gitignore')) {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf-8');

  if (gitignoreContent.includes('.env')) {
    console.log(`   ${green}✓${reset} .env está no .gitignore`);
  } else {
    console.log(`   ${red}✗${reset} .env NÃO está no .gitignore (PERIGO!))`);
    errors++;
  }

  if (gitignoreContent.includes('node_modules')) {
    console.log(`   ${green}✓${reset} node_modules está no .gitignore`);
  } else {
    console.log(`   ${yellow}⚠${reset} node_modules não está no .gitignore`);
    warnings++;
  }
} else {
  console.log(`   ${yellow}⚠${reset} .gitignore não encontrado`);
  warnings++;
}

// Resumo
console.log(`\n${bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${reset}`);
console.log(`${bold}📊 Resumo:${reset}`);
console.log(`${bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${reset}\n`);

if (errors === 0 && warnings === 0) {
  console.log(`${green}${bold}✓ Tudo pronto para deploy!${reset}\n`);
  console.log(`${cyan}Próximo passo:${reset}`);
  console.log(`1. Configure as Environment Variables na Vercel`);
  console.log(`2. Faça deploy via Vercel Dashboard`);
  console.log(`3. Execute as migrations no Supabase\n`);
  process.exit(0);
} else if (errors === 0) {
  console.log(`${yellow}${bold}⚠ ${warnings} avisos encontrados${reset}\n`);
  console.log(`${cyan}Você pode continuar, mas revise os avisos acima.${reset}\n`);
  process.exit(0);
} else {
  console.log(`${red}${bold}✗ ${errors} erros encontrados${reset}`);
  console.log(`${yellow}${bold}⚠ ${warnings} avisos${reset}\n`);
  console.log(`${cyan}Por favor, corrija os erros antes de fazer deploy.${reset}\n`);
  process.exit(1);
}
