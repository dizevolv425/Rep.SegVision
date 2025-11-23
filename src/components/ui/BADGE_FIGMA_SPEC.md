# Badge Component - SegVision Figma Design Specification

## Visão Geral

O componente Badge do SegVision possui **3 variantes** com pesos visuais diferentes para diferentes contextos de uso:

- **HEAVY**: Máximo contraste (fundo escuro + texto branco) - Alertas críticos e status urgentes
- **MEDIUM**: Contraste médio (fundo claro + texto escuro no tom) - Status intermediários  
- **LIGHT**: Contraste baixo (fundo muito claro + borda + texto no tom) - Categorização e tags

---

## Especificação Completa

### Dimensões Fixas
| Size | Height | Radius | PaddingX | Text | Icon |
|------|--------|--------|----------|------|------|
| `s`  | 18px   | 9px    | 12px     | 11px | 12px |
| `m`  | 22px   | 11px   | 12px     | 12px | 14px |
| `l`  | 26px   | 13px   | 12px     | 13px | 16px |

---

## Variante HEAVY (Alertas Críticos)

**Uso**: Alertas urgentes, status críticos que exigem máxima atenção visual
**Padrão**: Fundo escuro (tons 300/400) + Texto branco

| Tone    | Background Token        | Hex Color | Text       |
|---------|------------------------|-----------|------------|
| danger  | --red-alert-300        | #C8142C   | White/100  |
| success | --green-alert-400      | #289726   | White/100  |
| info    | --turquoise-alert-400  | #126AAF   | White/100  |
| caution | --yellow-alert-400     | #DEB900   | White/100  |
| neutral | --gray-300             | #7A7A88   | White/100  |

**Exemplo de Uso**:
```tsx
<Badge variant="heavy" tone="danger">Offline</Badge>
<Badge variant="heavy" tone="success">Online</Badge>
```

---

## Variante MEDIUM (Status Intermediários)

**Uso**: Status do sistema que precisam de visibilidade mas não são críticos
**Padrão**: Fundo médio (tons 100/200) + Texto escuro no tom

| Tone    | Background Token       | Hex Color | Text Token             | Text Hex  |
|---------|------------------------|-----------|------------------------|-----------|
| danger  | --red-alert-100        | #F87E81   | --red-alert-400        | #63000D   |
| success | --green-alert-200      | #87E373   | --green-alert-500      | #025D00   |
| info    | --turquoise-alert-200  | #63BDF7   | --turquoise-alert-400  | #126AAF   |
| caution | --yellow-alert-200     | #FDEC85   | --yellow-alert-500     | #715700   |
| neutral | --gray-200             | #B3B4C1   | --gray-400             | #474748   |

**Exemplo de Uso**:
```tsx
<Badge variant="medium" tone="success">Ativo</Badge>
<Badge variant="medium" tone="danger">Erro</Badge>
```

---

## Variante LIGHT (Categorização)

**Uso**: Tags, categorias, metadados, informações de baixa prioridade
**Padrão**: Fundo claro (tons 50) + Borda (tons 300/400) + Texto no tom (tons 300/400)

| Tone    | Background Token       | Border Token           | Text Token             |
|---------|------------------------|------------------------|------------------------|
| danger  | --red-alert-50         | --red-alert-300        | --red-alert-300        |
| success | --green-alert-50       | --green-alert-400      | --green-alert-400      |
| info    | --turquoise-alert-50   | --turquoise-alert-400  | --turquoise-alert-400  |
| caution | --yellow-alert-50      | --yellow-alert-400     | --yellow-alert-400     |
| neutral | --gray-50              | --gray-300             | --gray-300             |

**Exemplo de Uso**:
```tsx
<Badge variant="light" tone="success">Plano Pro</Badge>
<Badge variant="light" tone="neutral">Tag</Badge>
```

---

## Mapeamento Semântico

### Status de Sistema
| Status        | Variant | Tone    | Uso                              |
|---------------|---------|---------|----------------------------------|
| Online        | heavy   | success | Câmeras/dispositivos conectados  |
| Offline       | heavy   | danger  | Câmeras/dispositivos desconectados|
| Ativo         | medium  | success | Serviços/contas ativas           |
| Inativo       | medium  | neutral | Serviços/contas desativadas      |
| Erro          | heavy   | danger  | Falhas críticas                  |
| Atenção       | medium  | caution | Requer observação                |
| Processando   | medium  | info    | Em andamento                     |

### Status Financeiro
| Status        | Variant | Tone    | Uso                              |
|---------------|---------|---------|----------------------------------|
| Pago          | medium  | success | Pagamentos confirmados           |
| Pendente      | medium  | caution | Aguardando pagamento             |
| Vencido       | heavy   | danger  | Pagamentos atrasados (crítico)   |

### Alertas IA
| Status        | Variant | Tone    | Uso                              |
|---------------|---------|---------|----------------------------------|
| Novo          | heavy   | danger  | Alerta não visualizado           |
| Verificado    | medium  | caution | Alerta em análise                |
| Resolvido     | medium  | success | Alerta concluído                 |

---

## Diretrizes de Uso

### ✅ Quando usar HEAVY
- Alertas críticos que exigem ação imediata
- Status de "Offline", "Erro", "Vencido"
- Qualquer informação urgente que precise chamar atenção

### ✅ Quando usar MEDIUM  
- Status do sistema de prioridade média
- "Ativo", "Processando", "Pendente"
- Informações relevantes mas não urgentes

### ✅ Quando usar LIGHT
- Tags e categorias
- Metadados (planos, tipos, grupos)
- Filtros e labels
- Qualquer informação de baixa prioridade

---

## Implementação

```tsx
import { Badge } from './components/ui/badge';

// Heavy - Máximo contraste
<Badge variant="heavy" tone="danger" size="m">Offline</Badge>

// Medium - Contraste médio
<Badge variant="medium" tone="success" size="s">Ativo</Badge>

// Light - Contraste baixo
<Badge variant="light" tone="neutral" size="s">Tag</Badge>
```

---

## Props Interface

```tsx
interface BadgeProps {
  variant: 'heavy' | 'medium' | 'light';
  tone: 'danger' | 'success' | 'info' | 'caution' | 'neutral' | 'primary' | 'warning'
        // Semantic aliases
        | 'paid' | 'pending' | 'overdue' | 'active' | 'new' | 'processing'
        | 'open' | 'in_review' | 'resolved' | 'connected' | 'disconnected'
        | 'suspended' | 'canceled' | 'failure' | 'testing';
  size?: 's' | 'm' | 'l';
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}
```

---

**Design System**: SegVision Light Mode  
**Versão**: 3.0  
**Data**: Janeiro 2025  
**Fonte**: Inter (Google Fonts)
