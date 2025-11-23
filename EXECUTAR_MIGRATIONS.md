# Como Executar as Migrations do Supabase

## 🎯 Objetivo

Criar as tabelas `users` e `schools` no seu banco de dados Supabase.

---

## 🚀 Método 1: Via Dashboard do Supabase (RECOMENDADO - Mais Fácil)

### Passo 1: Acesse o SQL Editor
Abra este link no seu navegador:
```
https://supabase.com/dashboard/project/xyfkyqkhflgeosjtunkd/sql/new
```

### Passo 2: Cole o SQL
1. Abra o arquivo `supabase-migrations.sql`
2. Copie **TODO** o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor do Supabase (Ctrl+V)

### Passo 3: Execute
Clique no botão **RUN** (ou pressione Ctrl+Enter)

### Passo 4: Verifique
Acesse a aba **Table Editor** e confirme que as tabelas foram criadas:
- ✅ `public.users`
- ✅ `public.schools`

---

## ⚡ Método 2: Via Script Node.js (Automático)

### Passo 1: Obtenha a Service Role Key

1. Acesse:
   ```
   https://supabase.com/dashboard/project/xyfkyqkhflgeosjtunkd/settings/api
   ```

2. Role até a seção **Project API keys**

3. Copie a chave **service_role** (não use a anon key!)
   - ⚠️ **IMPORTANTE**: Esta chave é secreta, não compartilhe!
   - ⚠️ Esta chave bypassa todas as regras de segurança (RLS)

### Passo 2: Execute o Script

**Windows (PowerShell):**
```powershell
$env:SUPABASE_SERVICE_ROLE_KEY="sua_service_key_aqui"
npm run migrate
```

**Windows (CMD):**
```cmd
set SUPABASE_SERVICE_ROLE_KEY=sua_service_key_aqui && npm run migrate
```

**Linux/Mac:**
```bash
SUPABASE_SERVICE_ROLE_KEY=sua_service_key_aqui npm run migrate
```

### Passo 3: Verifique
O script deve exibir:
```
✅ SQL executado com sucesso!
🎉 Migration concluída!
```

---

## 🔍 Verificar se deu certo

Depois de executar a migration (por qualquer um dos métodos), faça o seguinte:

1. Acesse o Table Editor:
   ```
   https://supabase.com/dashboard/project/xyfkyqkhflgeosjtunkd/editor
   ```

2. Você deve ver estas tabelas:
   - ✅ `users` - Perfis dos usuários
   - ✅ `schools` - Dados das escolas

3. Clique em cada tabela e veja as colunas criadas

---

## 📝 Próximos Passos

Depois de executar a migration com sucesso:

### 1. Configure a Anon Key

Edite o arquivo `.env.local` e adicione sua **anon key**:

```env
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

Para obter a anon key:
1. Acesse: https://supabase.com/dashboard/project/xyfkyqkhflgeosjtunkd/settings/api
2. Copie a chave **anon/public**

### 2. Inicie o servidor

```bash
npm run dev
```

### 3. Teste o cadastro

1. Acesse: http://localhost:3000
2. Clique em "Criar conta"
3. Preencha os dados da escola
4. Complete o cadastro

Se tudo funcionar, você verá os dados sendo salvos no Supabase! 🎉

---

## ❓ Troubleshooting

### Erro: "exec_sql não existe"

Se o Método 2 falhar com este erro, use o **Método 1** (Dashboard).

### Erro: "permission denied"

Certifique-se de estar usando a **service_role key**, não a anon key.

### Erro: "already exists"

Não é um erro! Significa que as tabelas já foram criadas anteriormente. Está tudo certo! ✅

### Erro: "Database error saving new user"

Este erro ocorre quando o trigger não está funcionando corretamente. **Solução:**

1. Execute o arquivo `fix-complete.sql` no SQL Editor do Supabase
2. Isso recriará o trigger com melhor tratamento de erros

### Erro: "infinite recursion detected in policy"

Este erro ocorre quando as policies RLS estão criando loops. **Solução:**

1. Execute o arquivo `fix-complete.sql` no SQL Editor do Supabase
2. Isso removerá todas as policies recursivas e criará políticas simplificadas

### Erro: "new row violates row-level security policy for table 'schools'"

Este erro ocorre quando a policy de INSERT não está permitindo a criação de escolas durante o registro. **Solução:**

1. Execute o arquivo `fix-complete.sql` no SQL Editor do Supabase
2. Isso criará políticas que permitem tanto usuários autenticados quanto anônimos inserir registros

---

## 🔧 Aplicar Correções (Se tiver problemas no cadastro)

Se você já executou a migration inicial mas está tendo erros ao criar conta:

### Passo 1: Execute o Fix Completo

1. Acesse o SQL Editor: https://supabase.com/dashboard/project/xyfkyqkhflgeosjtunkd/sql/new
2. Abra o arquivo `fix-complete.sql`
3. Copie TODO o conteúdo
4. Cole no SQL Editor
5. Clique em **RUN**

### Passo 2: Verifique se funcionou

1. Abra o arquivo `verify-database.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor
4. Clique em **RUN**
5. Verifique os resultados:
   - ✅ Devem existir 4 policies na tabela `users`
   - ✅ Devem existir 3 policies na tabela `schools`
   - ✅ O trigger `on_auth_user_created` deve estar ENABLED
   - ✅ A role `anon` deve ter permissão de INSERT na tabela `schools`

### Passo 3: Teste novamente

1. Acesse o app: http://localhost:3000
2. Tente criar uma nova conta
3. Deve funcionar sem erros! 🎉

---

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. Verifique se a URL do Supabase está correta no `.env.local`
2. Confirme que usou a chave correta (service_role para migration, anon para o app)
3. Tente o Método 1 (Dashboard) se o Método 2 não funcionar
4. Se tiver erros no cadastro, execute o `fix-complete.sql`
5. Use o `verify-database.sql` para verificar o estado do banco
