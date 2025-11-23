# Breadcrumb Header Pattern — SegVision Design System

## Overview
Este documento define o padrão de header com breadcrumb para telas de detalhe no SegVision, substituindo o botão "Voltar" por navegação hierárquica mais clara e acessível.

## Quando Usar

### ✅ Use breadcrumb em:
- Telas de detalhe de câmeras
- Telas de detalhe de alertas (se houver view dedicada)
- Telas de detalhe de contratos
- Telas de detalhe de faturas
- Qualquer tela que mostre detalhes de um item específico de uma lista

### ❌ Não use breadcrumb em:
- Modais/Dialogs (use título do dialog)
- Telas principais de listagem
- Telas sem hierarquia de navegação

## Estrutura do Header

```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigateToList()}>
            {ListName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigateToCategory()}>
            {Category}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{CurrentItem}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <h1 className="text-[var(--neutral-text)]">{Category} — {CurrentItem}</h1>
  </div>
  
  {/* Content */}
</div>
```

## Spacing

### Hierarquia Vertical
- **Breadcrumb → Title**: 8px (`space-y-2`)
- **Header → Content**: 16px (`space-y-4` no container principal)

### Hierarquia Horizontal
- **Gap entre itens do breadcrumb**: 4px (gap-1)
- **Ícone separator**: 16px (h-4 w-4)

## Cores e Estados

### BreadcrumbLink (clicável)
- **Color**: `var(--primary-bg)` (Blue Primary 200)
- **Hover**: `var(--primary-bg-hover)` (Blue Primary 300)
- **Focus**: Ring 2px `var(--primary-bg)` com offset 2px
- **Cursor**: pointer
- **Transition**: colors

### BreadcrumbPage (item atual)
- **Color**: `var(--neutral-text)` (Black 300)
- **Cursor**: default (não clicável)
- **aria-current**: "page"

### BreadcrumbSeparator
- **Ícone**: ChevronRight
- **Color**: `var(--neutral-text-muted)` (Gray 200)
- **Size**: 16px (h-4 w-4)

## Tipografia

### Breadcrumb Items
- **Font**: Inter (herda do design system)
- **Size**: 14px (`text-[14px]`)
- **Weight**: 400 (normal)
- **Line Height**: Herda do design system

### Title (H1)
- **Font**: Inter (herda do design system)
- **Size**: 24px desktop, 20px mobile (definido em globals.css)
- **Weight**: 700 (definido em globals.css)
- **Line Height**: 120% (definido em globals.css)
- **Color**: `var(--neutral-text)`

## Acessibilidade

### Attributes
```tsx
<Breadcrumb>
  {/* aria-label="breadcrumb" já está no componente */}
</Breadcrumb>

<BreadcrumbPage>
  {/* aria-current="page" já está no componente */}
</BreadcrumbPage>
```

### Keyboard Navigation
- Todos os links devem ser navegáveis com Tab
- Enter/Space ativa o link
- Focus ring visível (2px com offset 2px)

### Screen Readers
- Separator tem `aria-hidden="true"`
- Último item tem `aria-current="page"`
- Nav tem `aria-label="breadcrumb"`

## Responsive

### Desktop (>= 1024px)
```tsx
<div className="space-y-2">
  <Breadcrumb>
    <BreadcrumbList>
      {/* Todos os itens visíveis */}
    </BreadcrumbList>
  </Breadcrumb>
  <h1>{Title}</h1>
</div>
```

### Tablet (768px - 1023px)
- Breadcrumb se mantém em uma linha
- Trunca textos longos se necessário
- Title pode quebrar para 2 linhas

### Mobile (< 768px)
- Breadcrumb em 1 linha com truncamento
- Considera usar BreadcrumbEllipsis para hierarquias muito longas
- Title quebra para 2 linhas se necessário

## Exemplo Completo: Câmera Detail

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, 
         BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

export function CameraDetailView({ camera, onBack }) {
  const [area, subLocation] = camera.location.split(' → ');
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={onBack}>
                Câmeras
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={onBack}>
                {area}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{subLocation}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-[var(--neutral-text)]">
          {area} — {subLocation}
        </h1>
      </div>
      
      {/* Content */}
    </div>
  );
}
```

## Overflow Handling

Para hierarquias muito longas (> 4 níveis), use BreadcrumbEllipsis:

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink onClick={() => navigate(-1)}>Previous</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Actions no Header

Se houver actions (botões) no header, use layout flex:

```tsx
<div className="space-y-4">
  <div className="flex items-start justify-between gap-4">
    <div className="space-y-2">
      <Breadcrumb>...</Breadcrumb>
      <h1>Title</h1>
    </div>
    <div className="flex gap-2">
      <Button variant="outline">Action</Button>
      <Button>Primary Action</Button>
    </div>
  </div>
  
  {/* Content */}
</div>
```

## Migration Checklist

Ao migrar uma tela de "Voltar" para Breadcrumb:

- [ ] Importar componentes de breadcrumb
- [ ] Identificar hierarquia de navegação (List → Category → Item)
- [ ] Remover botão "Voltar"
- [ ] Adicionar estrutura de breadcrumb
- [ ] Ajustar título H1 para refletir hierarquia
- [ ] Ajustar spacing (space-y-2 no header wrapper, space-y-4 no container)
- [ ] Testar navegação com keyboard
- [ ] Testar com screen reader
- [ ] Testar em diferentes resoluções

## Design Tokens Utilizados

```css
/* Colors */
--primary-bg: #2F5FFF;           /* Blue Primary 200 - Links */
--primary-bg-hover: #1E4FEF;     /* Blue Primary 300 - Link hover */
--neutral-text: #000000;         /* Black 300 - Título e current page */
--neutral-text-muted: #6B7280;   /* Gray 200 - Separators */

/* Focus Ring */
--primary-bg: #2F5FFF;           /* Focus ring color */
```

## Referências

- Componente: `/components/ui/breadcrumb.tsx`
- Exemplo implementado: `/components/CamerasScreen.tsx` (linha 178+)
- Design system: `/styles/globals.css`
