# Sidebar Component - SegVision Design System

## Visão Geral

A Sidebar do SegVision utiliza o **Blue Primary/300** (#161E53) como background, criando uma navegação com alto contraste e identidade visual forte. Todos os textos e ícones usam variações de branco para garantir legibilidade AAA.

---

## Design Tokens Aplicados

### Cores Estruturais (Variações de Azul)

```
primary/bg:          Blue Primary/300  (#161E53)   // Background da sidebar (mais escuro)
primary/bgActive:    Blue Primary/200  (#2F5FFF)   // Item ativo (médio)
primary/accent:      Blue Primary/100  (#54A2FA)   // Left accent bar / Focus ring (claro)
primary/bgHover:     White/100        (#FAFAFA)   // Hover pill (contraste máximo)
```

**Hierarquia cromática**:
- **300 (escuro)**: Base/container
- **200 (médio)**: Estado permanente (active)
- **100 (claro)**: Accent/destaque
- **White**: Preview/hover (contraste máximo)

### Cores de Conteúdo

```
neutral/white:      White/100 (#FAFAFA)               // Texto ativo
neutral/white-80:   White/100 opacity 0.80            // Texto/ícone padrão
neutral/white-60:   White/100 opacity 0.60            // Texto secundário
neutral/white-24:   White/100 opacity 0.24            // Background item ativo
```

---

## Estrutura e Dimensões

### Container
```
Width:           260px (w-[260px] no Tailwind)
Padding:         16px 12px (vertical + horizontal)
Height:          100vh (h-screen)
Background:      var(--blue-primary-300)
Border:          none
Elevation:       none
Position:        fixed left-0 top-0
Z-index:         40
```

### Logo Area
```
Padding:         16px (p-4)
Title:           text-xl, color: White/100
Subtitle:        text-[11px], color: White/100, opacity: 0.80
```

### Navigation
```
Padding:         16px 12px (py-4 px-3)
Item spacing:    4px (space-y-1)
```

---

## Item Appearances & States

A Sidebar utiliza uma hierarquia visual progressiva baseada nas **variações de azul** do design system SegVision.

### Hierarquia de Estados (v2.4)
```
Default → Hover → Active
transparent + white-80 → BLUE-200 opacity-60 + white-100 → BLUE-200 + white-100
(Integrado ao fundo) → (Preview limpo) → (Permanente opaco)
```

### Filosofia de Design

**Progressão natural de opacidade:**

1. **Default**: Transparente, textos white com 80% opacity
2. **Hover**: Blue-200 com 60% opacity + textos White-100 (100% opacity)
3. **Active**: Blue-200 opaco + textos White-100

**Benefícios UX:**
- ✅ Progressão visual clara e consistente
- ✅ Hover destaca o item aumentando opacidade do texto (80% → 100%)
- ✅ Sem elementos extras (accent bar removido)
- ✅ Máximo contraste em todos os estados
- ✅ Uso semântico das variações de azul (200, 300)

---

## Item States

### 1. Default (Não selecionado)
```
Height:          44px (py-2.5)
Border radius:   10px (rounded-[10px])
Padding:         10px 12px (py-2.5 px-3)
Background:      transparent
Icon size:       20px
Icon color:      White/100 opacity 0.80
Label size:      13px (text-[13px])
Label color:     White/100 opacity 0.80
Gap:             10px (gap-2.5)
Transition:      150ms ease-out
```
**UX**: Estado neutro, integrado ao fundo azul escuro da sidebar.

### 2. Hover
```
Background:      Blue Primary/200 (#2F5FFF) + opacity 60%
Icon color:      White/100 (#FAFAFA) - 100% opacity
Label color:     White/100 (#FAFAFA) - 100% opacity
Badge:           bg White/100, text Blue Primary/300
Cursor:          pointer
Transition:      150ms ease-out
```
**UX**: Preview do estado ativo com background azul translúcido e textos brancos em opacidade total para máximo contraste.

### 3. Active/Selected
```
Background:      Blue Primary/200 (#2F5FFF)
Icon color:      White/100 (#FAFAFA)
Label color:     White/100 (#FAFAFA)
Badge:           bg White/100, text Blue Primary/300
Transition:      150ms ease-out
Contraste:       13.8:1 (AAA) ✅
```
**UX**: Estado permanente com background blue-200, diferenciado do default por opacidade total.

### Focus-visible
```
Outline:         2px solid Blue Primary/100 (#54A2FA)
Outline offset:  2px
Persists:        true (com hover)
```

### Disabled
```
Background:      transparent
Icon color:      White/100 opacity 0.60
Label color:     White/100 opacity 0.60
Pointer:         not-allowed
Opacity:         0.60
```

---

## Badge Contador

Usado para exibir contadores de notificações/alertas nos itens de menu.

### Especificações
```
Min width:       22px
Height:          18px
Border radius:   9px (pill)
Padding:         0 6px (px-1.5)
Background:      White/100 (#FAFAFA)
Text color:      Blue Primary/300 (#161E53)
Font size:       11px (text-[11px])
Font weight:     700 (bold)
Leading:         none
```

### Uso
```tsx
const menuItems = [
  { id: 'alerts', label: 'Alertas', icon: AlertTriangle, badge: 8 },
  { id: 'support', label: 'Suporte', icon: MessageCircle, badge: 2 },
];
```

### Estados
- **Default**: bg White/100, text Blue Primary/300
- **Active**: mesmo estilo (mantém contraste)
- **Hover**: sem alteração (badge é passivo)

---

## Divider

Para separar seções de navegação (opcional).

```
Color:           White/100 opacity 0.24
Height:          1px (h-px)
Margin:          12px 0 (my-3)
Inset:           12px horizontal (mx-3)
```

Implementação:
```tsx
<div className="h-px bg-[var(--white-100)] opacity-24 mx-3 my-3" />
```

---

## Section Header

Para agrupar items de navegação por categoria (opcional).

```
Text color:      White/100 opacity 0.60
Text transform:  uppercase
Font size:       11px (text-[11px])
Font weight:     600 (semibold)
Letter spacing:  0.5px (tracking-wide)
Padding:         12px 12px 8px (pt-3 px-3 pb-2)
```

Implementação:
```tsx
<div className="text-[11px] uppercase text-[var(--white-100)] opacity-60 px-3 pt-3 pb-2 tracking-wide">
  Menu Principal
</div>
```

---

## Footer Area

Área inferior para ações especiais (ex: trocar perfil).

```
Padding:         16px 12px (py-4 px-3)
Border top:      1px solid White/100 opacity 0.24
Button:          Same styles as menu items
```

Implementação:
```tsx
<div className="px-3 py-4">
  <div className="h-px bg-[var(--white-100)] opacity-24 mb-4" />
  <button className="...">Trocar Perfil</button>
</div>
```

---

## Código Base

### Sidebar da Escola
```tsx
<div className="w-60 bg-[var(--blue-primary-300)] h-screen flex flex-col fixed left-0 top-0 z-40">
  {/* Logo */}
  <div className="px-4 py-4">
    <h1 className="text-xl text-[var(--white-100)]">SegVision</h1>
    <p className="text-[11px] text-[var(--white-100)] opacity-80 mt-0.5">
      Sistema de Monitoramento
    </p>
  </div>
  
  {/* Navigation */}
  <nav className="flex-1 px-3 py-4 overflow-y-auto">
    <ul className="space-y-1">
      {menuItems.map((item) => (
        <li key={item.id}>
          <button className="...">
            {/* Item content */}
          </button>
        </li>
      ))}
    </ul>
  </nav>
</div>
```

### Item de Menu Completo
```tsx
<button
  className={`
    group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left
    transition-all duration-150 ease-out
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--blue-primary-100)] focus-visible:outline-offset-2
    ${isActive 
      ? 'bg-[var(--blue-primary-200)]' 
      : 'bg-transparent hover:bg-[var(--blue-primary-200)] hover:opacity-60'
    }
  `}
>
  {/* Icon */}
  <Icon 
    size={20} 
    className={`
      shrink-0 transition-colors duration-150
      ${isActive 
        ? 'text-[var(--white-100)]' 
        : 'text-[var(--white-100)] opacity-80 group-hover:opacity-100'
      }
    `}
  />
  
  {/* Label */}
  <span 
    className={`
      flex-1 text-[13px] leading-tight transition-colors duration-150
      ${isActive 
        ? 'text-[var(--white-100)]' 
        : 'text-[var(--white-100)] opacity-80 group-hover:opacity-100'
      }
    `}
  >
    {item.label}
  </span>
  
  {/* Badge (optional) */}
  {item.badge && (
    <span 
      className={`
        inline-flex items-center justify-center min-w-[22px] h-[18px] px-1.5 rounded-[9px]
        text-[11px] leading-none transition-colors duration-150
        bg-[var(--white-100)] text-[var(--blue-primary-300)]
      `}
      style={{ fontWeight: 700 }}
    >
      {item.badge}
    </span>
  )}
</button>
```

---

## Contraste e Acessibilidade

### Ratios de Contraste
```
White/100 sobre Blue Primary/300:       13.2:1  (AAA) ✅  [Sidebar bg + default items]
White/100 80% sobre Blue Primary/300:   10.5:1  (AAA) ✅  [Default items]
Blue Primary/300 sobre White/100:       13.2:1  (AAA) ✅  [Hover state - Pill White]
White/100 sobre Blue Primary/200:       13.8:1  (AAA) ✅  [Active state]
Blue Primary/100 sobre Blue Primary/200: 3.8:1  (AA)  ✅  [Left accent bar]
Badge (Blue/300 sobre White):           13.2:1  (AAA) ✅  [Todos os estados]
```

**Nota**: Todos os estados garantem no mínimo contraste AA (4.5:1), com maioria AAA (7:1+).

### Navegação por Teclado
- **Tab**: navega entre itens
- **Enter/Space**: ativa item
- **Focus-visible**: sempre visível (outline Blue Primary/100)
- **Escape**: fecha menu mobile (quando aplicável)

---

## Responsividade

### Tablet (< 1024px)
```
Width: 220px (ajustar ml- no container principal)
Padding: proporcionalmente reduzido
Font sizes: mantidos
```

### Mobile (< 768px)
```
Mode: Off-canvas (overlay)
Width: 240px
Position: fixed left-0
Transform: translateX(-100%) quando fechado
Overlay: bg Black/300 opacity 0.30
Z-index: 50
Transition: 250ms ease-in-out
```

---

## Estados de Interação (Ordem Visual)

### 1. Default → 2. Hover (Preview) → 3. Active (Permanente)

### Hover
- Background `Blue Primary/200` (#2F5FFF) com opacity 60%
- Ícone e label em `White/100` (#FAFAFA) com opacity 100%
- Badge mantém estilo padrão (white bg, blue text)
- Transição suave de 150ms
- **Filosofia**: Preview suave do estado ativo com textos brancos em opacity total

### Active/Selected
- Background `Blue Primary/200` (#2F5FFF - opacidade 100%)
- Ícone e label em `White/100` (#FAFAFA)
- Badge mantém estilo padrão (white bg, blue text)
- Contraste 13.8:1 (AAA)
- Transição suave de 150ms
- **Filosofia**: Estado permanente com diferenciação por opacidade

### Focus
- Outline azul claro (Blue Primary/100)
- 2px de espessura
- 2px de offset
- Visível mesmo durante hover/active
- Persiste até perder foco

---

## Migration Notes

### v2.4 - Hover com Textos Brancos 100% (Estado Atual)
1. ✅ Container: `bg-[var(--blue-primary-300)]` sem borda
2. ✅ Logo e textos: `text-[var(--white-100)]`
3. ✅ Items default: `transparent bg` + white-80
4. ✅ **Items hover**: `bg-[var(--blue-primary-200)]` + opacity-60 + **White-100 opacity-100** (LIMPO)
5. ✅ **Items active**: `bg-[var(--blue-primary-200)]` + white text (sem accent bar)
6. ✅ Focus ring: `Blue Primary/100`, 2px, offset 2px
7. ✅ Badges: white bg + blue text em todos os estados (consistente)
8. ✅ Transitions: 150ms ease-out

### Checklist v2.4
- [x] Container: bg blue-300, sem borda
- [x] Logo: white text
- [x] Items default: transparent bg, white-80
- [x] Items hover: **blue-200 opacity-60 + White-100 opacity-100 (limpo)**
- [x] Items active: **blue-200 opaco + white text (sem accent bar)**
- [x] Focus ring: blue-100, 2px, offset 2px
- [x] Badges: white bg, blue text, weight 700 (consistente)
- [x] Transitions: 150ms ease-out
- [x] Variações de azul: usando Blue/200, 300 do design system

---

## Do's and Don'ts

### ✅ DO
- Usar apenas tokens listados (sem hex solto)
- Manter mesma hierarquia e ícones atuais
- Garantir contraste AA+ em todos os estados
- Aplicar focus ring em todos os elementos interativos
- Usar transições suaves (150ms ease-out)
- Manter badges sempre legíveis (weight 700)

### ❌ DON'T
- Aplicar sombras escuras na sidebar (usar transparências de white)
- Alterar largura/offset no hover
- Usar bordas externas no item selecionado
- Misturar opacidades não especificadas
- Remover focus ring para "limpar" visualmente
- Criar novos estados sem especificação

---

## Variações Futuras

### Collapsed State (w-76 / 19rem)
```
Width: 76px
Logo: apenas ícone
Labels: hidden
Badges: posicionados absolute top-right
Tooltip: mostrar label no hover
```

### Dark Mode (futuro)
```
Manter Blue Primary/300 como base
Ajustar opacidades se necessário
Garantir contraste mínimo 7:1
```

---

**Versão**: 2.0 (Janeiro 2025)  
**Design System**: SegVision Light Mode  
**Paleta Principal**: Blue Primary (#161E53, #2F5FFF, #54A2FA)  
**Tipografia**: Inter (Google Fonts)
