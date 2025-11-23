# Button Component - SegVision Design System

## Visão Geral

O componente Button do SegVision segue os tokens de design definidos, com variantes para diferentes contextos de uso.

---

## Variants

### Default (Primary)
Botão principal de ação com fundo azul.

**Colors:**
- Background: `Blue Primary/200` (#2F5FFF)
- Text: `White/100` (#FFFFFF)
- Hover: `Blue Primary/300`
- Active/Press: `Blue Primary/400`

**Hover (Icon only):**
- Shadow: md
- Scale: 105%

**Usage:** Ações principais, CTA, confirmações importantes.

```tsx
<Button variant="default">Salvar</Button>
<Button variant="default">Confirmar</Button>
<Button variant="default" size="icon"><Plus /></Button>
```

---

### Outline
Botão secundário com borda fina (1.5px), sem fundo sólido.

**Colors (Default):**
- Background: `White/100` (#FFFFFF)
- Border: `Gray/200` (1.5px)
- Text: `Black/300`

**Colors (Hover):**
- Border: `Blue Primary/100` (#54A2FA) - tom mais claro
- Text: `Blue Primary/100` (#54A2FA)

**Colors (Hover - Icon only):**
- Background: `Blue Primary/50` (#96BDF6)
- Border: `Blue Primary/100` (#54A2FA)
- Shadow: sm
- Scale: 105%

**Colors (Active/Press):**
- Border: `Blue Primary/200` (#2F5FFF)
- Text: `Blue Primary/200` (#2F5FFF)

**Usage:** Ações secundárias, cancelar, voltar.

```tsx
<Button variant="outline">Cancelar</Button>
<Button variant="outline">Voltar</Button>
<Button variant="outline" size="icon"><Filter /></Button>
```

---

### Destructive
Botão para ações destrutivas (deletar, remover, etc).

**Colors:**
- Background: `Red Alert/200` (#F03948)
- Text: `White/100` (#FFFFFF)
- Hover: `Red Alert/300`
- Active/Press: `Red Alert/400`

**Hover (Icon only):**
- Shadow: md
- Scale: 105%

**Usage:** Deletar, remover, desativar permanentemente.

```tsx
<Button variant="destructive">Excluir</Button>
<Button variant="destructive">Remover</Button>
<Button variant="destructive" size="icon"><Trash /></Button>
```

---

### Secondary
Botão com fundo cinza suave.

**Colors:**
- Background: `Gray/100`
- Text: `Black/300`
- Hover: `Gray/200`
- Active/Press: `Gray/300`

**Hover (Icon only):**
- Shadow: sm
- Scale: 105%

**Usage:** Ações terciárias, alternativas.

```tsx
<Button variant="secondary">Visualizar</Button>
<Button variant="secondary" size="icon"><Eye /></Button>
```

---

### Ghost
Botão sem fundo, apenas texto.

**Colors (Default):**
- Background: transparent
- Text: `Black/300`

**Colors (Hover):**
- Background: `Gray/50` (ou `Blue Primary/50` se icon)
- Text: `Blue Primary/300`

**Colors (Hover - Icon only):**
- Background: `Blue Primary/50` (#96BDF6)
- Shadow: sm
- Scale: 105%

**Colors (Active/Press):**
- Background: `Gray/100`

**Usage:** Ações sutis, ícones clicáveis.

```tsx
<Button variant="ghost">Ver mais</Button>
<Button variant="ghost" size="icon"><Settings /></Button>
```

---

### Link
Botão que parece link.

**Colors:**
- Text: `Blue Primary/300`
- Hover: `Blue Primary/400` + underline

**Usage:** Navegação inline, links de ação.

```tsx
<Button variant="link">Saiba mais</Button>
```

---

## Sizes

```tsx
<Button size="sm">Pequeno</Button>      // h-8
<Button size="default">Padrão</Button>  // h-9 (default)
<Button size="lg">Grande</Button>       // h-10
<Button size="icon"><Plus /></Button>   // size-9 (quadrado)
```

**Botões Icon (size="icon"):**
- Hover extra chamativo: shadow + scale (105%)
- Background sutil no hover (outline/ghost): Blue Primary/50
- Ideal para ações rápidas e toolbars

---

## States

### Focus
- Ring: `Blue Primary/100` (2px, offset 2px)

### Disabled
- Opacity: 50%
- Pointer events: none

---

## Exemplos Completos

```tsx
import { Button } from './components/ui/button';
import { Plus, Trash, Download, Bell, Settings, Filter, Edit } from 'lucide-react';

// Primary action
<Button variant="default">Salvar Alterações</Button>

// Secondary action
<Button variant="outline">Cancelar</Button>

// Destructive action
<Button variant="destructive">Excluir Conta</Button>

// With icon (text + icon)
<Button variant="default">
  <Plus />
  Adicionar Item
</Button>

// Icon only (hover extra chamativo - shadow + scale + bg sutil)
<Button variant="ghost" size="icon">
  <Bell />
</Button>

<Button variant="outline" size="icon">
  <Filter />
</Button>

<Button variant="default" size="icon">
  <Plus />
</Button>

<Button variant="destructive" size="icon">
  <Trash />
</Button>

// Different sizes
<Button size="sm">Pequeno</Button>
<Button size="default">Padrão</Button>
<Button size="lg">Grande</Button>

// Disabled
<Button disabled>Não Disponível</Button>
```

**Nota sobre botões icon:**
Quando `size="icon"` é usado, o hover adiciona automaticamente:
- Shadow (sm para outline/ghost/secondary, md para default/destructive)
- Scale 105% (efeito de "crescimento" sutil)
- Background Blue Primary/50 (#96BDF6) para outline e ghost

---

## Guidelines de Uso

### Quando usar Default
- Ação principal da página/modal
- Apenas 1 botão default por contexto
- Confirmações importantes

### Quando usar Outline
- Ações secundárias
- Cancelar/Voltar em modais
- Múltiplas opções de ação
- Bordas finas (1.5px) e azul claro (#54A2FA) no hover

### Quando usar Destructive
- Deletar dados
- Remover itens
- Ações irreversíveis
- Sempre confirmar com AlertDialog

### Quando usar Ghost
- Ações terciárias
- Ícones clicáveis
- Ações sutis que não competem com conteúdo

---

## CSS Variables (Cores)

As variáveis CSS estão definidas em `/styles/globals.css`:

```css
/* Blue Primary */
--blue-primary-50: #96BDF6;  /* Azul muito claro - hover bg icon */
--blue-primary-100: #54A2FA; /* Azul claro - outline hover/focus */
--blue-primary-200: #2F5FFF; /* Azul principal - default bg */
--blue-primary-300: #161E53; /* Azul escuro */

/* Red Alert */
--red-alert-200: #F03948;
--red-alert-300: #DB2838;
--red-alert-400: #C71828;

/* Gray */
--gray-50: #F7F8FA;
--gray-100: #EFF1F5;
--gray-200: #D5D9E1;
--gray-300: #A6ADBB;

/* Black */
--black-300: #1E1E1E;

/* White */
--white-100: #FFFFFF;
```

---

## Accessibility

- Sempre use texto descritivo
- Ícones sozinhos devem ter `aria-label`
- Botões disabled não devem ser focáveis
- Mantenha contraste mínimo 4.5:1

```tsx
// ✅ Bom
<Button variant="outline">Cancelar Operação</Button>
<Button size="icon" aria-label="Baixar arquivo"><Download /></Button>

// ❌ Ruim
<Button variant="outline">OK</Button>
<Button size="icon"><Download /></Button> {/* sem aria-label */}
```
