# 🔧 Fix: Dados Não Aparecem no Vercel

Guia para resolver problema de dados em fallback/mock na produção.

---

## 🎯 Problema

O site na Vercel está mostrando dados vazios ou de fallback ao invés dos dados reais do Supabase.

---

## ✅ Solução: 3 Passos

### PASSO 1: Configurar Environment Variables na Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique no seu projeto **SegVision**
3. Vá em **Settings** → **Environment Variables**
4. **Adicione estas 3 variáveis:**

```bash
Name: VITE_SUPABASE_URL
Value: https://xyfkyqkhflgeosjtunkd.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

```bash
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Zmt5cWtoZmxnZW9zanR1bmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDQ2MjUsImV4cCI6MjA3OTIyMDYyNX0.czLJxPPYkVKM0ktneHuS4pp8uE53Ezj68YALL_fM9XI
Environments: ✅ Production ✅ Preview ✅ Development
```

```bash
Name: VITE_SUPABASE_PROJECT_ID
Value: xyfkyqkhflgeosjtunkd
Environments: ✅ Production ✅ Preview ✅ Development
```

5. Clique em **Save** em cada uma

**⚠️ IMPORTANTE:**
- NÃO coloque aspas ao redor dos valores
- Os nomes devem começar com `VITE_`
- Marque todas as 3 environments

---

### PASSO 2: Configurar URLs Permitidas no Supabase

1. Acesse: https://app.supabase.com/project/xyfkyqkhflgeosjtunkd
2. Vá em **Authentication** → **URL Configuration**
3. Em **Site URL**, adicione:
   ```
   https://seu-projeto.vercel.app
   ```

4. Em **Redirect URLs**, adicione:
   ```
   https://seu-projeto.vercel.app/**
   http://localhost:5173/**
   http://localhost:3000/**
   ```

5. Clique em **Save**

**Substitua `seu-projeto.vercel.app` pela URL real da sua aplicação!**

---

### PASSO 3: Redeploy na Vercel

**DEPOIS de configurar as variáveis:**

1. Vercel Dashboard → Seu Projeto
2. **Deployments**
3. Clique nos **3 pontinhos (...)** do último deployment
4. **Redeploy**
5. **DESMARQUE** ☑️ Use existing Build Cache
6. Clique **Redeploy**

Aguarde ~2 minutos para o build completar.

---

## 🧪 Testar se Funcionou

Após o redeploy:

1. Acesse seu site: `https://seu-projeto.vercel.app`
2. Abra o **Console do navegador** (F12 → Console)
3. Procure por erros relacionados a Supabase

### ✅ Sinais de que está funcionando:
- Login funciona sem erros
- Dashboard carrega dados (não zeros ou vazios)
- Console sem erros de "Failed to fetch"

### ❌ Se ainda não funcionar:

**Verifique no Console do navegador:**

1. Se aparecer `Supabase client not initialized`:
   - Environment variables não foram configuradas corretamente

2. Se aparecer `Failed to fetch` ou `CORS error`:
   - URLs não foram adicionadas no Supabase

3. Se aparecer `No rows returned`:
   - Database está vazio (execute migrations e seeds)

---

## 🔍 Debug Avançado

### Verificar se Variáveis Foram Aplicadas

No Console do navegador, execute:
```javascript
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
```

**Deve retornar:** `https://xyfkyqkhflgeosjtunkd.supabase.co`

**Se retornar `undefined`:**
- Variáveis não foram configuradas na Vercel
- Ou você esqueceu de fazer redeploy

### Verificar Conexão Supabase

No Console do navegador, execute:
```javascript
// Verificar se client está inicializado
console.log('Supabase:', window.supabase || 'not loaded');
```

### Verificar RLS Policies

No Supabase SQL Editor, execute:
```sql
-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Ver policies
SELECT * FROM pg_policies
WHERE schemaname = 'public';
```

---

## 📋 Checklist Final

- [ ] Environment variables configuradas na Vercel
- [ ] Todas as 3 variáveis presentes (URL, ANON_KEY, PROJECT_ID)
- [ ] URLs adicionadas no Supabase (Authentication → URL Configuration)
- [ ] Redeploy executado SEM cache
- [ ] Build completou com sucesso
- [ ] Site abre sem erros
- [ ] Login funciona
- [ ] Dashboard mostra dados reais

---

## 🆘 Ainda não funciona?

1. **Limpar cache do navegador:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

2. **Verificar logs da Vercel:**
   - Deployments → Seu deploy → Function Logs
   - Procure por erros

3. **Verificar logs do Supabase:**
   - Supabase Dashboard → Logs → API
   - Veja se há requisições sendo bloqueadas

4. **Testar em navegador anônimo/privado:**
   - Às vezes cache local causa problemas

---

## 📞 Suporte

Se seguiu todos os passos e ainda não funciona:
- Verifique se as migrations foram executadas no Supabase
- Verifique se há dados nas tabelas (execute seeds)
- Abra issue no GitHub com prints dos erros

---

**URL do Projeto Supabase:** https://app.supabase.com/project/xyfkyqkhflgeosjtunkd

**Repository:** https://github.com/buyapp01/repsegvision
