# FilterBar Pattern - SegVision Design System

## Visão Geral
Padrão global para barras de filtros em todas as telas do SegVision. Garante consistência visual, responsividade e experiência fluida em diferentes resoluções.

---

## Especificação Visual

### Container
```tsx
<div className="bg-white rounded-xl p-3 border border-[var(--gray-100)] flex flex-wrap items-center gap-3">
  {/* Filter items */}
</div>
```

**Propriedades**:
- Background: `bg-white`
- Border Radius: `rounded-xl` (12px)
- Padding: `p-3` (12px)
- Border: `border border-[var(--gray-100)]`
- Layout: `flex flex-wrap items-center`
- Gap: `gap-3` (12px)

### Filter Items (Select)
```tsx
<div className="flex-1 min-w-[220px]">
  <Select value={filterValue} onValueChange={setFilterValue}>
    <SelectTrigger className="bg-[var(--gray-50)] border-[var(--gray-200)] hover:border-[var(--gray-300)]">
      <SelectValue placeholder="Todos os [tipo]" />
    </SelectTrigger>
    <SelectContent>
      {/* Options */}
    </SelectContent>
  </Select>
</div>
```

**Propriedades do Wrapper**:
- Sizing: `flex-1` (expande igualmente)
- Min Width: `min-w-[220px]` (evita quebra prematura)

**Propriedades do SelectTrigger**:
- Background: `bg-[var(--gray-50)]`
- Border: `border-[var(--gray-200)]`
- Hover: `hover:border-[var(--gray-300)]`

---

## Comportamento Responsivo

### Desktop (≥1200px)
- **Layout**: 4 colunas na mesma linha
- **Sizing**: Cada filtro cresce igualmente (`flex-1`)
- **Resultado**: Filtros se expandem até a borda do card

### Tablet (768-1199px)
- **Layout**: 2 colunas por linha
- **Wrapping**: Automático via `flex-wrap`
- **Min Width**: `220px` preservada

### Mobile (<768px)
- **Layout**: 1 filtro por linha
- **Width**: Largura total (100%)
- **Min Width**: Ainda respeitada

---

## SearchSection (Opcional)

Quando houver busca + filtros, separe em dois cards:

```tsx
{/* Search Section */}
<div className="bg-white rounded-xl p-3 border border-[var(--gray-100)]">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--neutral-icon)]" />
    <Input
      placeholder="Buscar..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 bg-[var(--gray-50)] border-[var(--gray-200)] hover:border-[var(--gray-300)]"
    />
  </div>
</div>

{/* Filters - FilterBar Pattern */}
<div className="bg-white rounded-xl p-3 border border-[var(--gray-100)] flex flex-wrap items-center gap-3">
  {/* Filter items */}
</div>
```

**Wrapper Container**:
```tsx
<div className="space-y-3">
  {/* SearchSection */}
  {/* FilterBar */}
</div>
```

---

## Telas Implementadas

### ✅ Escola (Cliente)
- **AlertsScreen** (`/components/AlertsScreen.tsx`)
  - Gravidade • Status • Tipos • Câmeras (4 filtros)
  
- **NotificationsScreen** (`/components/NotificationsScreen.tsx`)
  - Tipo • Gravidade (condicional) • Status (3 filtros)

### ✅ Admin (SaaS)
- **AdminAlertsScreen** (`/components/admin/AdminAlertsScreen.tsx`)
  - Usa AlertsScreen (herda padrão)
  
- **AdminSchoolsScreen** (`/components/admin/AdminSchoolsScreen.tsx`)
  - Status (1 filtro + busca separada)
  
- **AdminFinanceScreen** (`/components/admin/AdminFinanceScreen.tsx`)
  - Status (1 filtro)

### ✅ Operador (Segurança)
- **OperatorAlertsScreen** (`/components/operator/OperatorAlertsScreen.tsx`)
  - Usa AlertsScreen (herda padrão)

---

## Placeholders Padrão

### Alertas
- `"Todas as gravidades"`
- `"Todos os status"`
- `"Todos os tipos"`
- `"Todas as câmeras"`

### Notificações
- `"Todos os tipos"`
- `"Todas gravidades"`
- `"Todas"` (status)

### Admin
- `"Todos os status"` (escolas, faturas)

---

## Tokens Utilizados

### Cores
```css
/* Container */
--white-100: #FAFAFA          /* bg-white */
--gray-100: #E5E5E5           /* border */

/* Input/Select */
--gray-50: #F6F6F6            /* background */
--gray-200: #B3B4C1           /* border */
--gray-300: #7A7A88           /* hover border */
```

### Espaçamento
- **Gap**: 12px (`gap-3`)
- **Padding**: 12px (`p-3`)
- **Min Width**: 220px (`min-w-[220px]`)

### Border Radius
- **Card**: 12px (`rounded-xl`)

---

## Regras de Implementação

### ✅ Obrigatório
1. **Sempre usar `flex-1`** em cada filtro (expande até a borda)
2. **Sempre usar `min-w-[220px]`** (previne quebra prematura)
3. **Container sempre com `flex-wrap`** (responsividade automática)
4. **Gap de 12px** (`gap-3`) entre itens
5. **Padding de 12px** (`p-3`) no container
6. **Border radius de 12px** (`rounded-xl`)
7. **Cores dos tokens** (não usar cores hard-coded)

### ❌ Proibido
1. Usar larguras fixas (`w-[180px]`, `w-[240px]`)
2. Usar `md:w-[...]` (não é fluido)
3. Misturar filtros com outros elementos no mesmo card
4. Usar `justify-between` sem necessidade (flex-wrap já resolve)

---

## Diferença vs. Padrão Antigo

### ❌ Padrão Antigo (Obsoleto)
```tsx
<div className="flex flex-col md:flex-row gap-2">
  <Select>
    <SelectTrigger className="w-full md:w-[180px]">
      {/* ... */}
    </SelectTrigger>
  </Select>
</div>
```

**Problemas**:
- Largura fixa em desktop (não expande)
- Espaço desperdiçado (não preenche card)
- Sem card wrapper (inconsistente)
- Gap menor (2 vs 3)

### ✅ Padrão Novo (Atual)
```tsx
<div className="bg-white rounded-xl p-3 border border-[var(--gray-100)] flex flex-wrap items-center gap-3">
  <div className="flex-1 min-w-[220px]">
    <Select>
      <SelectTrigger className="bg-[var(--gray-50)] border-[var(--gray-200)] hover:border-[var(--gray-300)]">
        {/* ... */}
      </SelectTrigger>
    </Select>
  </div>
</div>
```

**Benefícios**:
- Expande até a borda (layout fluido)
- Preenche espaço disponível
- Card wrapper consistente
- Gap adequado (12px)
- Responsivo automático

---

## Quando NÃO Usar

Este padrão é para **filtros de listagem/tabela**. NÃO use para:

- ❌ Formulários de configuração (Settings)
- ❌ Modais de criação/edição
- ❌ Campos únicos de seleção
- ❌ Dropdowns de ação (não filtros)

**Para estes casos**, use o padrão de formulário normal:
```tsx
<div className="space-y-2">
  <Label>Campo</Label>
  <Select>
    <SelectTrigger className="w-full">
      {/* ... */}
    </SelectTrigger>
  </Select>
</div>
```

---

## Figma How-to

### Auto Layout
1. Selecione o frame do FilterBar
2. Auto Layout: **Horizontal**
3. Gap: **12**
4. Padding: **12**
5. Align: **Left**
6. Justify: **Space between**
7. Ative **Wrap**

### Resizing (Cada Select)
1. Selecione cada dropdown
2. Resizing: **W = Fill container**, **H = Hug**
3. Constraints: **Min-width = 220**

### Card Pai
- **W = Fill container** (para FilterBar herdar largura)

---

## Checklist de QA

Ao implementar FilterBar em nova tela:

- [ ] Container usa `flex flex-wrap gap-3 p-3`
- [ ] Container tem border e rounded-xl
- [ ] Cada filtro tem `flex-1 min-w-[220px]`
- [ ] SelectTrigger usa cores corretas (gray-50, gray-200, gray-300)
- [ ] Placeholders seguem padrão ("Todos os...")
- [ ] Responsivo testado (4 → 2 → 1 colunas)
- [ ] Busca separada em card próprio (se houver)
- [ ] Tokens usados (não cores hard-coded)

---

**Versão**: 1.0  
**Data**: Janeiro 2025  
**Autor**: SegVision Design System Team  
**Status**: ✅ Padrão Global Oficial
