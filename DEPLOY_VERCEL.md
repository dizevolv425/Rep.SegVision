# 🚀 Guia de Deploy SegVision na Vercel

Este guia contém instruções passo a passo para fazer deploy do SegVision na Vercel.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- [x] Conta no [Vercel](https://vercel.com)
- [x] Conta no [Supabase](https://supabase.com)
- [x] Projeto Supabase criado e configurado
- [x] Código no GitHub: https://github.com/dizevolv425/Rep.SegVision.git

---

## 🗄️ ETAPA 1: Preparar Banco de Dados Supabase

### 1.1 Executar Migrations

Acesse o **SQL Editor** no seu projeto Supabase e execute as migrations na ordem:

```bash
# 1. Schema completo
supabase/migrations/*.sql

# 2. Migrations críticas (em ordem):
- create_security_settings.sql
- create_security_logs.sql
- fix_security_logs_and_triggers.sql
- create_storage_buckets_and_policies.sql
- create_user_notification_preferences.sql
- create_system_monitoring_tables.sql
- create_system_monitoring_functions.sql
- extend_admin_dashboard_stats_with_monitoring_v2.sql
```

**Via Supabase Dashboard:**
1. Acesse seu projeto no Supabase
2. Vá em **SQL Editor**
3. Copie e cole cada migration
4. Execute com `Run`

### 1.2 Verificar Storage Buckets

No **Storage** do Supabase, verifique se os buckets foram criados:
- ✅ `avatars` (público, 2MB limit)
- ✅ `platform-assets` (público, 5MB limit)

Se não existirem, execute:
```sql
-- Ver migrations/create_storage_buckets_and_policies.sql
```

### 1.3 Seed Data (Opcional para Demo)

Execute os arquivos de seed:
```bash
seeds-dashboard-data.sql
seeds-admin-dashboard-data.sql
```

### 1.4 Obter Credenciais Supabase

No Supabase Dashboard, vá em **Settings** → **API**:

- **Project URL**: `https://xxxxxxxx.supabase.co`
- **Project ID**: `xxxxxxxx`
- **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**⚠️ Salve estas informações para a próxima etapa!**

---

## 🌐 ETAPA 2: Deploy na Vercel

### 2.1 Importar Projeto do GitHub

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **Import Git Repository**
3. Conecte sua conta GitHub se necessário
4. Selecione: `dizevolv425/Rep.SegVision`
5. Clique em **Import**

### 2.2 Configurar Projeto

Na tela de configuração:

**Framework Preset**: Vite
**Root Directory**: `./` (deixar vazio)
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

### 2.3 Configurar Environment Variables

Clique em **Environment Variables** e adicione:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=xxxxxxxx
```

**Substitua pelos valores obtidos na Etapa 1.4!**

**Importante:**
- ✅ Marcar para **Production**, **Preview** e **Development**
- ✅ Triple-check: Nomes devem começar com `VITE_`
- ⚠️ Não adicione aspas ao redor dos valores

### 2.4 Deploy

1. Clique em **Deploy**
2. Aguarde o build (~2-3 minutos)
3. ✅ Deploy concluído!

---

## ✅ ETAPA 3: Verificar Deployment

### 3.1 Testar a Aplicação

1. Acesse a URL gerada (ex: `segvision-xxxxx.vercel.app`)
2. Teste o login com um usuário do Supabase
3. Verifique:
   - ✅ Login funciona
   - ✅ Dashboard carrega dados
   - ✅ Notificações funcionam
   - ✅ Avatar upload funciona
   - ✅ System Health mostra métricas reais

### 3.2 Configurar Domínio (Opcional)

No Vercel Dashboard:
1. Vá em **Settings** → **Domains**
2. Adicione seu domínio customizado
3. Configure DNS conforme instruções

### 3.3 Verificar Logs

Se houver problemas:
1. Vá em **Deployments**
2. Clique no deployment atual
3. Veja **Build Logs** e **Function Logs**

---

## 🔧 ETAPA 4: Configurações Pós-Deploy

### 4.1 Configurar Authentication Redirect URLs

No Supabase Dashboard, vá em **Authentication** → **URL Configuration**:

Adicione URLs permitidas:
```
https://segvision-xxxxx.vercel.app
https://segvision-xxxxx.vercel.app/**
```

Se tiver domínio customizado:
```
https://seudominio.com
https://seudominio.com/**
```

### 4.2 Criar Usuário Admin

No Supabase, execute:
```sql
-- Criar usuário admin via SQL
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@segvision.com',
  crypt('SuaSenhaSegura123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
) RETURNING id;

-- Depois, pegar o ID retornado e criar o perfil:
INSERT INTO public.users (
  id,
  email,
  full_name,
  user_type,
  school_id,
  created_at
) VALUES (
  'uuid-retornado-acima',
  'admin@segvision.com',
  'Administrador do Sistema',
  'admin',
  NULL,
  NOW()
);
```

**Ou via Supabase Auth UI:**
1. Authentication → Users
2. Add user
3. Email: `admin@segvision.com`
4. Password: escolha uma senha forte
5. Auto Confirm User: ✅

### 4.3 Configurar Continuous Deployment

Já está configurado automaticamente! 🎉

Toda vez que você fizer push para `main`, a Vercel fará deploy automaticamente:
```bash
git add .
git commit -m "feat: Nova funcionalidade"
git push origin main
```

---

## 🐛 Troubleshooting

### Erro: "Supabase client not initialized"

**Causa:** Environment variables não configuradas corretamente

**Solução:**
1. Vercel Dashboard → Settings → Environment Variables
2. Verificar se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` existem
3. Redeploy: Deployments → ... → Redeploy

### Erro: "Failed to fetch"

**Causa:** Supabase não permite conexões do domínio Vercel

**Solução:**
1. Supabase → Settings → API → URL Configuration
2. Adicionar domínio Vercel às URLs permitidas
3. Aguardar propagação (~1 minuto)

### Erro: "Bucket not found"

**Causa:** Storage buckets não foram criados

**Solução:**
1. Execute migration: `create_storage_buckets_and_policies.sql`
2. Verifique no Supabase → Storage

### Build falha com erro de dependências

**Solução:**
```bash
# Local: limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Commit e push
git add package-lock.json
git commit -m "fix: Update dependencies"
git push origin main
```

### Dados do Dashboard não aparecem

**Causa:** Views não foram criadas ou não há dados

**Solução:**
1. Execute migrations de dashboard
2. Execute seed data
3. Verifique via SQL Editor:
```sql
SELECT * FROM dashboard_stats;
SELECT * FROM admin_dashboard_stats;
```

---

## 📊 Monitoramento

### Vercel Analytics

Ative analytics gratuitamente:
1. Vercel Dashboard → Analytics
2. Enable

### Supabase Logs

Monitore queries e performance:
1. Supabase Dashboard → Logs
2. Filtre por tipo: API, Auth, Storage

---

## 🚀 Próximos Passos

Após o deploy bem-sucedido:

1. ✅ **Configurar domínio customizado**
2. ✅ **Ativar SSL automático** (Vercel faz isso automaticamente)
3. ✅ **Criar usuários de teste**
4. ✅ **Popular dados de escolas**
5. ✅ **Configurar backups do Supabase**
6. ✅ **Configurar monitoramento de uptime** (UptimeRobot, Pingdom)
7. ✅ **Ativar Vercel Edge Functions** (opcional)

---

## 📞 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Issues**: https://github.com/dizevolv425/Rep.SegVision/issues

---

## ✅ Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] ✅ Migrations executadas com sucesso
- [ ] ✅ Storage buckets criados
- [ ] ✅ Environment variables configuradas
- [ ] ✅ Deploy na Vercel concluído
- [ ] ✅ Aplicação acessível via URL
- [ ] ✅ Login funcionando
- [ ] ✅ Dashboard carregando dados reais
- [ ] ✅ Notificações funcionando
- [ ] ✅ Avatar upload funcionando
- [ ] ✅ System Health mostrando métricas
- [ ] ✅ URLs de callback configuradas no Supabase
- [ ] ✅ Usuário admin criado
- [ ] ✅ Domínio customizado configurado (opcional)

---

**🎉 Parabéns! Seu SegVision está no ar!**

Acesse: `https://segvision-xxxxx.vercel.app`
