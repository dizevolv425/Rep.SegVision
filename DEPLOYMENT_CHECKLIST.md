# ✅ Deployment Checklist - SegVision

Use este checklist para garantir que todos os passos do deploy foram executados corretamente.

---

## 📋 PRÉ-DEPLOY

### Verificação Local
- [ ] Código commitado e enviado para GitHub
- [ ] `node verify-deploy-ready.js` executado sem erros
- [ ] `npm run build` funciona sem erros
- [ ] Arquivo `.env` NÃO está no repositório
- [ ] `.gitignore` contém `.env` e `node_modules`

### Credenciais Supabase
- [ ] Projeto Supabase criado
- [ ] `Project URL` copiado
- [ ] `anon/public key` copiado
- [ ] `Project ID` copiado

---

## 🗄️ SUPABASE SETUP

### Migrations - Core Tables
- [ ] `create_security_settings.sql` executado
- [ ] `create_security_logs.sql` executado
- [ ] `fix_security_logs_and_triggers.sql` executado
- [ ] `create_storage_buckets_and_policies.sql` executado
- [ ] `create_user_notification_preferences.sql` executado

### Migrations - System Monitoring
- [ ] `create_system_monitoring_tables.sql` executado
- [ ] `create_system_monitoring_functions.sql` executado
- [ ] `extend_admin_dashboard_stats_with_monitoring_v2.sql` executado

### Migrations - Outras (em ordem alfabética)
- [ ] Todas as outras migrations executadas
- [ ] Nenhum erro no SQL Editor

### Storage
- [ ] Bucket `avatars` criado (2MB, public)
- [ ] Bucket `platform-assets` criado (5MB, public)
- [ ] Políticas RLS configuradas para ambos

### Seed Data (Opcional)
- [ ] `seeds-dashboard-data.sql` executado
- [ ] `seeds-admin-dashboard-data.sql` executado
- [ ] Seed de system monitoring executado (logs de uptime)

### Verificação Database
```sql
-- Execute no SQL Editor para verificar
SELECT
  'admin_dashboard_stats' as fonte,
  sistema_uptime_24h,
  sistema_response_time_avg_24h,
  alertas_processados_hoje,
  cameras_online,
  cameras_totais
FROM admin_dashboard_stats;
```
- [ ] Query acima retorna dados sem erro

---

## 🌐 VERCEL DEPLOY

### Configuração Inicial
- [ ] Conta Vercel criada/logada
- [ ] GitHub conectado à Vercel
- [ ] Repositório `dizevolv425/Rep.SegVision` importado
- [ ] Framework Preset: `Vite`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Environment Variables
- [ ] `VITE_SUPABASE_URL` configurado
- [ ] `VITE_SUPABASE_ANON_KEY` configurado
- [ ] `VITE_SUPABASE_PROJECT_ID` configurado
- [ ] Variáveis marcadas para Production, Preview, Development

### Deploy
- [ ] Deploy iniciado
- [ ] Build concluído sem erros
- [ ] URL de produção gerada
- [ ] Site acessível via URL

---

## ✅ PÓS-DEPLOY

### Configuração Supabase
- [ ] URL da Vercel adicionada em Authentication → URL Configuration
- [ ] URL com wildcard (`/**`) adicionada
- [ ] Se domínio customizado: domínio adicionado também

### Criar Usuário Admin
- [ ] Usuário admin criado no Supabase Auth
- [ ] Perfil admin criado na tabela `users`
- [ ] Login testado com sucesso

### Testes Funcionais
- [ ] **Login:** Funciona sem erros
- [ ] **Dashboard:** Carrega dados reais (não mock)
- [ ] **System Health:** Mostra uptime e response time reais
- [ ] **Notificações:** Sistema de notificações funciona
- [ ] **Avatar Upload:** Upload funciona sem "Bucket not found"
- [ ] **Security Logs:** Logs aparecem em Settings → Segurança
- [ ] **Perfil no Header:** Avatar aparece corretamente após upload

### Performance
- [ ] Site carrega em menos de 3 segundos
- [ ] Lighthouse Score > 80 (Performance)
- [ ] Sem erros no Console do navegador
- [ ] Sem warnings no Console (exceto externos)

### Monitoramento
- [ ] Vercel Analytics ativado (opcional)
- [ ] Supabase Database Health verificado
- [ ] Logs de erro monitorados

---

## 🔐 SEGURANÇA

### Supabase
- [ ] RLS (Row Level Security) habilitado em todas as tabelas críticas
- [ ] Policies configuradas para admins e escolas
- [ ] Bucket policies configuradas
- [ ] Service role key NÃO exposta publicamente

### Vercel
- [ ] Environment variables NÃO commitadas no Git
- [ ] Apenas `anon/public key` usada no frontend
- [ ] SSL ativado automaticamente (Vercel faz isso)

### Application
- [ ] Configurações de segurança testadas (MFA, sessões)
- [ ] Logs de auditoria funcionando
- [ ] Triggers de segurança ativos

---

## 📊 VALIDAÇÃO FINAL

### URLs e Acesso
- [ ] URL de produção: ___________________________
- [ ] Domínio customizado (se aplicável): ___________________________
- [ ] Login admin: ___________________________
- [ ] Senha segura configurada

### Dados de Teste
- [ ] Pelo menos 1 escola criada
- [ ] Pelo menos 3 câmeras configuradas
- [ ] Pelo menos 5 alertas de teste
- [ ] Dashboard mostrando dados corretos

### Continuous Deployment
- [ ] Push para `main` dispara deploy automático
- [ ] Build e deploy automático funcionam
- [ ] Preview deployments funcionam (opcional)

---

## 🎉 DEPLOY COMPLETO

Se todos os itens acima estão marcados:

### ✅ SEU SEGVISION ESTÁ NO AR!

**URL de Produção:** ___________________________

**Próximos Passos:**
1. Adicionar mais escolas
2. Configurar domínio customizado (se ainda não fez)
3. Configurar monitoramento de uptime (UptimeRobot)
4. Compartilhar com stakeholders
5. Começar a usar em produção!

---

## 📞 Suporte

Se algo não está funcionando:

1. **Verifique os logs:**
   - Vercel → Deployments → Function Logs
   - Supabase → Logs → API / Auth / Storage

2. **Problemas comuns:**
   - Ver [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) seção Troubleshooting

3. **Re-deploy:**
   - Vercel → Deployments → ... → Redeploy

4. **GitHub Issues:**
   - https://github.com/dizevolv425/Rep.SegVision/issues

---

**Data do Deploy:** ___________________________

**Responsável:** ___________________________

**Versão:** v1.0.0

---

🚀 **Deploy realizado com sucesso!**
