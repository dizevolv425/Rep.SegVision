# Sistema de Notificações SegVision

> ⚠️ **ATENÇÃO:** Esta documentação foi **substituída** pela versão unificada.  
> **Consulte:** `/components/NOTIFICATIONS_UNIFIED_DOCUMENTATION.md` para a versão atual.

---

## Visão Geral (LEGADO)

O SegVision possui um sistema completo de notificações que funciona uniformemente para os três perfis (Escola, Administrador e Operador), com filtragem de conteúdo baseada em permissões.

## Componentes

### 1. NotificationsContext (`/components/NotificationsContext.tsx`)
**Responsabilidade:** Gerenciamento global do estado de notificações

**Features:**
- Armazena todas as notificações com acesso por perfil
- Filtra notificações baseado no perfil atual
- Conta notificações não lidas
- Funções para marcar como lida (individual e em massa)
- Ordenação automática (críticas no topo por 5 min)

**Tipos:**
```typescript
type NotificationType = 'alert' | 'financial' | 'system';
type NotificationSeverity = 'high' | 'medium' | 'low';
type NotificationStatus = 'unread' | 'read';

interface Notification {
  id: string;
  type: NotificationType;
  severity?: NotificationSeverity;
  title: string;
  description: string;
  origin: string;
  timestamp: Date;
  status: NotificationStatus;
  profileAccess: ('school' | 'admin' | 'operator')[];
  actionLabel?: string;
  actionPath?: string;
}
```

---

### 2. NotificationsModal (`/components/NotificationsModal.tsx`)
**Responsabilidade:** Modal de acesso rápido às notificações

**Localização:** Acionado pelo ícone de sino no TopBar

**Features:**
- Tamanho: 560px (desktop), fullscreen (mobile)
- Filtros: Tipo (Alertas/Financeiro/Sistema), Status (Todas/Não lidas/Lidas)
- Ordenação: Críticas no topo por 5 min, depois por timestamp
- Ações: Marcar todas como lidas, ver detalhes, acessar contexto
- Empty state com ícone de sino

**Layout:**
```
┌─────────────────────────────────┐
│ Notificações    [Marcar lidas]  │
│ X não lidas                     │
├─────────────────────────────────┤
│ [Tipo ▼]  [Status ▼]           │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ 🔔 Título da notificação    │ │
│ │ Descrição breve             │ │
│ │ [Badge Tipo] [Badge Status] │ │
│ │ ⏰ há 15 minutos             │ │
│ │ [Ação contextual]           │ │
│ └─────────────────────────────┘ │
│ ... mais notificações           │
├─────────────────────────────────┤
│ Críticas no topo por 5 min      │
│                    [Ver todas]  │
└─────────────────────────────────┘
```

**Estados Visuais:**
- **Não lida:** `bg-[var(--blue-primary-50)]/30` + bolinha azul
- **Crítica:** Borda esquerda vermelha 4px
- **Lida:** `bg-white`

---

### 3. NotificationsScreen (`/components/NotificationsScreen.tsx`)
**Responsabilidade:** Tela dedicada de gerenciamento de notificações

**Rotas:**
- `/escola/notificacoes`
- `/admin/notificacoes`
- `/operador/notificacoes`

**Features:**
- Busca por texto (título, descrição, origem)
- Filtros avançados: Tipo, Gravidade (para alertas), Status
- Seleção múltipla com ações em massa
- Vista desktop: Tabela completa
- Vista mobile: Cards empilhados
- Paginação: 20 itens por vez (futuro)

**Colunas (Desktop):**
| ☑ | Tipo | Título | Origem | Data/Hora | Status |
|---|------|--------|--------|-----------|--------|
| ☑ | 🔴 Alerta | Invasão detectada... | Câmera 01 | há 15 min | Não lida |

**Bulk Actions:**
- Aparece quando há itens selecionados
- "Marcar selecionadas como lidas"
- "Cancelar seleção"

---

## Integração com Navegação

### Sidebar
**Todos os perfis possuem:**
```tsx
{ 
  id: 'notifications', 
  label: 'Notificações', 
  icon: Bell, 
  dynamicBadge: true  // Mostra unreadCount
}
```

**Badge:**
- **Não ativo:** `bg-white text-blue` com contador
- **Ativo (pílula branca):** `bg-blue text-white` com contador
- **Zero:** Badge não aparece

### TopBar
**Ícone de Sino:**
- Sempre visível no topo direito
- Badge vermelho com contador quando `unreadCount > 0`
- Click abre `NotificationsModal`

**Comportamento:**
```tsx
<Bell onClick={() => setNotificationsOpen(true)} />
{unreadCount > 0 && (
  <Badge variant="destructive">{unreadCount}</Badge>
)}
```

---

## Regras de Exibição por Perfil

### Escola (`school`)
**Vê:**
- ✅ Alertas da escola
- ✅ Financeiro da escola
- ✅ Sistema (ex.: API WhatsApp reconectada)

**Não vê:**
- ❌ Alertas de outras escolas
- ❌ Financeiro global
- ❌ Integrações administrativas

### Administrador (`admin`)
**Vê:**
- ✅ Financeiro global
- ✅ Integrações e APIs
- ✅ Sistema (uptime, performance)
- ✅ Alertas globais (resumidos)

**Não vê:**
- ❌ Preview de câmeras (LGPD)
- ❌ Detalhes operacionais específicos de escolas

### Operador (`operator`)
**Vê:**
- ✅ Alertas operacionais
- ✅ Câmeras offline
- ✅ Sistema (status de equipamentos)

**Não vê:**
- ❌ Financeiro
- ❌ Contratos
- ❌ Configurações administrativas

---

## Badges e Estados

### Tipo de Notificação
```tsx
// Alertas
<Badge variant="light" tone="info" size="s">Alerta</Badge>

// Financeiro
<Badge variant="light" tone="primary" size="s">Financeiro</Badge>

// Sistema
<Badge variant="light" tone="neutral" size="s">Sistema</Badge>
```

### Gravidade (apenas para Alertas)
```tsx
// Alta
<Badge variant="medium" tone="danger" size="s">Alta</Badge>

// Média
<Badge variant="medium" tone="warning" size="s">Média</Badge>

// Baixa
<Badge variant="medium" tone="info" size="s">Baixa</Badge>
```

### Status
```tsx
// Não lida
<Badge variant="medium" tone="primary" size="s">Não lida</Badge>

// Lida
<Badge variant="light" tone="neutral" size="s">Lida</Badge>
```

---

## Ordenação e Priorização

### Regra de Ordenação
1. **Alertas críticos** (tipo=alert + gravidade=high) nos primeiros 5 minutos
2. **Timestamp** (mais recente primeiro)

### Implementação
```typescript
const fiveMinutes = 5 * 60 * 1000;
const isCritical = 
  notification.type === 'alert' && 
  notification.severity === 'high' && 
  (now - notification.timestamp) < fiveMinutes;
```

**Indicador visual:** Borda esquerda vermelha 4px

---

## Sincronização de Contadores

### Fluxo
```
NotificationsContext
  ↓ unreadCount
  ├─→ Sidebar Badge (3 componentes)
  ├─→ TopBar Bell Badge
  └─→ Modal Header
```

### Update Triggers
- `markAsRead(id)` → Decrementa contador
- `markAllAsRead()` → Zera contador
- Click em notificação → Marca como lida automaticamente

---

## Ações Contextuais

Cada notificação pode ter uma ação específica:

```tsx
{
  actionLabel: 'Ver alerta',
  actionPath: '/alerts'
}
```

**Comportamento:**
1. Click na notificação → Marca como lida
2. Navega para `actionPath`
3. Fecha modal (se aberto)

**Exemplos:**
- **Alerta:** "Ver alerta" → `/alerts`
- **Financeiro:** "Ver fatura" → `/finance`
- **Sistema:** "Ver integrações" → `/settings`

---

## Estados de UI

### Loading
- Skeleton nos cards
- Spinner na tabela

### Empty
```
🔔
Sem notificações
Voltamos a avisar quando algo novo chegar.
```

### Error
```
Banner topo: "Erro ao carregar notificações. Tente novamente."
```

---

## Responsividade

### Desktop (>= 768px)
- Modal: 560px centralizado
- Tela: Tabela completa com todas as colunas
- Filtros: Inline em uma linha

### Mobile (< 768px)
- Modal: Fullscreen com scroll
- Tela: Cards empilhados
- Filtros: Stacked verticalmente
- Botão "Marcar lidas" vira ícone no header

---

## Acessibilidade

### Keyboard
- **Tab:** Navega entre filtros e notificações
- **Enter/Space:** Abre notificação
- **Esc:** Fecha modal
- **(Futuro) n:** Abre modal
- **(Futuro) Shift+N:** Marca todas como lidas

### Screen Readers
- Modal tem `role="dialog"`
- Contador lido como "X notificações não lidas"
- Badges com labels descritivos

---

## Integração com date-fns

**Formatação de timestamps:**
```tsx
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

formatDistanceToNow(notification.timestamp, { 
  locale: ptBR, 
  addSuffix: true 
})
// Resultado: "há 15 minutos"
```

---

## Dados Mock

### Estrutura
```typescript
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    severity: 'high',
    title: 'Invasão detectada no portão principal',
    description: 'Movimento após horário detectado...',
    origin: 'Câmera Portão 1',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    status: 'unread',
    profileAccess: ['school', 'operator'],
    actionLabel: 'Ver alerta',
    actionPath: '/alerts'
  },
  // ...
];
```

---

## Próximos Passos (Futuro)

- [ ] WebSocket para notificações em tempo real
- [ ] Paginação na tela dedicada
- [ ] Filtro por data
- [ ] Exportar notificações (CSV)
- [ ] Configurações de preferências de notificação
- [ ] Push notifications (browser)
- [ ] Agrupamento por tipo/origem
- [ ] Arquivar notificações antigas

---

## Tokens e Cores

### Backgrounds
```css
--blue-primary-50: #96BDF6  /* Notificação não lida */
--danger-bg: #C8142C        /* Badge contador TopBar */
--neutral-subtle: #F6F6F6   /* Card lida */
```

### Borders
```css
--danger-bg: #C8142C        /* Borda esquerda crítica */
--neutral-border: #E2E2EA   /* Bordas gerais */
```

---

## Arquivos do Sistema

```
/components/
  ├── NotificationsContext.tsx      # Estado global
  ├── NotificationsModal.tsx         # Modal rápido
  ├── NotificationsScreen.tsx        # Tela dedicada
  ├── Sidebar.tsx                    # + item Notificações
  ├── AdminSidebar.tsx               # + item Notificações
  ├── OperatorSidebar.tsx            # + item Notificações
  ├── TopBar.tsx                     # + sino com modal
  └── NOTIFICATIONS_SYSTEM_DOCUMENTATION.md  # Este arquivo
```
