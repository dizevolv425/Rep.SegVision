# Sistema de Notificações SegVision - Guia Rápido

> Sistema unificado de notificações para todos os perfis (Escola, Administrador, Operador)

---

## 🚀 Start Here

### Para desenvolvedores:
1. Leia: **[NOTIFICATIONS_UNIFIED_DOCUMENTATION.md](./NOTIFICATIONS_UNIFIED_DOCUMENTATION.md)**
2. Consulte: **[NOTIFICATIONS_VISUAL_SPEC.md](./NOTIFICATIONS_VISUAL_SPEC.md)**
3. Teste com: **[NOTIFICATIONS_CHECKLIST.md](./NOTIFICATIONS_CHECKLIST.md)**

### Para entender a migração:
- **[NOTIFICATIONS_MIGRATION_SUMMARY.md](./NOTIFICATIONS_MIGRATION_SUMMARY.md)** - Antes/Depois

---

## 📂 Arquivos do Sistema

### Componentes
```
/components/
  ├── NotificationsContext.tsx      # Estado global ⭐
  ├── NotificationsPopover.tsx      # Popover na header 🆕
  ├── NotificationsScreen.tsx       # Tela dedicada
  └── TopBar.tsx                    # Header com sino único ✅
```

### Documentação
```
/components/
  ├── NOTIFICATIONS_README.md                    # Este arquivo
  ├── NOTIFICATIONS_UNIFIED_DOCUMENTATION.md     # Doc completa ⭐
  ├── NOTIFICATIONS_VISUAL_SPEC.md               # Especificações visuais
  ├── NOTIFICATIONS_CHECKLIST.md                 # Testes & QA
  ├── NOTIFICATIONS_MIGRATION_SUMMARY.md         # Resumo da migração
  └── NOTIFICATIONS_SYSTEM_DOCUMENTATION.md      # LEGADO (não usar)
```

---

## ⚡ Quick Start

### Usar o Hook

```tsx
import { useNotifications } from './components/NotificationsContext';

function MyComponent() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  return (
    <div>
      <p>Você tem {unreadCount} notificações não lidas</p>
      <button onClick={markAllAsRead}>Marcar todas como lidas</button>
    </div>
  );
}
```

### Adicionar Notificação (Mock)

```tsx
// Em NotificationsContext.tsx
const newNotification: Notification = {
  id: uuid(),
  type: 'alert',
  severity: 'high',
  title: 'Alerta crítico',
  description: 'Descrição do alerta',
  origin: 'Câmera 01',
  timestamp: new Date(),
  status: 'unread',
  profileAccess: ['school', 'operator'],
  actionLabel: 'Ver alerta',
  actionPath: '/alerts'
};
```

---

## 🎯 Onde Encontrar

### Header (Sino)
- **Arquivo:** `/components/TopBar.tsx`
- **Componente:** `<NotificationsPopover />`
- **Aparece em:** Todas as páginas, top-right

### Popover
- **Arquivo:** `/components/NotificationsPopover.tsx`
- **Trigger:** Click no sino da header
- **Width:** 420px

### Tela Dedicada
- **Arquivo:** `/components/NotificationsScreen.tsx`
- **Rota Escola:** `/notifications`
- **Rota Admin:** `/admin/notifications`
- **Rota Operador:** `/operator/notifications`

### Sidebars (Badges)
- **Escola:** `/components/Sidebar.tsx`
- **Admin:** `/components/AdminSidebar.tsx`
- **Operador:** `/components/OperatorSidebar.tsx`

---

## 📊 Tipos

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

## 🎨 Design Tokens

```css
/* Contador (Badge Vermelho) */
--danger-bg: #C8142C        /* Red Alert/300 */
--white-50: #FFFFFF

/* Unread (Azul Claro) */
--blue-primary-50: #96BDF6
--blue-primary-200: #2F5FFF  /* Dot */

/* Critical (Barra Vermelha) */
--red-alert-300: #C8142C

/* Backgrounds */
--neutral-bg: #FFFFFF
--neutral-subtle: #F6F6F6
--neutral-border: #E2E2EA

/* Text */
--neutral-text: #2C2C2C
--neutral-text-muted: #1D1D1D
```

---

## ✅ Features

- ✅ **Um único sino** na header
- ✅ **Popover unificado** (420px)
- ✅ **Contadores sincronizados** (header + sidebar)
- ✅ **Filtragem por perfil** automática
- ✅ **Estados visuais** (unread/read/critical)
- ✅ **Badges de severidade** (alta/média/baixa)
- ✅ **Marca como lida** ao clicar
- ✅ **"Marcar todas como lidas"** no popover
- ✅ **"Ver todas"** navega para tela dedicada
- ✅ **Empty state** quando não há notificações
- ✅ **Scroll** quando muitas notificações
- ✅ **Acessibilidade** (ARIA, keyboard nav)

---

## 🔄 Sincronização

Tudo sincronizado via **NotificationsContext**:

```
Context → markAsRead(id) → Atualiza:
  ✓ Badge header
  ✓ Badge sidebar
  ✓ Popover items
  ✓ Tela dedicada
```

---

## 🐛 Troubleshooting

### Badge não atualiza?
1. Verifique se o componente usa `useNotifications()`
2. Certifique-se que está dentro do `<NotificationsProvider>`

### Notificação não aparece?
1. Verifique `profileAccess` array
2. Confirme que o perfil atual está incluído

### Contador errado?
1. O contador é baseado em `status === 'unread'`
2. Verificar se `markAsRead()` está sendo chamado corretamente

---

## 📚 Documentação Completa

### 1. Arquitetura & API
**[NOTIFICATIONS_UNIFIED_DOCUMENTATION.md](./NOTIFICATIONS_UNIFIED_DOCUMENTATION.md)**
- Componentes principais
- Fluxo de dados
- API do contexto
- Design tokens
- Exemplos de uso

### 2. Especificações Visuais
**[NOTIFICATIONS_VISUAL_SPEC.md](./NOTIFICATIONS_VISUAL_SPEC.md)**
- Layout detalhado
- Anatomia dos componentes
- Cores e ícones
- Estados visuais
- Tipografia
- Responsividade
- Acessibilidade

### 3. Checklist de Testes
**[NOTIFICATIONS_CHECKLIST.md](./NOTIFICATIONS_CHECKLIST.md)**
- Testes funcionais
- Testes visuais
- Sincronização
- Edge cases
- Deploy checklist

### 4. Migração (Antes/Depois)
**[NOTIFICATIONS_MIGRATION_SUMMARY.md](./NOTIFICATIONS_MIGRATION_SUMMARY.md)**
- Problemas anteriores
- Solução implementada
- Mudanças técnicas
- Resultados

---

## 🎓 Best Practices

### ✅ DO:
- Usar `useNotifications()` hook
- Incluir `profileAccess` ao criar notificações
- Marcar como lida ao navegar
- Usar badges de severidade quando relevante

### ❌ DON'T:
- Criar estado local de notificações
- Duplicar lógica de contadores
- Ignorar `profileAccess` (quebra filtragem)
- Modificar o contexto diretamente

---

## 🚀 Próximos Passos

### Implementar (Futuro):
- [ ] Real-time via WebSocket
- [ ] Toast para alertas críticos
- [ ] Mobile full-screen modal
- [ ] Preferências de usuário
- [ ] Push notifications
- [ ] Email/SMS digest

---

## 📞 Suporte

### Dúvidas sobre:
- **Arquitetura:** Consulte [NOTIFICATIONS_UNIFIED_DOCUMENTATION.md](./NOTIFICATIONS_UNIFIED_DOCUMENTATION.md)
- **Visual:** Consulte [NOTIFICATIONS_VISUAL_SPEC.md](./NOTIFICATIONS_VISUAL_SPEC.md)
- **Testes:** Consulte [NOTIFICATIONS_CHECKLIST.md](./NOTIFICATIONS_CHECKLIST.md)
- **Migração:** Consulte [NOTIFICATIONS_MIGRATION_SUMMARY.md](./NOTIFICATIONS_MIGRATION_SUMMARY.md)

---

## ✨ Versão

Notifications System v2.0 - Unified  
SegVision Design System  
Janeiro 2025

**Status:** ✅ Production Ready
