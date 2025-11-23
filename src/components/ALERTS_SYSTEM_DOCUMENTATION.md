# Sistema de Alertas Inteligentes - Documentação Completa

## Visão Geral

Sistema de gerenciamento de alertas detectados pela IA, com cards estilo filete colorido, filtros avançados e modais de classificação e preview de vídeo.

---

## Componentes do Sistema

### 1. AlertsScreen.tsx (Principal)

Tela principal de alertas usada por todos os perfis (Escola, Operador, Admin).

#### Features
- ✅ Cards com filete colorido à esquerda (baseado em gravidade)
- ✅ Filtros: Busca, Gravidade, Status, Tipo, Câmera
- ✅ Botões de ação: Ver Vídeo, Confirmar, Resolver
- ✅ Integração com modais de classificação e preview
- ✅ Contagem de alertas filtrados
- ✅ Export de relatório

#### Header
```
Título: "Alertas Inteligentes"
Subtítulo: "Histórico de eventos detectados pela IA"
```

---

## Cards de Alerta (Estilo Filete)

### Anatomia Visual

```
┌─────────────────────────────────────────────────────┐
│█  [icon]  Título do Alerta                          │
│█          [Badge Novo] [Badge Alta]                 │
│█                                                     │
│█          Descrição do alerta em uma ou mais linhas │
│█                                                     │
│█          📷 Câmera  📍 Local  🕐 Data/Hora         │
│█                                                     │
│█                       [Ver Vídeo] [Confirmar] [...] │
└─────────────────────────────────────────────────────┘
█ = Filete colorido (4px, baseado em gravidade)
```

### Estrutura do Card

#### Container
```tsx
<div className="bg-white border border-[var(--gray-100)] 
                rounded-xl hover:border-[var(--gray-200)] 
                hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)]"
     style={{ borderLeft: `4px solid ${severityColor}` }}>
```

#### Layout Interno
- **Padding**: 16px
- **Gap**: 16px entre colunas
- **Display**: Flex horizontal

#### Colunas

1. **Icon Column** (40px width)
   - Círculo 32px com ícone do tipo
   - Background: `var(--gray-50)`
   - Ícone: 16px, cor neutral

2. **Content Column** (flex-1)
   - Header Row: Título + Badges
   - Description: 13px, line-height 20px
   - Meta Row: Ícones + dados (câmera, local, timestamp)

3. **Actions Column** (shrink-0)
   - Botões de ação alinhados à direita
   - Gap: 8px entre botões

---

## Cores do Filete (por Gravidade)

### Gravidades e Cores
| Gravidade | Cor | Token CSS |
|-----------|-----|-----------|
| **Alta** | Vermelho | `var(--red-alert-300)` #C8142C |
| **Média** | Laranja | `var(--orange-alert-300)` |
| **Baixa** | Turquesa | `var(--turquoise-alert-400)` #126AAF |

### Implementação
```tsx
const getSeverityColor = (severity: 'alta' | 'media' | 'baixa') => {
  switch (severity) {
    case 'alta': return 'var(--red-alert-300)';
    case 'media': return 'var(--orange-alert-300)';
    case 'baixa': return 'var(--turquoise-alert-400)';
  }
};
```

---

## Sistema de Badges

### Status Badges (Variante Medium/Light, Tamanho M)

| Status | Badge |
|--------|-------|
| **Novo** | `<Badge variant="medium" tone="danger" size="m">Novo</Badge>` |
| **Confirmado** | `<Badge variant="light" tone="caution" size="m">Confirmado</Badge>` |
| **Resolvido** | `<Badge variant="medium" tone="success" size="m">Resolvido</Badge>` |
| **Falso** | `<Badge variant="light" tone="neutral" size="m">Falso</Badge>` |

### Gravidade Badges (Variante Medium, Tamanho S)

| Gravidade | Badge |
|-----------|-------|
| **Alta** | `<Badge variant="medium" tone="danger" size="s">Alta</Badge>` |
| **Média** | `<Badge variant="medium" tone="warning" size="s">Média</Badge>` |
| **Baixa** | `<Badge variant="medium" tone="info" size="s">Baixa</Badge>` |

---

## Botões de Ação

### Especificação Visual

Todos os botões **SEMPRE** têm texto branco para máximo contraste.

#### Ver Vídeo (Primary)
```tsx
<Button className="bg-[var(--blue-primary-300)] text-white 
                   hover:bg-[var(--blue-primary-300)] hover:opacity-95 
                   h-9 rounded-[10px]">
  <Video className="w-4 h-4 mr-1.5" />
  Ver Vídeo
</Button>
```
- Background: Blue Primary/300 (#2F5FFF)
- Texto: Branco
- Altura: 36px (h-9)
- Border radius: 10px

#### Confirmar (Warning)
```tsx
<Button className="bg-[var(--orange-alert-400)] text-white 
                   hover:bg-[var(--orange-alert-400)] hover:opacity-95 
                   h-9 rounded-[10px]">
  Confirmar
</Button>
```
- Background: Orange Alert/400 (#BA870B)
- Texto: Branco
- Habilitado apenas quando status === 'novo'

#### Resolver (Success)
```tsx
<Button className="bg-[var(--green-alert-300)] text-white 
                   hover:bg-[var(--green-alert-300)] hover:opacity-95 
                   h-9 rounded-[10px]">
  Resolver
</Button>
```
- Background: Green Alert/300 (#47D238)
- Texto: Branco
- Habilitado apenas quando status === 'confirmado'

#### Disabled
```tsx
<Button disabled 
        className="bg-[var(--gray-200)] text-white 
                   opacity-60 cursor-not-allowed h-9 rounded-[10px]">
  Resolver
</Button>
```
- Background: Gray/200 (#B3B4C1)
- Texto: Branco
- Opacity: 60%

---

## Barra de Filtros

### Layout
```tsx
<div className="bg-white rounded-xl p-3 border border-[var(--gray-100)] 
                flex flex-wrap items-center gap-3">
```

### Componentes

#### 1. Search Input
```tsx
<Input
  placeholder="Buscar por palavra-chave…"
  className="bg-[var(--gray-50)] border-[var(--gray-200)] 
             hover:border-[var(--gray-300)] 
             focus:border-[var(--blue-primary-300)]"
/>
```
- Flex: 1 (cresce)
- Min-width: 200px
- Ícone de search à esquerda

#### 2. Gravidade Select (NOVO)
```tsx
<Select>
  <SelectItem value="todas">Todas</SelectItem>
  <SelectItem value="alta">Alta</SelectItem>
  <SelectItem value="media">Média</SelectItem>
  <SelectItem value="baixa">Baixa</SelectItem>
</Select>
```
- Width: 160px
- Primeira vez que Gravidade aparece como filtro

#### 3. Status Select
```tsx
<Select>
  <SelectItem value="todos">Todos</SelectItem>
  <SelectItem value="novo">Novo</SelectItem>
  <SelectItem value="confirmado">Confirmado</SelectItem>
  <SelectItem value="resolvido">Resolvido</SelectItem>
  <SelectItem value="falso">Falso</SelectItem>
</Select>
```

#### 4. Tipo Select
```tsx
<Select>
  <SelectItem value="todos">Todos</SelectItem>
  <SelectItem value="intrusion">Intrusão</SelectItem>
  <SelectItem value="face">Reconhecimento Facial</SelectItem>
  <SelectItem value="crowd">Aglomeração</SelectItem>
  <SelectItem value="object">Objeto Suspeito</SelectItem>
  <SelectItem value="camera_offline">Câmera Offline</SelectItem>
</Select>
```

#### 5. Câmera Select
```tsx
<Select>
  <SelectItem value="todas">Todas as câmeras</SelectItem>
  {/* Lista dinâmica de câmeras */}
</Select>
```

#### 6. Exportar Button
```tsx
<Button variant="outline" size="sm" className="ml-auto">
  <Download className="w-4 h-4 mr-2" />
  Exportar Relatório
</Button>
```
- Margin-left: auto (alinha à direita)

---

## Modal de Classificação

### Componente: AlertClassifyModal

#### Props
```tsx
interface AlertClassifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertId: string;
  alertTitle: string;
  defaultOption?: 'incidente_tratado' | 'falso_positivo' | 'ignorado';
  onConfirm: (alertId: string, classification: string, notes: string) => void;
}
```

#### Layout
- **Size**: 640px width
- **Padding**: 20px
- **Border radius**: 12px

#### Opções (CardRadio)

##### 1. Incidente Tratado
- **Tone**: Success (verde)
- **Icon**: CheckCircle
- **Título**: "Incidente Tratado (Resolvido)"
- **Descrição**: "A IA detectou corretamente. O incidente foi verificado e tratado."
- **Ação**: Define status como "Resolvido"

##### 2. Falso Positivo
- **Tone**: Danger (vermelho)
- **Icon**: XCircle
- **Título**: "Falso Positivo (Erro da IA)"
- **Descrição**: "A IA detectou incorretamente. Este alerta não era um incidente real."
- **Ação**: Define status como "Falso"

##### 3. Ignorado
- **Tone**: Neutral (cinza)
- **Icon**: MinusCircle
- **Título**: "Ignorado / Outro"
- **Descrição**: "Alerta visualizado mas não requer ação específica ou classificação."
- **Ação**: Define status como "Resolvido" (mas marcado como ignorado)

#### Notas Operacionais
```tsx
<Textarea
  placeholder="Descreva como o incidente foi tratado (opcional)"
  rows={3}
  className="bg-[var(--gray-50)] border-[var(--gray-200)] 
             hover:border-[var(--gray-300)] 
             focus:border-[var(--blue-primary-300)]"
/>
```

#### Footer
```tsx
<DialogFooter>
  <Button variant="ghost">Cancelar</Button>
  <Button className="bg-[var(--green-alert-300)] text-white">
    Confirmar Resolução
  </Button>
</DialogFooter>
```

### Toasts
- **Incidente Tratado**: "Alerta resolvido com sucesso."
- **Falso Positivo**: "Alerta marcado como Falso Positivo."
- **Ignorado**: "Alerta marcado como Ignorado."

---

## Modal de Preview de Vídeo

### Componente: VideoPreviewModal

#### Props
```tsx
interface VideoPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertId: string;
  alertTitle: string;
  cameraName: string;
  capturedAt: string;
  status: 'novo' | 'confirmado' | 'resolvido' | 'falso';
  description?: string;
  streamUrl?: string;
}
```

#### Layout
- **Size**: 880px width
- **Padding**: 20px
- **Border radius**: 12px

#### Player Frame
- **Aspect ratio**: 16:9
- **Background**: Black

#### Estados do Player

##### 1. Com Stream (Escola/Operador)
```tsx
<div className="bg-black">
  {/* Player de vídeo */}
</div>
```

##### 2. Offline (Sem stream)
```tsx
<div className="bg-[var(--black-300)]">
  <CameraOff className="w-12 h-12 text-white" />
  <p className="text-white">Frame capturado do evento</p>
  <Badge variant="light" tone="danger" size="s">Offline</Badge>
</div>
```

##### 3. LGPD (Admin bloqueado)
```tsx
<div className="bg-[var(--gray-400)]">
  <CameraOff className="w-12 h-12 text-white" />
  <p className="text-white">Visualização de vídeo bloqueada (LGPD)</p>
  <p className="text-white text-xs opacity-80">
    Administradores não têm acesso a imagens por questões de privacidade
  </p>
</div>
```

#### Metadata Grid (2 colunas)
```tsx
<div className="grid grid-cols-2 gap-4">
  <div>
    <p className="text-xs text-[var(--neutral-text-muted)]">Câmera</p>
    <p className="text-[var(--neutral-text)]">{cameraName}</p>
  </div>
  <div>
    <p className="text-xs text-[var(--neutral-text-muted)]">Data e Hora</p>
    <p className="text-[var(--neutral-text)]">{capturedAt}</p>
  </div>
  <div>
    <p className="text-xs text-[var(--neutral-text-muted)]">Tipo de Evento</p>
    <p className="text-[var(--neutral-text)]">{alertTitle}</p>
  </div>
  <div>
    <p className="text-xs text-[var(--neutral-text-muted)]">Status</p>
    {getStatusBadge()}
  </div>
</div>
```

#### Footer
```tsx
<DialogFooter>
  <Button className="bg-[var(--gray-400)] text-white">
    Fechar
  </Button>
</DialogFooter>
```

---

## Fluxo de Ações

### 1. Confirmar Alerta
```
1. Usuário clica "Confirmar" em card com status "Novo"
2. Abre AlertClassifyModal
3. Usuário seleciona classificação (padrão: Incidente Tratado)
4. Usuário adiciona notas (opcional)
5. Clica "Confirmar Resolução"
6. Status do alerta muda para:
   - "Resolvido" (incidente_tratado ou ignorado)
   - "Falso" (falso_positivo)
7. Toast de sucesso
8. Modal fecha
9. Lista atualiza
```

### 2. Resolver Alerta
```
1. Usuário clica "Resolver" em card com status "Confirmado"
2. Abre AlertClassifyModal
3. Mesmo fluxo de classificação
4. Status atualiza conforme seleção
```

### 3. Ver Vídeo
```
1. Usuário clica "Ver Vídeo" em qualquer card
2. Abre VideoPreviewModal
3. Se Admin: mostra placeholder LGPD
4. Se Escola/Operador:
   - Com stream: mostra player
   - Sem stream: mostra "Offline"
5. Exibe metadata do alerta
6. Usuário clica "Fechar"
7. Volta para lista
```

---

## Regras de Permissão

### Escola
- ✅ Ver lista de alertas
- ✅ Filtrar e buscar
- ✅ Confirmar alertas
- ✅ Resolver alertas
- ✅ Ver preview de vídeo (com stream)
- ✅ Exportar relatórios

### Operador
- ✅ Ver lista de alertas
- ✅ Filtrar e buscar
- ✅ Confirmar alertas
- ✅ Resolver alertas
- ✅ Ver preview de vídeo (com stream)
- ✅ Exportar relatórios

### Admin (SaaS)
- ✅ Ver lista de alertas (todas as escolas)
- ✅ Filtrar e buscar
- ✅ Confirmar alertas
- ✅ Resolver alertas
- ⛔ Ver preview de vídeo (BLOQUEADO - LGPD)
- ✅ Exportar relatórios

---

## Tipos de Alerta e Ícones

| Tipo | Ícone | Label |
|------|-------|-------|
| `intrusion` | `Ban` | Intrusão |
| `face` | `User` | Reconhecimento Facial |
| `crowd` | `Users` | Aglomeração |
| `object` | `Package` | Objeto Suspeito |
| `camera_offline` | `Camera` | Câmera Offline |

---

## Responsividade

### Desktop (≥1200px)
- Filtros em linha horizontal
- Cards com 3 colunas (Icon + Content + Actions)
- Botões de ação visíveis lado a lado

### Tablet (768-1199px)
- Filtros quebram em 2 linhas se necessário
- Cards mantêm 3 colunas
- Botões podem quebrar para 2 linhas

### Mobile (<768px)
- Filtros em stack vertical
- Cards: Actions vão para baixo
- Botões full-width em stack vertical

---

## Acessibilidade

### Keyboard Navigation
- **Tab**: Navega entre filtros e cards
- **Enter**: Abre modais
- **Esc**: Fecha modais
- **Arrow keys**: Navega opções de radio no modal

### Focus Rings
- Todos os botões têm focus ring azul
- Radio buttons têm focus ring
- Inputs têm border azul no focus

### Screen Readers
- Labels semânticos em todos os filtros
- ARIA descriptions em campos de notas
- Status badges com texto descritivo

---

## Estados Vazios

### Nenhum Alerta Encontrado
```tsx
<div className="text-center py-12">
  <AlertTriangle className="w-12 h-12 text-[var(--neutral-text-muted)]" />
  <p className="text-[var(--neutral-text)]">Nenhum alerta encontrado</p>
  <p className="text-sm text-[var(--neutral-text-muted)]">
    Tente ajustar os filtros ou buscar por outro termo
  </p>
</div>
```

---

## Dados Mockados

### Exemplo de Alerta
```tsx
{
  id: '1',
  type: 'intrusion',
  title: 'Movimento após horário',
  description: 'Movimento detectado fora do horário escolar na área externa',
  camera: 'Câmera Pátio 01',
  location: 'Pátio Principal',
  time: '18:45',
  date: '15/01/2024',
  status: 'novo',
  severity: 'alta',
  icon: Ban,
  streamUrl: 'rtsp://camera01/stream'
}
```

### Campos Opcionais
- `location` - Local do evento
- `streamUrl` - URL do stream de vídeo
- `actionBy` - Usuário que tomou ação
  ```tsx
  {
    name: 'Ana Silva',
    role: 'Seg.'
  }
  ```

---

## Melhorias Futuras

### Próximas Features
- [ ] Paginação de alertas
- [ ] Ordenação customizada
- [ ] Filtro por período de data
- [ ] Player de vídeo real (integração RTSP)
- [ ] Timeline de eventos no drawer
- [ ] Notificações push de novos alertas
- [ ] Anexar evidências aos alertas
- [ ] Comentários em alertas
- [ ] Atribuir alertas a usuários

### Performance
- [ ] Virtual scrolling para listas longas
- [ ] Lazy loading de vídeos
- [ ] Cache de filtros aplicados
- [ ] Debounce na busca

---

## Manutenção

### Arquivos do Sistema
```
components/
├── AlertsScreen.tsx              # Tela principal
├── AlertClassifyModal.tsx        # Modal de classificação
├── VideoPreviewModal.tsx         # Modal de preview
├── operator/
│   └── OperatorAlertsScreen.tsx  # Wrapper para Operador
└── admin/
    └── AdminAlertsScreen.tsx     # Wrapper para Admin
```

### Dependências
- `lucide-react` - Ícones
- `sonner@2.0.3` - Toasts
- `./ui/badge` - Sistema de badges
- `./ui/button` - Botões
- `./ui/input` - Campo de busca
- `./ui/select` - Filtros dropdown
- `./ui/dialog` - Modais
- `./ui/textarea` - Notas
- `./ui/radio-group` - Opções de classificação
- `./UserProfileContext` - Contexto de perfil (LGPD check)

---

**Design System**: SegVision Light Mode  
**Versão**: 2.0 (Filete Style)  
**Data**: Janeiro 2025
