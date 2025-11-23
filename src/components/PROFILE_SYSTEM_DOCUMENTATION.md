# Sistema de Perfis SegVision

## Visão Geral

O SegVision possui três perfis de usuário distintos, cada um com suas próprias telas, permissões e funcionalidades. A troca entre perfis é feita através do menu do avatar no topo direito da aplicação.

## Perfis Disponíveis

### 1. Gestor da Escola (`school`)
**Descrição:** Gestão da unidade escolar e configurações locais

**Telas:**
- Dashboard
- Ambientes
- Câmeras
- Alertas Inteligentes
- Análises
- Financeiro
- Contatos de Emergência
- Central de Inteligência
- Configurações

**Permissões:**
- Visualização completa de todas as funcionalidades da escola
- Configuração de câmeras e IA
- Gestão de contatos e ambientes
- Acesso a relatórios e análises

---

### 2. Administrador do SaaS (`admin`)
**Descrição:** Gestão global da plataforma, financeiro e contratos

**Telas:**
- Dashboard Geral
- Escolas
- Alertas Globais
- Financeiro Geral
- Contratos & Assinaturas
- Integrações
- Configurações do Sistema

**Permissões:**
- Visão global de todas as escolas
- Gestão de contratos e assinaturas
- Configurações do sistema
- Relatórios consolidados
- **Restrição:** Não tem acesso a preview ao vivo de câmeras (LGPD)

---

### 3. Operador (Segurança) (`operator`)
**Descrição:** Resposta a incidentes e monitoramento em tempo real

**Telas:**
- Dashboard Operacional
- Câmeras (com preview ao vivo)
- Alertas Inteligentes (com ações Confirmar/Resolver)
- Contatos de Emergência (somente leitura)
- Central de Inteligência

**Permissões:**
- Preview ao vivo de câmeras
- Confirmar e resolver alertas (sequência obrigatória)
- Acesso de leitura a contatos de emergência
- Ações rápidas de comunicação (ligar/WhatsApp)

**Restrições (RN-002):**
- Não pode configurar câmeras ou IA
- Não pode editar/adicionar contatos
- Não tem acesso a análises avançadas
- Não tem acesso a financeiro
- Não pode gerenciar usuários

---

## Fluxo de Trabalho do Operador

### Dashboard Operacional
- Cards prioritários: Incidentes Críticos Ativos destacados
- Gráfico de evolução de alertas (7 dias)
- Tabela de últimos alertas (clique redireciona para Alertas)
- Banner informativo sobre latência (<5s)

### Gestão de Alertas (RN-004)
**Sequência obrigatória:**
1. **Novo** → Operador clica em "Confirmar Alerta"
2. **Confirmado** → Operador toma ações e clica em "Resolver Incidente"
3. **Resolvido** → Status final

**Detalhes:**
- Filtros: Status (Novo/Confirmado/Resolvido) e Gravidade (Alta/Média/Baixa)
- Drawer lateral com informações completas
- Log de ações registrando usuário e horário
- Link rápido para preview da câmera

### Visualização de Câmeras
- Lista de câmeras com preview
- Click abre visualização fullscreen
- Controles: mute, expandir
- Estados: Online (stream), Offline (banner de erro), Carregando (spinner)

### Contatos de Emergência
- **Somente leitura**
- Ações rápidas: Ligar e WhatsApp
- Banner informativo sobre permissões

---

## Troca de Perfil

### Menu do Usuário (Avatar)
**Localização:** Top-right da aplicação

**Opções:**
1. Meu Perfil
2. **Trocar perfil** (seção destacada)
   - Gestor da Escola
   - Administrador do SaaS
   - Operador (Segurança)
3. Sair

**Comportamento:**
- Mostra apenas perfis diferentes do atual
- Cada opção exibe descrição breve
- Troca de perfil reseta para o dashboard do novo perfil

---

## Implementação Técnica

### Context
```typescript
// UserProfileContext.tsx
export type UserProfile = 'school' | 'admin' | 'operator';
```

### Sidebars
- `Sidebar.tsx` - Perfil Escola
- `AdminSidebar.tsx` - Perfil Administrador
- `OperatorSidebar.tsx` - Perfil Operador

### Telas do Operador
- `/components/operator/OperatorDashboardScreen.tsx`
- `/components/operator/OperatorCamerasScreen.tsx`
- `/components/operator/OperatorAlertsScreen.tsx`
- `/components/operator/OperatorContactsScreen.tsx`
- `/components/operator/OperatorCentralScreen.tsx`

---

## Padrões Visuais

### Sidebar Operador
- Background: Azul (`var(--primary-bg)`)
- Item ativo: Pílula branca com texto azul
- Badge de contador:
  - Default: bg branco/20, text branco
  - Ativo: bg azul, text branco

### Badges de Status (Alertas)
- **Novo:** `variant="medium" tone="danger"`
- **Confirmado:** `variant="medium" tone="info"`
- **Resolvido:** `variant="medium" tone="success"`

### Badges de Câmeras
- **Online:** `variant="light" tone="success"` com bg `#47D238`
- **Offline:** `variant="light" tone="danger"`

---

## Regras de Negócio

### RN-002: Restrições do Operador
- Sem acesso a configurações de IA
- Sem permissão para editar câmeras
- Sem acesso a análises avançadas e financeiro

### RN-003: Câmera Offline
- Exibir banner: "Câmera Offline: Verifique a conexão"
- Instruir contato com suporte técnico

### RN-004: Sequência de Alertas
- Operador deve primeiro Confirmar antes de Resolver
- Cada ação registra usuário e timestamp
- Log visível no drawer de detalhes

---

## Responsividade

### Mobile
- Priorizar cards de Incidentes Críticos
- Botões grandes para Confirmar/Resolver
- Tabelas com scroll horizontal
- Chat de suporte em altura fixa

### Desktop
- Layout em grid (cards, preview de câmeras)
- Drawer lateral para detalhes
- Gráficos em largura completa

---

## Estados Especiais

### Empty State
- Dashboard: "Sem dados nas últimas 24h"
- Alertas: "Nenhum alerta encontrado"
- Câmeras: "Nenhuma câmera cadastrada"

### Error State
- Banner topo: "Erro ao carregar dados. Tente novamente."

### Loading State
- Skeleton em cards
- Spinner em tabelas
- Spinner central em preview de câmeras

---

## Atalhos de Teclado (Futuro)
- `g a` → Alertas
- `g c` → Câmeras
- `?` → Drawer de Notificações
