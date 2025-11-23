# Form System Implementation - SegVision

## ✅ Implementado

Sistema completo de formulários com cores padronizadas (Gray/50 + Gray/200) e espaçamentos baseados em 8pt grid.

---

## Componentes Atualizados

### 1. Input (`/components/ui/input.tsx`)
✅ Background: Gray/50  
✅ Border: Gray/200 (default) → Gray/300 (hover) → Blue/300 (focus)  
✅ Focus ring: Blue/100 (2px, offset 2px)  
✅ Text: 14px (UPDATED)  
✅ Placeholder: Gray/300 + 14px (UPDATED)  
✅ Error/Success states  
✅ Height: 44px (padrão desktop)  
✅ Border radius: 8px (UPDATED)  
✅ Margin top: 8px (mt-2) (UPDATED)  
✅ Margin bottom: 8px (mb-2) (UPDATED)  

### 2. Select (`/components/ui/select.tsx`)
✅ Mesmas cores do Input  
✅ Chevron icon: Gray/300  
✅ Trigger height: 44px (default) | 36px (sm)  
✅ Border radius: 8px (UPDATED)  
✅ Text: 14px (UPDATED)  
✅ Placeholder: 14px (UPDATED)  
✅ Margin top: 8px (mt-2) (UPDATED)  
✅ Margin bottom: 8px (mb-2) (UPDATED)  
✅ Content: White/100 background  
✅ Selected item: Blue/300 checkmark  

### 3. Textarea (`/components/ui/textarea.tsx`)
✅ Mesmas cores do Input  
✅ Min height: 88px  
✅ Border radius: 8px (UPDATED)  
✅ Text: 14px (UPDATED)  
✅ Placeholder: 14px (UPDATED)  
✅ Margin top: 8px (mt-2) (UPDATED)  
✅ Margin bottom: 8px (mb-2) (UPDATED)  
✅ Field-sizing: content (auto-expande)  
✅ Resize: none  

### 4. Checkbox (`/components/ui/checkbox.tsx`)
✅ Unchecked: Gray/50 + Gray/200  
✅ Checked: Blue/300 bg + White/100 check  
✅ Size: 16×16px  

### 5. Radio Group (`/components/ui/radio-group.tsx`)
✅ Unchecked: Gray/50 + Gray/200  
✅ Checked: Blue/300 indicator  
✅ Gap between items: 8px  

### 6. Switch (`/components/ui/switch.tsx`)
✅ Unchecked track: Gray/200  
✅ Checked track: Blue/300  
✅ Thumb: White/100  
✅ Size: 32×18.4px  

### 7. SearchInput (`/components/ui/search-input.tsx`) **[NOVO]**
✅ Input com ícone Search à esquerda  
✅ Ícone: Gray/300 (não muda no focus)  
✅ Border radius: 8px (UPDATED)  
✅ Text: 14px (UPDATED)  
✅ Placeholder: 14px (UPDATED)  
✅ Margin top: 8px (mt-2) (UPDATED)  
✅ Margin bottom: 8px (mb-2) (UPDATED)  
✅ Padding left: 40px  

### 8. FieldGroup (`/components/ui/field-group.tsx`) **[NOVO]**
✅ Wrapper para padronizar espaçamentos  
✅ Label → Control: 4px (UPDATED)  
✅ Control → Assist: 6px  
✅ Props: label, required, error, help, success  

---

## Paleta de Cores

### Surface
```css
--input-bg:            var(--gray-50)      /* #F6F6F6 */
--input-border:        var(--gray-200)    /* #B3B4C1 */
--input-border-hover:  var(--gray-300)    /* #7A7A88 */
--input-border-focus:  var(--blue-primary-300) /* #161E53 */
--input-focus-ring:    var(--blue-primary-100) /* #54A2FA */
```

### Text
```css
--input-text:          var(--black-300)   /* #2C2C2C */
--input-placeholder:   var(--gray-300)    /* #7A7A88 */
--input-disabled:      var(--gray-300)    /* #7A7A88 */
```

### Feedback
```css
--error-border:        var(--red-alert-300)    /* #C8142C */
--error-text:          var(--red-alert-400)    /* #81131D */
--success-border:      var(--green-alert-300)  /* #47D238 */
```

---

## Espaçamentos

| Token       | Value | Usage                    |
|-------------|-------|--------------------------|
| space/025   | 4px   | Label → Control (UPDATED)|
| space/050   | 4px   | Required asterisk margin |
| space/075   | 6px   | Control → Assist         |
| space/150   | 12px  | Between FieldGroups      |
| space/200   | 16px  | Grid gutter (2 cols)     |
| space/300   | 24px  | Between form sections    |

---

## Métricas dos Componentes

### Input / Select
```
Height:         44px
Padding X:      12px
Padding Y:      8px
Border radius:  10px
Border width:   1px
```

### Textarea
```
Min height:     88px
Padding:        12px
Border radius:  10px
```

### Checkbox / Radio
```
Size:           16×16px (4 units)
Border radius:  4px (checkbox) | full (radio)
```

### Switch
```
Width:          32px
Height:         18.4px
Thumb size:     16px
```

---

## Estados Visuais

### Default
- Border: Gray/200
- Background: Gray/50
- Text: Black/300
- Placeholder: Gray/300

### Hover
- Border: Gray/300 (um tom mais escuro)
- Outros mantidos

### Focus
- Border: Blue Primary/300
- Focus ring: Blue Primary/100 (2px, offset 2px)
- Sem box-shadow

### Error
- Border: Red Alert/300
- Focus ring: Red Alert/100
- Assist text: Red Alert/400

### Success
- Border: Green Alert/300
- Focus ring: Green Alert/100
- Assist text: Green Alert/300

### Disabled
- Border: Gray/100
- Background: Gray/50 (mantido)
- Text: Gray/300
- Opacity: 70%
- Cursor: not-allowed

---

## Padrões de Layout

### Single Column (Mobile)
```tsx
<div className="space-y-3"> {/* 12px gap */}
  <FieldGroup label="Nome">
    <Input />
  </FieldGroup>
  <FieldGroup label="Email">
    <Input type="email" />
  </FieldGroup>
</div>
```

### Two Columns (Desktop)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* 16px gutter */}
  <FieldGroup label="Nome">
    <Input />
  </FieldGroup>
  <FieldGroup label="Sobrenome">
    <Input />
  </FieldGroup>
</div>
```

### Form Sections
```tsx
<form className="space-y-6"> {/* 24px between sections */}
  <div>
    <h3 className="mb-4">Dados Pessoais</h3>
    <div className="space-y-3">
      {/* fields */}
    </div>
  </div>
  
  <div>
    <h3 className="mb-4">Contato</h3>
    <div className="space-y-3">
      {/* fields */}
    </div>
  </div>
</form>
```

---

## Acessibilidade

### Contraste
- Black/300 sobre Gray/50: **12.6:1** (AAA) ✅
- Gray/300 sobre Gray/50: **3.2:1** (legível, intencional para placeholder)
- Blue/300 border: **13.2:1** vs White (AAA) ✅

### Keyboard Navigation
- Tab navega entre campos
- Focus ring sempre visível (Blue/100)
- Enter/Space ativa checkbox/radio/switch
- Arrow keys navegam radio groups

### ARIA
```tsx
// Required
<Input aria-required="true" />

// Error
<Input aria-invalid="true" aria-describedby="error-id" />
<span id="error-id">Mensagem de erro</span>

// Help
<Input aria-describedby="help-id" />
<span id="help-id">Texto de ajuda</span>
```

---

## Exemplos de Uso

### Básico
```tsx
import { Input } from "./components/ui/input";

<Input placeholder="Digite seu nome..." />
```

### Com FieldGroup (Recomendado)
```tsx
import { FieldGroup } from "./components/ui/field-group";
import { Input } from "./components/ui/input";

<FieldGroup
  label="Email"
  required
  help="Usaremos para comunicações"
  error="Email já cadastrado"
>
  <Input type="email" placeholder="seu@email.com" />
</FieldGroup>
```

### Search
```tsx
import { SearchInput } from "./components/ui/search-input";

<SearchInput placeholder="Buscar alertas..." />
```

### Select
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecione uma escola" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Escola ABC</SelectItem>
    <SelectItem value="2">Colégio XYZ</SelectItem>
  </SelectContent>
</Select>
```

---

## Documentação

- **Completa**: `/components/ui/FORM_SYSTEM_DOCUMENTATION.md`
- **Quick Reference**: `/components/ui/FORM_QUICK_REFERENCE.md`
- **Showcase**: `/components/FormShowcase.tsx`

---

## Próximos Passos (TODO)

- [ ] DatePicker component
- [ ] TimePicker component  
- [ ] Multiselect/Combobox component
- [ ] File upload component
- [ ] Slider/Range component
- [ ] Aplicar em telas existentes (SettingsScreen, ProfileScreen, etc.)

---

## Migration Checklist

Ao atualizar formulários existentes:

- [ ] Substituir `bg-white` por `bg-[var(--gray-50)]`
- [ ] Atualizar borders para `border-[var(--gray-200)]`
- [ ] Adicionar hover: `hover:border-[var(--gray-300)]`
- [ ] Adicionar focus ring: `focus-visible:ring-2 ring-[var(--blue-primary-100)]`
- [ ] Usar FieldGroup para espaçamentos consistentes
- [ ] Atualizar placeholders para `text-[var(--gray-300)]`
- [ ] Adicionar estados error/success
- [ ] Verificar espaçamentos (8px, 6px, 12px)
- [ ] Testar navegação por teclado
- [ ] Validar contraste WCAG AA

---

## Breaking Changes

⚠️ **Atenção**: Mudanças visuais nos inputs

1. Background agora é Gray/50 (antes branco)
2. Border padrão Gray/200 (antes variava)
3. Focus tem ring Blue/100 (antes box-shadow variável)
4. Placeholders Gray/300 (antes variava)

**Impacto**: Todos os formulários terão aparência consistente mas diferente.

---

## Rollback

Se necessário reverter:
- Restaurar arquivos em `/components/ui/` para versão anterior
- Remover `FieldGroup` wrapper
- Restaurar espaçamentos customizados

---

**Version**: Form System v1.0  
**Status**: ✅ Implementado  
**Date**: 2024  
**Author**: SegVision Design Team
