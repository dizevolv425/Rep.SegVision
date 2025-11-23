# Badge Component - SegVision Design System

## Visão Geral

O componente Badge do SegVision possui **3 variantes** com diferentes pesos visuais para diferentes contextos:

- **HEAVY**: Fundo escuro + texto branco (máximo contraste) - Para alertas críticos
- **MEDIUM**: Fundo médio + texto escuro no tom (contraste médio) - Para status intermediários
- **LIGHT**: Fundo claro + borda + texto no tom (contraste baixo) - Para categorização

---

## Especificação de Tokens

### Tamanhos

| Size | Height | Radius | PaddingX | Text | Icon |
|------|--------|--------|----------|------|------|
| `s`  | 18px   | 9px    | 12px     | 11px | 12px |
| `m`  | 22px   | 11px   | 12px     | 12px | 14px |
| `l`  | 26px   | 13px   | 12px     | 13px | 16px |

### Variante HEAVY (Alertas Críticos)

**Uso**: Alertas urgentes, status críticos que exigem ação imediata  
**Padrão**: Fundo escuro (tons 300/400) + Texto branco

| Tone      | Background          | Text        | Uso                    |
|-----------|---------------------|-------------|------------------------|
| danger    | Red Alert/300       | White/100   | Offline, Erro, Vencido |
| success   | Green Alert/400     | White/100   | Online, Conectado      |
| info      | Turquoise Alert/400 | White/100   | Info crítica           |
| caution   | Yellow Alert/400    | White/100   | Atenção urgente        |
| warning   | Orange Alert/400    | White/100   | Risco alto             |
| neutral   | Gray/300            | White/100   | Indefinido crítico     |

### Variante MEDIUM (Status Intermediários)

**Uso**: Status do sistema que precisam visibilidade mas não são críticos  
**Padrão**: Fundo médio (tons 100/200) + Texto escuro no tom (tom 400)

| Tone      | Background          | Text                | Uso                    |
|-----------|---------------------|---------------------|------------------------|
| danger    | Red Alert/100       | Red Alert/400       | Falhas não críticas    |
| success   | Green Alert/200     | Green Alert/500     | Ativo, Resolvido       |
| info      | Turquoise Alert/200 | Turquoise Alert/400 | Processando, Em análise|
| caution   | Yellow Alert/200    | Yellow Alert/500    | Pendente, Obs. padrão  |
| warning   | Orange Alert/200    | Orange Alert/400    | Risco médio            |
| neutral   | Gray/200            | Gray/400            | Suspenso, Inativo      |

### Variante LIGHT (Categorização)

**Uso**: Tags, categorias, metadados, informações de baixa prioridade  
**Padrão**: Fundo claro (tons 50) + Borda (tons 300/400) + Texto no tom (tons 300/400)

| Tone       | Background         | Border             | Text               |
|------------|--------------------|--------------------|-------------------|
| danger     | Red Alert/50       | Red Alert/300      | Red Alert/300     |
| success    | Green Alert/50     | Green Alert/400    | Green Alert/400   |
| info       | Turquoise Alert/50 | Turquoise Alert/400| Turquoise Alert/400|
| caution    | Yellow Alert/50    | Yellow Alert/400   | Yellow Alert/400  |
| warning    | Orange Alert/50    | Orange Alert/400   | Orange Alert/400  |
| neutral    | Gray/50            | Gray/300           | Gray/300          |
| primary    | Blue Primary/50    | Blue Primary/200   | Blue Primary/300  |

---

## Mapeamento Semântico

### Status de Câmeras/Dispositivos
```tsx
// Online - crítico, usa HEAVY
<Badge variant="heavy" tone="success" size="s">Online</Badge>

// Offline - crítico, usa HEAVY com vermelho
<Badge variant="heavy" tone="danger" size="s">Offline</Badge>
```

### Status de Alertas IA
```tsx
// Novo - crítico, não visualizado
<Badge variant="heavy" tone="danger" size="s">Novo</Badge>

// Verificado - em análise, médio
<Badge variant="medium" tone="caution" size="s">Verificado</Badge>

// Resolvido - concluído, médio
<Badge variant="medium" tone="success" size="s">Resolvido</Badge>
```

### Status Financeiro
```tsx
// Pago - confirmado, médio
<Badge variant="medium" tone="paid" size="s">Pago</Badge>

// Pendente - aguardando, médio
<Badge variant="medium" tone="pending" size="s">Pendente</Badge>

// Vencido - crítico!
<Badge variant="heavy" tone="overdue" size="s">Vencido</Badge>
```

### Tags e Categorias
```tsx
// Usa sempre LIGHT
<Badge variant="light" tone="primary" size="s">Plano Pro</Badge>
<Badge variant="light" tone="neutral" size="s">Escola ABC</Badge>
```

---

## Exemplos de Uso

### Importação
```tsx
import { Badge } from './components/ui/badge';
```

### Status Críticos (HEAVY)
```tsx
// Máximo contraste para alertas urgentes
<Badge variant="heavy" tone="danger" size="m">Erro Crítico</Badge>
<Badge variant="heavy" tone="success" size="m">Online</Badge>
<Badge variant="heavy" tone="overdue" size="s">Vencido</Badge>
```

### Status Intermediários (MEDIUM)
```tsx
// Contraste médio para status padrão
<Badge variant="medium" tone="success" size="s">Ativo</Badge>
<Badge variant="medium" tone="pending" size="s">Pendente</Badge>
<Badge variant="medium" tone="processing" size="m">Processando</Badge>
```

### Tags e Categorias (LIGHT)
```tsx
// Contraste baixo para metadados
<Badge variant="light" tone="primary" size="s">Plano Pro</Badge>
<Badge variant="light" tone="neutral" size="s">Tag</Badge>
```

### Com Ícones
```tsx
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

<Badge variant="heavy" tone="success" size="m" icon={<CheckCircle />}>
  Online
</Badge>

<Badge variant="heavy" tone="danger" size="m" icon={<XCircle />}>
  Offline
</Badge>

<Badge variant="medium" tone="pending" size="s" icon={<Clock />}>
  Pendente
</Badge>
```

---

## Diretrizes de Uso

### ✅ Quando usar HEAVY
- Alertas críticos (Offline, Erro fatal, Vencido)
- Status que exigem ação imediata
- Qualquer informação de máxima prioridade
- Contextos onde é essencial chamar atenção

### ✅ Quando usar MEDIUM  
- Status padrão do sistema (Ativo, Processando, Pendente)
- Informações relevantes mas não urgentes
- Estados intermediários (Verificado, Em análise)
- Feedback de operações em andamento

### ✅ Quando usar LIGHT
- Tags de categorização (Planos, Tipos)
- Metadados (Escola, Turma, Grupo)
- Filtros e labels
- Qualquer informação de baixa prioridade visual

---

## Estados Interativos

### HEAVY
- **hover**: cores mantidas
- **active/press**: opacity 96%
- **disabled**: bg Gray/50, text Gray/300

### MEDIUM
- **hover**: cores mantidas
- **active/press**: opacity 96%
- **disabled**: bg Gray/50, text Gray/300

### LIGHT
- **hover**: cores mantidas
- **active/press**: opacity 96%
- **disabled**: bg Gray/50, border Gray/100, text Gray/300

---

## Props

```tsx
interface BadgeProps {
  variant: 'heavy' | 'medium' | 'light';
  tone: 
    // Core
    | 'primary' | 'success' | 'caution' | 'warning' | 'danger' | 'info' | 'neutral'
    // Aliases
    | 'yellow' 
    // Semantic
    | 'paid' | 'pending' | 'overdue' | 'active' | 'suspended' | 'canceled'
    | 'processing' | 'new' | 'open' | 'in_review' | 'resolved' 
    | 'connected' | 'disconnected' | 'failure' | 'testing'
    | 'attention' | 'observation' | 'maintenance' | 'latency';
  size?: 's' | 'm' | 'l';              // Padrão: 'm'
  icon?: React.ReactNode;               // Ícone opcional
  asChild?: boolean;                    // Usar Slot do Radix UI
  className?: string;                   // Classes adicionais
  children: React.ReactNode;            // Conteúdo do badge
}
```

---

## Tokens CSS

As variáveis CSS estão definidas em `/styles/globals.css`:

```css
/* Alert Palettes */
--red-alert-50: #FDC6C5;
--red-alert-100: #F87E81;
--red-alert-200: #F03948;
--red-alert-300: #C8142C;
--red-alert-400: #63000D;

--green-alert-50: #E6FFE6;
--green-alert-200: #87E373;
--green-alert-400: #289726;
--green-alert-500: #025D00;

--turquoise-alert-50: #EBF6FF;
--turquoise-alert-200: #63BDF7;
--turquoise-alert-400: #126AAF;

--yellow-alert-50: #FFFEF0;
--yellow-alert-200: #FDEC85;
--yellow-alert-400: #DEB900;
--yellow-alert-500: #715700;

--orange-alert-50: #FFFBE8;
--orange-alert-200: #FACD64;
--orange-alert-400: #BA870B;

/* Neutrals */
--gray-50: #F6F6F6;
--gray-200: #B3B4C1;
--gray-300: #7A7A88;
--gray-400: #474748;

--white-100: #FAFAFA;
```

---

## Regras Importantes

1. **HEAVY sempre com texto branco** - Não há exceções
2. **MEDIUM sempre com texto escuro no tom** - Fundo claro/médio
3. **LIGHT sempre com borda** - Fundo muito claro + borda + texto no tom
4. **Offline sempre usa HEAVY + danger** - Vermelho crítico
5. **Online sempre usa HEAVY + success** - Verde crítico
6. **Vencido sempre usa HEAVY + danger** - Vermelho crítico
7. **Pendente usa MEDIUM + caution** - Amarelo (yellow), não laranja!
8. **Ícones herdam cor do texto** - Configuração automática
9. **Tipografia**: Inter Medium 11px/12px/13px conforme tamanho

---

**Design System**: SegVision Light Mode  
**Versão**: 3.0 - Aligned with Figma  
**Data**: Janeiro 2025  
**Fonte**: Inter (Google Fonts)
