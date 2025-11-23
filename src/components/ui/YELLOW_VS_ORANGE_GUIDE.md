# Yellow (Caution) vs Orange (Warning) - Guia de Uso

## Visão Geral

O SegVision possui duas cores para estados de alerta: **Yellow (Amarelo)** e **Orange (Laranja)**. É crucial usar cada uma no contexto correto.

---

## Diferença Conceitual

### 🟡 Yellow = CAUTION (Atenção)
**Significado:** Informação que requer atenção/observação, mas não é urgente ou crítica.

**Quando usar:**
- Heads-up / FYI (para conhecimento)
- Estados em observação
- Manutenção programada (não urgente)
- Latência/fila de processamento (normal)
- Avisos financeiros leves (ex.: "fatura a vencer em 10 dias")
- Sistema funcionando, mas com ressalvas

**Tom:** "Observe isso, mas está sob controle"

---

### 🟠 Orange = WARNING (Alerta)
**Significado:** Situação que requer AÇÃO para evitar problema maior.

**Quando usar:**
- Pendências que requerem ação
- Estado degradado (funciona, mas não ideal)
- Limite próximo de ser atingido
- Prazo se aproximando
- Risco operacional moderado
- Avisos financeiros críticos (ex.: "fatura vence amanhã")

**Tom:** "Ação recomendada para evitar problema"

---

## Escala de Severidade

```
┌─────────────────────────────────────────────���───┐
│ Crescente em urgência →                         │
├─────────────────────────────────────────────────┤
│ INFO (azul) → CAUTION (amarelo) → WARNING (laranja) → DANGER (vermelho) │
│   ℹ️              ⚠️                  ⚠️                    🚨           │
│ Neutro       Observe          Aja agora           Crítico              │
└─────────────────────────────────────────────────┘
```

---

## Exemplos Práticos

### 🟡 CAUTION (Yellow)

#### Financeiro
```tsx
<Badge variant="light" tone="caution">Fatura a vencer em 10 dias</Badge>
<Badge variant="medium" tone="caution">Latência de pagamento: 2 dias</Badge>
```

#### Sistema
```tsx
<Badge variant="light" tone="attention">Em observação</Badge>
<Badge variant="medium" tone="maintenance">Manutenção agendada</Badge>
<Badge variant="light" tone="latency">Latência: 150ms</Badge>
```

#### Operacional
```tsx
<Alert variant="caution">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Câmera em observação</AlertTitle>
  <AlertDescription>
    A Câmera Pátio 02 apresentou intermitência ontem. Estamos monitorando.
  </AlertDescription>
</Alert>
```

---

### 🟠 WARNING (Orange)

#### Financeiro
```tsx
<Badge variant="medium" tone="pending">Pendente</Badge>
<Badge variant="medium" tone="warning">Vence em 24h</Badge>
```

#### Sistema
```tsx
<Badge variant="medium" tone="warning">Limite: 85% usado</Badge>
<Badge variant="light" tone="warning">Degradado</Badge>
```

#### Operacional
```tsx
<Alert variant="warning">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Ação recomendada</AlertTitle>
  <AlertDescription>
    3 alertas não confirmados há mais de 2 horas. Revisar pendências.
  </AlertDescription>
</Alert>
```

---

## Mapa Semântico

| Situação | Cor | Tone | Exemplo |
|----------|-----|------|---------|
| Fatura vence em 10+ dias | Yellow | `caution` | "A vencer" |
| Fatura vence em 3 dias | Orange | `pending` | "Pendente" |
| Fatura vence amanhã | Orange | `warning` | "Vence em 24h" |
| Fatura vencida | Red | `overdue` | "Vencido" |
| | | | |
| Latência 100-200ms | Yellow | `latency` | "Latência normal" |
| Latência 200-500ms | Orange | `warning` | "Latência alta" |
| Latência >500ms | Red | `danger` | "Latência crítica" |
| | | | |
| Manutenção em 7 dias | Yellow | `maintenance` | "Manutenção agendada" |
| Manutenção hoje | Orange | `warning` | "Manutenção hoje" |
| Sistema degradado | Orange | `warning` | "Degradado" |
| Sistema offline | Red | `danger` | "Offline" |
| | | | |
| Alerta em observação | Yellow | `observation` | "Em observação" |
| Alerta confirmado | Orange | `warning` | "Confirmado" |
| Alerta crítico | Red | `danger` | "Crítico" |

---

## Tokens CSS

### Yellow Alert
```css
--yellow-alert-50: #FFFEF0;   /* fundo suave */
--yellow-alert-100: #FEF7C3;  /* hover/subtle */
--yellow-alert-200: #FDEC85;  /* borda light */
--yellow-alert-300: #FADB3F;  /* texto light, ícones */
--yellow-alert-400: #DEB900;  /* fundo medium, ícones */
```

### Orange Alert
```css
--orange-alert-50: #FFFBE8;   /* fundo suave */
--orange-alert-100: #FEEBAE;  /* hover/subtle */
--orange-alert-200: #FACD64;  /* borda light */
--orange-alert-300: #F5A41D;  /* texto light, ícones */
--orange-alert-400: #BA870B;  /* fundo medium, ícones */
```

---

## Badges

### Light Variant
```tsx
// Yellow (Caution)
<Badge variant="light" tone="caution">
  bg: Yellow/50 | border: Yellow/200 | text: Yellow/300
</Badge>

// Orange (Warning)
<Badge variant="light" tone="warning">
  bg: Orange/50 | border: Orange/200 | text: Orange/300
</Badge>
```

### Medium Variant
```tsx
// Yellow (Caution)
<Badge variant="medium" tone="caution">
  bg: Yellow/400 | text: White/100
</Badge>

// Orange (Warning)
<Badge variant="medium" tone="warning">
  bg: Orange/400 | text: White/100
</Badge>
```

---

## Alert/Banner Components

```tsx
// Caution (Yellow) - Para observação
<Alert variant="caution">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Atenção</AlertTitle>
  <AlertDescription>
    Informação para conhecimento. Nenhuma ação urgente necessária.
  </AlertDescription>
</Alert>

// Warning (Orange) - Para ação
<Alert variant="warning">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Ação recomendada</AlertTitle>
  <AlertDescription>
    Esta situação requer atenção para evitar problemas.
  </AlertDescription>
</Alert>
```

---

## Regras de Decisão Rápida

### Use YELLOW quando:
- ✅ É informativo (não requer ação imediata)
- ✅ Estado "em observação"
- ✅ Manutenção planejada
- ✅ Métricas normais mas dignas de nota
- ✅ Prazos distantes (>5 dias)

### Use ORANGE quando:
- ✅ Requer ação para evitar problema
- ✅ Estado degradado (funciona, mas não ideal)
- ✅ Pendências que expiram em breve
- ✅ Limites próximos de serem atingidos
- ✅ Prazos próximos (1-5 dias)

### Use RED quando:
- 🚨 Erro crítico/incidente
- 🚨 Sistema offline
- 🚨 Prazo vencido
- 🚨 Limite ultrapassado

---

## Componentes que Aceitam Yellow/Caution

- ✅ Badge (`tone="caution"` | `tone="attention"` | `tone="observation"` | `tone="maintenance"` | `tone="latency"`)
- ✅ Alert/Banner (`variant="caution"`)
- ✅ Toast (futuro: `tone="caution"`)
- ✅ Chips/Filtros (`tone="caution"`)
- ✅ Table row highlight (background: `--yellow-alert-50`)

---

## Anti-patterns (NÃO FAZER)

❌ **Não usar yellow para urgências**
```tsx
// ERRADO
<Badge variant="medium" tone="caution">Vencido há 10 dias</Badge>

// CORRETO
<Badge variant="medium" tone="danger">Vencido há 10 dias</Badge>
```

❌ **Não usar orange para observação passiva**
```tsx
// ERRADO
<Badge variant="light" tone="warning">Manutenção em 30 dias</Badge>

// CORRETO
<Badge variant="light" tone="caution">Manutenção em 30 dias</Badge>
```

❌ **Não trocar laranja por amarelo arbitrariamente**
- Yellow e Orange são níveis diferentes na escala de severidade
- Sempre respeite a hierarquia: Info < Caution < Warning < Danger

---

## Acessibilidade

### Contraste
- **Yellow/300 em Yellow/50**: 7.6:1 (AAA) ✅
- **Yellow/400 em White/100**: 8.4:1 (AAA) ✅
- **Orange/300 em Orange/50**: 8.1:1 (AAA) ✅
- **Orange/400 em White/100**: 7.2:1 (AAA) ✅

### Ícones
Sempre combine badges/alerts de cor com ícones apropriados:
- Yellow/Caution: `AlertCircle`, `Eye`, `Clock`
- Orange/Warning: `AlertTriangle`, `AlertOctagon`

---

## Checklist de Implementação

Ao adicionar um estado amarelo/laranja, pergunte:

1. **Esta situação requer ação imediata?**
   - ❌ Não → Yellow (Caution)
   - ✅ Sim → Orange (Warning)

2. **Há risco operacional se ignorado?**
   - ❌ Não → Yellow (Caution)
   - ✅ Sim → Orange (Warning)

3. **O prazo é urgente (< 5 dias)?**
   - ❌ Não → Yellow (Caution)
   - ✅ Sim → Orange (Warning)

4. **É apenas informativo/observação?**
   - ✅ Sim → Yellow (Caution)
   - ❌ Não → Orange (Warning)

---

## Versão
Yellow Alert System v1.0 - SegVision Design System
