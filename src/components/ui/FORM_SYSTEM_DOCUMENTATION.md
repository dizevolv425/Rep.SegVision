# Form System - SegVision Design System

## Visão Geral

Sistema completo de formulários com cores padronizadas em cinza e espaçamentos baseados em 8pt grid.

---

## Color Tokens

### Input Surface Colors
```
Background (default):     Gray/50      (#F6F6F6)
Border (default):         Gray/200     (#B3B4C1)
Border (hover):           Gray/300     (#7A7A88)
Border (focus):           Blue Primary/300 (#161E53)
Focus Ring:               Blue Primary/100 (#54A2FA)

Background (disabled):    Gray/50      (#F6F6F6)
Border (disabled):        Gray/100     (#E2E2EA)
```

### Text Colors
```
Value (typed text):       Black/300    (#2C2C2C)
Placeholder:              Gray/300     (#7A7A88)
Disabled text:            Gray/300     (#7A7A88)

Label:                    Black/300    (#2C2C2C)
Help text:                Gray/300     (#7A7A88)
Required asterisk:        Red Alert/300 (#C8142C)
```

### Feedback Colors
```
Error border:             Red Alert/300    (#C8142C)
Error text:               Red Alert/400    (#81131D)
Error ring:               Red Alert/100    (#F87E81)

Success border:           Green Alert/300  (#47D238)
Success text:             Green Alert/300  (#47D238)
Success ring:             Green Alert/100  (#BDEFB8)
```

### Icon Colors
```
Search icon:              Gray/300     (#7A7A88)
Calendar icon:            Gray/300     (#7A7A88)
Chevron (select):         Gray/300     (#7A7A88)
```

---

## Spacing Tokens

```
space/025:  4px   - Label → Control gap (UPDATED)
space/050:  4px   - Required asterisk margin
space/075:  6px   - Control → Assist gap
space/150:  12px  - Between FieldGroups (default)
space/200:  16px  - Grid gutter
space/300:  24px  - Between form sections
```

---

## Component: FieldGroup

Wrapper para padronizar espaçamentos em todos os campos de formulário.

### Structure (Auto Layout Vertical)

```
┌─────────────────────────┐
│ Label (optional) *      │  ← 4px gap (UPDATED)
├─────────────────────────┤
│ Control (Input/Select)  │  ← 6px gap
├─────────────────────────┤
│ Assist (Help/Error)     │
└─────────────────────────┘
     ↓ 12px gap
┌─────────────────────────┐
│ Next FieldGroup         │
└─────────────────────────┘
```

### Props

```typescript
interface FieldGroupProps {
  label?: string;
  required?: boolean;
  error?: string;
  help?: string;
  success?: string;
  density?: "default" | "dense";
  children: React.ReactNode;
}
```

### Usage

```tsx
import { FieldGroup } from "./components/ui/field-group";
import { Input } from "./components/ui/input";

<FieldGroup
  label="Email"
  required
  help="Usaremos este email para comunicações"
>
  <Input type="email" placeholder="seu@email.com" />
</FieldGroup>

<FieldGroup
  label="Senha"
  error="Senha deve ter no mínimo 8 caracteres"
>
  <Input type="password" />
</FieldGroup>

<FieldGroup
  label="Nome"
  success="Nome disponível"
>
  <Input type="text" />
</FieldGroup>
```

---

## Components

### Input

**Metrics:**
- Height: 44px (default)
- Border radius: 8px (UPDATED)
- Padding X: 12px
- Padding Y: 8px
- Margin top: 8px (mt-2) (UPDATED)
- Margin bottom: 8px (mb-2) (UPDATED)
- Text font-size: 14px (UPDATED)
- Placeholder font-size: 14px (UPDATED)

**States:**

```tsx
// Default
<Input type="text" placeholder="Digite algo..." />

// Error state
<Input type="text" error />

// Success state
<Input type="text" success />

// Disabled
<Input type="text" disabled />
```

**Colors:**
- Background: `Gray/50`
- Border default: `Gray/200`
- Border hover: `Gray/300`
- Border focus: `Blue Primary/300`
- Focus ring: `Blue Primary/100` (2px, offset 2px)

---

### SearchInput

Input com ícone de busca à esquerda.

**Usage:**

```tsx
import { SearchInput } from "./components/ui/search-input";

<SearchInput placeholder="Buscar..." />
```

**Features:**
- Ícone Search em `Gray/300`
- Padding left aumentado (40px) para acomodar ícone
- Ícone mantém cor `Gray/300` no focus (não muda)
- Margin top: 8px (mt-2) (UPDATED)
- Margin bottom: 8px (mb-2) (UPDATED)
- Text font-size: 14px (UPDATED)
- Placeholder font-size: 14px (UPDATED)

---

### Select

**Metrics:**
- Height: 44px (default) | 36px (sm)
- Border radius: 8px (UPDATED)
- Padding X: 12px
- Margin top: 8px (mt-2) (UPDATED)
- Margin bottom: 8px (mb-2) (UPDATED)
- Text font-size: 14px (UPDATED)
- Placeholder font-size: 14px (UPDATED)

**Usage:**

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecione uma opção" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Opção 1</SelectItem>
    <SelectItem value="2">Opção 2</SelectItem>
  </SelectContent>
</Select>
```

**Features:**
- Chevron em `Gray/300`
- Placeholder em `Gray/300`
- Item selected com checkmark em `Blue Primary/300`
- Content background: `White/100`

---

### Textarea

**Metrics:**
- Min height: 88px
- Border radius: 8px (UPDATED)
- Padding: 12px
- Margin top: 8px (mt-2) (UPDATED)
- Margin bottom: 8px (mb-2) (UPDATED)
- Text font-size: 14px (UPDATED)
- Placeholder font-size: 14px (UPDATED)

**Usage:**

```tsx
import { Textarea } from "./components/ui/textarea";

<Textarea placeholder="Digite sua mensagem..." />
```

**Features:**
- Field-sizing: content (auto-expande)
- Resize: none (sem handle de resize)
- Mesmas cores e estados do Input

---

### Checkbox

**Metrics:**
- Size: 16px (4 × 4)
- Border radius: 4px

**Usage:**

```tsx
import { Checkbox } from "./components/ui/checkbox";

<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <label htmlFor="terms">Aceito os termos</label>
</div>
```

**Colors:**
- Unchecked: `Gray/50` bg + `Gray/200` border
- Checked: `Blue Primary/300` bg + border
- Checkmark: `White/100`

---

### Radio Group

**Metrics:**
- Item size: 16px (4 × 4)
- Border radius: 50% (full circle)
- Gap between items: 8px

**Usage:**

```tsx
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";

<RadioGroup defaultValue="option1">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option1" id="r1" />
    <label htmlFor="r1">Opção 1</label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option2" id="r2" />
    <label htmlFor="r2">Opção 2</label>
  </div>
</RadioGroup>
```

**Colors:**
- Unchecked: `Gray/50` bg + `Gray/200` border
- Checked: `Blue Primary/300` indicator

---

### Switch

**Metrics:**
- Width: 32px (8 × 4)
- Height: 18.4px (~1.15rem)
- Thumb size: 16px (4 × 4)

**Usage:**

```tsx
import { Switch } from "./components/ui/switch";

<div className="flex items-center gap-2">
  <Switch id="notifications" />
  <label htmlFor="notifications">Receber notificações</label>
</div>
```

**Colors:**
- Unchecked track: `Gray/200`
- Checked track: `Blue Primary/300`
- Thumb: `White/100`

---

## Spacing Rules

### Label → Control
```
Gap: 4px (UPDATED)
```

**Why:** Compacto e próximo, mantendo labels e campos agrupados visualmente.

### Control → Assist
```
Gap: 6px (space/075)
```

**Why:** Mantém help/error próximo ao campo, mas não colado.

### Between FieldGroups
```
Default density: 12px (space/150)
Dense density: 12px (space/150) - mesma distância
```

**Why:** Agrupa campos relacionados sem criar blocos pesados.

### Between Form Sections
```
Gap: 24px (space/300)
```

**Why:** Separação clara de seções (ex: Dados Pessoais vs Endereço).

### Grid Gutter
```
Gap: 16px (space/200)
```

**Why:** Respiração adequada em layouts de 2-3 colunas.

---

## Layout Patterns

### Single Column (Mobile)

```tsx
<div className="space-y-3"> {/* 12px between fields */}
  <FieldGroup label="Nome" required>
    <Input />
  </FieldGroup>
  
  <FieldGroup label="Email" required>
    <Input type="email" />
  </FieldGroup>
  
  <FieldGroup label="Telefone">
    <Input type="tel" />
  </FieldGroup>
</div>
```

### Two Column (Desktop)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* 16px gutter */}
  <FieldGroup label="Nome" required>
    <Input />
  </FieldGroup>
  
  <FieldGroup label="Sobrenome">
    <Input />
  </FieldGroup>
  
  <FieldGroup label="Email" required className="md:col-span-2">
    <Input type="email" />
  </FieldGroup>
</div>
```

### Form Sections

```tsx
<form className="space-y-6"> {/* 24px between sections */}
  {/* Section 1: Personal Data */}
  <div>
    <h3 className="mb-4">Dados Pessoais</h3>
    <div className="space-y-3">
      <FieldGroup label="Nome">
        <Input />
      </FieldGroup>
      <FieldGroup label="CPF">
        <Input />
      </FieldGroup>
    </div>
  </div>
  
  {/* Section 2: Contact */}
  <div>
    <h3 className="mb-4">Contato</h3>
    <div className="space-y-3">
      <FieldGroup label="Email">
        <Input type="email" />
      </FieldGroup>
      <FieldGroup label="Telefone">
        <Input type="tel" />
      </FieldGroup>
    </div>
  </div>
</form>
```

---

## Accessibility

### Contrast Ratios

**Text on Gray/50:**
- Black/300: 12.6:1 (AAA) ✅
- Gray/300 (placeholder): 3.2:1 (legível mas intencional)

**Focus States:**
- Blue Primary/300 border: 13.2:1 vs White (AAA) ✅
- Blue Primary/100 ring: Visible (2px, offset 2px)

### Keyboard Navigation

- Tab order segue ordem visual
- Focus ring sempre visível
- Enter/Space ativa checkboxes, radios, switches
- Arrow keys navegam radio groups

### Screen Readers

```tsx
// Required fields
<FieldGroup label="Email" required>
  <Input type="email" aria-required="true" />
</FieldGroup>

// Error states
<FieldGroup label="Senha" error="Senha muito curta">
  <Input type="password" aria-invalid="true" aria-describedby="password-error" />
</FieldGroup>

// Help text
<FieldGroup label="Username" help="Apenas letras e números">
  <Input aria-describedby="username-help" />
</FieldGroup>
```

---

## Migration Guide

### From old inputs

**BEFORE:**
```tsx
<div className="mb-4">
  <label className="block mb-2">Nome</label>
  <input 
    className="border rounded p-2 w-full" 
    type="text" 
  />
  <p className="text-sm text-gray-500 mt-1">Digite seu nome completo</p>
</div>
```

**AFTER:**
```tsx
<FieldGroup 
  label="Nome" 
  help="Digite seu nome completo"
>
  <Input type="text" />
</FieldGroup>
```

### Benefits

✅ Espaçamentos consistentes (8pt grid)
✅ Cores padronizadas (paleta oficial)
✅ Estados visuais claros (focus, error, success)
✅ Acessibilidade garantida (ARIA, contraste AA/AAA)
✅ Menos código (wrapper component)
✅ Manutenibilidade (tokens centralizados)

---

## Do's and Don'ts

### ✅ DO

```tsx
// Use FieldGroup para consistência
<FieldGroup label="Email" required error="Email inválido">
  <Input type="email" />
</FieldGroup>

// Use espaçamentos do 8pt grid
<div className="space-y-3"> {/* 12px */}
  ...
</div>

// Use apenas cores da paleta
<Input /> // usa Gray/50 + Gray/200 automaticamente
```

### ❌ DON'T

```tsx
// Não use espaçamentos arbitrários
<div className="mb-[13px]"> {/* ❌ não múltiplo de 4/8 */}

// Não override cores sem motivo
<Input className="bg-white border-gray-400" /> {/* ❌ */}

// Não empilhe Help + Error
<FieldGroup help="..." error="..."> {/* ❌ error substitui help */}

// Não use texto preto em placeholders
<Input placeholder="..." className="placeholder:text-black" /> {/* ❌ */}
```

---

## Component Checklist

- [x] Input (text, email, password, tel, etc.)
- [x] SearchInput (com ícone)
- [x] Select/Dropdown
- [x] Textarea
- [x] Checkbox
- [x] Radio Group
- [x] Switch
- [x] FieldGroup (wrapper)
- [ ] DatePicker (TODO)
- [ ] TimePicker (TODO)
- [ ] Multiselect/Combobox (TODO)

---

## Examples

Ver `/components/ui/form-examples.tsx` para exemplos visuais completos de:
- Todos os tipos de input
- Estados (default, hover, focus, error, success, disabled)
- Layouts (single column, grid, sections)
- Validação em tempo real
- Formulários completos

---

**Version**: Form System v1.0
**Last Updated**: 2024
**Status**: ✅ Implementado
