# SegVision - Sistema Completo de Cores e Componentes

## 📋 Índice
1. [Paleta de Cores Oficial](#paleta-de-cores-oficial)
2. [Light Mode - Cores de Superfícies](#light-mode---cores-de-superfícies)
3. [Dark Mode - Cores de Superfícies](#dark-mode---cores-de-superfícies)
4. [Sistema de Badges](#sistema-de-badges)
5. [Sistema de Botões](#sistema-de-botões)
6. [Sistema de Alertas e Feedback](#sistema-de-alertas-e-feedback)
7. [Tokens Semânticos](#tokens-semânticos)
8. [Regras de Tipografia](#regras-de-tipografia)

---

## Paleta de Cores Oficial

### 🔵 Blue Primary (Cor Principal do Sistema)
```css
--blue-primary-50:  #96BDF6  /* Azul muito claro - hover bg icon */
--blue-primary-100: #54A2FA  /* Azul claro - outline hover/focus */
--blue-primary-200: #2F5FFF  /* ⭐ AZUL PRINCIPAL - brand, botões primary */
--blue-primary-300: #161E53  /* Azul escuro - sidebar light mode */
--blue-primary-400: #4A7FFF  /* Azul médio-claro */
--blue-primary-600: #0F2256  /* Borders cards dark mode */
--blue-primary-700: #0D1B4A  /* Inputs border dark mode */
--blue-primary-750: #0B1841  /* Scrollbar dark mode */
--blue-primary-800: #0A1538  /* Subtle backgrounds dark */
--blue-primary-825: #071E48  /* Card background dark mode */
--blue-primary-850: #081229  /* Inputs background dark mode */
--blue-primary-900: #060E1F  /* Background principal dark mode */
--blue-primary-950: #040A15  /* Muito escuro */
```

**Cores Específicas Hard-coded (Dark Mode):**
- **Main Background**: `#090F36` (mais escuro - background principal)
- **Header Background**: `#0B1343` (intermediário - barra superior)
- **Sidebar Dark**: `#102D8A` (azul vibrante - destaque navegação)
- **Cards/Tables**: `#19215A` (mais claro - elementos de conteúdo)

---

### 🔴 Red Alert (Alertas Críticos)
```css
--red-alert-50:  #FDC6C5  /* Background suave para light variant */
--red-alert-100: #F87E81  /* Background médio para medium variant */
--red-alert-200: #F03948  /* ⭐ VERMELHO PRINCIPAL - alertas críticos */
--red-alert-300: #C8142C  /* Vermelho escuro - heavy variant, danger bg */
--red-alert-400: #63000D  /* Vermelho muito escuro - texto médio, borders */
--red-alert-600: #9D1020  /* Dark mode - border badge light */
--red-alert-800: #4D0810  /* Dark mode - bg badge light */
```

**Uso:**
- **200**: Alertas críticos, danger background dark mode
- **300**: Heavy badges danger, offline
- **400**: Texto em medium badges danger

---

### 🟢 Green Alert (Sucesso/Online)
```css
--green-alert-50:  #E6FFE6  /* Background suave para light variant */
--green-alert-100: #BDEFB8  /* Background claro */
--green-alert-200: #87E373  /* Background médio para medium variant */
--green-alert-300: #47D238  /* Verde vibrante - botões success */
--green-alert-400: #289726  /* ⭐ VERDE PRINCIPAL - heavy badges, online */
--green-alert-500: #025D00  /* Verde escuro - texto médio */
--green-alert-600: #1F7A1F  /* Dark mode - border badge light */
--green-alert-800: #0D3D0D  /* Dark mode - bg badge light */
```

**Uso:**
- **400**: Heavy badges success, online, conectado
- **300**: Botões success actions
- **200**: Medium badges success

---

### 🔵 Turquoise Alert (Info)
```css
--turquoise-alert-50:  #EBF6FF  /* Background suave para light variant */
--turquoise-alert-100: #AADAFD  /* Background claro */
--turquoise-alert-200: #63BDF7  /* Background médio para medium variant */
--turquoise-alert-300: #20A4ED  /* Turquesa vibrante */
--turquoise-alert-400: #126AAF  /* ⭐ TURQUESA PRINCIPAL - info badges */
--turquoise-alert-600: #0E5589  /* Dark mode - border badge light */
--turquoise-alert-800: #073853  /* Dark mode - bg badge light */
```

**Uso:**
- **400**: Heavy badges info, informações críticas
- **200**: Medium badges info, processando

---

### 🟡 Yellow Alert (Caution/Pendente)
```css
--yellow-alert-50:  #FFFEF0  /* Background suave para light variant */
--yellow-alert-100: #FEF7C3  /* Background claro */
--yellow-alert-200: #FDEC85  /* Background médio para medium variant */
--yellow-alert-300: #FADB3F  /* Amarelo vibrante */
--yellow-alert-400: #DEB900  /* ⭐ AMARELO PRINCIPAL - heavy badges caution */
--yellow-alert-500: #715700  /* Amarelo escuro - texto médio */
--yellow-alert-600: #9D8800  /* Dark mode - border badge light */
--yellow-alert-800: #4F4600  /* Dark mode - bg badge light */
```

**Uso:**
- **400**: Heavy badges caution, atenção urgente
- **200**: Medium badges pending, observação
- **IMPORTANTE**: Pendente usa amarelo (caution), NÃO laranja!

---

### 🟠 Orange Alert (Warning/Confirmação)
```css
--orange-alert-50:  #FFFBE8  /* Background suave para light variant */
--orange-alert-100: #FEEBAE  /* Background claro */
--orange-alert-200: #FACD64  /* Background médio para medium variant */
--orange-alert-300: #F5A41D  /* Laranja vibrante */
--orange-alert-400: #BA870B  /* ⭐ LARANJA PRINCIPAL - botões warning */
--orange-alert-600: #8A6408  /* Dark mode - border badge light */
--orange-alert-800: #4A3604  /* Dark mode - bg badge light */
```

**Uso:**
- **400**: Heavy badges warning, botões confirmar
- **200**: Medium badges warning

---

### ⚫ Gray (Neutrals)
```css
--gray-50:  #F6F6F6  /* Backgrounds sutis light mode */
--gray-100: #E2E2EA  /* Borders light mode */
--gray-200: #B3B4C1  /* Borders inputs, texto secundário */
--gray-300: #7A7A88  /* Texto muted, ícones */
--gray-400: #474748  /* Texto principal dark light mode */
```

---

### ⚪ White
```css
--white-50:  #FFFFFF  /* Branco puro - backgrounds light mode */
--white-100: #FAFAFA  /* Branco levemente off - textos dark mode */
```

---

### ⚫ Black
```css
--black-50:  #000000  /* Preto puro */
--black-100: #0F0F0F  /* Preto muito escuro */
--black-200: #1D1D1D  /* Texto secundário light mode */
--black-300: #2C2C2C  /* ⭐ TEXTO PRINCIPAL light mode */
```

---

## Light Mode - Cores de Superfícies

### Backgrounds
```css
--neutral-bg:         #FFFFFF    /* Background principal - body/main */
--header-bg:          #FFFFFF    /* Header background */
--neutral-subtle:     #F6F6F6    /* Cards, tables, sections background */
--card-inner-bg:      #F3F3F9    /* Inner divs dentro de cards */
--analytics-list-bg:  #F3F3F9    /* Analytics screen list items */
```

### Borders
```css
--neutral-border: #E2E2EA  /* Borders padrão - cards, inputs */
```

### Text & Icons
```css
--neutral-text:        #2C2C2C  /* ⭐ Texto principal - títulos */
--neutral-text-muted:  #1D1D1D  /* ⭐ Texto secundário */
--neutral-icon:        #1D1D1D  /* Ícones */
--neutral-inverse:     #FFFFFF  /* Texto invertido */
```

### Sidebar (Light Mode)
```css
--sidebar:            #161E53  /* Blue Primary/300 - fundo sidebar */
--sidebar-foreground: #FAFAFA  /* Texto branco */
--sidebar-border:     #FAFAFA  /* Bordas brancas */
--sidebar-accent:     #2F5FFF  /* Item ativo - Blue Primary/200 */
```

### Inputs (Light Mode)
```css
--input-background:    transparent      /* Adapta ao container */
--input-border:        #B3B4C1         /* Gray/200 */
--input-border-hover:  #7A7A88         /* Gray/300 */
--input-text:          #2C2C2C         /* Black/300 */
--input-placeholder:   #7A7A88         /* Gray/300 */
```

### Tables (Light Mode)
```css
--table-row-hover: #F6F6F6  /* Gray/50 - hover nas linhas */
```

### Scrollbar (Light Mode)
```css
track: #FFFFFF
thumb: #E2E2EA
thumb-hover: #B3B4C1
```

---

## Dark Mode - Cores de Superfícies

### Hierarquia Visual (do mais escuro ao mais claro)
```
1. Main/Body:    #090F36  ⬛ (mais escuro - background principal)
2. Header:       #0B1343  ⬛ (intermediário - barra superior)
3. Sidebar:      #102D8A  🟦 (azul vibrante - destaque navegação)
4. Cards/Tables: #19215A  🟦 (mais claro - elementos de conteúdo)
5. Borders:      #0F2256  🔹 (Blue/600 - contraste com cards)
```

### Backgrounds
```css
--neutral-bg:         #090F36  /* Main background dark mode */
--header-bg:          #0B1343  /* Header background dark mode */
--neutral-subtle:     #19215A  /* Cards, tables, sections dark mode */
--card:               #19215A  /* Card background específico */
--card-inner-bg:      #212E70  /* Inner divs dentro de cards */
--analytics-list-bg:  #212E70  /* Analytics screen list items */
```

### Borders
```css
--neutral-border: #0F2256  /* Blue Primary/600 - stroke mais clara */
```

### Text & Icons
```css
--neutral-text:           #FAFAFA                   /* White/100 - texto principal */
--neutral-text-muted:     rgba(250, 250, 250, 0.6) /* 60% opacidade */
--neutral-icon:           rgba(250, 250, 250, 0.75) /* 75% opacidade */
--neutral-inverse:        #040A15                   /* Blue Primary/950 */
```

### Sidebar (Dark Mode)
```css
--sidebar:            #102D8A  /* ⭐ Azul vibrante - sidebar dark mode */
--sidebar-foreground: #FAFAFA  /* Texto branco */
--sidebar-border:     #FAFAFA  /* Bordas brancas */
--sidebar-accent:     #2F5FFF  /* Item ativo - Blue Primary/200 */
```

### Inputs (Dark Mode)
```css
--input-background:    #0B1343  /* Same as header - darker contrast */
--input-border:        #0D1B4A  /* Blue Primary/700 */
--input-border-hover:  #0F2256  /* Blue Primary/600 - mais claro */
--input-text:          #FAFAFA  /* White/100 */
--input-placeholder:   #FAFAFA  /* White/100 @ 50% opacity */
```

### Tables (Dark Mode)
```css
--table-row-hover: #19215A  /* Same as cards/sections */
```

### Scrollbar (Dark Mode)
```css
track: #090F36 (Main background)
thumb: #0B1841 (Blue Primary/750)
thumb-hover: rgba(250, 250, 250, 0.75)
```

### States (Dark Mode)
```css
--focus-ring:     #2F5FFF                   /* Blue Primary/200 - vibrante */
--disabled-bg:    #19215A                   /* Same as cards */
--disabled-text:  rgba(250, 250, 250, 0.4)  /* 40% opacidade */
```

---

## Sistema de Badges

### Hierarquia de Variantes
- **HEAVY**: Máximo contraste (fundo escuro + texto branco) - Alertas críticos
- **MEDIUM**: Contraste médio (fundo médio + texto escuro) - Status intermediários  
- **LIGHT**: Contraste baixo (fundo claro + borda + texto) - Categorização

---

### HEAVY Variant (Alertas Críticos)

**Uso**: Alertas urgentes, status críticos que exigem ação imediata

#### Light Mode
| Tone    | Background          | Text      | Uso                    |
|---------|---------------------|-----------|------------------------|
| danger  | Red Alert/300       | White/100 | Offline, Erro, Vencido |
| success | Green Alert/400     | White/100 | Online, Conectado      |
| info    | Turquoise Alert/400 | White/100 | Info crítica           |
| caution | Yellow Alert/400    | White/100 | Atenção urgente        |
| warning | Orange Alert/400    | White/100 | Risco alto             |
| neutral | Gray/300            | White/100 | Indefinido crítico     |

#### Dark Mode (Heavy - permanece igual)
Cores intensas mantidas em ambos os modos.

**Exemplos:**
```tsx
<Badge variant="heavy" tone="danger" size="s">Offline</Badge>
<Badge variant="heavy" tone="success" size="s">Online</Badge>
<Badge variant="heavy" tone="overdue" size="s">Vencido</Badge>
```

---

### MEDIUM Variant (Status Intermediários)

**Uso**: Status do sistema que precisam visibilidade mas não são críticos

#### Light Mode
| Tone    | Background          | Text                | Uso                    |
|---------|---------------------|---------------------|------------------------|
| danger  | Red Alert/100       | Red Alert/400       | Falhas não críticas    |
| success | Green Alert/200     | Green Alert/500     | Ativo, Resolvido       |
| info    | Turquoise Alert/200 | Turquoise Alert/400 | Processando, Em análise|
| caution | Yellow Alert/200    | Yellow Alert/500    | Pendente, Obs. padrão  |
| warning | Orange Alert/200    | Orange Alert/400    | Risco médio            |
| neutral | Gray/200            | Gray/400            | Suspenso, Inativo      |

#### Dark Mode (Medium)
```css
primary:  bg-Blue/400         text-White/100
success:  bg-Green/400        text-White/100
warning:  bg-Orange/400       text-White/100
yellow:   bg-Yellow/400       text-White/100
info:     bg-Turquoise/400    text-White/100
danger:   bg-Red/400          text-White/100
neutral:  bg-Blue/700         text-White/100
```

**Exemplos:**
```tsx
<Badge variant="medium" tone="success" size="s">Ativo</Badge>
<Badge variant="medium" tone="pending" size="s">Pendente</Badge>
<Badge variant="medium" tone="resolved" size="s">Resolvido</Badge>
```

---

### LIGHT Variant (Categorização)

**Uso**: Tags, categorias, metadados, informações de baixa prioridade

#### Light Mode
| Tone    | Background         | Border             | Text               |
|---------|--------------------|--------------------|-------------------|
| danger  | Red Alert/50       | Red Alert/300      | Red Alert/300     |
| success | Green Alert/50     | Green Alert/400    | Green Alert/400   |
| info    | Turquoise Alert/50 | Turquoise Alert/400| Turquoise Alert/400|
| caution | Yellow Alert/50    | Yellow Alert/400   | Yellow Alert/400  |
| warning | Orange Alert/50    | Orange Alert/400   | Orange Alert/400  |
| neutral | Gray/50            | Gray/300           | Gray/300          |
| primary | Blue Primary/50    | Blue Primary/200   | Blue Primary/300  |

#### Dark Mode (Light)
```css
primary:  bg-800  border-600  text-300
success:  bg-800  border-600  text-300
warning:  bg-800  border-600  text-300
yellow:   bg-800  border-600  text-300
info:     bg-800  border-600  text-300
danger:   bg-800  border-600  text-300
neutral:  bg-850  border-700  text-white@75%
```

**Exemplos:**
```tsx
<Badge variant="light" tone="primary" size="s">Plano Pro</Badge>
<Badge variant="light" tone="neutral" size="s">Escola ABC</Badge>
```

---

### Tamanhos de Badges
| Size | Height | Radius | PaddingX | Text | Icon |
|------|--------|--------|----------|------|------|
| `s`  | 18px   | 9px    | 12px     | 11px | 12px |
| `m`  | 22px   | 11px   | 12px     | 12px | 14px |
| `l`  | 26px   | 13px   | 12px     | 13px | 16px |

---

### Mapeamento Semântico de Badges

#### Status de Câmeras/Dispositivos
```tsx
// Online - crítico
<Badge variant="heavy" tone="success" size="s">Online</Badge>

// Offline - crítico vermelho
<Badge variant="heavy" tone="danger" size="s">Offline</Badge>
```

#### Status de Alertas IA
```tsx
// Novo - crítico, não visualizado
<Badge variant="heavy" tone="danger" size="s">Novo</Badge>

// Verificado - em análise, médio amarelo
<Badge variant="medium" tone="caution" size="s">Verificado</Badge>

// Resolvido - concluído, médio verde
<Badge variant="medium" tone="success" size="s">Resolvido</Badge>
```

#### Status Financeiro
```tsx
// Pago - confirmado, médio
<Badge variant="medium" tone="paid" size="s">Pago</Badge>

// Pendente - aguardando, médio AMARELO
<Badge variant="medium" tone="pending" size="s">Pendente</Badge>

// Vencido - crítico vermelho!
<Badge variant="heavy" tone="overdue" size="s">Vencido</Badge>
```

#### Tags e Categorias
```tsx
// Sempre LIGHT
<Badge variant="light" tone="primary" size="s">Plano Pro</Badge>
<Badge variant="light" tone="neutral" size="s">Escola ABC</Badge>
```

---

## Sistema de Botões

### Variantes de Botões

#### 1. DEFAULT (Primary) - Botão Principal
**Light Mode:**
```css
background: #2F5FFF (Blue Primary/200)
text: #FFFFFF (White/100)
hover: #161E53 (Blue Primary/300) - escurece
active: opacity 96%
```

**Dark Mode:**
```css
background: #2F5FFF (Blue Primary/200) - MESMO azul
text: #FAFAFA (White/100)
hover: #54A2FA (Blue Primary/100) - clareia!
active: #161E53 (Blue Primary/300)
```

**Uso**: Ações principais, CTA, confirmações importantes.

```tsx
<Button variant="default">Salvar</Button>
<Button variant="default" size="icon"><Plus /></Button>
```

---

#### 2. OUTLINE - Botão Secundário (Borda 1.5px)

**Light Mode:**
```css
background: #FFFFFF
border: #B3B4C1 (Gray/200) - 1.5px
text: #2C2C2C (Black/300)

hover:
  border: #54A2FA (Blue Primary/100) - tom mais claro
  text: #54A2FA (Blue Primary/100)

hover (icon only):
  background: #96BDF6 (Blue Primary/50)
  border: #54A2FA (Blue Primary/100)
  shadow: sm + scale 105%
```

**Dark Mode:**
```css
background: transparent
border: #FAFAFA (White/100) - 1.5px
text: #FAFAFA (White/100)

hover:
  border: #2F5FFF (Blue Primary/200) - azul vibrante
  text: #2F5FFF (Blue Primary/200)
  background: subtle

hover (icon only):
  background: azul sutil
  shadow: sm + scale 105%
```

**Uso**: Ações secundárias, cancelar, voltar.

```tsx
<Button variant="outline">Cancelar</Button>
<Button variant="outline" size="icon"><Filter /></Button>
```

---

#### 3. DESTRUCTIVE - Ações Destrutivas

**Light Mode:**
```css
background: #F03948 (Red Alert/200)
text: #FFFFFF
hover: #C8142C (Red Alert/300)
active: #63000D (Red Alert/400)
```

**Dark Mode:**
```css
background: #F03948 (Red Alert/200) - mesmo tom
text: #FAFAFA
hover: escurece
active: escurece mais
```

**Uso**: Deletar, remover, desativar permanentemente.

```tsx
<Button variant="destructive">Excluir</Button>
<Button variant="destructive" size="icon"><Trash /></Button>
```

---

#### 4. SECONDARY - Alternativas

**Light Mode:**
```css
background: #E2E2EA (Gray/100)
text: #2C2C2C (Black/300)
hover: #B3B4C1 (Gray/200)
```

**Dark Mode:**
```css
background: #19215A (cards color)
text: #FAFAFA
hover: clareia ligeiramente
```

**Uso**: Ações terciárias, alternativas.

```tsx
<Button variant="secondary">Visualizar</Button>
```

---

#### 5. GHOST - Sem Fundo

**Light Mode:**
```css
background: transparent
text: #2C2C2C (Black/300)

hover:
  background: #F6F6F6 (Gray/50)
  text: #161E53 (Blue Primary/300)

hover (icon only):
  background: #96BDF6 (Blue Primary/50)
  shadow: sm + scale 105%
```

**Dark Mode:**
```css
background: transparent
text: #FAFAFA

hover:
  background: #19215A (subtle)
  text: azul vibrante
```

**Uso**: Ações sutis, ícones clicáveis.

```tsx
<Button variant="ghost">Ver mais</Button>
<Button variant="ghost" size="icon"><Settings /></Button>
```

---

#### 6. LINK - Link Inline

```css
text: Blue Primary/300
hover: Blue Primary/400 + underline
```

```tsx
<Button variant="link">Saiba mais</Button>
```

---

### Tamanhos de Botões
```tsx
<Button size="sm">Pequeno</Button>      // h-8
<Button size="default">Padrão</Button>  // h-9 (default)
<Button size="lg">Grande</Button>       // h-10
<Button size="icon"><Plus /></Button>   // size-9 (quadrado)
```

**Botões Icon (size="icon") - Hover Extra Chamativo:**
- Shadow + Scale 105%
- Background sutil (outline/ghost): Blue Primary/50
- Ideal para toolbars e ações rápidas

---

### Botões de Ação em Cards (Especial)

#### Primary (Ver Vídeo)
```css
background: #2F5FFF (Blue Primary/200)
color: white
height: 36px
border-radius: 10px
font: Inter/Semibold/13
hover: opacity 0.96
```

#### Warning (Confirmar)
```css
background: #BA870B (Orange Alert/400)
color: white
height: 36px
border-radius: 10px
font: Inter/Semibold/13
hover: opacity 0.96
```

#### Success (Resolver)
```css
background: #47D238 (Green Alert/300)
color: white
height: 36px
border-radius: 10px
font: Inter/Semibold/13
hover: opacity 0.96
```

#### Disabled
```css
background: #B3B4C1 (Gray/200)
color: white
opacity: 0.6
cursor: not-allowed
```

**IMPORTANTE**: Todos os botões de ação em cards devem ter **texto branco** para máximo contraste.

---

## Sistema de Alertas e Feedback

### Tokens Semânticos de Feedback

#### Light Mode
```css
--success-bg:      #87E373 (Green Alert/200)
--success-text:    #2C2C2C (Black/300)
--success-border:  #47D238 (Green Alert/300)

--caution-bg:      #DEB900 (Yellow Alert/400)
--caution-text:    #2C2C2C (Black/300)
--caution-border:  #DEB900 (Yellow Alert/400)

--warning-bg:      #F5A41D (Orange Alert/300)
--warning-text:    #2C2C2C (Black/300)
--warning-border:  #BA870B (Orange Alert/400)

--danger-bg:       #C8142C (Red Alert/300)
--danger-text-on:  #FFFFFF (White/50)
--danger-border:   #63000D (Red Alert/400)

--info-bg:         #20A4ED (Turquoise Alert/300)
--info-text:       #2C2C2C (Black/300)
--info-border:     #126AAF (Turquoise Alert/400)
```

#### Dark Mode
```css
--success-bg:      #289726 (Green Alert/400)
--success-text:    #FAFAFA (White/100)
--success-border:  #47D238 (Green Alert/300)

--caution-bg:      #DEB900 (Yellow Alert/400)
--caution-text:    #FAFAFA (White/100)
--caution-border:  #FADB3F (Yellow Alert/300)

--warning-bg:      #BA870B (Orange Alert/400)
--warning-text:    #FAFAFA (White/100)
--warning-border:  #F5A41D (Orange Alert/300)

--danger-bg:       #F03948 (Red Alert/200) - tom mais claro/vibrante
--danger-text-on:  #FAFAFA (White/100)
--danger-border:   #C8142C (Red Alert/300)

--info-bg:         #126AAF (Turquoise Alert/400)
--info-text:       #FAFAFA (White/100)
--info-border:     #20A4ED (Turquoise Alert/300)
```

---

## Tokens Semânticos

### Primary (Brand)
```css
/* Light & Dark Mode - MESMOS valores */
--primary-bg:         #2F5FFF (Blue Primary/200)
--primary-bg-hover:   Light: #161E53 | Dark: #54A2FA
--primary-bg-press:   Light: escurece | Dark: #161E53
--primary-border:     #2F5FFF (Blue Primary/200)
--primary-text-on:    #FFFFFF (Light) | #FAFAFA (Dark)
```

### Neutral
```css
/* Light Mode */
--neutral-bg:         #FFFFFF
--neutral-subtle:     #F6F6F6
--neutral-border:     #E2E2EA
--neutral-text:       #2C2C2C ⭐
--neutral-text-muted: #1D1D1D ⭐
--neutral-icon:       #1D1D1D
--neutral-inverse:    #FFFFFF

/* Dark Mode */
--neutral-bg:         #090F36
--neutral-subtle:     #19215A
--neutral-border:     #0F2256
--neutral-text:       #FAFAFA ⭐
--neutral-text-muted: rgba(250,250,250,0.6) ⭐
--neutral-icon:       rgba(250,250,250,0.75)
--neutral-inverse:    #040A15
```

### States
```css
/* Light Mode */
--focus-ring:     #54A2FA (Blue Primary/100)
--disabled-bg:    #E2E2EA (Gray/100)
--disabled-text:  #0F0F0F (Black/100)

/* Dark Mode */
--focus-ring:     #2F5FFF (Blue Primary/200) - vibrante
--disabled-bg:    #19215A
--disabled-text:  rgba(250,250,250,0.4)
```

---

## Regras de Tipografia

### Fonte Exclusiva
```css
font-family: "Inter", sans-serif;
```

### Classes PROIBIDAS
❌ **NUNCA use:**
- `text-xl`, `text-lg`, `text-2xl`, etc. (tamanhos)
- `font-bold`, `font-semibold`, `font-medium`, `font-normal` (pesos)
- `leading-*` (line-height)

### Classes PERMITIDAS
✅ **Pode usar apenas:**
- `text-[var(--neutral-text)]` (títulos)
- `text-[var(--neutral-text-muted)]` (textos secundários)

### Regras Globais (Aplicadas via `/styles/globals.css`)

```css
h1 { font-size: var(--text-2xl); font-weight: 500; }
h2 { font-size: var(--text-xl); font-weight: 500; }
h3 { font-size: var(--text-lg); font-weight: 500; }
h4 { font-size: var(--text-base); font-weight: 600; } ⭐ Semibold automático
p  { font-size: var(--text-base); font-weight: 400; }
td { font-size: 14px; font-weight: 400; }
```

**IMPORTANTE**: Elementos `h4` têm `font-weight: 600` (semibold) aplicado automaticamente. NUNCA adicione classes de font-weight em h4.

---

## Regras Importantes (Checklist)

1. ✅ **Badge Offline** → sempre `heavy` + `danger` (vermelho crítico)
2. ✅ **Badge Online** → sempre `heavy` + `success` (verde crítico)
3. ✅ **Pendente** → usa amarelo (`pending` → `caution`), NÃO laranja
4. ✅ **Vencido** → sempre `heavy` + `danger` (vermelho crítico)
5. ✅ **Verificado** → usa amarelo médio (`medium` + `caution`)
6. ✅ **Novo (alerta)** → sempre `heavy` + `danger` (vermelho crítico)
7. ✅ Tags e categorias → sempre `light` variant
8. ✅ Sem classes de tipografia Tailwind exceto tokens de cor
9. ✅ Inter como única fonte
10. ✅ Fundo branco (#FFFFFF) no light mode
11. ✅ Dark Mode Main: #090F36, Header: #0B1343, Sidebar: #102D8A, Cards: #19215A
12. ✅ Botões Primary usam #2F5FFF em ambos os modos
13. ✅ Outline buttons: borda branca no dark, azul no hover
14. ✅ Todos os textos no dark mode: White/100 ou 60% opacity
15. ✅ Botões de ação em cards: sempre texto branco

---

## Contraste WCAG AA (Acessibilidade)

### Requisitos Mínimos
- **Texto corpo**: ≥ 4.5:1
- **Texto grande (18px+)**: ≥ 3:1
- **Elementos interativos**: ≥ 3:1

### Verificações
✅ Texto principal sobre fundos: garantido  
✅ Botões: Blue/400 com White text = 7.2:1  
✅ Links: Blue/400 sobre 950 = 6.8:1  
✅ Placeholders: 60% opacity suficiente para indicação  
✅ Focus rings: sempre visíveis em ambos os modos

---

## Documentação Completa

### Badge System (v3.0)
- `/components/ui/BADGE_DOCUMENTATION.md`
- `/components/ui/BADGE_FIGMA_SPEC.md`
- `/components/ui/BADGE_COLOR_REFERENCE.md`
- `/components/BADGE_USAGE_BY_JOURNEY.md`
- `/components/BADGE_SYSTEM_V3_SUMMARY.md`

### Other Components
- `/DARK_MODE_DOCUMENTATION.md` ⭐
- `/components/ui/BUTTON_DOCUMENTATION.md`
- `/components/ui/FORM_SYSTEM_DOCUMENTATION.md`
- `/components/ALERTS_SYSTEM_DOCUMENTATION.md`

---

**Design System**: SegVision (Light + Dark Mode)  
**Versão**: 4.0 - Sistema Completo de Cores  
**Data**: Janeiro 2025  
**Última Atualização**: Sistema unificado de cores, badges, botões e componentes
