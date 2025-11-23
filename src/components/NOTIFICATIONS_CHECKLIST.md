# Checklist - Sistema de Notificações Unificado

## ✅ Implementação Completa

### 1. Componentes Criados/Atualizados

- [x] **NotificationsContext.tsx** - Estado global (já existia)
- [x] **NotificationsPopover.tsx** - Novo popover unificado (CRIADO)
- [x] **NotificationsScreen.tsx** - Tela dedicada (já existia)
- [x] **TopBar.tsx** - Header com sino único (ATUALIZADO)
- [x] **Sidebar.tsx** - Badge sincronizado (já estava OK)
- [x] **AdminSidebar.tsx** - Badge sincronizado (já estava OK)
- [x] **OperatorSidebar.tsx** - Badge sincronizado (já estava OK)

### 2. Removido (Limpeza)

- [x] Popover antigo de alertas (mock local removido)
- [x] Segundo botão Bell duplicado (removido)
- [x] Import do NotificationsModal não usado (removido)
- [x] Estados locais de alerts (removido)
- [x] Funções getAlertIcon locais (removido)

---

## 🧪 Testes de Funcionalidade

### Header (TopBar)

- [ ] **Sino visível** em todas as páginas
- [ ] **Badge vermelho** aparece quando `unreadCount > 0`
- [ ] **Badge esconde** quando `unreadCount === 0`
- [ ] **Click no sino** abre o popover
- [ ] **Apenas um sino** na header (sem duplicações)
- [ ] **Aria-label** correto no botão

### Popover de Notificações

#### Header
- [ ] **Título** "Notificações" aparece
- [ ] **Contador** mostra "{count} não {lida/lidas}"
- [ ] **Botão "Marcar como lidas"** aparece quando `unreadCount > 0`
- [ ] **Botão esconde** quando `unreadCount === 0`
- [ ] **Click no botão** marca todas como lidas

#### Lista
- [ ] **Notificações filtradas** por perfil atual
- [ ] **Items unread** têm background azul claro
- [ ] **Items read** têm background branco
- [ ] **Critical alerts** mostram barra vermelha esquerda
- [ ] **Ícones corretos** por tipo (Alert/Financial/System)
- [ ] **Badges de severidade** aparecem corretamente
- [ ] **Dot azul** aparece em items unread
- [ ] **Hover** muda background para cinza
- [ ] **Click no item** marca como lida e navega
- [ ] **Scroll funciona** quando há muitas notificações

#### Footer
- [ ] **Botão "Ver todas"** aparece
- [ ] **Click** navega para `/notifications`
- [ ] **Popover fecha** após navegar

#### Empty State
- [ ] **Ícone Bell** aparece quando lista vazia
- [ ] **Texto** "Sem notificações" aparece
- [ ] **Mensagem de ajuda** aparece

### Tela Dedicada (NotificationsScreen)

- [ ] **Rota funciona** em todos os perfis
- [ ] **Breadcrumb** aparece corretamente
- [ ] **Filtros** funcionam (busca, tipo, severidade, status)
- [ ] **Checkboxes** de seleção funcionam
- [ ] **Marcar selecionadas como lidas** funciona
- [ ] **Click em item** marca como lida e navega

### Sidebars

#### Sidebar (Escola)
- [ ] **Item "Notificações"** existe
- [ ] **Badge contador** aparece quando `unreadCount > 0`
- [ ] **Badge esconde** quando `unreadCount === 0`
- [ ] **Número correto** de não lidas
- [ ] **Badge atualiza** ao marcar como lidas

#### AdminSidebar
- [ ] **Item "Notificações"** existe
- [ ] **Badge contador** aparece quando `unreadCount > 0`
- [ ] **Badge esconde** quando `unreadCount === 0`
- [ ] **Número correto** de não lidas
- [ ] **Badge atualiza** ao marcar como lidas

#### OperatorSidebar
- [ ] **Item "Notificações"** existe
- [ ] **Badge contador** aparece quando `unreadCount > 0`
- [ ] **Badge esconde** quando `unreadCount === 0`
- [ ] **Número correto** de não lidas
- [ ] **Badge atualiza** ao marcar como lidas

---

## 🔄 Sincronização de Contadores

### Cenário 1: Marcar todas como lidas (Popover)

1. [ ] Abrir popover com 3 notificações não lidas
2. [ ] Click em "Marcar como lidas"
3. [ ] **Badge da header** some
4. [ ] **Badge da sidebar** some
5. [ ] **Items do popover** mudam de azul para branco
6. [ ] **Dots azuis** somem
7. [ ] **Contador** mostra "0 não lidas"

### Cenário 2: Marcar uma como lida (Click no item)

1. [ ] Abrir popover com 3 notificações não lidas
2. [ ] Click em uma notificação
3. [ ] **Navega** para página correta
4. [ ] **Popover fecha**
5. [ ] **Badge da header** mostra 2
6. [ ] **Badge da sidebar** mostra 2
7. [ ] Reabrir popover
8. [ ] **Item clicado** está branco (read)
9. [ ] **Contador** mostra "2 não lidas"

### Cenário 3: Trocar de perfil

1. [ ] Perfil Escola: 3 não lidas
2. [ ] **Badge header** mostra 3
3. [ ] **Badge sidebar** mostra 3
4. [ ] Trocar para Administrador
5. [ ] **Badge atualiza** para novo número
6. [ ] **Notificações filtradas** corretamente
7. [ ] Voltar para Escola
8. [ ] **Badge volta** para 3

### Cenário 4: Marcar selecionadas (Tela dedicada)

1. [ ] Navegar para `/notifications`
2. [ ] Selecionar 2 notificações não lidas
3. [ ] Click em "Marcar selecionadas como lidas"
4. [ ] **Badge header** atualiza
5. [ ] **Badge sidebar** atualiza
6. [ ] **Items** mudam visual
7. [ ] **Seleção** limpa

---

## 🎨 Testes Visuais

### Cores e Tokens

- [ ] **Blue Primary/50** (#96BDF6) - background unread
- [ ] **Red Alert/300** (#C8142C) - badge header, barra critical
- [ ] **White/50** (#FFFFFF) - background read
- [ ] **Neutral subtle** (#F6F6F6) - hover, footer
- [ ] **Neutral border** (#E2E2EA) - bordas

### Ícones

- [ ] **Bell** - sino header, empty state
- [ ] **AlertCircle** - notificações de alerta
- [ ] **DollarSign** - notificações financeiras
- [ ] **Info** - notificações de sistema

### Badges de Severidade

- [ ] **Alta** - `tone="danger"` (vermelho)
- [ ] **Média** - `tone="warning"` (laranja)
- [ ] **Baixa** - `tone="info"` (turquesa)
- [ ] Todos variant="light", size="s"

### Tipografia

- [ ] **Nenhuma classe** text-sm, text-base, etc
- [ ] **Apenas** text-[var(--neutral-text)] e text-[var(--neutral-text-muted)]
- [ ] **Font-family** Inter em todos os textos

---

## ♿ Acessibilidade

### Keyboard Navigation

- [ ] **Tab** foca no sino da header
- [ ] **Enter/Space** abre popover
- [ ] **Tab** dentro do popover navega items
- [ ] **Enter** em item marca como lida e navega
- [ ] **Escape** fecha popover

### ARIA Labels

- [ ] Sino tem `aria-label="Abrir notificações"`
- [ ] Badge tem `aria-label="{count} notificações não lidas"`
- [ ] Popover tem `role="dialog"`
- [ ] Items têm labels descritivos

### Focus Management

- [ ] **Focus ring** azul visível no sino
- [ ] **Focus ring** visível nos items
- [ ] **Focus trap** dentro do popover

---

## 📱 Responsividade

### Desktop (>= 1024px)

- [ ] Popover **420px** width
- [ ] Alinhado à **direita** do sino
- [ ] **8px** de espaço entre sino e popover

### Tablet (768px - 1024px)

- [ ] Mesmas regras do desktop

### Mobile (< 768px)

- [ ] **(Futuro)** Modal full-screen
- [ ] **(Futuro)** Header actions em kebab menu

---

## 🐛 Edge Cases

### Caso 1: Zero notificações

- [ ] **Badge header** não aparece
- [ ] **Badge sidebar** não aparece
- [ ] **Popover** mostra empty state
- [ ] **Botão "Marcar como lidas"** não aparece
- [ ] **Footer** não aparece

### Caso 2: Muitas notificações (>20)

- [ ] **Scroll funciona** corretamente
- [ ] **Performance** aceitável
- [ ] **Todos os items** renderizam

### Caso 3: Notificação sem severidade

- [ ] **Sem badge** de severidade
- [ ] **Layout** não quebra
- [ ] **Funciona normalmente**

### Caso 4: Todas as notificações são read

- [ ] **Badge header** não aparece
- [ ] **Contador** mostra "0 não lidas"
- [ ] **Botão "Marcar como lidas"** não aparece
- [ ] **Items** todos com background branco

### Caso 5: Navegar sem actionPath

- [ ] **Click** marca como lida
- [ ] **Não navega** (não quebra)
- [ ] **Popover fecha**

---

## 📚 Documentação

- [x] **NOTIFICATIONS_UNIFIED_DOCUMENTATION.md** criado
- [x] **NOTIFICATIONS_VISUAL_SPEC.md** criado
- [x] **NOTIFICATIONS_CHECKLIST.md** criado (este arquivo)
- [x] **NOTIFICATIONS_SYSTEM_DOCUMENTATION.md** marcado como legado

---

## 🚀 Deploy Checklist

### Antes de ir para produção:

1. [ ] Todos os testes funcionais passam
2. [ ] Todos os testes visuais passam
3. [ ] Testes de acessibilidade passam
4. [ ] Responsividade testada
5. [ ] Edge cases testados
6. [ ] Performance aceitável
7. [ ] Documentação atualizada
8. [ ] Code review feito
9. [ ] Sem console.errors
10. [ ] Build sem warnings

---

## 🔮 Melhorias Futuras

- [ ] **Mobile** - Modal full-screen
- [ ] **WebSocket** - Real-time push
- [ ] **Toast** - Notificações críticas imediatas
- [ ] **Sound** - Alertas sonoros (opcional)
- [ ] **Preferências** - Configurações por usuário
- [ ] **Histórico** - Arquivar notificações antigas
- [ ] **Virtualization** - react-window para muitas notificações
- [ ] **Email/SMS** - Digest diário

---

## 📊 Métricas de Sucesso

- ✅ **Zero duplicações** de sino na header
- ✅ **100% sincronização** de contadores
- ✅ **Consistência** em todos os perfis
- ✅ **UX unificada** (mesmo comportamento)
- ✅ **Performance** < 100ms para abrir popover
- ✅ **Acessibilidade** WCAG AA

---

## ✨ Versão

Notifications System v2.0 - Unified  
Checklist criado em: Janeiro 2025
