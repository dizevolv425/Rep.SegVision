# 📊 Dashboard SegVision - Implementação Completa

Este documento descreve a implementação do sistema de dados reais para o Dashboard do SegVision, substituindo os dados mock por consultas ao Supabase.

## 📁 Arquivos Criados/Modificados

### **Arquivos Criados:**

1. **`database-migrations-dashboard.sql`**
   - Migration para ajustar o banco de dados
   - Adiciona valores ao enum `camera_status`: `ativa`, `inativa`
   - Adiciona tipos de alerta: `fall`, `aggression`, `weapon`
   - Cria campo `ai_accuracy` na tabela `schools`
   - Cria índices para otimização
   - Cria view `dashboard_stats` para estatísticas agregadas
   - Adiciona políticas RLS necessárias

2. **`src/types/dashboard.ts`**
   - Types TypeScript completos para o dashboard
   - Interfaces para dados brutos e processados
   - Enums e mapeamentos de UI
   - Documentação de todas as estruturas

3. **`src/hooks/useDashboardData.ts`**
   - Hook customizado para buscar dados do Supabase
   - Gerencia estados de loading, error e dados
   - Refresh automático a cada 30 segundos
   - Formatação de dados para UI

4. **`seeds-dashboard-data.sql`**
   - Dados de exemplo para testes
   - Cria 4 environments, 6 locations, 8 câmeras
   - Cria 14 alertas distribuídos nas últimas 24h
   - Comentários detalhados de uso

5. **`DASHBOARD-IMPLEMENTATION.md`** (este arquivo)
   - Documentação completa da implementação

### **Arquivos Modificados:**

1. **`src/components/DashboardScreen.tsx`**
   - Substituiu dados mock por hook `useDashboardData`
   - Adicionou loading states com Skeleton
   - Adicionou tratamento de erros
   - Adicionou botão de refresh manual
   - Manteve compatibilidade com `isFirstAccess`

---

## 🚀 Como Executar a Implementação

### **Passo 1: Executar a Migration**

```bash
# Descomentar a linha no .env
SUPABASE_SERVICE_ROLE_KEY=sua_service_key_aqui

# Executar migration via SQL Editor do Supabase
# 1. Acesse: https://supabase.com/dashboard/project/xyfkyqkhflgeosjtunkd/sql/new
# 2. Cole o conteúdo de database-migrations-dashboard.sql
# 3. Clique em "Run"
```

**Ou via script Node.js:**

```javascript
// Criar arquivo: scripts/run-dashboard-migration.js
const { readFileSync } = 'fs';
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sql = readFileSync('./database-migrations-dashboard.sql', 'utf-8');
// Execute via Postgres Meta API ou RPC
```

### **Passo 2: Obter School ID**

```sql
-- Execute no SQL Editor
SELECT id, name FROM schools LIMIT 1;

-- Copie o UUID retornado
```

### **Passo 3: Executar Seeds (Dados de Exemplo)**

```sql
-- 1. Abra seeds-dashboard-data.sql
-- 2. Substitua TODAS as ocorrências de 'YOUR_SCHOOL_ID_HERE' pelo ID copiado
-- 3. Execute no SQL Editor do Supabase
```

**Exemplo com sed (macOS/Linux):**

```bash
sed -i '' 's/YOUR_SCHOOL_ID_HERE/SEU-UUID-AQUI/g' seeds-dashboard-data.sql
```

### **Passo 4: Testar o Dashboard**

```bash
# Iniciar o frontend
npm run dev

# Acessar http://localhost:5173
# Fazer login com usuário da escola
# Navegar para Dashboard
# Verificar dados reais carregando
```

---

## 📊 Estrutura de Dados

### **Enums Atualizados:**

```typescript
// camera_status
type CameraStatus = 'online' | 'offline' | 'ativa' | 'inativa';

// alert_type (adicionados)
type AlertType =
  | 'intrusion'    // Já existia
  | 'face'         // Já existia
  | 'crowd'        // Já existia
  | 'object'       // Já existia
  | 'camera_offline' // Já existia
  | 'fall'         // NOVO
  | 'aggression'   // NOVO
  | 'weapon';      // NOVO
```

### **Nova View: `dashboard_stats`**

Retorna estatísticas agregadas para cada escola:

```sql
SELECT * FROM dashboard_stats WHERE school_id = 'UUID';
```

Campos:
- `cameras_ativas`: Câmeras online ou ativa
- `cameras_total`: Total de câmeras
- `alertas_24h`: Alertas nas últimas 24h
- `alertas_ontem`: Alertas do dia anterior (para comparação)
- `incidentes_criticos_24h`: Alertas severity='alta' nas últimas 24h
- `incidentes_criticos_ontem`: Incidentes críticos do dia anterior
- `ai_accuracy`: Taxa de detecção da IA

---

## 🔧 Hook: `useDashboardData`

### **Uso:**

```typescript
import { useDashboardData } from '../hooks/useDashboardData';

function MyComponent() {
  const {
    stats,          // Objeto com 4 estatísticas
    chartData,      // Array para gráfico de evolução
    recentAlerts,   // Array com últimos 4 alertas
    isLoading,      // Boolean
    error,          // Error | null
    refresh,        // Function para refresh manual
    lastUpdated     // Date da última atualização
  } = useDashboardData({
    refreshInterval: 30000,  // 30 segundos
    enabled: true            // Se deve buscar automaticamente
  });

  return (/* ... */);
}
```

### **Funcionalidades:**

✅ Busca automática ao montar o componente
✅ Refresh automático a cada 30 segundos
✅ Função de refresh manual
✅ Loading states
✅ Error handling
✅ Formatação automática de dados

---

## 📈 Queries Otimizadas

### **Query 1: Stats (4 cards)**

```typescript
// Usa a view dashboard_stats
const { data } = await supabase
  .from('dashboard_stats')
  .select('*')
  .eq('school_id', schoolId)
  .single();
```

### **Query 2: Chart Data (evolução 24h)**

```typescript
const { data } = await supabase
  .from('alerts')
  .select('created_at')
  .eq('school_id', schoolId)
  .gte('created_at', '24 hours ago')
  .order('created_at', { ascending: true });

// Agrupamento por hora feito no JavaScript
```

### **Query 3: Recent Alerts (últimos 4)**

```typescript
const { data } = await supabase
  .from('alerts')
  .select(`
    id,
    type,
    title,
    status,
    severity,
    created_at,
    camera:cameras(
      name,
      location:locations(name)
    )
  `)
  .eq('school_id', schoolId)
  .order('created_at', { ascending: false })
  .limit(4);
```

---

## 🎨 UI Components

### **Loading States:**

Skeleton loaders para:
- 4 cards de estatísticas
- Gráfico de evolução
- 4 alertas recentes

### **Error State:**

Card vermelho com:
- Ícone de alerta
- Mensagem de erro
- Botão "Tentar Novamente"

### **Empty State (Alertas):**

- Ícone de alerta
- Mensagem "Nenhum alerta registrado"

---

## 🔐 Row Level Security (RLS)

Políticas criadas/verificadas:

```sql
-- Escolas veem próprios alertas
CREATE POLICY "Schools can view own alerts"
ON alerts FOR SELECT
USING (school_id IN (
  SELECT school_id FROM users WHERE id = auth.uid()
));

-- Admins veem todos os alertas
CREATE POLICY "Admins can view all alerts"
ON alerts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);
```

---

## 🧪 Como Testar

### **Teste 1: Loading State**

1. Desabilite o WiFi temporariamente
2. Acesse o dashboard
3. Deve mostrar skeletons de loading
4. Habilite WiFi
5. Dados devem carregar

### **Teste 2: Erro de Conexão**

1. Pare o Supabase (ou use URL inválida no `.env`)
2. Acesse o dashboard
3. Deve mostrar card de erro vermelho
4. Clique em "Tentar Novamente"
5. Deve tentar novamente

### **Teste 3: Dados Reais**

1. Execute os seeds
2. Acesse o dashboard
3. Verifique:
   - 4 cards com números corretos
   - Gráfico com dados das últimas 24h
   - 4 alertas recentes
   - Última atualização com timestamp

### **Teste 4: Refresh Automático**

1. Acesse o dashboard
2. Anote o timestamp de "Última atualização"
3. Espere 30 segundos
4. Timestamp deve atualizar automaticamente

### **Teste 5: Refresh Manual**

1. Acesse o dashboard
2. Clique no botão "Atualizar"
3. Deve recarregar os dados

---

## 📝 Checklist de Implementação

- [x] Migration SQL criada
- [x] Enums atualizados
- [x] Campo `ai_accuracy` adicionado
- [x] View `dashboard_stats` criada
- [x] Índices de otimização criados
- [x] Políticas RLS verificadas
- [x] Types TypeScript criados
- [x] Hook `useDashboardData` implementado
- [x] DashboardScreen atualizado
- [x] Loading states adicionados
- [x] Error handling implementado
- [x] Seeds de dados criados
- [x] Documentação completa

---

## 🐛 Troubleshooting

### **Erro: "School ID não encontrado"**

**Causa:** Usuário não tem `school_id` na tabela `users`.

**Solução:**
```sql
UPDATE users SET school_id = 'SEU-SCHOOL-ID' WHERE id = 'SEU-USER-ID';
```

### **Erro: "View dashboard_stats does not exist"**

**Causa:** Migration não foi executada.

**Solução:** Execute `database-migrations-dashboard.sql` no SQL Editor.

### **Erro: "Invalid enum value for alert_type"**

**Causa:** Migration não adicionou novos valores ao enum.

**Solução:** Certifique-se que a migration foi executada completamente.

### **Dashboard mostra 0 dados**

**Causa:** Seeds não foram executados ou school_id incorreto.

**Solução:**
1. Verifique o school_id: `SELECT * FROM schools;`
2. Execute os seeds com o ID correto
3. Verifique os dados: `SELECT * FROM cameras WHERE school_id = 'UUID';`

### **Refresh automático não funciona**

**Causa:** Hook está desabilitado ou intervalo muito longo.

**Solução:**
```typescript
useDashboardData({
  refreshInterval: 30000,  // Certifique-se que está definido
  enabled: true            // Certifique-se que está true
})
```

---

## 🚀 Próximos Passos (Melhorias Futuras)

1. **Cache de Queries:**
   - Implementar React Query ou SWR
   - Reduzir chamadas duplicadas ao banco

2. **Websockets (Realtime):**
   - Usar Supabase Realtime para alertas ao vivo
   - Atualizar dashboard em tempo real

3. **Materialized View:**
   - Converter `dashboard_stats` para materialized view
   - Adicionar pg_cron para atualização periódica

4. **Analytics Avançado:**
   - Gráficos de tendência semanal/mensal
   - Comparação com períodos anteriores
   - Heatmaps de horários

5. **Exportação de Dados:**
   - Botão para exportar relatórios (PDF/CSV)
   - Histórico de alertas completo

---

## 📚 Referências

- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks](https://react.dev/reference/react)
- [Recharts Documentation](https://recharts.org/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Implementado em:** 22/11/2025
**Versão:** 1.0.0
**Status:** ✅ Concluído
