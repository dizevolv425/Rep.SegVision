# Badge Usage Patterns - Por Jornada do Usuário

## Visão Geral

Este documento define os padrões obrigatórios de uso de badges em cada jornada do SegVision: **Escola**, **Administrador** e **Operador**.

---

## Jornada da Escola (Cliente Contratante)

### Dashboard
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Alertas IA - Novo | `heavy` | `danger` | `<Badge variant="heavy" tone="danger">Novo</Badge>` |
| Alertas IA - Verificado | `medium` | `caution` | `<Badge variant="medium" tone="caution">Verificado</Badge>` |
| Alertas IA - Resolvido | `medium` | `success` | `<Badge variant="medium" tone="success">Resolvido</Badge>` |

### Câmeras
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Status Online | `heavy` | `success` | `<Badge variant="heavy" tone="success">Online</Badge>` |
| Status Offline | `heavy` | `danger` | `<Badge variant="heavy" tone="danger">Offline</Badge>` |
| Feature IA | `light` | `primary` | `<Badge variant="light" tone="primary" size="s">IA</Badge>` |
| Feature RF (Reconhecimento Facial) | `light` | `primary` | `<Badge variant="light" tone="primary" size="s">RF</Badge>` |
| Feature CP (Contagem de Pessoas) | `light` | `primary` | `<Badge variant="light" tone="primary" size="s">CP</Badge>` |

### Financeiro
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Fatura Paga | `medium` | `paid` | `<Badge variant="medium" tone="paid">Pago</Badge>` |
| Fatura Pendente | `medium` | `pending` | `<Badge variant="medium" tone="pending">Pendente</Badge>` |
| Fatura Vencida | `heavy` | `overdue` | `<Badge variant="heavy" tone="overdue">Vencido</Badge>` |

### Central de Inteligência (Alertas)
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Alerta Aberto | `heavy` | `open` | `<Badge variant="heavy" tone="open">Aberto</Badge>` |
| Alerta Em Análise | `medium` | `in_review` | `<Badge variant="medium" tone="in_review">Em Análise</Badge>` |
| Alerta Resolvido | `medium` | `resolved` | `<Badge variant="medium" tone="resolved">Resolvido</Badge>` |
| Severidade Alta | `heavy` | `danger` | `<Badge variant="heavy" tone="danger">Alta</Badge>` |
| Severidade Média | `medium` | `warning` | `<Badge variant="medium" tone="warning">Média</Badge>` |
| Severidade Baixa | `light` | `info` | `<Badge variant="light" tone="info">Baixa</Badge>` |

### Ambientes
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Contador de Locais | `light` | `neutral` | `<Badge variant="light" tone="neutral" size="s">5</Badge>` |
| Tipo de Ambiente | `light` | `primary` | `<Badge variant="light" tone="primary">Sala de Aula</Badge>` |

### Analytics
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Frequência Alta | `light` | `success` | `<Badge variant="light" tone="success">Frequente</Badge>` |
| Frequência Média | `light` | `caution` | `<Badge variant="light" tone="caution">Regular</Badge>` |
| Frequência Baixa | `light` | `neutral` | `<Badge variant="light" tone="neutral">Raro</Badge>` |
| Percentual | `light` | `neutral` | `<Badge variant="light" tone="neutral">85%</Badge>` |

### Suporte
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Ticket Aberto | `medium` | `danger` | `<Badge variant="medium" tone="open">Aberto</Badge>` |
| Ticket Em Progresso | `medium` | `info` | `<Badge variant="medium" tone="processing">Em Progresso</Badge>` |
| Ticket Resolvido | `medium` | `success` | `<Badge variant="medium" tone="resolved">Resolvido</Badge>` |
| Prioridade Crítica | `heavy` | `danger` | `<Badge variant="heavy" tone="danger">Crítica</Badge>` |
| Prioridade Alta | `medium` | `warning` | `<Badge variant="medium" tone="warning">Alta</Badge>` |
| Prioridade Normal | `light` | `info` | `<Badge variant="light" tone="info">Normal</Badge>` |

### Profile/Settings
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Sessão Atual | `light` | `success` | `<Badge variant="light" tone="success">Atual</Badge>` |
| Plano Ativo | `light` | `primary` | `<Badge variant="light" tone="primary">Plano Pro</Badge>` |

---

## Jornada do Administrador (Proprietário da Plataforma)

### Dashboard Admin
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Alertas Pendentes | `heavy` | `danger` | `<Badge variant="heavy" tone="pending">Pendente</Badge>` |
| Sistema Operacional | `medium` | `success` | `<Badge variant="medium" tone="success">Operacional</Badge>` |

### Escolas (Clientes)
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Escola Ativa | `medium` | `active` | `<Badge variant="medium" tone="active">Ativa</Badge>` |
| Escola Inativa | `light` | `neutral` | `<Badge variant="light" tone="neutral">Inativa</Badge>` |
| Escola Pendente Setup | `light` | `pending` | `<Badge variant="light" tone="pending">Pendente</Badge>` |
| Plano Basic | `light` | `neutral` | `<Badge variant="light" tone="neutral">Basic</Badge>` |
| Plano Pro | `light` | `primary` | `<Badge variant="light" tone="primary">Pro</Badge>` |
| Plano Premium | `light` | `primary` | `<Badge variant="light" tone="primary">Premium</Badge>` |

### Financeiro Admin
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Fatura Paga | `medium` | `paid` | `<Badge variant="medium" tone="paid">Paga</Badge>` |
| Fatura Pendente | `medium` | `pending` | `<Badge variant="medium" tone="pending">Pendente</Badge>` |
| Fatura Atrasada | `heavy` | `overdue` | `<Badge variant="heavy" tone="overdue">Atrasada</Badge>` |
| Plano (categoria) | `light` | `neutral` | `<Badge variant="light" tone="neutral">Pro</Badge>` |

### Alertas Admin
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Alerta Pendente | `light` | `pending` | `<Badge variant="light" tone="pending">Pendente</Badge>` |
| Alerta Revisado | `light` | `info` | `<Badge variant="light" tone="info">Revisado</Badge>` |
| Alerta Resolvido | `medium` | `resolved` | `<Badge variant="medium" tone="resolved">Resolvido</Badge>` |
| Severidade Alta | `heavy` | `danger` | `<Badge variant="heavy" tone="danger">Alta</Badge>` |
| Severidade Média | `medium` | `warning` | `<Badge variant="medium" tone="warning">Média</Badge>` |
| Severidade Baixa | `light` | `info` | `<Badge variant="light" tone="info">Baixa</Badge>` |

### Contratos Admin
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Contrato Ativo | `medium` | `active` | `<Badge variant="medium" tone="active">Ativo</Badge>` |
| Contrato Suspenso | `light` | `suspended` | `<Badge variant="light" tone="suspended">Suspenso</Badge>` |
| Contrato Cancelado | `light` | `canceled` | `<Badge variant="light" tone="canceled">Cancelado</Badge>` |
| Tipo de Plano | `light` | `primary` | `<Badge variant="light" tone="primary">Premium</Badge>` |

### Integrações Admin
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Integração Conectada | `medium` | `connected` | `<Badge variant="medium" tone="connected">Conectada</Badge>` |
| Integração Testando | `light` | `testing` | `<Badge variant="light" tone="testing">Testando</Badge>` |
| Integração Com Erro | `heavy` | `failure` | `<Badge variant="heavy" tone="failure">Erro</Badge>` |

### Settings Admin
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Usuário Ativo | `medium` | `success` | `<Badge variant="medium" tone="success">Ativo</Badge>` |
| Usuário Inativo | `light` | `neutral` | `<Badge variant="light" tone="neutral">Inativo</Badge>` |
| Role Admin | `light` | `primary` | `<Badge variant="light" tone="primary">Admin</Badge>` |
| Role Manager | `light` | `neutral` | `<Badge variant="light" tone="neutral">Manager</Badge>` |

---

## Jornada do Operador (Pessoal de Segurança)

### Dashboard Operador
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Alertas Críticos | `heavy` | `danger` | `<Badge variant="heavy" tone="danger">3 Críticos</Badge>` |
| Atenção Necessária | `medium` | `danger` | `<Badge variant="medium" tone="danger">Atenção</Badge>` |
| Câmeras Online | `medium` | `success` | `<Badge variant="medium" tone="success">12 Online</Badge>` |

### Câmeras Operador
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Câmera Online | `heavy` | `success` | `<Badge variant="heavy" tone="success">Online</Badge>` |
| Câmera Offline | `heavy` | `danger` | `<Badge variant="heavy" tone="danger">Offline</Badge>` |
| Gravando | `medium` | `success` | `<Badge variant="medium" tone="success">Gravando</Badge>` |
| Com Falha | `heavy` | `failure` | `<Badge variant="heavy" tone="failure">Falha</Badge>` |

### Central Operador
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Evento Novo | `heavy` | `new` | `<Badge variant="heavy" tone="new">Novo</Badge>` |
| Evento Em Atendimento | `medium` | `processing` | `<Badge variant="medium" tone="processing">Em Atendimento</Badge>` |
| Evento Resolvido | `medium` | `resolved` | `<Badge variant="medium" tone="resolved">Resolvido</Badge>` |
| Prioridade Urgente | `heavy` | `danger` | `<Badge variant="heavy" tone="danger">Urgente</Badge>` |

### Alertas Operador
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Alerta Ativo | `heavy` | `danger` | `<Badge variant="heavy" tone="danger">Ativo</Badge>` |
| Alerta Verificado | `medium` | `caution` | `<Badge variant="medium" tone="caution">Verificado</Badge>` |
| Alerta Falso Positivo | `medium` | `success` | `<Badge variant="medium" tone="success">Falso Positivo</Badge>` |

### Contatos Operador
| Contexto | Variant | Tone | Exemplo |
|----------|---------|------|---------|
| Contato Ativo | `light` | `success` | `<Badge variant="light" tone="success">Ativo</Badge>` |
| Tipo de Contato | `light` | `neutral` | `<Badge variant="light" tone="neutral">Segurança</Badge>` |

---

## Regras Gerais Por Variante

### HEAVY (Crítico)
**Quando usar**: 
- Status de conectividade (Online/Offline)
- Alertas não visualizados (Novo)
- Pagamentos vencidos
- Falhas críticas
- Qualquer situação que exige ação IMEDIATA

**Cores disponíveis**:
- `danger` - Vermelho escuro (#C8142C)
- `success` - Verde escuro (#289726)
- `info` - Azul escuro (#126AAF)
- `caution` - Amarelo escuro (#DEB900)
- `warning` - Laranja escuro (#BA870B)
- `neutral` - Cinza escuro (#7A7A88)

### MEDIUM (Intermediário)
**Quando usar**:
- Status de processos (Ativo, Processando, Pendente)
- Alertas em análise (Verificado, Em Revisão)
- Pagamentos confirmados ou aguardando
- Estados intermediários
- Informações relevantes mas não urgentes

**Cores disponíveis**:
- `danger` - Fundo vermelho claro + texto escuro
- `success` - Fundo verde claro + texto escuro
- `info` - Fundo azul claro + texto escuro
- `caution` - Fundo amarelo claro + texto escuro
- `warning` - Fundo laranja claro + texto escuro
- `neutral` - Fundo cinza claro + texto escuro

### LIGHT (Categorização)
**Quando usar**:
- Tags de planos (Basic, Pro, Premium)
- Categorias de ambiente
- Metadados (Escola, Tipo, Grupo)
- Contadores (5 locais, 85%)
- Qualquer informação de baixa prioridade visual

**Cores disponíveis**:
- `primary` - Azul SegVision
- `neutral` - Cinza
- `success` - Verde
- `danger` - Vermelho
- `info` - Azul turquesa
- `caution` - Amarelo
- `warning` - Laranja

---

## Checklist de Validação

Antes de implementar uma badge, pergunte:

1. ✅ **É um status crítico?** → Use `heavy`
2. ✅ **É um status intermediário?** → Use `medium`
3. ✅ **É uma tag/categoria?** → Use `light`
4. ✅ **Online/Offline sempre** → `heavy` + `success`/`danger`
5. ✅ **Vencido sempre** → `heavy` + `overdue`
6. ✅ **Novo alerta sempre** → `heavy` + `danger`/`new`
7. ✅ **Pendente sempre** → `medium` + `pending` (amarelo!)
8. ✅ **Verificado sempre** → `medium` + `caution`

---

## Exemplos de Implementação

### Escola - Dashboard
```tsx
// Alertas IA
<Badge variant="heavy" tone="danger" size="s">Novo</Badge>
<Badge variant="medium" tone="caution" size="s">Verificado</Badge>
<Badge variant="medium" tone="success" size="s">Resolvido</Badge>
```

### Admin - Escolas
```tsx
// Status da escola
<Badge variant="medium" tone="active" size="s">Ativa</Badge>
<Badge variant="light" tone="neutral" size="s">Inativa</Badge>

// Plano
<Badge variant="light" tone="primary" size="s">Pro</Badge>
```

### Operador - Câmeras
```tsx
// Status de conectividade
<Badge variant="heavy" tone="success" size="s">Online</Badge>
<Badge variant="heavy" tone="danger" size="s">Offline</Badge>
```

---

**Última atualização**: Janeiro 2025  
**Versão**: 3.0  
**Status**: ✅ Alinhado com Figma Design System
