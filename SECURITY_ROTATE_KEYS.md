# 🔐 AÇÃO URGENTE: Rotacionar Chaves do Supabase

**⚠️ ALERTA DE SEGURANÇA**

As credenciais do Supabase foram expostas publicamente no GitHub.

**Risco:** Qualquer pessoa pode acessar seu banco de dados com as chaves antigas.

---

## ⚡ Ação Imediata Necessária

### 1️⃣ Rotacionar Chaves no Supabase (5 min)

1. Acesse: https://app.supabase.com/project/xyfkyqkhflgeosjtunkd/settings/api

2. Role até **Project API keys**

3. Clique em **Reset** ao lado de:
   - ✅ `anon` `public` key
   - ⚠️ **NÃO** reset `service_role` (ainda não foi exposta)

4. **Copie a NOVA chave gerada**

---

### 2️⃣ Atualizar .env Local

Edite seu arquivo `.env` local com a **NOVA chave**:

```bash
VITE_SUPABASE_URL=https://xyfkyqkhflgeosjtunkd.supabase.co
VITE_SUPABASE_ANON_KEY=nova-chave-aqui
VITE_SUPABASE_PROJECT_ID=xyfkyqkhflgeosjtunkd
```

---

### 3️⃣ Atualizar Environment Variables na Vercel

1. https://vercel.com/dashboard → Seu Projeto → **Settings** → **Environment Variables**

2. **Delete** a variável antiga:
   - `VITE_SUPABASE_ANON_KEY` → ⋮ → Delete

3. **Adicione a nova:**
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: [nova-chave-do-passo-1]
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

4. **Save**

---

### 4️⃣ Redeploy na Vercel

1. **Deployments** → **...** → **Redeploy**
2. **DESMARQUE** cache
3. Deploy

---

### 5️⃣ Verificar Logs do Supabase (Opcional mas Recomendado)

Verifique se houve acessos não autorizados:

1. https://app.supabase.com/project/xyfkyqkhflgeosjtunkd/logs/explorer

2. Procure por:
   - Requests de IPs desconhecidos
   - Queries suspeitas
   - Alterações não autorizadas

3. Se encontrar atividade suspeita:
   - Contate suporte do Supabase
   - Revise todas as tabelas por alterações

---

## 🛡️ Prevenção Futura

### ✅ O que já está correto agora:

1. `.env` removido do git ✅
2. `.gitignore` configurado ✅
3. `.env.example` criado como template ✅

### 📝 Boas Práticas:

1. **NUNCA commite arquivos com credenciais:**
   - `.env`
   - `credentials.json`
   - Arquivos com senhas, tokens, API keys

2. **Sempre use .env.example:**
   - Template sem credenciais reais
   - Documenta variáveis necessárias

3. **Rotacione chaves periodicamente:**
   - A cada 90 dias (recomendado)
   - Imediatamente se suspeitar de comprometimento

4. **Use diferentes chaves por ambiente:**
   - Dev: Projeto Supabase de desenvolvimento
   - Prod: Projeto Supabase de produção

---

## 🔍 Como Verificar se .env foi Removido

```bash
# Verificar se .env está no git
git ls-files | grep .env

# Deve retornar APENAS:
# .env.example

# Se retornar .env, execute:
git rm --cached .env
git commit -m "security: Remove .env from tracking"
git push origin main
```

---

## ⚠️ Histórico do Git

**Importante:** As chaves antigas ainda existem no **histórico** do Git.

Para remover completamente (avançado):

```bash
# CUIDADO: Reescreve histórico - pode quebrar clones existentes
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (CUIDADO!)
git push origin --force --all
```

**⚠️ Recomendação:** Ao invés de reescrever histórico, é mais seguro simplesmente **rotacionar as chaves**.

---

## 📋 Checklist

- [ ] Chaves rotacionadas no Supabase
- [ ] `.env` local atualizado com novas chaves
- [ ] Environment Variables atualizadas na Vercel
- [ ] Redeploy executado na Vercel
- [ ] Site funcionando com novas chaves
- [ ] Logs do Supabase verificados (opcional)
- [ ] `.env` confirmado removido do git

---

## 🆘 Suporte

Se precisar de ajuda:
- Supabase Support: https://supabase.com/support
- Vercel Support: https://vercel.com/support

---

## ✅ Após Completar

Quando todas as chaves forem rotacionadas e funcionando:

1. Teste o site em produção
2. Teste login e dashboard
3. Verifique que não há erros de autenticação
4. Confirme que .env NÃO está no repositório

**Status:** 🔴 **PENDENTE** - Execute os passos acima o quanto antes!

---

**Data da Exposição:** 2025-01-23
**Chaves Comprometidas:** `anon/public key`
**Ação Necessária:** Rotação imediata
