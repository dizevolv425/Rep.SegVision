# Badge Color Reference - SegVision

## Quick Visual Reference

### HEAVY Variant (Alertas Críticos)
Fundo escuro + Texto branco - Máximo contraste

```
┌─────────────────────────────────────────────────────────────┐
│ HEAVY - Fundo escuro (300/400) + Texto branco               │
├─────────────────────────────────────────────────────────────┤
│ danger    │ #C8142C (Red 300)        │ White  │ Offline     │
│ success   │ #289726 (Green 400)      │ White  │ Online      │
│ info      │ #126AAF (Turquoise 400)  │ White  │ Info        │
│ caution   │ #DEB900 (Yellow 400)     │ White  │ Atenção     │
│ warning   │ #BA870B (Orange 400)     │ White  │ Risco       │
│ neutral   │ #7A7A88 (Gray 300)       │ White  │ Indefinido  │
└─────────────────────────────────────────────────────────────┘
```

### MEDIUM Variant (Status Intermediários)
Fundo médio + Texto escuro no tom - Contraste médio

```
┌─────────────────────────────────────────────────────────────┐
│ MEDIUM - Fundo médio (100/200) + Texto escuro (500/400)     │
├─────────────────────────────────────────────────────────────┤
│ danger    │ #F87E81 (Red 100)        │ #63000D │ Erro        │
│ success   │ #87E373 (Green 200)      │ #025D00 │ Ativo       │
│ info      │ #63BDF7 (Turquoise 200)  │ #126AAF │ Processando │
│ caution   │ #FDEC85 (Yellow 200)     │ #715700 │ Pendente    │
│ warning   │ #FACD64 (Orange 200)     │ #BA870B │ Risco Médio │
│ neutral   │ #B3B4C1 (Gray 200)       │ #474748 │ Suspenso    │
└─────────────────────────────────────────────────────────────┘
```

### LIGHT Variant (Tags e Categorias)
Fundo claro + Borda + Texto no tom - Contraste baixo

```
┌─────────────────────────────────────────────────────────────┐
│ LIGHT - Fundo claro (50) + Borda + Texto (300/400)          │
├─────────────────────────────────────────────────────────────┤
│ danger    │ #FDC6C5 │ #C8142C │ #C8142C │ Tag Danger        │
│ success   │ #E6FFE6 │ #289726 │ #289726 │ Tag Success       │
│ info      │ #EBF6FF │ #126AAF │ #126AAF │ Tag Info          │
│ caution   │ #FFFEF0 │ #DEB900 │ #DEB900 │ Tag Caution       │
│ warning   │ #FFFBE8 │ #BA870B │ #BA870B │ Tag Warning       │
│ neutral   │ #F6F6F6 │ #7A7A88 │ #7A7A88 │ Tag Neutral       │
│ primary   │ #96BDF6 │ #2F5FFF │ #161E53 │ Tag Primary       │
└─────────────────────────────────────────────────────────────┘
```

---

## Uso por Contexto

### 🔴 Câmeras/Dispositivos
```tsx
// SEMPRE usar HEAVY para status de conectividade
<Badge variant="heavy" tone="success">Online</Badge>   // Verde escuro + branco
<Badge variant="heavy" tone="danger">Offline</Badge>   // Vermelho escuro + branco
```

### 🔴 Alertas IA
```tsx
// Novo = crítico (HEAVY)
<Badge variant="heavy" tone="danger">Novo</Badge>      // Vermelho escuro + branco

// Verificado = em análise (MEDIUM amarelo)
<Badge variant="medium" tone="caution">Verificado</Badge>  // Amarelo médio + texto escuro

// Resolvido = concluído (MEDIUM)
<Badge variant="medium" tone="success">Resolvido</Badge>   // Verde médio + texto escuro
```

### 💰 Financeiro
```tsx
// Pago = confirmado (MEDIUM)
<Badge variant="medium" tone="paid">Pago</Badge>       // Verde #87E373 + texto #025D00

// Pendente = aguardando (MEDIUM amarelo)
<Badge variant="medium" tone="pending">Pendente</Badge>    // Amarelo #FDEC85 + texto #715700

// Vencido = crítico (HEAVY)
<Badge variant="heavy" tone="overdue">Vencido</Badge>  // Vermelho escuro + branco
```

### 🏷️ Tags e Categorias
```tsx
// SEMPRE usar LIGHT para metadados
<Badge variant="light" tone="primary">Plano Pro</Badge>    // Azul claro + borda + texto azul
<Badge variant="light" tone="neutral">Escola ABC</Badge>   // Cinza claro + borda + texto cinza
```

---

## Tabela de Decisão Rápida

| Contexto | Criticidade | Variant | Exemplo |
|----------|-------------|---------|---------|
| Offline | 🔴 Alta | `heavy` + `danger` | Vermelho escuro |
| Online | 🟢 Alta | `heavy` + `success` | Verde escuro |
| Vencido | 🔴 Alta | `heavy` + `overdue` | Vermelho escuro |
| Novo (alerta) | 🔴 Alta | `heavy` + `danger` | Vermelho escuro |
| Ativo | 🟢 Média | `medium` + `success` | Verde médio |
| Pendente | 🟡 Média | `medium` + `pending` | Amarelo médio |
| Verificado | 🟡 Média | `medium` + `caution` | Amarelo médio |
| Processando | 🔵 Média | `medium` + `processing` | Azul médio |
| Resolvido | 🟢 Média | `medium` + `resolved` | Verde médio |
| Suspenso | ⚪ Média | `medium` + `suspended` | Cinza médio |
| Tag/Categoria | ⚪ Baixa | `light` + qualquer tom | Claro + borda |

---

## ❌ Erros Comuns

1. ❌ `<Badge variant="medium" tone="danger">Offline</Badge>`  
   ✅ `<Badge variant="heavy" tone="danger">Offline</Badge>`

2. ❌ `<Badge variant="light" tone="pending">Pendente</Badge>`  
   ✅ `<Badge variant="medium" tone="pending">Pendente</Badge>`

3. ❌ `<Badge variant="heavy" tone="warning">Verificado</Badge>`  
   ✅ `<Badge variant="medium" tone="caution">Verificado</Badge>`

4. ❌ `<Badge variant="medium" tone="overdue">Vencido</Badge>`  
   ✅ `<Badge variant="heavy" tone="overdue">Vencido</Badge>`

5. ❌ `<Badge variant="medium" tone="primary">Plano Pro</Badge>`  
   ✅ `<Badge variant="light" tone="primary">Plano Pro</Badge>`

---

## 📊 Paleta Completa CSS

```css
/* Red Alert - Danger/Critical */
--red-alert-50: #FDC6C5;   /* LIGHT bg */
--red-alert-100: #F87E81;  /* MEDIUM bg */
--red-alert-200: #F03948;  /* Primária SegVision */
--red-alert-300: #C8142C;  /* HEAVY bg + LIGHT border/text */
--red-alert-400: #81131D;  /* MEDIUM text */

/* Green Alert - Success */
--green-alert-50: #E6FFE6;   /* LIGHT bg */
--green-alert-200: #87E373;  /* MEDIUM bg */
--green-alert-400: #289726;  /* HEAVY bg + MEDIUM text + LIGHT border/text */

/* Turquoise Alert - Info */
--turquoise-alert-50: #EBF6FF;   /* LIGHT bg */
--turquoise-alert-200: #63BDF7;  /* MEDIUM bg */
--turquoise-alert-400: #126AAF;  /* HEAVY bg + MEDIUM text + LIGHT border/text */

/* Yellow Alert - Caution (Pendente!) */
--yellow-alert-50: #FFFEF0;   /* LIGHT bg */
--yellow-alert-200: #FDEC85;  /* MEDIUM bg */
--yellow-alert-400: #DEB900;  /* HEAVY bg + MEDIUM text + LIGHT border/text */

/* Orange Alert - Warning */
--orange-alert-50: #FFFBE8;   /* LIGHT bg */
--orange-alert-200: #FACD64;  /* MEDIUM bg */
--orange-alert-400: #BA870B;  /* HEAVY bg + MEDIUM text + LIGHT border/text */

/* Gray - Neutral */
--gray-50: #F6F6F6;    /* LIGHT bg */
--gray-200: #B3B4C1;   /* MEDIUM bg */
--gray-300: #7A7A88;   /* HEAVY bg + LIGHT border/text */
--gray-400: #474748;   /* MEDIUM text */

/* Blue Primary */
--blue-primary-50: #96BDF6;   /* LIGHT bg */
--blue-primary-100: #54A2FA;  /* MEDIUM bg */
--blue-primary-200: #2F5FFF;  /* Primária SegVision + LIGHT border */
--blue-primary-300: #161E53;  /* HEAVY bg + LIGHT text */

/* White */
--white-100: #FAFAFA;  /* Texto em HEAVY variant */
```

---

**Regra de Ouro**: 
- HEAVY = Crítico (ação imediata)
- MEDIUM = Relevante (atenção)
- LIGHT = Informativo (categorização)

**Data**: Janeiro 2025  
**Versão**: 3.0
