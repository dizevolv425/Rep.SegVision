# SegVision Design System Guidelines

## Visão Geral
Interface web SaaS para sistema de monitoramento escolar com IA. Minimalista, light mode, fundo branco (#FFFFFF), tipografia exclusiva Inter.

---

## Paleta de Cores Oficial

### Cores Principais
- **Blue Primary 200**: `#2F5FFF` - Cor principal do sistema
- **Red Alert 200**: `#F03948` - Alertas críticos

### Alert Palettes (Completas)
```css
/* Red Alert */
--red-alert-50: #FDC6C5
--red-alert-100: #F87E81
--red-alert-200: #F03948
--red-alert-300: #C8142C
--red-alert-400: #63000D

/* Green Alert */
--green-alert-50: #E6FFE6
--green-alert-100: #BDEFB8
--green-alert-200: #87E373
--green-alert-300: #47D238
--green-alert-400: #289726
--green-alert-500: #025D00

/* Turquoise Alert (Info) */
--turquoise-alert-50: #EBF6FF
--turquoise-alert-200: #63BDF7
--turquoise-alert-400: #126AAF

/* Yellow Alert (Caution) */
--yellow-alert-50: #FFFEF0
--yellow-alert-200: #FDEC85
--yellow-alert-400: #DEB900
--yellow-alert-500: #715700

/* Orange Alert (Warning) */
--orange-alert-50: #FFFBE8
--orange-alert-200: #FACD64
--orange-alert-400: #BA870B

/* Neutrals */
--gray-50: #F6F6F6
--gray-200: #B3B4C1
--gray-300: #7A7A88
--gray-400: #474748
--white-100: #FAFAFA
```

---

## Badge Component (ATUALIZADO)

### 3 Variantes com Pesos Visuais Diferentes

#### 1. HEAVY (Alertas Críticos)
**Uso**: Máxima atenção - alertas urgentes, status críticos  
**Estilo**: Fundo escuro (tons 300/400) + Texto branco

```tsx
<Badge variant="heavy" tone="danger" size="s">Offline</Badge>
<Badge variant="heavy" tone="success" size="s">Online</Badge>
<Badge variant="heavy" tone="overdue" size="s">Vencido</Badge>
```

**Cores**:
- `danger` → Red Alert/300 (#C8142C)
- `success` → Green Alert/400 (#289726)
- `info` → Turquoise Alert/400 (#126AAF)
- `caution` → Yellow Alert/400 (#DEB900)
- `warning` → Orange Alert/400 (#BA870B)
- `neutral` → Gray/300 (#7A7A88)

#### 2. MEDIUM (Status Intermediários)
**Uso**: Visibilidade média - status padrão do sistema  
**Estilo**: Fundo médio (tons 100/200) + Texto escuro no tom (tom 400)

```tsx
<Badge variant="medium" tone="success" size="s">Ativo</Badge>
<Badge variant="medium" tone="pending" size="s">Pendente</Badge>
<Badge variant="medium" tone="resolved" size="s">Resolvido</Badge>
```

**Cores**:
- `danger` → bg Red/100 (#F87E81) + texto Red/400 (#63000D)
- `success` → bg Green/200 (#87E373) + texto Green/500 (#025D00)
- `info` → bg Turquoise/200 (#63BDF7) + texto Turquoise/400 (#126AAF)
- `caution` → bg Yellow/200 (#FDEC85) + texto Yellow/500 (#715700)
- `neutral` → bg Gray/200 (#B3B4C1) + texto Gray/400 (#474748)

#### 3. LIGHT (Tags e Categorias)
**Uso**: Baixa prioridade - categorização, metadados  
**Estilo**: Fundo claro (tons 50) + Borda (tons 300/400) + Texto no tom

```tsx
<Badge variant="light" tone="primary" size="s">Plano Pro</Badge>
<Badge variant="light" tone="neutral" size="s">Escola ABC</Badge>
```

### Mapeamento Semântico Obrigatório

#### Câmeras/Dispositivos
- **Online** → `variant="heavy" tone="success"` (verde crítico)
- **Offline** → `variant="heavy" tone="danger"` (vermelho crítico)

#### Alertas IA
- **Novo** → `variant="heavy" tone="danger"` (não visualizado = crítico)
- **Verificado** → `variant="medium" tone="caution"` (em análise = amarelo médio)
- **Resolvido** → `variant="medium" tone="success"` (concluído = verde médio)

#### Financeiro
- **Pago** → `variant="medium" tone="paid"` (confirmado)
- **Pendente** → `variant="medium" tone="pending"` (aguardando = amarelo)
- **Vencido** → `variant="heavy" tone="overdue"` (crítico = vermelho)

#### Tags/Categorias
- Sempre usar `variant="light"` para planos, tipos, escola, etc.

---

## Tipografia

### Regras Estritas
- **Tipografia**: Inter (Google Fonts)
- **PROIBIDO**: Classes Tailwind de tipografia (`text-xl`, `text-lg`, `font-bold`, `font-semibold`)
- **PERMITIDO**: Apenas `text-[var(--neutral-text)]` e `text-[var(--neutral-text-muted)]`

### Tokens Padrão
```css
--neutral-text: var(--black-300)        /* Títulos */
--neutral-text-muted: var(--black-200)  /* Textos secundários */
```

### Regras Globais de Tipografia
Aplicadas automaticamente via `/styles/globals.css`:
- **h4**: `font-weight: 600` (semibold) - Todos os h4 são automaticamente semibold
  - **NUNCA** adicione `font-bold`, `font-semibold`, `font-medium`, `font-normal` em h4
  - O semibold é aplicado automaticamente pelo globals.css
- **td**: `font-size: 14px` - Todas as células de tabela têm tamanho fixo de 14px

---

## Layout

### Estrutura Fixa
- **Body/HTML**: `overflow: hidden` + `h-screen`
- **Sidebar + Header**: Fixos
- **Conteúdo**: Scroll interno apenas na área de conteúdo

### Sidebar
- **Fundo Light Mode**: Blue Primary/300 (#161E53)
- **Fundo Dark Mode**: #102D8A (token: `var(--sidebar)`) - Azul vibrante
- **Textos e ícones**: Branco (#FAFAFA) em ambos os modos
- **Largura**: 260px (w-[260px]) - Lateral esquerda fixa

---

## Ícones Padronizados

### Sidebars (3 perfis)
- **Dashboard**: `LayoutDashboard`
- **Financeiro**: `CreditCard`
- **Central de Inteligência**: `Brain`

### Câmeras
- **Online/Offline**: `CheckCircle` / `XCircle`
- **Status IA**: Feature badges com ícones relevantes

---

## Botões de Ação em Cards

### Botões com Texto Branco (Obrigatório)
Todos os botões de ação em cards de alertas devem ter **texto branco** para máximo contraste e clareza visual.

#### Primary (Ver Vídeo)
```css
background: var(--blue-primary-200) /* #2F5FFF */
color: white
height: 36px
border-radius: 10px
font: Inter/Semibold/13
```

#### Warning (Confirmar)
```css
background: var(--orange-alert-400) /* #BA870B */
color: white
height: 36px
border-radius: 10px
font: Inter/Semibold/13
```

#### Success (Resolver)
```css
background: var(--green-alert-300) /* #47D238 */
color: white
height: 36px
border-radius: 10px
font: Inter/Semibold/13
```

#### Disabled
```css
background: var(--gray-200) /* #B3B4C1 */
color: white
opacity: 0.6
cursor: not-allowed
```

### Hover State
Use `opacity: 0.96` mantendo a mesma cor de background.

---

## Tokens Semânticos

```css
/* Primary */
--primary-bg: var(--blue-primary-200)
--primary-text-on: var(--white-50)

/* Neutral */
--neutral-bg: var(--white-50)
--neutral-border: var(--gray-100)
--neutral-text: var(--black-300)
--neutral-text-muted: var(--black-200)

/* Feedback */
--success-bg: var(--green-alert-200)
--caution-bg: var(--yellow-alert-400)
--warning-bg: var(--orange-alert-300)
--danger-bg: var(--red-alert-300)
--info-bg: var(--turquoise-alert-300)
```

---

## Regras Importantes

1. **Badge Offline** sempre `heavy` + `danger` (vermelho crítico)
2. **Badge Online** sempre `heavy` + `success` (verde crítico)
3. **Pendente** usa amarelo (`pending` → `caution`), NÃO laranja
4. **Vencido** sempre `heavy` + `danger` (vermelho crítico)
5. **Verificado** usa amarelo médio (`medium` + `caution`)
6. **Novo (alerta)** sempre `heavy` + `danger` (vermelho crítico)
7. Tags e categorias sempre `light` variant
8. Sem classes de tipografia Tailwind exceto tokens de cor
9. Inter como única fonte
10. Fundo branco (#FFFFFF) no light mode
11. **Dark Mode disponível** - Main #090F36, Header #0B1343, Sidebar #102D8A, Cards/Tables #19215A
12. Consultar `/DARK_MODE_DOCUMENTATION.md` para especificações completas do dark mode

---

## Documentação Completa

### Badge System (v3.0)
- **Badge Documentation**: `/components/ui/BADGE_DOCUMENTATION.md`
- **Badge Figma Spec**: `/components/ui/BADGE_FIGMA_SPEC.md`
- **Badge Color Reference**: `/components/ui/BADGE_COLOR_REFERENCE.md`
- **Badge Usage by Journey**: `/components/BADGE_USAGE_BY_JOURNEY.md`
- **Badge Migration Guide**: `/components/BADGE_MIGRATION_QUICK_GUIDE.md`
- **Badge System Summary**: `/components/BADGE_SYSTEM_V3_SUMMARY.md`
- **Badge Visual Test**: `/components/BadgeVisualTest.tsx` (rota: `/badge-visual-test`)
- **Badge Showcase**: `/components/BadgeShowcase.tsx` (rota: `/badge-showcase`)

### Other Components
- **Dark Mode**: `/DARK_MODE_DOCUMENTATION.md` ⭐
- **Alerts System**: `/components/ALERTS_SYSTEM_DOCUMENTATION.md`
- **Alert Cards**: `/components/ALERT_CARD_SPEC.md`
- **Toasts & Dialogs**: `/components/TOAST_AND_DIALOG_SYSTEM.md` (showcase: `/toast-showcase`)
- **Settings (Unified)**: `/components/SETTINGS_MIGRATION.md`
- **Buttons**: `/components/ui/BUTTON_DOCUMENTATION.md`
- **Forms**: `/components/ui/FORM_SYSTEM_DOCUMENTATION.md`
- **Notifications**: `/components/NOTIFICATIONS_UNIFIED_DOCUMENTATION.md`
- **Sidebar**: `/components/SIDEBAR_DOCUMENTATION.md`
- **Profile System**: `/components/PROFILE_SYSTEM_DOCUMENTATION.md`

---

**Design System**: SegVision (Light + Dark Mode)  
**Versão**: 3.4  
**Data**: Janeiro 2025  
**Atualização**: Dark Mode refinado - Main #090F36, Header #0B1343, Sidebar #102D8A, Cards/Tables #19215A
