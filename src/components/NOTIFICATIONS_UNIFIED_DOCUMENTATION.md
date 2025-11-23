# Sistema de Notificações Unificado - SegVision

## Visão Geral

O sistema de notificações do SegVision está completamente unificado, com uma única interface consistente em todos os três perfis (Escola, Administrador, Operador).

---

## Arquitetura

### 1. Componentes Principais

```
NotificationsContext.tsx        # Estado global e lógica
NotificationsPopover.tsx        # Popover na header (novo)
NotificationsScreen.tsx         # Tela dedicada
TopBar.tsx                      # Header com sino unificado
Sidebar.tsx / AdminSidebar / OperatorSidebar  # Badges sincronizados
```

### 2. Fluxo de Dados

```
NotificationsContext (Provider)
    ↓
    ├── TopBar → NotificationsPopover (header)
    ├── Sidebars (badges de contador)
    └── NotificationsScreen (tela dedicada)
```

---

## Header (TopBar)

### Botão de Notificações

**Único sino na header** - remove duplicações anteriores.

```tsx
// TopBar.tsx
<NotificationsPopover onNavigate={onNavigate} />
```

#### Especificações:
- **Ícone:** `Bell` (Lucide)
- **Badge vermelho:** Aparece quando `unreadCount > 0`
- **Posição:** Top-right da header, lado esquerdo do avatar
- **Ação:** Abre o NotificationsPopover
- **Acessibilidade:** `aria-label="Abrir notificações"`, focus ring azul

#### Badge Contador:
```css
position: absolute
top: -4px
right: -4px
size: 20px × 20px
background: var(--danger-bg)    # Red Alert/300
color: var(--white-50)
font-size: 10px
border-radius: 50%
```

---

## Popover de Notificações

### NotificationsPopover.tsx

Janela suspensa que aparece ao clicar no sino.

#### Dimensões:
- **Desktop:** `width: 420px`, `maxHeight: 560px`
- **Mobile:** Full-screen modal (futuro)

#### Estrutura:

```
┌─────────────────────────────────────┐
│ Header                              │
│  Notificações        [Marcar lidas] │
│  3 não lidas                        │
├─────────────────────────────────────┤
│ List (ScrollArea h-400px)           │
│                                     │
│  [●] Critical Alert                 │
│      Description...                 │
│      Origin • há 15min              │
│                                     │
│  [ ] Normal Notification            │
│      Description...                 │
│      Origin • há 2h                 │
│                                     │
├─────────────────────────────────────┤
│ Footer                              │
│           [Ver todas]               │
└─────────────────────────────────────┘
```

#### Header:
- **Left:**
  - Título: "Notificações"
  - Subtitle: "{count} não {lida/lidas}"
- **Right:**
  - Button: "Marcar como lidas"
  - Variant: `ghost`, Size: `sm`
  - Aparece apenas quando `unreadCount > 0`
  - Ação: `markAllAsRead()` → atualiza contadores

#### List (Items):
- **Layout:** Ícone • Título/Badge • Descrição • Meta
- **Height:** ScrollArea com `h-[400px]`
- **Estados:**
  - **Unread:** `bg-[var(--blue-primary-50)]`
  - **Read:** `bg-[var(--white-50)]`
  - **Critical (high severity):** Barra vermelha esquerda
- **Hover:** `bg-[var(--neutral-subtle)]`
- **Click:** 
  - `markAsRead(id)`
  - `navigate(actionPath)`
  - Fecha popover

#### Item Anatomy:
```tsx
<div className="flex items-start gap-3">
  {/* Icon Circle */}
  <div className="w-8 h-8 rounded-full bg-{type}/50 text-{type}/300">
    <Icon />
  </div>
  
  {/* Content */}
  <div className="flex-1">
    <div className="flex justify-between">
      <h4>{title}</h4>
      <div className="flex gap-2">
        <Badge severity />
        {isUnread && <dot />}
      </div>
    </div>
    <p className="text-muted">{description}</p>
    <div className="flex justify-between">
      <span>{origin}</span>
      <span>{timestamp}</span>
    </div>
  </div>
</div>
```

#### Footer:
- **Button:** "Ver todas"
- Variant: `ghost`, full width
- Color: `var(--primary-bg)` (azul)
- Ação: `navigate('/notifications')` → fecha popover

#### Empty State:
```tsx
<div className="text-center py-12">
  <Bell className="h-12 w-12 text-muted mb-4" />
  <p>Sem notificações</p>
  <p className="text-muted">Avisaremos quando algo novo chegar.</p>
</div>
```

---

## Tela Dedicada (NotificationsScreen)

### Rota: `/{perfil}/notificacoes`

Tela completa com filtros avançados e ações em lote.

#### Header:
```tsx
<div className="breadcrumb">Início › Notificações</div>
<h1>Notificações</h1>
<p>{unreadCount} não lidas</p>
```

#### Filtros:
- **Busca:** Input de texto (título, descrição, origem)
- **Tipo:** Select (Todos, Alertas, Financeiro, Sistema)
- **Severidade:** Select (Todos, Alta, Média, Baixa)
- **Status:** Select (Todos, Não lidas, Lidas)

#### Bulk Actions:
```tsx
{selectedIds.length > 0 && (
  <div className="bulk-action-bar">
    <span>{selectedIds.length} selecionadas</span>
    <Button onClick={handleMarkSelectedAsRead}>
      Marcar selecionadas como lidas
    </Button>
  </div>
)}
```

#### Lista:
- Checkbox para seleção múltipla
- Mesma aparência do popover, mas com mais espaço
- Ações secundárias: "Marcar como lida" individual

---

## Sincronização de Contadores

### updateCounters() - Lógica Automática

Sempre que uma notificação é marcada como lida:

1. **Context atualiza estado:**
   ```tsx
   markAsRead(id) → setNotifications(...)
   ```

2. **Contadores recalculam automaticamente:**
   ```tsx
   const unreadCount = getFilteredNotifications()
     .filter(n => n.status === 'unread')
     .length;
   ```

3. **UI reage:**
   - TopBar bell badge atualiza
   - Sidebar item badge atualiza
   - Popover subtitle atualiza
   - Todos os componentes usam o mesmo `unreadCount`

### Função markAllAsRead():
```tsx
const markAllAsRead = () => {
  setNotifications(prev =>
    prev.map(n => 
      n.profileAccess.includes(currentProfile) 
        ? { ...n, status: 'read' } 
        : n
    )
  );
};
```

**Importante:** Marca apenas as notificações do perfil atual.

---

## Filtros por Perfil

Notificações possuem propriedade `profileAccess`:

```tsx
interface Notification {
  profileAccess: ('school' | 'admin' | 'operator')[];
  // ...
}
```

O contexto filtra automaticamente:

```tsx
const getFilteredNotifications = () => {
  return notifications.filter(n => 
    n.profileAccess.includes(currentProfile)
  );
};
```

---

## Design Tokens

### Cores

#### Badge Vermelho (Contador):
```css
background: var(--danger-bg)      # Red Alert/300 (#C8142C)
color: var(--white-50)            # White (#FFFFFF)
```

#### Estado Unread:
```css
background: var(--blue-primary-50)   # (#96BDF6)
dot: var(--blue-primary-200)         # (#2F5FFF)
```

#### Critical Accent:
```css
border-left: 4px solid var(--red-alert-300)   # (#C8142C)
```

#### Icon Circles:
```css
alert:     bg-[var(--red-alert-50)]      text-[var(--red-alert-300)]
financial: bg-[var(--green-alert-50)]    text-[var(--green-alert-300)]
system:    bg-[var(--turquoise-alert-50)] text-[var(--turquoise-alert-300)]
```

#### Severity Badges:
- **Alta:** `tone="danger"`, variant="light"
- **Média:** `tone="warning"`, variant="light"
- **Baixa:** `tone="info"`, variant="light"

---

## Responsividade

### Desktop (>= 768px):
- Popover: 420px width, alinhado à direita
- Header bell: tamanho normal

### Mobile (< 768px) - Futuro:
- Popover vira modal full-screen
- Header: ações overflow para kebab menu
- Lista: cards empilhados

---

## Acessibilidade

### TopBar Bell:
```tsx
<Button
  aria-label="Abrir notificações"
  role="button"
  className="focus-visible:ring-2 focus-visible:ring-[var(--blue-primary-100)]"
>
```

### Contadores:
```tsx
{unreadCount > 0 && (
  <span aria-label={`${unreadCount} notificações não lidas`}>
    {unreadCount}
  </span>
)}
```

### Keyboard Navigation:
- Tab para focar no bell
- Enter/Space para abrir popover
- Tab dentro do popover para navegar items
- Escape para fechar

---

## Checklist de Migração

✅ **Removido:** Popover antigo de alertas (mock local)  
✅ **Removido:** Segundo botão Bell (duplicado)  
✅ **Criado:** NotificationsPopover unificado  
✅ **Atualizado:** TopBar usa apenas NotificationsPopover  
✅ **Verificado:** Sidebar school sincronizada  
✅ **Verificado:** AdminSidebar sincronizada  
✅ **Verificado:** OperatorSidebar sincronizada  
✅ **Verificado:** NotificationsScreen funcional  
✅ **Testado:** markAllAsRead atualiza todos os contadores  

---

## Exemplo de Uso

### Adicionar uma nova notificação:

```tsx
// No contexto ou mock
const newNotification: Notification = {
  id: uuid(),
  type: 'alert',
  severity: 'high',
  title: 'Nova invasão detectada',
  description: 'Movimento após horário no portão 2',
  origin: 'Câmera Portão 2',
  timestamp: new Date(),
  status: 'unread',
  profileAccess: ['school', 'operator'],
  actionLabel: 'Ver alerta',
  actionPath: '/alerts'
};
```

### Marcar como lida ao navegar:

```tsx
const handleItemClick = (notification: Notification) => {
  markAsRead(notification.id);  // Atualiza contadores
  if (notification.actionPath) {
    onNavigate(notification.actionPath);
    setOpen(false);  // Fecha popover
  }
};
```

### Botão "Ver todas":

```tsx
const handleViewAll = () => {
  onNavigate('notifications');  // Rota para tela dedicada
  setOpen(false);
};
```

---

## Próximos Passos (Futuro)

1. **Mobile full-screen modal**
2. **Real-time com WebSocket** (notificações push)
3. **Preferências de notificação** (tipos, frequência)
4. **Histórico arquivado** (notificações antigas)
5. **Toast notifications** para alertas críticos imediatos
6. **Sound alerts** (opcional, configurável)
7. **Email/SMS digest** (resumo diário)

---

## Versão

Notifications System v2.0 - SegVision Unified  
Atualizado em: Janeiro 2025
