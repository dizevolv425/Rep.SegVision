# ⚡ Quick Deploy Guide - SegVision

Guia rápido de 5 minutos para deploy do SegVision na Vercel.

---

## 🎯 Pré-requisitos

- ✅ Conta Vercel
- ✅ Conta Supabase
- ✅ Projeto Supabase criado

---

## 📝 Passo a Passo

### 1️⃣ Supabase Setup (5 min)

**Obter credenciais:**
```
Supabase Dashboard → Settings → API
```

Copie:
- Project URL: `https://xxx.supabase.co`
- Anon key: `eyJhbGci...`
- Project ID: `xxx`

**Executar migrations:**
```
Supabase Dashboard → SQL Editor
```

Cole e execute cada arquivo de `supabase/migrations/` na ordem alfabética.

### 2️⃣ Vercel Deploy (2 min)

1. Acesse https://vercel.com/new
2. Import Git Repository
3. Selecione `dizevolv425/Rep.SegVision`
4. Configure:
   ```
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   ```

5. **Environment Variables:**
   ```bash
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   VITE_SUPABASE_PROJECT_ID=xxx
   ```

6. Deploy!

### 3️⃣ Pós-Deploy (2 min)

**Configurar URLs no Supabase:**
```
Authentication → URL Configuration
```

Adicione:
```
https://seu-projeto.vercel.app
https://seu-projeto.vercel.app/**
```

**Criar usuário admin:**
```sql
-- No Supabase SQL Editor
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@segvision.com', crypt('senha123', gen_salt('bf')), NOW())
RETURNING id;

-- Usar o ID retornado:
INSERT INTO public.users (id, email, full_name, user_type)
VALUES ('id-retornado', 'admin@segvision.com', 'Admin', 'admin');
```

---

## ✅ Verificar

- [ ] https://seu-projeto.vercel.app abre
- [ ] Login funciona
- [ ] Dashboard carrega dados
- [ ] Sem erros no console

---

## 🆘 Problemas Comuns

**Build falha:**
```bash
# Localmente:
npm install
npm run build
```

**Login não funciona:**
- Verifique environment variables na Vercel
- Verifique URL Configuration no Supabase

**Dados não aparecem:**
- Execute todas as migrations
- Verifique SQL Editor por erros

---

## 📚 Documentação Completa

Ver [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) para guia detalhado.

---

**🚀 Deploy em 9 minutos!**
