# Migração: Meu Perfil → Configurações

## Resumo da Mudança

"Meu Perfil" foi movido para dentro de "Configurações" como uma aba, consolidando todas as preferências e configurações de usuário em uma única tela com navegação por abas.

---

## Mudanças Principais

### 1. Estrutura de Navegação

#### Antes
- **Sidebar**: 
  - Configurações (separado)
  - Meu Perfil (separado)
- **UserMenu**: "Meu Perfil" → Tela isolada

#### Depois
- **Sidebar**: 
  - Configurações (único item)
- **UserMenu**: "Meu Perfil" → Configurações (aba Perfil)

### 2. Telas Unificadas

Todos os perfis (Escola, Administrador, Operador) agora usam o mesmo componente `SettingsScreen` com abas que variam por permissão.

### 3. Abas Disponíveis

| Aba | Escola | Admin | Operador | Descrição |
|-----|--------|-------|----------|-----------|
| **Perfil** | ✓ | ✓ | ✓ | Dados pessoais, avatar, preferências de UI |
| **Segurança** | ✓ | ✓ | ✓ | Senha, 2FA, parâmetros de segurança |
| **Notificações** | ✓ | ✓ | ✓ | Canais e tipos de notificações |
| **Sessões** | ✓ | ✓ | ✓ | Dispositivos conectados |
| **Organização** | ✓ | ✓ | ✗ | Dados da escola/organização |
| **Integrações** | ✓ | ✓ | ✗ | WhatsApp, E-mail, Pagamentos, DocSign |
| **Usuários** | ✓ | ✓ | ✗ | Gerenciamento de usuários internos |
| **Auditoria** | ✗ | ✓ | ✗ | Log de segurança (somente leitura) |

---

## Componentes Afetados

### Arquivos Modificados

1. **SettingsScreen.tsx** (Reescrito)
   - Agora usa componente `Tabs` do Shadcn
   - Consolidou conteúdo de ProfileScreen, SettingsScreen antigo
   - Visibilidade de abas baseada em `currentProfile`

2. **AppHeader.tsx** (Modificado)
   - `handleProfileClick()` agora redireciona para `'settings'` em vez de `'profile'`

3. **screen-titles.ts** (Modificado)
   - Removido `profile` 
   - Atualizado subtítulo de `settings` para todos os perfis

4. **Sidebar.tsx** (Já tinha Configurações)
   - Nenhuma mudança necessária

5. **AdminSidebar.tsx** (Modificado)
   - Label alterado de "Configurações do Sistema" para "Configurações"

6. **OperatorSidebar.tsx** (Modificado)
   - Adicionado item "Configurações" com ícone `Settings`
   - Tipo `OperatorScreen` atualizado

7. **App.tsx** (Modificado)
   - Removida rota `'profile'`
   - Removida importação de `ProfileScreen`
   - Removida importação de `AdminSettingsScreen`
   - Adicionada rota `'settings'` para `OperatorScreen`

### Arquivos Removidos

- **ProfileScreen.tsx** (Conteúdo migrado para SettingsScreen > aba Perfil)
- **admin/AdminSettingsScreen.tsx** (Substituído por SettingsScreen unificado)

---

## Fluxo de Navegação

### UserMenu → Meu Perfil

```tsx
// ANTES
handleProfileClick() → onNavigate('profile') → ProfileScreen

// DEPOIS
handleProfileClick() → onNavigate('settings') → SettingsScreen (aba padrão: 'perfil')
```

### Sidebar → Configurações

```tsx
// ANTES (Escola)
onNavigate('settings') → SettingsScreen (dados da escola + usuários + notificações)

// DEPOIS (Todos os perfis)
onNavigate('settings') → SettingsScreen (abas com visibilidade condicional)
```

---

## Estrutura de Abas

### Componente Tabs (Shadcn)

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    {visibleTabs.perfil && <TabsTrigger value="perfil">Perfil</TabsTrigger>}
    {visibleTabs.seguranca && <TabsTrigger value="seguranca">Segurança</TabsTrigger>}
    {/* ... outras abas ... */}
  </TabsList>

  <TabsContent value="perfil">
    {/* Conteúdo da aba Perfil */}
  </TabsContent>
  
  {/* ... outros conteúdos ... */}
</Tabs>
```

### Visibilidade Condicional

```tsx
const visibleTabs = {
  perfil: true,
  seguranca: true,
  notificacoes: true,
  sessoes: true,
  organizacao: currentProfile === 'school' || currentProfile === 'admin',
  integracoes: currentProfile === 'school' || currentProfile === 'admin',
  usuarios: currentProfile === 'school' || currentProfile === 'admin',
  auditoria: currentProfile === 'admin'
};
```

---

## Aba Perfil (ex-ProfileScreen)

### Conteúdo Migrado

#### 1. Avatar
- Upload de foto
- Remoção de foto
- Preview circular

#### 2. Dados Pessoais
- Nome (text, required)
- E-mail (email, required)
- Telefone (tel, com máscara)
- Cargo/Função (text)

#### 3. Preferências de UI
- Tema (Sistema | Claro | Escuro)
- Idioma (dropdown)

### Inputs Padronizados

Todos os inputs seguem o padrão do Design System:

```tsx
className="bg-[var(--gray-50)] border-[var(--gray-200)] 
           hover:border-[var(--gray-300)] 
           focus:border-[var(--blue-primary-300)]"
```

---

## Aba Segurança

### Conteúdo

1. **Alterar Senha**
   - Senha atual
   - Nova senha (min 8 caracteres)
   - Confirmar nova senha

2. **2FA (Autenticação em Duas Etapas)**
   - Toggle ativar/desativar
   - Badge de status:
     - Ativo → `Badge variant="medium" tone="success"`
     - Inativo → `Badge variant="light" tone="neutral"`

3. **Parâmetros Globais** (Admin only)
   - Tempo de inatividade (minutos)
   - Tentativas máximas de login
   - Expiração de senha (dias)

---

## Aba Notificações

### Canais
- WhatsApp (toggle)
- E-mail (toggle)
- In-app (sempre ativo, disabled)

### Tipos
- Alertas de Segurança
- Financeiro
- Sistema

### Gravidade Mínima
- Select: Baixa | Média | Alta

---

## Aba Sessões

### Tabela de Dispositivos
- Dispositivo (Desktop/Mobile/Tablet)
- Navegador
- Localização
- Última atividade
- Status (Atual/Recente)

### Badges
- Atual → `Badge variant="medium" tone="primary"`
- Recente → `Badge variant="light" tone="info"`

### Ações
- Encerrar sessão individual
- Encerrar todas as outras sessões (com confirmação)

---

## Aba Organização (Escola/Admin)

### Dados Cadastrais
- Nome da Escola/Organização
- CNPJ
- Endereço completo (Rua, Cidade, Estado, CEP)
- Telefone
- E-mail
- Responsável

---

## Aba Integrações (Escola/Admin)

### Integrações Disponíveis
1. WhatsApp Business
2. E-mail SMTP
3. Gateway de Pagamento
4. DocSign (Assinatura Digital)

### Status de Integração
- Conectado → `Badge variant="medium" tone="success"`
- Desconectado → `Badge variant="light" tone="neutral"`

### Ações
- Testar conexão
- Ativar/Desativar

---

## Aba Usuários (Escola/Admin)

### Gestão de Usuários Internos
- Lista de operadores e colaboradores
- Status (Ativo/Inativo)
- Cargo
- E-mail
- Data de criação

### Ações
- Adicionar novo usuário (modal)
- Editar usuário
- Ativar/Desativar

### Badges
- Ativo → `Badge variant="medium" tone="success"`
- Inativo → `Badge variant="light" tone="neutral"`

---

## Aba Auditoria (Admin only)

### Log de Eventos
Lista somente leitura de eventos de segurança:
- Login bem-sucedido
- Integração modificada
- Usuário criado
- Senha alterada

### Estrutura
- Evento (descrição)
- Usuário (email)
- Timestamp
- Tipo (auth/config/user/security)

---

## Benefícios da Migração

1. **Navegação Simplificada**
   - Um único ponto de entrada para todas as configurações
   - Reduz itens na sidebar

2. **Consistência entre Perfis**
   - Todos os perfis usam a mesma interface
   - Visibilidade de abas é condicional e clara

3. **Melhor UX**
   - Usuário encontra todas as configurações em um só lugar
   - Abas facilitam navegação entre seções relacionadas

4. **Manutenção Simplificada**
   - Um único componente `SettingsScreen` para manter
   - Removidos `ProfileScreen` e `AdminSettingsScreen`

5. **Escalabilidade**
   - Fácil adicionar novas abas no futuro
   - Controle fino de visibilidade por perfil

---

## Padrões Visuais Aplicados

### Header de Página
- Título: "Configurações"
- Subtítulo dinâmico baseado na aba ativa (futuro)

### Inputs
```css
background: var(--gray-50)
border: var(--gray-200)
hover: var(--gray-300)
focus: var(--blue-primary-300)
```

### Botões Primários
```css
background: var(--blue-primary-300)
color: white
hover: opacity 0.95
```

### Badges
- Light: categorização, estados neutros
- Medium: status importantes do sistema

### Toasts
- Success: "Alterações salvas com sucesso!"
- Error: Mensagens de validação

---

## Testes Recomendados

1. **Navegação**
   - [ ] UserMenu → Meu Perfil → abre Settings na aba Perfil
   - [ ] Sidebar → Configurações → abre Settings na última aba usada
   - [ ] Troca entre abas funciona corretamente

2. **Visibilidade por Perfil**
   - [ ] Escola: vê Perfil, Segurança, Notificações, Sessões, Organização, Integrações, Usuários
   - [ ] Admin: vê todas as abas incluindo Auditoria
   - [ ] Operador: vê apenas Perfil, Segurança, Notificações, Sessões

3. **Funcionalidades**
   - [ ] Salvar dados pessoais
   - [ ] Alterar senha
   - [ ] Toggle 2FA
   - [ ] Salvar preferências de notificação
   - [ ] Encerrar sessões
   - [ ] Gerenciar usuários (Escola/Admin)
   - [ ] Testar integrações (Escola/Admin)

4. **Responsividade**
   - [ ] Tabs são scrolláveis em mobile
   - [ ] Cards se adaptam a 1 coluna em mobile
   - [ ] Inputs são full-width em telas pequenas

---

**Versão**: 1.0  
**Data**: Janeiro 2025  
**Design System**: SegVision Light Mode
