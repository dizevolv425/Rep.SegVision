# Especificação Visual - Popover de Notificações

## Layout Completo

```
┌──────────────────────────────────────────────────┐
│  Notificações            [Marcar como lidas]    │  ← Header (p-4)
│  3 não lidas                                     │
├──────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────┐ │
│  │  ●  [!] Invasão detectada no portão        │ │  ← Critical (barra vermelha)
│  │     principal                   [Alta] ●   │ │     + Badge severity
│  │     Movimento após horário...              │ │     + Dot não lida
│  │     Câmera Portão 1         há 15 minutos  │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │  ← Unread (bg azul claro)
│  │  ●  [$] Fatura gerada         [Média]  ●  │ │
│  │     Fatura mensal no valor...             │ │
│  │     Sistema de Cobrança          há 2h    │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │  ← Read (bg branco)
│  │  ●  [i] Integração reconectada            │ │
│  │     WhatsApp Business foi...              │ │
│  │     Central Integrações         há 4h     │ │
│  └────────────────────────────────────────────┘ │
│                                                  │  ← ScrollArea (400px)
│  ┌────────────────────────────────────────────┐ │
│  │  ●  [!] Câmera offline                    │ │
│  │     Câmera Pátio 02 perdeu...             │ │
│  │     Câmera Pátio 02             há 6h     │ │
│  └────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────┤
│                  [Ver todas]                     │  ← Footer (p-3)
└──────────────────────────────────────────────────┘
   420px width
```

---

## Anatomia do Header

```css
/* Container */
padding: 16px
border-bottom: 1px solid var(--neutral-border)
display: flex
justify-content: space-between
align-items: flex-start

/* Left Side */
<div>
  <h3>Notificações</h3>                 /* text-[var(--neutral-text)] */
  <p>3 não lidas</p>                     /* text-[var(--neutral-text-muted)] mt-0.5 */
</div>

/* Right Side (condicional) */
{unreadCount > 0 && (
  <Button variant="ghost" size="sm">    /* h-8 px-2 */
    Marcar como lidas
  </Button>
)}
```

---

## Anatomia de Notificação (Item)

### Estado: Unread + Critical

```
┌─────────────────────────────────────────────────┐
│▌ ●  [!] Invasão detectada no portão principal  │  ← 4px red bar left
│     principal                      [Alta] ●     │
│     Movimento após horário detectado na Câm...  │
│     Câmera Portão 1                há 15min     │
└─────────────────────────────────────────────────┘

CSS:
- Container: bg-[var(--blue-primary-50)] px-4 py-3
- Red accent: absolute left-0 w-1 bg-[var(--red-alert-300)]
- Icon circle: w-8 h-8 rounded-full bg-[var(--red-alert-50)] text-[var(--red-alert-300)]
- Badge: variant="light" tone="danger" size="s"
- Unread dot: w-2 h-2 rounded-full bg-[var(--blue-primary-200)]
```

### Estado: Read (Normal)

```
┌─────────────────────────────────────────────────┐
│  ●  [i] Integração WhatsApp reconectada         │
│      A integração com WhatsApp Business foi...  │
│      Central de Integrações              há 4h  │
└─────────────────────────────────────────────────┘

CSS:
- Container: bg-[var(--white-50)] px-4 py-3
- Icon circle: w-8 h-8 rounded-full bg-[var(--turquoise-alert-50)] text-[var(--turquoise-alert-300)]
- No badge, no dot
```

---

## Cores por Tipo de Notificação

### Alert (Alertas de Segurança)

```css
Icon Circle:
  background: var(--red-alert-50)      /* #FDC6C5 */
  color: var(--red-alert-300)          /* #C8142C */

Icon: AlertCircle (lucide-react)
```

### Financial (Financeiro)

```css
Icon Circle:
  background: var(--green-alert-50)    /* #E6FFE6 */
  color: var(--green-alert-300)        /* #47D238 */

Icon: DollarSign (lucide-react)
```

### System (Sistema)

```css
Icon Circle:
  background: var(--turquoise-alert-50)   /* #EBF6FF */
  color: var(--turquoise-alert-300)       /* #20A4ED */

Icon: Info (lucide-react)
```

---

## Badges de Severidade

### Alta (High)

```tsx
<Badge variant="light" tone="danger" size="s">Alta</Badge>

CSS:
- bg: var(--red-alert-50)
- border: var(--red-alert-200)
- text: var(--red-alert-300)
```

### Média (Medium)

```tsx
<Badge variant="light" tone="warning" size="s">Média</Badge>

CSS:
- bg: var(--orange-alert-50)
- border: var(--orange-alert-200)
- text: var(--orange-alert-300)
```

### Baixa (Low)

```tsx
<Badge variant="light" tone="info" size="s">Baixa</Badge>

CSS:
- bg: var(--turquoise-alert-50)
- border: var(--turquoise-alert-200)
- text: var(--turquoise-alert-300)
```

---

## Indicador de Não Lida

### Dot (ponto azul)

```css
width: 8px
height: 8px
border-radius: 50%
background: var(--blue-primary-200)   /* #2F5FFF */
flex-shrink: 0
```

Posição: Top-right do item, ao lado do badge de severidade

---

## Critical Accent (Barra Vermelha)

```css
position: absolute
left: 0
top: 0
bottom: 0
width: 4px
background: var(--red-alert-300)   /* #C8142C */
```

Aplica-se apenas quando `severity === 'high'`

---

## Estados Interativos

### Hover

```css
/* Item */
hover:bg-[var(--neutral-subtle)]   /* #F6F6F6 */
cursor: pointer
transition: background-color 200ms
```

### Active/Click

```tsx
onClick={() => {
  markAsRead(notification.id);
  if (notification.actionPath) {
    onNavigate(notification.actionPath);
    setOpen(false);
  }
}}
```

### Focus

```css
focus-visible:outline-2
focus-visible:outline-[var(--blue-primary-100)]
focus-visible:outline-offset-2
```

---

## Tipografia

### Título (h3 Header)

```css
font-family: Inter
font-weight: 500
color: var(--neutral-text)          /* #2C2C2C */
/* Tamanho definido por globals.css, não usar classes text-* */
```

### Subtitle (contador)

```css
font-family: Inter
color: var(--neutral-text-muted)    /* #1D1D1D */
margin-top: 2px
/* Tamanho definido por globals.css */
```

### Título da Notificação

```css
font-family: Inter
font-weight: 500
color: var(--neutral-text)
line-clamp: 1
/* Não usar text-sm, text-base, etc - usar defaults */
```

### Descrição

```css
font-family: Inter
color: var(--neutral-text-muted)
line-clamp: 2
margin-top: 4px
/* Não usar text-sm - usar default */
```

### Meta (origem e timestamp)

```css
font-family: Inter
color: var(--neutral-text-muted)
margin-top: 4px
/* Usar default do globals.css */
```

---

## Footer

```css
/* Container */
padding: 12px
border-top: 1px solid var(--neutral-border)
background: var(--neutral-subtle)   /* #F6F6F6 */

/* Button */
<Button variant="ghost" size="sm" className="w-full">
  Ver todas
</Button>

CSS Button:
- width: 100%
- text-align: center
- color: var(--primary-bg)          /* Blue Primary/200 */
- hover: bg-[var(--neutral-bg)]
- hover: text-[var(--primary-bg-hover)]
```

---

## Empty State

```
┌──────────────────────────────────────────────────┐
│  Notificações                                    │
│  0 não lidas                                     │
├──────────────────────────────────────────────────┤
│                                                  │
│                      ○                           │  ← Bell icon (48px)
│                                                  │     color: var(--neutral-border)
│               Sem notificações                   │
│         Avisaremos quando algo novo chegar.      │
│                                                  │
│                                                  │  ← py-12
└──────────────────────────────────────────────────┘

CSS:
- Container: flex flex-col items-center justify-center py-12 px-4
- Icon: h-12 w-12 text-[var(--neutral-border)]
- Title: text-[var(--neutral-text)]
- Help: text-[var(--neutral-text-muted)] text-center mt-1
```

---

## Responsividade

### Desktop (>= 768px)

```css
width: 420px
max-height: 560px
align: end (alinhado à direita do bell)
sideOffset: 8px (espaço entre bell e popover)
```

### Tablet (768px - 1024px)

Mesmo comportamento do desktop.

### Mobile (< 768px) - FUTURO

```css
type: modal-full-screen
width: 100vw
height: 100vh
position: fixed
top: 0
left: 0
z-index: 50

Header actions: overflow to kebab menu
```

---

## Acessibilidade (a11y)

### Popover Trigger (Bell Button)

```tsx
<Button
  aria-label="Abrir notificações"
  aria-expanded={open}
  aria-haspopup="dialog"
  role="button"
>
  <Bell />
  {unreadCount > 0 && (
    <span aria-label={`${unreadCount} notificações não lidas`}>
      {unreadCount}
    </span>
  )}
</Button>
```

### Popover Content

```tsx
<PopoverContent
  role="dialog"
  aria-label="Notificações"
>
```

### Notification Items

```tsx
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  aria-label={`${notification.title}, ${notification.status === 'unread' ? 'não lida' : 'lida'}`}
>
```

### Keyboard Navigation

- **Tab:** Focar próximo elemento
- **Shift+Tab:** Focar elemento anterior
- **Enter/Space:** Abrir notificação
- **Escape:** Fechar popover

---

## Animações

### Popover Open/Close

```tsx
// Radix Popover já tem animações built-in
// Usar transitions padrão do shadcn/ui
```

### Hover Transitions

```css
transition: background-color 200ms ease-in-out;
```

### Badge Counter Update

```css
/* Smooth number change */
transition: all 150ms ease-out;
```

---

## Z-Index Hierarchy

```css
TopBar (Header):        z-index: 30
PopoverContent:         z-index: 50 (Radix default)
Modal (futuro):         z-index: 50
Sidebar:                z-index: 40
```

---

## Performance

### ScrollArea

```tsx
<ScrollArea className="h-[400px]">
  {/* Virtualization não necessária para < 100 items */}
  {/* Se crescer muito, considerar react-window */}
</ScrollArea>
```

### Re-renders

```tsx
// Context otimizado com filtros
const getFilteredNotifications = React.useMemo(() => {
  return notifications.filter(n => 
    n.profileAccess.includes(currentProfile)
  );
}, [notifications, currentProfile]);
```

---

## Especificações Técnicas

### Dependencies

```json
{
  "lucide-react": "Ícones",
  "@radix-ui/react-popover": "Popover component",
  "@radix-ui/react-scroll-area": "ScrollArea",
  "date-fns": "Formatação de datas",
  "class-variance-authority": "Badge variants"
}
```

### Imports

```tsx
import { Bell, AlertCircle, DollarSign, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useNotifications } from './NotificationsContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
```

---

## Versão

Visual Specification v1.0 - NotificationsPopover  
SegVision Design System  
Janeiro 2025
