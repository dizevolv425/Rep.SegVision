# 🔐 Fix: Erro "Usuário não autenticado" após Login

Solução para o erro onde o usuário consegue fazer login mas depois recebe "Usuário não autenticado" ao acessar dados.

---

## ✅ Fix Aplicado

Atualizei o `src/lib/supabase.ts` com configurações adequadas de autenticação:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,        // ✅ Persiste sessão
    autoRefreshToken: true,      // ✅ Renova token automaticamente
    detectSessionInUrl: true,    // ✅ Detecta sessão via URL
    storage: window.localStorage, // ✅ Usa localStorage
    storageKey: 'segvision-auth', // ✅ Chave customizada
    flowType: 'pkce',            // ✅ Fluxo seguro
  },
});
```

---

## 🔧 Próximos Passos

### 1. Verificar Configuração de Auth no Supabase

Acesse: https://app.supabase.com/project/xyfkyqkhflgeosjtunkd/auth/url-configuration

**Verifique se está configurado:**

#### Site URL:
```
https://seu-projeto.vercel.app
```

#### Redirect URLs:
```
https://seu-projeto.vercel.app/**
https://seu-projeto.vercel.app/auth/callback
http://localhost:5173/**
http://localhost:3000/**
```

#### Additional Redirect URLs:
Se você usar domínio customizado, adicione:
```
https://seudominio.com/**
```

---

### 2. Configurar PKCE Flow (Recomendado)

No Supabase Dashboard:

1. **Authentication** → **Settings**
2. Procure por **PKCE Flow**
3. Certifique-se que está **HABILITADO** ✅

---

### 3. Aguardar Novo Deploy

A Vercel deve fazer deploy automático em ~2 minutos.

**Ou force um redeploy:**
1. Vercel → Deployments → ... → Redeploy
2. DESMARQUE cache
3. Deploy

---

### 4. Testar

Após o deploy:

1. **Limpe o cache do navegador:**
   - Ctrl+Shift+Delete (Windows)
   - Cmd+Shift+Delete (Mac)
   - Marque "Cookies e Dados do Site"
   - Limpar dados

2. **Acesse o site em aba anônima:**
   ```
   https://seu-projeto.vercel.app
   ```

3. **Faça login novamente**

4. **Verifique se dashboard carrega sem erros**

---

## 🔍 Debug

### No Console do Navegador (F12):

```javascript
// Verificar se sessão está sendo salva
console.log('Session:', localStorage.getItem('segvision-auth'));

// Verificar usuário atual
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// Verificar session
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

### Esperado:
- `localStorage.getItem('segvision-auth')` deve retornar um objeto JSON grande
- `user` deve retornar objeto com email, id, etc
- `session` deve retornar objeto com access_token, refresh_token

### Se retornar `null`:
- Session não está sendo persistida
- Verifique URLs no Supabase
- Limpe localStorage e tente novamente

---

## 🐛 Troubleshooting

### Erro persiste após fix?

1. **Verificar Environment Variables na Vercel:**
   ```
   VITE_SUPABASE_URL=https://xyfkyqkhflgeosjtunkd.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   VITE_SUPABASE_PROJECT_ID=xyfkyqkhflgeosjtunkd
   ```

2. **Verificar se localStorage está bloqueado:**
   - Alguns navegadores bloqueiam em modo privado
   - Extensões podem bloquear
   - Configurações de privacidade podem bloquear

3. **Verificar CORS:**
   No console, se aparecer erro de CORS:
   - URLs não configuradas no Supabase
   - Adicione as URLs conforme passo 1

4. **Verificar se RLS está bloqueando:**
   ```sql
   -- No Supabase SQL Editor
   SELECT * FROM users WHERE id = auth.uid();
   ```

   Se retornar vazio:
   - RLS policies podem estar bloqueando
   - Verifique policies na tabela users

---

## 📊 O que Mudou?

### Antes:
```typescript
// Configuração básica - session não persistia
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Problema:**
- Session não era salva no localStorage
- Após reload, usuário era deslogado
- getUser() retornava null após login

### Depois:
```typescript
// Configuração completa com persistência
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'segvision-auth',
    flowType: 'pkce',
  },
});
```

**Solução:**
- ✅ Session salva no localStorage
- ✅ Token renovado automaticamente
- ✅ Session detectada via URL
- ✅ Fluxo PKCE seguro

---

## ✅ Checklist

- [ ] Código atualizado (já feito ✅)
- [ ] Deploy completado na Vercel
- [ ] URLs configuradas no Supabase
- [ ] PKCE Flow habilitado
- [ ] Cache do navegador limpo
- [ ] Login testado em aba anônima
- [ ] Dashboard carrega sem erros
- [ ] Console sem erros de autenticação

---

## 📞 Ainda com Problemas?

1. **Verifique Supabase Logs:**
   - Dashboard → Logs → Auth
   - Procure por erros de autenticação

2. **Verifique Vercel Function Logs:**
   - Deployments → Seu deploy → Function Logs

3. **Teste localmente:**
   ```bash
   npm run dev
   ```
   Se funcionar local mas não em produção:
   - Problema com environment variables na Vercel
   - Problema com URLs no Supabase

---

**Última atualização:** Commit 8de9e23

**Próximo passo:** Aguardar deploy e testar!
