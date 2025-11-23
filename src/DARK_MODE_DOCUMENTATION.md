# SegVision Dark Mode Documentation

## Overview
Sistema de Dark Mode global implementado com paleta azul escura, mantendo a identidade visual SegVision e garantindo contraste AA (WCAG 2.1).

---

## Toggle de Tema

### Localização
- **Header**: Posicionado entre o ícone de notificações (Bell) e o avatar do usuário
- **Ícone Light Mode**: Sol (Sun)
- **Ícone Dark Mode**: Lua (Moon)
- **Tooltip**: "Ativar modo escuro" / "Desativar modo escuro"

### Comportamento
- **Click**: Alterna entre light e dark mode
- **Persistência**: Salvo em `localStorage.segvision-theme`
- **Padrão**: Light mode
- **System**: Opcionalmente pode seguir `prefers-color-scheme`

### Acessibilidade
- `aria-pressed`: Indica estado atual do toggle
- `aria-label`: Descreve ação do botão
- Focus ring visível em ambos os modos

---

## Tokens de Cor - Light Mode

```css
/* Surfaces */
--neutral-bg: #FFFFFF
--neutral-subtle: #F6F6F6
--neutral-border: #E2E2EA

/* Text */
--neutral-text: #2C2C2C
--neutral-text-muted: #1D1D1D
--neutral-icon: #1D1D1D

/* Brand */
--primary-bg: #2F5FFF
--primary-text-on: #FFFFFF

/* Sidebar */
--sidebar: #161E53 (Blue Primary/300)
--sidebar-foreground: #FAFAFA
--sidebar-accent: #2F5FFF (Blue Primary/200)
--sidebar-border: #2F5FFF
```

---

## Tokens de Cor - Dark Mode

```css
/* Surfaces */
--neutral-bg: #090F36 - Main background (body/main)
--header-bg: #0B1343 - Header background
--card: #19215A - Card, table, section backgrounds
--neutral-subtle: #19215A - Cards, tables, sections
--neutral-border: #0F2256 (Blue Primary/600) - Stroke mais clara

/* Text */
--neutral-text: #FAFAFA
--neutral-text-muted: rgba(250, 250, 250, 0.6)
--neutral-icon: rgba(250, 250, 250, 0.75)

/* Brand - Tom mais claro */
--primary-bg: #2F5FFF (Blue Primary/200) - Mesmo azul do light mode
--primary-bg-hover: #6891FF (Blue Primary/100) - Hover mais claro
--primary-bg-press: #161E53 (Blue Primary/300) - Press mais escuro
--primary-text-on: #FAFAFA

/* Sidebar */
--sidebar: #102D8A - Dark mode específico (azul vibrante)
--sidebar-foreground: #FAFAFA
--sidebar-border: #FAFAFA
```

---

## Componentes Adaptados

### Sidebar
- **Fundo Light**: Blue Primary/300 (#161E53) - Identidade visual SegVision
- **Fundo Dark**: #102D8A - Tom azul vibrante
- **Item Ativo**: Blue Primary/200 (#2F5FFF) em ambos os modos
- **Texto**: White 100 em ambos os modos
- **Badge**: White/100 em ambos os modos
- **Divisor**: White/100 com 35% opacidade em ambos os modos

### Header (AppHeader)
- **Fundo**: `--header-bg` (#0B1343 dark | #FFF light)
- **Borda**: `--neutral-border` (#0F2256 dark | E2E2EA light)
- **Título**: `--neutral-text` (adapta automaticamente)
- **Subtítulo**: `--neutral-text-muted` (60% opacidade dark)

### Cards
- **Fundo**: #19215A no dark (todos os cards, tabelas, seções) | #FFFFFF no light
- **Borda**: Blue Primary/600 (#0F2256) no dark - Stroke mais clara | #E2E2EA no light
- **Shadow**: Removido no dark mode

### Inputs
- **Fundo**: #19215A no dark (mesmo das cards) | Gray/50 (#F6F6F6) no light
- **Borda**: Blue Primary/700 (#0D1B4A) no dark | Gray/200 (#B3B4C1) no light
- **Hover**: Blue Primary/600 (#0F2256) no dark - Mais claro | Gray/300 no light
- **Focus**: Blue Primary/200 ring (#2F5FFF) no dark - Mais vibrante | Blue Primary/100 ring no light
- **Texto**: White/100 no dark | Black/300 no light
- **Placeholder**: White/100 @ 50% opacity no dark | Gray/300 no light

### Tables
- **Header Bg**: #19215A no dark (mesmo das cards) | Gray/50 no light
- **Row Hover**: #19215A no dark | Gray/50 no light
- **Divider**: Blue Primary/700 no dark | Gray/100 no light

### Badges

#### Light Variant (Dark Mode)
```css
primary:  bg-800  border-600  text-300
success:  bg-800  border-600  text-300
warning:  bg-800  border-600  text-300
yellow:   bg-800  border-600  text-300
info:     bg-800  border-600  text-300
danger:   bg-800  border-600  text-300
neutral:  bg-850  border-700  text-white@75%
```

#### Medium Variant (Dark Mode)
```css
primary:  bg-Blue/400    text-White/100
success:  bg-Green/400   text-White/100
warning:  bg-Orange/400  text-White/100
yellow:   bg-Yellow/400  text-White/100
info:     bg-Turquoise/400 text-White/100
danger:   bg-Red/400     text-White/100
neutral:  bg-Blue/700    text-White/100
```

#### Heavy Variant
Permanece igual em ambos os modos (cores intensas mantidas).

### Buttons
- **Primary**: Blue Primary/200 (#2F5FFF) bg em **ambos** os modos - Azul mais claro e vibrante
- **Hover**: Blue Primary/100 (#6891FF) no dark - Mais claro | Blue Primary/300 no light
- **Press**: Blue Primary/300 (#161E53) no dark | Blue Primary/400 no light
- **Focus Ring**: Blue Primary/200 no dark - Mais vibrante | Blue Primary/100 no light
- **Outline**: 
  - Border branco (White/100) no dark | Preto no light
  - Hover: border azul (Primary/200) + bg subtle
  - Background sempre transparente
- **Ghost**: Subtle bg no hover em ambos os modos

### Modals/Dialogs
- **Surface**: #19215A no dark (mesmo das cards) | #FFF no light
- **Border**: Blue Primary/700 no dark - Mais claro | Gray/100 no light
- **Backdrop**: `rgba(44, 44, 44, 0.5)` em ambos

---

## Regras de Contraste (WCAG AA)

### Texto sobre Fundos
- **Corpo**: ≥ 4.5:1 (garantido com White/100 sobre Blue/950)
- **Botões**: ≥ 4.5:1 (Blue/400 com White text = 7.2:1)
- **Links**: ≥ 4.5:1 (Blue/400 sobre 950 = 6.8:1)

### Placeholders
- **Opacidade máxima**: 60% (--neutral-text-muted)
- Suficiente para indicação, não para leitura crítica

### Focus Indicators
- **Light Mode**: Blue Primary/100 (ring visível)
- **Dark Mode**: Blue Primary/200 (#2F5FFF) - Mais vibrante e visível
- **Largura**: 2px, offset 2px

---

## Scrollbar Styling

### Light Mode
```css
track: #FFFFFF
thumb: #E2E2EA
thumb-hover: #B3B4C1
```

### Dark Mode
```css
track: #090F36 (Main background)
thumb: #19215A (Cards/sections)
thumb-hover: rgba(250, 250, 250, 0.75)
```

---

## Implementação Técnica

### ThemeContext
- **Provider**: Envolve toda a aplicação
- **Hook**: `useTheme()` retorna `{ theme, setTheme, actualTheme }`
- **Estados**: 'light' | 'dark' | 'system'
- **localStorage**: `segvision-theme`

### ThemeToggle Component
```tsx
import { useTheme } from './ThemeContext';

const { actualTheme, setTheme } = useTheme();
const toggleTheme = () => {
  setTheme(actualTheme === 'light' ? 'dark' : 'light');
};
```

### CSS Class Trigger
```css
.dark {
  /* Todos os tokens dark */
}
```

Aplicado dinamicamente ao `<html>` element via `document.documentElement.classList`.

---

## Testes de Qualidade

### Checklist Visual
- [ ] Sidebar mantém identidade azul em ambos os modos
- [ ] Texto legível em todos os cards e modais
- [ ] Badges mantém hierarquia visual (light < medium < heavy)
- [ ] Inputs claramente delimitados e focus visível
- [ ] Tabelas alternam linhas com contraste sutil
- [ ] Scrollbar visível mas discreta

### Checklist Funcional
- [ ] Toggle persiste escolha após refresh
- [ ] Tooltip muda texto conforme modo atual
- [ ] Ícone alterna entre Sol e Lua
- [ ] Transição suave entre modos (CSS transitions)
- [ ] Sem flash de tema incorreto no carregamento

### Checklist Acessibilidade
- [ ] Contraste AA em todos os textos críticos
- [ ] Focus ring sempre visível
- [ ] aria-pressed atualiza corretamente
- [ ] Keyboard navigation funciona no toggle

---

## Migration Guide (Para Desenvolvedores)

### Tokens a Usar
**SEMPRE use tokens CSS variáveis**, nunca hex direto:

```tsx
// ✅ CORRETO
<div className="bg-[var(--neutral-bg)] text-[var(--neutral-text)]" />

// ❌ ERRADO
<div className="bg-white text-black dark:bg-gray-900 dark:text-white" />
```

### Sidebar Items
```tsx
// Item ativo
bg-[var(--sidebar-accent)]
text-[var(--sidebar-foreground)]

// Badge
bg-[var(--sidebar-primary-foreground)]
text-[var(--sidebar)]
```

### Cards
```tsx
<Card className="bg-[var(--card)] border-[var(--border)]">
  <CardTitle className="text-[var(--neutral-text)]" />
  <CardDescription className="text-[var(--neutral-text-muted)]" />
</Card>
```

### Inputs
Já adaptados via componente base. Não override tokens de cor.

### Tables
```tsx
<TableHeader className="bg-[var(--muted)]">
<TableRow className="hover:bg-[var(--table-row-hover)]">
```

---

## Paleta Completa de Blue Primary

```css
--blue-primary-50:  #96BDF6  (não usado no dark)
--blue-primary-100: #54A2FA  (buttons hover dark)
--blue-primary-200: #2F5FFF  (brand principal em ambos os modos)
--blue-primary-300: #161E53  (sidebar light mode)
--blue-primary-400: #4A7FFF  (não usado)
--blue-primary-600: #0F2256  (borders cards dark mode)
--blue-primary-700: #0D1B4A  (inputs border dark mode)
--blue-primary-800: #0A1538  (subtle backgrounds dark)
--blue-primary-850: #0C1641  (inputs background dark)
--blue-primary-900: #060E1F  (não usado)
--blue-primary-950: #040A15  (não usado)

/* Cores Hardcoded Específicas Dark Mode */
#102D8A: Sidebar background dark mode (azul vibrante)
#0B1343: Header background dark mode
#19215A: Cards, Tables, Sections background dark mode
#090F36: Main background dark mode
```

/* Token específico para sidebar dark */
#081229 (sidebar dark mode - Blue/850)

/* Token específico para cards dark */
#071E48 (cards dark mode - Blue/825)
```

---

## Hierarquia Visual Dark Mode (do mais escuro ao mais claro)

```
1. Main/Body:        #090F36 (mais escuro - background principal)
2. Header:           #0B1343 (intermediário - barra superior)
3. Sidebar:          #102D8A (azul vibrante - destaque navegação)
4. Cards/Tables:     #19215A (mais claro - elementos de conteúdo)
5. Borders:          #0F2256 (Blue/600 - contraste com cards)
```

### Lógica da Hierarquia
- **Main background** é o mais escuro (#090F36) como base da interface
- **Header** é ligeiramente mais claro (#0B1343) para distinguir da área de conteúdo
- **Sidebar** usa azul vibrante (#102D8A) para destacar navegação com identidade visual forte
- **Cards, Tables e Seções** são os mais claros (#19215A) para destacar conteúdo do fundo
- **Borders** criam separação visual (#0F2256) sem ser invasivas

---

## Notas Importantes

1. **Cards/Tables/Seções com #19215A**: TODOS os cards, tabelas e seções no dark mode usam #19215A
2. **Main background mais escuro**: #090F36 é a base mais escura da interface
3. **Header distinto**: #0B1343 diferencia a barra superior do conteúdo principal
4. **Sidebar azul vibrante**: #102D8A destaca navegação com identidade visual forte
5. **Stroke mais clara nos cards**: Border usa Blue/600 (#0F2256) para melhor contraste
6. **Inputs mesma cor das cards**: #19215A para consistência visual
7. **Botões azul vibrante**: Primary usa #2F5FFF em ambos os modos para consistência
8. **Outline stroke branco**: Botões outline têm borda branca no dark, azul no hover
9. **Badges light** usam tons 800/600/300 no dark para legibilidade
10. **Overlays** mantêm mesma opacidade em ambos (0.5)
11. **Charts** adaptam cores mas mantêm mesma paleta base
12. **Textos sempre claros**: Nenhum texto preto no dark mode, sempre White/100 ou 60% opacity

---

## Resumo das Correções Aplicadas (v2.0)

### Backgrounds
- ✅ Background principal: Blue/900 (#060E1F) - mais claro
- ✅ Cards: **#071E48** - tom específico para todos os cards no dark mode
- ✅ Inputs: Blue/850 (#0C1641) - tom diferente dos cards
- ✅ **Sidebar: #081229** - tom específico do dark mode (diferente do light)

### Bordas
- ✅ Border padrão: Blue/600 (#0F2256) - **stroke mais clara**
- ✅ Inputs border: Blue/700 (#0D1B4A)
- ✅ Inputs hover: Blue/600 (#0F2256) - ainda mais claro
- ✅ Outline buttons: Branco no normal, azul no hover

### Botões
- ✅ Primary: #2F5FFF em ambos os modos
- ✅ Hover: #6891FF (azul mais claro)
- ✅ Outline: border branco → hover azul
- ✅ Focus ring: #2F5FFF (vibrante)

### Textos
- ✅ Todos os textos: White/100 ou rgba(250,250,250,0.6)
- ✅ Placeholders: 50% opacity
- ✅ Nenhum texto preto no dark mode

### Componentes Atualizados
- ✅ Input, Textarea, SearchInput - backgrounds e borders corretos
- ✅ Select - trigger, content e items adaptados
- ✅ Button - outline com stroke branco
- ✅ Alert - textos adaptados
- ✅ Field Group - labels adaptados
- ✅ **Cards - background #071E48 e border #0F2256 (stroke mais clara)**
- ✅ AlertCard - usando tokens --card e --border
- ✅ Card shadcn - usando tokens bg-card e border

### Cores Específicas de Cards no Dark Mode
```css
--card: #071E48                  /* Background de TODOS os cards */
--border: #0F2256                /* Stroke dos cards (mais clara) */
--card-foreground: #FAFAFA       /* Texto nos cards */
```

**Uso correto:**
```tsx
<div className="bg-[var(--card)] border border-[var(--border)]">
  {/* Conteúdo do card */}
</div>
```

---

## Tabela Comparativa: Light Mode vs Dark Mode

| Elemento | Light Mode | Dark Mode |
|----------|-----------|-----------|
| **Background Principal** | #FFFFFF (branco) | #060E1F (Blue/900) |
| **Sidebar** | #161E53 (Blue/300) | **#081229** |
| **Cards** | #FFFFFF (branco) | **#071E48** |
| **Inputs** | #F6F6F6 (Gray/50) | #0C1641 (Blue/850) |
| **Border Cards** | #E2E2EA (Gray/100) | **#0F2256 (Blue/600)** |
| **Border Inputs** | #B3B4C1 (Gray/200) | #0D1B4A (Blue/700) |
| **Texto Principal** | #474748 (Gray/400) | #FAFAFA (White/100) |
| **Texto Secundário** | #7A7A88 (Gray/300) | rgba(250,250,250,0.6) |
| **Botões Primary** | #2F5FFF | #2F5FFF (mesmo) |
| **Botões Hover** | #161E53 | #6891FF (mais claro) |

### Tokens Específicos do Dark Mode
- `--sidebar: #081229` (Blue/850 - mesmo tom dos inputs)
- `--card: #071E48` (Blue/825 - tom único para cards)
- `--border: #0F2256` (Blue/600 - stroke mais clara)

---

**Versão**: 2.0  
**Data**: Janeiro 2025  
**Atualizado**: Dark Mode com sidebar #081229 e cards #071E48
