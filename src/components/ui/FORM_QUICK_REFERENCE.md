# Form System - Quick Reference

## Typography Standard

**Todos os componentes de input e dropdown usam 14px (0.875rem):**
- Input text/placeholder
- Select text/placeholder/items
- Textarea text/placeholder
- SearchInput text/placeholder
- Dropdown menu items
- Context menu items
- Menubar items

## Color Palette

```
Background:     Gray/50      #F6F6F6
Border:         Gray/200     #B3B4C1
Hover:          Gray/300     #7A7A88
Focus:          Blue/300     #161E53
Ring:           Blue/100     #54A2FA

Text:           Black/300    #2C2C2C (14px)
Placeholder:    Gray/300     #7A7A88 (14px)

Error:          Red/300      #C8142C
Success:        Green/300    #47D238
```

---

## Spacing

```
Label → Control:     4px   (UPDATED)
Control → Assist:    6px   (space/075)
Between Fields:      12px  (space/150)
Between Sections:    24px  (space/300)
Grid Gutter:         16px  (space/200)
```

---

## Quick Usage

### Input
```tsx
import { Input } from "./components/ui/input";

// Basic
<Input placeholder="Digite..." />

// States
<Input error />
<Input success />
<Input disabled />
```

### FieldGroup (Recommended)
```tsx
import { FieldGroup } from "./components/ui/field-group";
import { Input } from "./components/ui/input";

<FieldGroup
  label="Email"
  required
  error="Email inválido"
  help="Usaremos para contato"
>
  <Input type="email" />
</FieldGroup>
```

### Search
```tsx
import { SearchInput } from "./components/ui/search-input";

<SearchInput placeholder="Buscar..." />
```

### Select
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecione" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Opção 1</SelectItem>
  </SelectContent>
</Select>
```

### Textarea
```tsx
import { Textarea } from "./components/ui/textarea";

<Textarea placeholder="Mensagem..." />
```

### Checkbox
```tsx
import { Checkbox } from "./components/ui/checkbox";

<div className="flex items-center gap-2">
  <Checkbox id="c1" />
  <label htmlFor="c1">Aceito os termos</label>
</div>
```

### Radio
```tsx
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";

<RadioGroup defaultValue="1">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="1" id="r1" />
    <label htmlFor="r1">Opção 1</label>
  </div>
</RadioGroup>
```

### Switch
```tsx
import { Switch } from "./components/ui/switch";

<div className="flex items-center gap-2">
  <Switch id="s1" />
  <label htmlFor="s1">Notificações</label>
</div>
```

---

## Layout Patterns

### Single Column
```tsx
<div className="space-y-3">
  <FieldGroup label="Nome">
    <Input />
  </FieldGroup>
  <FieldGroup label="Email">
    <Input type="email" />
  </FieldGroup>
</div>
```

### Two Columns
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <FieldGroup label="Nome">
    <Input />
  </FieldGroup>
  <FieldGroup label="Sobrenome">
    <Input />
  </FieldGroup>
</div>
```

### Sections
```tsx
<form className="space-y-6">
  <div>
    <h3 className="mb-4">Dados Pessoais</h3>
    <div className="space-y-3">
      ...fields
    </div>
  </div>
  
  <div>
    <h3 className="mb-4">Contato</h3>
    <div className="space-y-3">
      ...fields
    </div>
  </div>
</form>
```

---

## States Visual Guide

| State    | Border          | Background | Text       |
|----------|-----------------|------------|------------|
| Default  | Gray/200        | Gray/50    | Black/300  |
| Hover    | Gray/300        | Gray/50    | Black/300  |
| Focus    | Blue/300 + ring | Gray/50    | Black/300  |
| Error    | Red/300 + ring  | Gray/50    | Black/300  |
| Success  | Green/300 + ring| Gray/50    | Black/300  |
| Disabled | Gray/100        | Gray/50    | Gray/300   |

---

## Component Sizes

```
Input:       h-[44px]  px-3  py-2  mt-2 mb-2  rounded-[8px]  text:14px  placeholder:14px
Select:      h-[44px]  px-3  py-2  mt-2 mb-2  rounded-[8px]  text:14px  placeholder:14px
Textarea:    min-h-[88px] px-3 py-2 mt-2 mb-2  rounded-[8px]  text:14px  placeholder:14px
SearchInput: h-[44px] pl-10 pr-3 py-2 mt-2 mb-2 rounded-[8px] text:14px  placeholder:14px
Checkbox:    size-4 (16×16)
Radio:       size-4 (16×16)
Switch:      w-8 h-[18.4px]
```

---

## Focus Ring

```
Color:  Blue Primary/100 (#54A2FA)
Width:  2px
Offset: 2px
```

Always visible for keyboard navigation.

---

## Accessibility

### ARIA
```tsx
// Required
<Input aria-required="true" />

// Error
<Input aria-invalid="true" aria-describedby="error-id" />

// Help
<Input aria-describedby="help-id" />
```

### Contrast
- Black/300 on Gray/50: 12.6:1 (AAA) ✅
- Gray/300 on Gray/50: 3.2:1 (legível)

---

## Migration Checklist

- [ ] Replace white backgrounds with Gray/50
- [ ] Update borders to Gray/200 (default)
- [ ] Add hover state (Gray/300)
- [ ] Add focus ring (Blue/100)
- [ ] Use FieldGroup for spacing
- [ ] Update placeholders to Gray/300 + 14px
- [ ] Update border-radius to 8px
- [ ] Add margin-top 8px (mt-2) to all inputs
- [ ] Add margin-bottom 8px (mb-2) to all inputs
- [ ] Add error/success states
- [ ] Verify 4px spacing (label→control) - UPDATED
- [ ] Verify 6px spacing (control→assist)
- [ ] Verify 12px spacing (between fields)

---

## Common Mistakes

❌ **Don't:**
- Use white background (`bg-white`)
- Use arbitrary spacing (`mb-[13px]`)
- Stack help + error messages
- Use black text in placeholders
- Override colors without reason

✅ **Do:**
- Use Gray/50 background
- Use 8pt grid spacing
- Show error OR help (not both)
- Use Gray/300 for placeholders
- Follow token system

---

## Files

- Component: `/components/ui/input.tsx`
- Component: `/components/ui/select.tsx`
- Component: `/components/ui/textarea.tsx`
- Component: `/components/ui/field-group.tsx`
- Component: `/components/ui/search-input.tsx`
- Docs: `/components/ui/FORM_SYSTEM_DOCUMENTATION.md`
- Examples: `/components/FormShowcase.tsx`

---

**Version**: v1.0
**Updated**: 2024
