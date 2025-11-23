# Badge System v3.0 - Documentation Index

## 📖 Índice Completo da Documentação

Guia de navegação para toda a documentação do sistema de badges SegVision v3.0.

---

## 🚀 Para Começar Rapidamente

### Novo no Sistema?
1. **Leia primeiro**: [BADGE_DOCUMENTATION.md](/components/ui/BADGE_DOCUMENTATION.md)
2. **Veja exemplos**: Acesse `/badge-showcase` no app
3. **Guia rápido**: [BADGE_MIGRATION_QUICK_GUIDE.md](/components/BADGE_MIGRATION_QUICK_GUIDE.md)

### Migrando código antigo?
- **Guia de Migração**: [BADGE_MIGRATION_QUICK_GUIDE.md](/components/BADGE_MIGRATION_QUICK_GUIDE.md)
- **Cheat Sheet**: Seção "⚡ Mudanças Rápidas" no guia de migração

### Implementando nova feature?
- **Uso por Jornada**: [BADGE_USAGE_BY_JOURNEY.md](/components/BADGE_USAGE_BY_JOURNEY.md)
- **Referência de Cores**: [BADGE_COLOR_REFERENCE.md](/components/ui/BADGE_COLOR_REFERENCE.md)

---

## 📚 Documentação Por Tipo

### 1. Documentação Técnica

#### [BADGE_DOCUMENTATION.md](/components/ui/BADGE_DOCUMENTATION.md)
**Para**: Desenvolvedores que precisam entender o sistema completo  
**Conteúdo**:
- Especificação de tamanhos e tokens
- Todas as 3 variantes (HEAVY, MEDIUM, LIGHT)
- Mapeamento semântico completo
- Exemplos de uso com código
- Diretrizes de quando usar cada variante
- Props interface

#### [BADGE_FIGMA_SPEC.md](/components/ui/BADGE_FIGMA_SPEC.md)
**Para**: Designers e desenvolvedores que precisam validar contra o Figma  
**Conteúdo**:
- Dimensões exatas do Figma
- Especificação de cores por variante
- Mapeamento de tokens CSS
- Tabelas de uso por status
- Props detalhadas

---

### 2. Referências Visuais

#### [BADGE_COLOR_REFERENCE.md](/components/ui/BADGE_COLOR_REFERENCE.md)
**Para**: Consulta rápida de cores e padrões  
**Conteúdo**:
- Tabelas visuais de cores
- Uso por contexto (Online/Offline, Alertas, etc.)
- Erros comuns vs. correto
- Paleta CSS completa com hexadecimais
- Tabela de decisão rápida

#### [BadgeShowcase.tsx](/components/BadgeShowcase.tsx)
**Para**: Visualização interativa no app  
**Como acessar**: Rota `/badge-showcase`  
**Conteúdo**:
- Todas as variantes e tamanhos
- Casos de uso reais
- Guia de decisão interativo
- Paleta de cores visual

#### [BadgeVisualTest.tsx](/components/BadgeVisualTest.tsx)
**Para**: Validação visual e QA  
**Como acessar**: Rota `/badge-visual-test`  
**Conteúdo**:
- Testes visuais de todas as variantes
- Checklist de inspeção
- Casos críticos de uso
- Validação de cores

---

### 3. Guias de Uso

#### [BADGE_USAGE_BY_JOURNEY.md](/components/BADGE_USAGE_BY_JOURNEY.md)
**Para**: Implementar badges em contextos específicos  
**Conteúdo**:
- Padrões por jornada (Escola, Admin, Operador)
- Badges por tela (Dashboard, Câmeras, Financeiro, etc.)
- Tabelas de uso obrigatório
- Exemplos de implementação por contexto
- Checklist de validação

#### [BADGE_MIGRATION_QUICK_GUIDE.md](/components/BADGE_MIGRATION_QUICK_GUIDE.md)
**Para**: Migrar código antigo para v3.0  
**Conteúdo**:
- Cheat sheet de decisão rápida
- Padrões de substituição
- Casos de uso específicos
- Armadilhas comuns
- Ferramentas de validação
- Checklist de migração

---

### 4. Resumo Executivo

#### [BADGE_SYSTEM_V3_SUMMARY.md](/components/BADGE_SYSTEM_V3_SUMMARY.md)
**Para**: Entender todas as mudanças implementadas  
**Conteúdo**:
- Objetivo do v3.0
- Todas as mudanças implementadas
- Arquivos modificados e criados
- Regras críticas (Top 10)
- Paleta completa de cores
- Checklist de validação
- Próximos passos

---

## 🎯 Fluxos de Trabalho

### Cenário 1: "Preciso implementar uma nova tela"

1. Consulte [BADGE_USAGE_BY_JOURNEY.md](/components/BADGE_USAGE_BY_JOURNEY.md)
2. Encontre a jornada correspondente (Escola/Admin/Operador)
3. Veja os padrões obrigatórios para aquela tela
4. Use o [BadgeShowcase](/badge-showcase) para visualizar
5. Implemente seguindo os exemplos

### Cenário 2: "Encontrei um badge antigo no código"

1. Abra [BADGE_MIGRATION_QUICK_GUIDE.md](/components/BADGE_MIGRATION_QUICK_GUIDE.md)
2. Procure o "Padrão de Substituição" correspondente
3. Aplique a correção
4. Valide no [BadgeVisualTest](/badge-visual-test)

### Cenário 3: "Não sei qual variante usar"

1. Use a tabela de decisão em [BADGE_COLOR_REFERENCE.md](/components/ui/BADGE_COLOR_REFERENCE.md)
2. Ou consulte o "Guia de Decisão" em [BADGE_DOCUMENTATION.md](/components/ui/BADGE_DOCUMENTATION.md)
3. Valide visualmente no [BadgeShowcase](/badge-showcase)

### Cenário 4: "Preciso saber a cor exata de um badge"

1. Consulte [BADGE_COLOR_REFERENCE.md](/components/ui/BADGE_COLOR_REFERENCE.md)
2. Ou veja [BADGE_FIGMA_SPEC.md](/components/ui/BADGE_FIGMA_SPEC.md)
3. Ou use DevTools no [BadgeShowcase](/badge-showcase)

### Cenário 5: "Preciso validar se está correto"

1. Acesse [BadgeVisualTest](/badge-visual-test)
2. Siga o checklist de inspeção visual
3. Verifique as cores e variantes
4. Valide casos críticos

---

## 🔗 Links Rápidos

### Documentação
- [Badge Documentation](/components/ui/BADGE_DOCUMENTATION.md)
- [Figma Spec](/components/ui/BADGE_FIGMA_SPEC.md)
- [Color Reference](/components/ui/BADGE_COLOR_REFERENCE.md)
- [Usage by Journey](/components/BADGE_USAGE_BY_JOURNEY.md)
- [Migration Guide](/components/BADGE_MIGRATION_QUICK_GUIDE.md)
- [System Summary](/components/BADGE_SYSTEM_V3_SUMMARY.md)

### Componentes
- [Badge Component](/components/ui/badge.tsx)
- [Badge Showcase](/components/BadgeShowcase.tsx)
- [Badge Visual Test](/components/BadgeVisualTest.tsx)

### Rotas do App
- Showcase: `/badge-showcase`
- Visual Test: `/badge-visual-test`

### Guidelines
- [Guidelines Gerais](/guidelines/Guidelines.md)

---

## 📊 Estrutura de Arquivos

```
/
├── guidelines/
│   └── Guidelines.md                           # Guidelines gerais do sistema
│
├── styles/
│   └── globals.css                             # Tokens CSS (red-alert-400 adicionado)
│
├── components/
│   ├── ui/
│   │   ├── badge.tsx                          # Componente Badge v3.0
│   │   ├── BADGE_DOCUMENTATION.md             # Documentação técnica completa
│   │   ├── BADGE_FIGMA_SPEC.md               # Especificação do Figma
│   │   └── BADGE_COLOR_REFERENCE.md          # Referência visual de cores
│   │
│   ├── BadgeShowcase.tsx                      # Showcase interativo
│   ├── BadgeVisualTest.tsx                    # Testes visuais
│   ├── BADGE_USAGE_BY_JOURNEY.md             # Padrões por jornada
│   ├── BADGE_MIGRATION_QUICK_GUIDE.md        # Guia de migração
│   └── BADGE_SYSTEM_V3_SUMMARY.md            # Resumo executivo
│
└── BADGE_SYSTEM_INDEX.md                      # Este arquivo (índice)
```

---

## ⭐ Destaques

### As 3 Variantes

```tsx
// HEAVY - Alertas críticos (fundo escuro + texto branco)
<Badge variant="heavy" tone="danger">Offline</Badge>

// MEDIUM - Status intermediários (fundo médio + texto escuro)
<Badge variant="medium" tone="success">Ativo</Badge>

// LIGHT - Categorização (fundo claro + borda + texto no tom)
<Badge variant="light" tone="primary">Plano Pro</Badge>
```

### Regras Críticas

1. **Offline** → `heavy` + `danger`
2. **Online** → `heavy` + `success`
3. **Vencido** → `heavy` + `overdue`
4. **Novo alerta** → `heavy` + `danger`
5. **Pendente** → `medium` + `pending` (amarelo!)
6. **Tags** → `light` + qualquer tom

### Paleta Rápida

- **Red**: 50 (#FDC6C5), 100 (#F87E81), 300 (#C8142C), 400 (#81131D)
- **Green**: 50 (#E6FFE6), 200 (#87E373), 400 (#289726)
- **Yellow**: 50 (#FFFEF0), 200 (#FDEC85), 400 (#DEB900)
- **Turquoise**: 50 (#EBF6FF), 200 (#63BDF7), 400 (#126AAF)

---

## 🆘 Precisa de Ajuda?

1. **Problema com cores?** → [BADGE_COLOR_REFERENCE.md](/components/ui/BADGE_COLOR_REFERENCE.md)
2. **Não sabe qual variante?** → [BADGE_DOCUMENTATION.md](/components/ui/BADGE_DOCUMENTATION.md) seção "Diretrizes"
3. **Migrando código?** → [BADGE_MIGRATION_QUICK_GUIDE.md](/components/BADGE_MIGRATION_QUICK_GUIDE.md)
4. **Validando implementação?** → [BadgeVisualTest](/badge-visual-test)
5. **Quer ver exemplos?** → [BadgeShowcase](/badge-showcase)

---

**Versão**: 3.0  
**Status**: ✅ Completo  
**Última atualização**: Janeiro 2025  
**Manutenção**: SegVision Design System Team
