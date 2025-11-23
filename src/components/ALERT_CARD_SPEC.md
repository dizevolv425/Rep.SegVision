# Alert Card Component Specification

## Visão Geral
Componente redesenhado para exibição de alertas do sistema SegVision, seguindo hierarquia visual clara e botões com texto branco.

---

## Estrutura do Card

### Layout Horizontal (Desktop/Tablet ≥768px)

```
┌─────────────────────────────────────────────────────────────┐
│ [Icon] │ Title + StatusBadge           [Timestamp Badge]    │
│  32px  │ Description                                         │
│        │ [Camera] [Location] [Author] [Priority] [Type]     │
│        │                                      [Ver Vídeo]    │
│        │                                      [Confirmar]    │
│        │                                      [Resolver]     │
└─────────────────────────────────────────────────────────────┘
```

### Layout Vertical (Mobile <768px)

```
┌────────────────────────────────┐
│ [Icon] Title                   │
│        StatusBadge  Timestamp  │
│                                │
│ Description                    │
│ [Camera] [Location] [Author]   │
│ [Priority] [Type]              │
│                                │
│ [Ver Vídeo - Full Width]       │
│ [Confirmar - Full Width]       │
│ [Resolver - Full Width]        │
└────────────────────────────────┘
```

---

## Seções do Card

### 1. Left Meta (Ícone de Tipo)
- **Tamanho**: 32px circle
- **Background**: Baseado no tipo do alerta
  - Intrusão → Red Alert/50 (#FDC6C5)
  - Reconhecimento Facial → Turquoise Alert/50 (#EBF6FF)
  - Aglomeração → Green Alert/50 (#E6FFE6)
  - Outros → Gray/50 (#F6F6F6)
- **Ícone**: 16px, cor correspondente ao tom 400 da paleta

### 2. Middle Content

#### Header Row
- **Gap**: 8px entre elementos
- **Elementos**:
  - **Title**: Inter/Semibold/14, cor Black/300
  - **StatusBadge**: Varia por status (ver abaixo)
  - **Timestamp**: Badge/Light/Neutral/S no canto direito

#### Description
- **Tipografia**: Inter/Regular/13, line-height 20px
- **Cor**: Black/300

#### Meta Row
- **Gap**: 12px entre itens
- **Ícones**: 14px (3.5 w/h tailwind)
- **Tipografia**: Inter/Medium/12
- **Cor**: Black/200 (neutral-text-muted)
- **Elementos**:
  - Câmera (ícone + nome)
  - Local (opcional, ícone MapPin + texto)
  - Autor da ação (opcional, nome + cargo)
  - Badge de Gravidade
  - Badge de Tipo

### 3. Right Actions (Desktop)
- **Width**: 148px
- **Layout**: Vertical, gap 8px
- **Botões**: Width 100%, height 36px

---

## Badges

### Status (Variant + Tone + Size)
- **Novo**: `heavy` + `danger` + `m` (vermelho crítico)
- **Confirmado**: `light` + `caution` + `m` (amarelo claro)
- **Resolvido**: `medium` + `success` + `m` (verde médio)
- **Falso Positivo**: `light` + `neutral` + `m` (cinza claro)

### Gravidade (Variant + Tone + Size)
- **Alta**: `medium` + `danger` + `s`
- **Média**: `medium` + `warning` + `s`
- **Baixa**: `medium` + `info` + `s`

### Tipo (Variant + Tone + Size)
- Sempre: `light` + `neutral` + `s`
- Labels: Intrusão, Reconhecimento Facial, Aglomeração, Objeto Suspeito, Movimento

### Timestamp
- Sempre: `light` + `neutral` + `s`
- Formato: "YYYY-MM-DD às HH:MM"

---

## Botões (Texto SEMPRE Branco)

### Ver Vídeo (Primary)
```tsx
className="bg-[var(--blue-primary-200)] text-white 
           hover:bg-[var(--blue-primary-200)] hover:opacity-96 
           rounded-[10px] text-[13px] font-semibold h-9"
```
- **Cor**: Blue Primary/200 (#2F5FFF)
- **Texto**: Branco (#FFFFFF)
- **Quando**: Sempre visível se `hasVideo={true}`

### Confirmar (Warning)
```tsx
className="bg-[var(--orange-alert-400)] text-white 
           hover:bg-[var(--orange-alert-400)] hover:opacity-96 
           rounded-[10px] text-[13px] font-semibold h-9"
```
- **Cor**: Orange Alert/400 (#BA870B)
- **Texto**: Branco (#FFFFFF)
- **Quando**: Apenas se `status === 'novo'`

### Resolver (Success)
```tsx
className="bg-[var(--green-alert-300)] text-white 
           hover:bg-[var(--green-alert-300)] hover:opacity-96 
           rounded-[10px] text-[13px] font-semibold h-9"
```
- **Cor**: Green Alert/300 (#47D238)
- **Texto**: Branco (#FFFFFF)
- **Quando**: Sempre visível
- **Estado Disabled**: `status !== 'confirmado'`
  - Background: Gray/200 (#B3B4C1)
  - Texto: Branco com opacidade reduzida (60%)

---

## Estados Visuais

### Default
- Border: 1px, Gray/100
- Background: White
- Border Radius: 12px (rounded-xl)
- Padding: 16px

### Hover
- Shadow: `0 6px 24px rgba(0,0,0,0.06)`
- Border: Gray/200

### Critical Highlight
- **Quando**: `priority === 'alta'` AND `status === 'novo'`
- **Efeito**: Border left 3px, Red Alert/300 (#C8142C)

---

## Props Interface

```tsx
interface AlertCardProps {
  id: string;
  type: 'movement' | 'intrusion' | 'face' | 'crowd' | 'object';
  title: string;
  description: string;
  camera: string;
  time: string;        // HH:MM
  date: string;        // YYYY-MM-DD
  status: 'novo' | 'confirmado' | 'resolvido' | 'falso';
  priority: 'baixa' | 'media' | 'alta';
  icon: LucideIcon;
  hasVideo?: boolean;  // default: true
  location?: string;   // opcional
  actionBy?: {         // opcional, autor da última ação
    name: string;
    role: string;
  };
  onViewVideo?: (id: string) => void;
  onConfirm?: (id: string) => void;
  onResolve?: (id: string) => void;
}
```

---

## Responsividade

### Breakpoints
- **Desktop**: ≥768px → Layout horizontal com ações em coluna direita
- **Mobile**: <768px → Layout vertical com ações abaixo do conteúdo

### Ajustes Mobile
- Icon + Title no topo
- Status e Timestamp logo abaixo
- Meta Row com wrap habilitado
- Botões full-width com gap 8px

---

## Uso

### Importação
```tsx
import { AlertCard } from './AlertCard';
```

### Exemplo Básico
```tsx
<AlertCard
  id="alert-001"
  type="intrusion"
  title="Movimento após horário"
  description="Movimento detectado fora do horário escolar"
  camera="Câmera Pátio 01"
  time="18:45"
  date="2024-01-15"
  status="novo"
  priority="alta"
  icon={Ban}
  onViewVideo={(id) => console.log('View video', id)}
  onConfirm={(id) => console.log('Confirm', id)}
  onResolve={(id) => console.log('Resolve', id)}
/>
```

### Com Autor e Local
```tsx
<AlertCard
  id="alert-002"
  type="face"
  title="Pessoa não autorizada"
  description="Rosto não identificado detectado na entrada"
  camera="Câmera Entrada Principal"
  location="Portaria Norte"
  time="14:23"
  date="2024-01-15"
  status="confirmado"
  priority="media"
  icon={User}
  actionBy={{
    name: 'Ana Silva',
    role: 'Seg.'
  }}
  onViewVideo={(id) => handleViewVideo(id)}
  onConfirm={(id) => handleConfirm(id)}
  onResolve={(id) => handleResolve(id)}
/>
```

---

## Migração de Cards Antigos

### Antes (Card Antigo)
```tsx
<Card className="border-[var(--neutral-border)]">
  <CardContent className="p-4">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-[var(--neutral-subtle)] rounded-md">
        <AlertIcon className="h-6 w-6 text-[var(--neutral-icon)]" />
      </div>
      {/* ... resto do conteúdo ... */}
      <div className="flex flex-col gap-2">
        <Button variant="outline" onClick={...}>Ver Vídeo</Button>
        <Button className="bg-[var(--warning-bg)]">Confirmar</Button>
        <Button className="bg-[var(--success-bg)]">Resolver</Button>
      </div>
    </div>
  </CardContent>
</Card>
```

### Depois (AlertCard)
```tsx
<AlertCard
  {...alert}
  onViewVideo={handleViewVideo}
  onConfirm={handleConfirm}
  onResolve={handleResolve}
/>
```

---

## Tokens CSS Utilizados

```css
/* Cores de fundo dos botões */
--blue-primary-200: #2F5FFF      /* Ver Vídeo */
--orange-alert-400: #BA870B      /* Confirmar */
--green-alert-300: #47D238       /* Resolver */
--gray-200: #B3B4C1              /* Disabled */

/* Cores de fundo do ícone */
--red-alert-50: #FDC6C5
--turquoise-alert-50: #EBF6FF
--green-alert-50: #E6FFE6
--gray-50: #F6F6F6

/* Cores dos ícones */
--red-alert-400: #63000D
--turquoise-alert-400: #126AAF
--green-alert-400: #289726
--gray-400: #474748

/* Cores de texto */
--neutral-text: Black/300
--neutral-text-muted: Black/200

/* Borders */
--gray-100: (border padrão)
--gray-200: (border hover)
--red-alert-300: #C8142C (highlight crítico)
```

---

## Checklist de Implementação

- [x] Estrutura horizontal com 3 seções (Left/Middle/Right)
- [x] Ícone circular com background baseado no tipo
- [x] Header com título, status badge e timestamp
- [x] Descrição com tipografia correta
- [x] Meta row com câmera, local, autor, gravidade e tipo
- [x] Botões com texto branco (primary/warning/success)
- [x] Estado disabled para botão Resolver
- [x] Responsividade mobile com layout vertical
- [x] Hover states (shadow + border)
- [x] Critical highlight (border left vermelho)
- [x] Badges corretos (Status, Gravidade, Tipo, Timestamp)

---

**Versão**: 1.0  
**Data**: Janeiro 2025  
**Design System**: SegVision Light Mode
