# 🎯 SegVision

**Sistema de Monitoramento Inteligente com IA para Segurança Escolar**

SegVision é uma plataforma completa de monitoramento e segurança para instituições de ensino, com detecção inteligente de eventos via IA, gestão de alertas em tempo real e dashboards administrativos.

---

## ✨ Features Principais

### 🏫 Para Escolas
- **Dashboard em Tempo Real** - Visão geral de alertas, câmeras ativas e incidentes
- **Sistema de Alertas Inteligente** - Detecção automatizada de:
  - Intrusões
  - Reconhecimento facial
  - Aglomerações
  - Objetos suspeitos
  - Câmeras offline
  - Quedas
  - Agressões
  - Armas
- **Gestão de Câmeras** - Monitoramento de status e localização
- **Analytics** - Métricas e relatórios de segurança
- **Sistema de Tickets** - Gerenciamento de incidentes
- **Notificações Push** - Alertas em tempo real configuráveis

### 👨‍💼 Para Administradores
- **Admin Dashboard** - Métricas globais de todas as escolas
- **Gestão de Escolas** - Cadastro e monitoramento de instituições
- **Gestão Financeira** - Controle de faturas e receitas
- **System Health** - Monitoramento de uptime e performance
- **Logs de Auditoria** - Rastreamento de mudanças de segurança
- **Configurações de Segurança** - MFA, sessões, políticas de senha

### 🔐 Segurança
- **Autenticação Supabase** - Login seguro com JWT
- **Row Level Security (RLS)** - Isolamento de dados por escola
- **Logs de Auditoria** - Registro completo de ações administrativas
- **Configurações de Segurança** - MFA, expiração de sessão, políticas

---

## 🚀 Deploy

### Opção 1: Quick Deploy (9 minutos)
Siga o guia rápido: **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)**

### Opção 2: Deploy Detalhado
Guia completo passo a passo: **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)**

### Verificar Pré-Deploy
Execute antes de fazer deploy:
```bash
node verify-deploy-ready.js
```

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component Library
- **Lucide React** - Icons
- **Recharts** - Charts & Graphs
- **Sonner** - Toast Notifications

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication (JWT)
  - Row Level Security (RLS)
  - Storage (File Upload)
  - Real-time Subscriptions

### Hosting
- **Vercel** - Frontend Hosting & Edge Functions

---

## 📁 Estrutura do Projeto

```
SegVision/
├── src/
│   ├── components/
│   │   ├── admin/              # Telas administrativas
│   │   ├── auth/               # Login, registro, reset senha
│   │   ├── ui/                 # Componentes shadcn/ui
│   │   ├── DashboardScreen.tsx
│   │   ├── AlertsScreen.tsx
│   │   ├── CamerasScreen.tsx
│   │   └── ...
│   ├── hooks/
│   │   ├── useDashboardData.ts       # Dashboard escolar
│   │   ├── useAdminDashboardData.ts  # Dashboard admin
│   │   ├── useUserProfile.ts         # Perfil do usuário
│   │   ├── useSecuritySettings.ts    # Configurações segurança
│   │   └── ...
│   ├── lib/
│   │   └── supabase.ts         # Cliente Supabase
│   ├── types/
│   │   ├── dashboard.ts        # Types do dashboard
│   │   ├── admin-dashboard.ts  # Types do admin dashboard
│   │   └── database.types.ts   # Types gerados do Supabase
│   └── App.tsx
├── supabase/
│   └── migrations/             # Migrations SQL
│       ├── create_security_settings.sql
│       ├── create_security_logs.sql
│       ├── create_storage_buckets_and_policies.sql
│       ├── create_system_monitoring_tables.sql
│       └── ...
├── DEPLOY_VERCEL.md           # Guia completo de deploy
├── QUICK_DEPLOY.md            # Guia rápido de deploy
├── verify-deploy-ready.js     # Script de verificação
└── README.md
```

---

## 💻 Desenvolvimento Local

### 1. Clone o Repositório
```bash
git clone https://github.com/dizevolv425/Rep.SegVision.git
cd Rep.SegVision
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Environment Variables
Crie um arquivo `.env` na raiz:
```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_SUPABASE_PROJECT_ID=seu-project-id
```

### 4. Executar Migrations
No Supabase Dashboard → SQL Editor, execute os arquivos de `supabase/migrations/` na ordem alfabética.

### 5. Rodar Desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:5173

### 6. Build de Produção
```bash
npm run build
npm run preview  # Preview do build
```

---

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Lint do código |
| `node verify-deploy-ready.js` | Verifica pré-requisitos para deploy |

---

## 📊 Database Schema

### Principais Tabelas

- **users** - Usuários do sistema (escola + admin)
- **schools** - Escolas cadastradas
- **cameras** - Câmeras de monitoramento
- **alerts** - Alertas detectados pela IA
- **notifications** - Notificações do usuário
- **security_logs** - Logs de auditoria
- **security_settings** - Configurações de segurança
- **system_uptime_logs** - Logs de uptime
- **system_performance_metrics** - Métricas de performance

### Views

- **dashboard_stats** - Estatísticas do dashboard escolar
- **admin_dashboard_stats** - Estatísticas do admin dashboard (inclui uptime e performance)

---

## 🔐 Environment Variables

### Obrigatórias (Vercel)
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_SUPABASE_PROJECT_ID=xxx
```

### Como Obter
1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Settings** → **API**
3. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Project API keys** → `anon/public` → `VITE_SUPABASE_ANON_KEY`
   - **Project ref** → `VITE_SUPABASE_PROJECT_ID`

---

## 📚 Documentação Adicional

- **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)** - Guia completo de deploy na Vercel
- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Guia rápido de 9 minutos
- **[EXECUTAR_MIGRATIONS.md](./EXECUTAR_MIGRATIONS.md)** - Como executar migrations
- **[DASHBOARD_IMPLEMENTATION.md](./DASHBOARD_IMPLEMENTATION.md)** - Implementação do dashboard

---

## 🐛 Troubleshooting

### Build falha localmente
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erro "Supabase client not initialized"
Verifique se as environment variables estão corretas no arquivo `.env`

### Dados não aparecem no dashboard
1. Verifique se as migrations foram executadas
2. Execute os seed data (opcional)
3. Verifique se há dados nas tabelas via SQL Editor

### Erro de autenticação
1. Verifique URL Configuration no Supabase
2. Adicione `http://localhost:5173` às URLs permitidas

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'feat: Adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto foi desenvolvido para uso interno. Todos os direitos reservados.

---

## 🔗 Links

- **Design Original**: [Figma](https://www.figma.com/design/cpd5Cb3p2xFtjud5m1pklL/SegVision)
- **Repositório**: [GitHub](https://github.com/dizevolv425/Rep.SegVision)
- **Deploy**: [Vercel](https://vercel.com)
- **Backend**: [Supabase](https://supabase.com)

---

## 🎯 Roadmap

- [ ] PWA Support
- [ ] Mobile App (React Native)
- [ ] Integração com câmeras IP
- [ ] Machine Learning para detecção customizada
- [ ] Relatórios PDF automatizados
- [ ] Multi-idioma (i18n)
- [ ] Dark mode melhorado
- [ ] Websockets para alertas em tempo real
- [ ] Integração com sistemas de alarme

---

**🚀 Desenvolvido com React + TypeScript + Supabase**

**🤖 Generated with [Claude Code](https://claude.com/claude-code)**
