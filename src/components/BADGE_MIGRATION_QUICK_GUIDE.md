# Badge Migration Quick Guide - v3.0

## 🚀 Guia Rápido de Migração

Para desenvolvedores que precisam atualizar badges antigas para o novo padrão v3.0.

---

## ⚡ Mudanças Rápidas

### Variantes Antigas → Novas

```tsx
// ❌ ANTES (variantes antigas que não existem mais)
<Badge variant="solid" tone="success">Ativo</Badge>
<Badge variant="soft" tone="neutral">Inativo</Badge>
<Badge variant="bordered" tone="primary">Tag</Badge>

// ✅ AGORA (3 variantes corretas)
<Badge variant="heavy" tone="success">Online</Badge>    // Crítico
<Badge variant="medium" tone="success">Ativo</Badge>   // Intermediário
<Badge variant="light" tone="primary">Tag</Badge>      // Categorização
```

---

## 📋 Cheat Sheet - Decisão Rápida

| Se você precisa de... | Use... | Exemplo |
|----------------------|--------|---------|
| Status CRÍTICO (Online/Offline) | `heavy` | `<Badge variant="heavy" tone="danger">Offline</Badge>` |
| Alerta NÃO VISTO | `heavy` | `<Badge variant="heavy" tone="danger">Novo</Badge>` |
| Pagamento VENCIDO | `heavy` | `<Badge variant="heavy" tone="overdue">Vencido</Badge>` |
| Status PADRÃO (Ativo/Pendente) | `medium` | `<Badge variant="medium" tone="success">Ativo</Badge>` |
| Alerta EM ANÁLISE | `medium` | `<Badge variant="medium" tone="caution">Verificado</Badge>` |
| Pagamento CONFIRMADO | `medium` | `<Badge variant="medium" tone="paid">Pago</Badge>` |
| TAG de plano/tipo | `light` | `<Badge variant="light" tone="primary">Pro</Badge>` |
| CATEGORIA | `light` | `<Badge variant="light" tone="neutral">Escola ABC</Badge>` |
| CONTADOR | `light` | `<Badge variant="light" tone="neutral">5</Badge>` |

---

## 🔄 Padrões de Substituição

### 1. Status de Conectividade

```tsx
// ❌ ANTES
<Badge variant="medium" tone={status === 'online' ? 'success' : 'danger'}>
  {status === 'online' ? 'Online' : 'Offline'}
</Badge>

// ✅ AGORA
<Badge variant="heavy" tone={status === 'online' ? 'success' : 'danger'}>
  {status === 'online' ? 'Online' : 'Offline'}
</Badge>
```

### 2. Alertas IA

```tsx
// ❌ ANTES
<Badge variant="medium" tone={
  alert.status === 'novo' ? 'danger' :
  alert.status === 'verificado' ? 'warning' :
  'success'
}>
  {alert.status}
</Badge>

// ✅ AGORA
<Badge 
  variant={alert.status === 'novo' ? 'heavy' : 'medium'}
  tone={
    alert.status === 'novo' ? 'danger' :
    alert.status === 'verificado' ? 'caution' :  // Não 'warning'!
    'success'
  }
>
  {alert.status}
</Badge>
```

### 3. Status Financeiro

```tsx
// ❌ ANTES
<Badge variant="light" tone={status === 'pago' ? 'paid' : 'pending'}>
  {status}
</Badge>

// ✅ AGORA
<Badge variant="medium" tone={status === 'pago' ? 'paid' : 'pending'}>
  {status}
</Badge>

// ⚠️ IMPORTANTE: Vencido é HEAVY!
<Badge variant="heavy" tone="overdue">Vencido</Badge>
```

### 4. Tags e Categorias

```tsx
// ✅ JÁ ESTÁ CORRETO (light para tags)
<Badge variant="light" tone="primary" size="s">Plano Pro</Badge>
<Badge variant="light" tone="neutral" size="s">Escola</Badge>

// Features de câmera
<Badge variant="light" tone="primary" size="s">IA</Badge>
<Badge variant="light" tone="primary" size="s">RF</Badge>
```

---

## 🎯 Casos de Uso Específicos

### Dashboard - Alertas

```tsx
const renderAlertBadge = (status: string) => {
  if (status === 'novo') {
    return <Badge variant="heavy" tone="danger">Novo</Badge>;
  }
  if (status === 'verificado') {
    return <Badge variant="medium" tone="caution">Verificado</Badge>;
  }
  return <Badge variant="medium" tone="success">Resolvido</Badge>;
};
```

### Câmeras - Status + Features

```tsx
// Status de conectividade (HEAVY)
<Badge variant="heavy" tone={camera.status === 'online' ? 'success' : 'danger'} size="s">
  {camera.status === 'online' ? 'Online' : 'Offline'}
</Badge>

// Features (LIGHT)
{camera.aiEnabled && <Badge variant="light" tone="primary" size="s">IA</Badge>}
{camera.facialRecognition && <Badge variant="light" tone="primary" size="s">RF</Badge>}
```

### Admin - Status de Escola

```tsx
const getSchoolStatusBadge = (status: string) => {
  const config = {
    active: { variant: 'medium' as const, tone: 'success' as const, label: 'Ativa' },
    inactive: { variant: 'light' as const, tone: 'neutral' as const, label: 'Inativa' },
    pending: { variant: 'light' as const, tone: 'pending' as const, label: 'Pendente' }
  };
  const { variant, tone, label } = config[status];
  return <Badge variant={variant} tone={tone} size="s">{label}</Badge>;
};
```

### Operador - Central de Eventos

```tsx
const getEventBadge = (priority: string) => {
  if (priority === 'urgente' || priority === 'crítico') {
    return <Badge variant="heavy" tone="danger">Urgente</Badge>;
  }
  if (priority === 'alta') {
    return <Badge variant="medium" tone="warning">Alta</Badge>;
  }
  return <Badge variant="light" tone="info">Normal</Badge>;
};
```

---

## ⚠️ Armadilhas Comuns

### 1. Pendente = Amarelo, NÃO Laranja!

```tsx
// ❌ ERRADO
<Badge variant="medium" tone="warning">Pendente</Badge>  // Laranja

// ✅ CORRETO
<Badge variant="medium" tone="pending">Pendente</Badge>  // Amarelo
// OU
<Badge variant="medium" tone="caution">Pendente</Badge>  // Amarelo
```

### 2. Offline Sempre HEAVY

```tsx
// ❌ ERRADO
<Badge variant="medium" tone="danger">Offline</Badge>

// ✅ CORRETO
<Badge variant="heavy" tone="danger">Offline</Badge>
```

### 3. Vencido Sempre HEAVY

```tsx
// ❌ ERRADO
<Badge variant="medium" tone="overdue">Vencido</Badge>

// ✅ CORRETO
<Badge variant="heavy" tone="overdue">Vencido</Badge>
```

### 4. Tags Sempre LIGHT

```tsx
// ❌ ERRADO
<Badge variant="medium" tone="primary">Plano Pro</Badge>

// ✅ CORRETO
<Badge variant="light" tone="primary">Plano Pro</Badge>
```

---

## 🔍 Como Encontrar Badges Antigas

### Buscar no Código

```bash
# Procurar variantes antigas que não existem mais
grep -r "variant=\"solid\"" components/
grep -r "variant=\"soft\"" components/
grep -r "variant=\"bordered\"" components/

# Procurar badges em componentes específicos
grep -r "<Badge" components/DashboardScreen.tsx
grep -r "<Badge" components/CamerasScreen.tsx
grep -r "<Badge" components/FinanceScreen.tsx
```

### Validar Uso Correto

```bash
# Verificar se Offline usa heavy
grep -r "Offline" components/ | grep "Badge"

# Verificar se Pendente usa medium (não light)
grep -r "Pendente" components/ | grep "Badge"

# Verificar se tags usam light
grep -r "variant=\"light\"" components/
```

---

## ✅ Checklist de Migração

Por componente, verificar:

- [ ] Offline/Online usam `variant="heavy"`
- [ ] Novo alerta usa `variant="heavy"`
- [ ] Vencido usa `variant="heavy"`
- [ ] Ativo/Pendente/Resolvido usam `variant="medium"`
- [ ] Verificado usa `variant="medium" tone="caution"` (amarelo!)
- [ ] Tags de plano/tipo usam `variant="light"`
- [ ] Categorias usam `variant="light"`
- [ ] Contadores usam `variant="light"`
- [ ] Nenhuma badge usa variantes antigas (solid, soft, bordered)
- [ ] Pendente usa `tone="pending"` ou `tone="caution"` (amarelo, não warning/laranja)

---

## 📚 Referências Rápidas

### Props Interface

```tsx
interface BadgeProps {
  variant: 'heavy' | 'medium' | 'light';
  tone: 
    // Core
    | 'danger' | 'success' | 'info' | 'caution' | 'warning' | 'neutral' | 'primary'
    // Semantic
    | 'paid' | 'pending' | 'overdue' | 'active' | 'new' | 'processing'
    | 'open' | 'in_review' | 'resolved' | 'connected' | 'disconnected'
    | 'suspended' | 'canceled' | 'failure' | 'testing';
  size?: 's' | 'm' | 'l';
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}
```

### Semantic Tone Mapping

| Tone Semântico | Mapeia Para | Cor Final |
|----------------|-------------|-----------|
| `paid` | `success` | Verde |
| `pending` | `caution` | Amarelo |
| `overdue` | `danger` | Vermelho |
| `active` | `success` | Verde |
| `new` | `danger` | Vermelho |
| `open` | `danger` | Vermelho |
| `in_review` | `info` | Azul turquesa |
| `resolved` | `success` | Verde |
| `connected` | `success` | Verde |
| `disconnected` | `neutral` | Cinza |
| `processing` | `info` | Azul turquesa |
| `suspended` | `neutral` | Cinza |
| `canceled` | `danger` | Vermelho |
| `failure` | `danger` | Vermelho |
| `testing` | `info` | Azul turquesa |

---

## 🛠️ Ferramentas de Validação

### Teste Visual
Acesse `/badge-visual-test` para validar visualmente:
- Cores corretas
- Tamanhos corretos
- Variantes corretas

### Showcase
Acesse `/badge-showcase` para ver:
- Todas as variantes
- Exemplos de uso
- Guia de decisão

---

## 📞 Suporte

- **Documentação Completa**: `/components/ui/BADGE_DOCUMENTATION.md`
- **Especificação Figma**: `/components/ui/BADGE_FIGMA_SPEC.md`
- **Referência de Cores**: `/components/ui/BADGE_COLOR_REFERENCE.md`
- **Uso por Jornada**: `/components/BADGE_USAGE_BY_JOURNEY.md`
- **Resumo do Sistema**: `/components/BADGE_SYSTEM_V3_SUMMARY.md`

---

**Última atualização**: Janeiro 2025  
**Versão**: 3.0  
**Status**: ✅ Production Ready
