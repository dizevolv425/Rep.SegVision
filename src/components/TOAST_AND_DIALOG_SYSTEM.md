# Sistema de Toasts e Diálogos de Confirmação - SegVision

## Visão Geral

Sistema completo de feedback visual para o usuário, integrado ao design system SegVision, incluindo:
- **Toasts**: Notificações temporárias não-invasivas
- **AlertDialogs**: Modais de confirmação para ações críticas

---

## 1. Sistema de Toasts

### 1.1 Importação e Uso

```tsx
import { showToast } from './ui/toast-utils';

// Uso básico
showToast.success({ title: 'Operação realizada com sucesso' });
showToast.error({ title: 'Erro ao processar requisição' });
showToast.info({ title: 'Informação importante' });
showToast.warning({ title: 'Atenção necessária' });

// Com descrição
showToast.success({ 
  title: 'Dados salvos',
  description: 'As alterações foram aplicadas com sucesso'
});

// Com duração customizada (padrão: 3000ms)
showToast.info({ 
  title: 'Processando',
  description: 'Aguarde enquanto processamos sua solicitação',
  duration: 5000
});
```

### 1.2 Variantes e Cores

| Tipo | Cor | Token CSS | Uso |
|------|-----|-----------|-----|
| **success** | Verde | `--green-alert-300` (#47D238) | Confirmações, operações bem-sucedidas |
| **error** | Vermelho | `--red-alert-300` (#C8142C) | Erros, falhas críticas |
| **info** | Azul | `--turquoise-alert-300` (#20A4ED) | Informações neutras, dicas |
| **warning** | Laranja | `--orange-alert-400` (#BA870B) | Avisos, atenção necessária |

### 1.3 Especificações Visuais

```css
/* Toast Container */
width: min-w-[362px]
padding: 16px (px-4 py-3)
border-radius: 8px (rounded-lg)
background: var(--[tipo]-alert-[tom])
box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1)

/* Ícone */
size: 20px (size-5)
color: white

/* Divisor vertical */
width: 1px
height: 20px
background: white

/* Título */
font-size: 14px
font-weight: 400
line-height: 1.4
color: white

/* Descrição (opcional) */
font-size: 12px
font-weight: 400
line-height: 1.4
color: white/90
margin-top: 4px

/* Botão fechar */
size: 12px (size-3)
color: white
hover: opacity-80
```

### 1.4 Ícones por Tipo

- **Success**: `CheckCircle` (lucide-react)
- **Error**: `XCircle` (lucide-react)
- **Info**: `Info` (lucide-react)
- **Warning**: `AlertTriangle` (lucide-react)

### 1.5 Posicionamento

- **Posição**: `top-center` (configurado no `<Toaster />` em App.tsx)
- **Z-index**: Automático (gerenciado pelo Sonner)
- **Empilhamento**: Vertical, novos toasts aparecem abaixo dos anteriores

---

## 2. Sistema de Diálogos de Confirmação

### 2.1 Importação e Uso

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
         AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
         AlertDialogTitle } from './ui/alert-dialog';
import { showToast } from './ui/toast-utils';

function Component() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      // Executar ação
      deleteItem(itemToDelete);
      
      // Feedback ao usuário
      showToast.success({ 
        title: 'Item excluído com sucesso'
      });
      
      setItemToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Button onClick={() => handleDeleteClick('123')}>Excluir</Button>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-[var(--neutral-border)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--neutral-text)]">
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--neutral-text-muted)]">
              Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-[var(--red-alert-300)] text-white hover:opacity-96"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

### 2.2 Especificações Visuais

```css
/* Dialog Overlay */
background: rgba(0, 0, 0, 0.5)
backdrop-filter: blur(4px)

/* Dialog Content */
background: white
border: 1px solid var(--neutral-border)
border-radius: 12px
padding: 24px
max-width: 500px
box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15)

/* Title */
font-size: 18px (h4 - automaticamente semibold)
color: var(--neutral-text)
margin-bottom: 8px

/* Description */
font-size: 14px
color: var(--neutral-text-muted)
line-height: 1.5

/* Footer */
display: flex
gap: 12px
justify-content: flex-end
margin-top: 24px

/* Botão Cancelar */
background: white
border: 1px solid var(--neutral-border)
color: var(--neutral-text)
hover:bg: var(--neutral-subtle)

/* Botão Ação Destrutiva */
background: var(--red-alert-300)
color: white
hover: opacity-96
```

### 2.3 Tipos de Diálogos

#### Exclusão (Destrutivo)
```tsx
<AlertDialogAction 
  onClick={handleDelete}
  className="bg-[var(--red-alert-300)] text-white hover:opacity-96"
>
  Excluir
</AlertDialogAction>
```

#### Confirmação Neutra
```tsx
<AlertDialogAction 
  onClick={handleConfirm}
  className="bg-[var(--blue-primary-200)] text-white hover:opacity-96"
>
  Confirmar
</AlertDialogAction>
```

#### Atenção/Cuidado
```tsx
<AlertDialogAction 
  onClick={handleProceed}
  className="bg-[var(--orange-alert-400)] text-white hover:opacity-96"
>
  Prosseguir
</AlertDialogAction>
```

---

## 3. Padrão de Integração

### 3.1 Fluxo Completo (Exemplo: Exclusão)

```tsx
// 1. Estado
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState<string | null>(null);

// 2. Trigger (botão de ação)
const handleDeleteClick = (e: React.MouseEvent, id: string) => {
  e.stopPropagation(); // Se dentro de elemento clicável
  setItemToDelete(id);
  setDeleteDialogOpen(true);
};

// 3. Confirmação
const handleConfirmDelete = () => {
  if (itemToDelete) {
    deleteItem(itemToDelete);
    
    // Toast de sucesso
    showToast.success({ 
      title: 'Item excluído com sucesso'
    });
    
    setItemToDelete(null);
  }
  setDeleteDialogOpen(false);
};

// 4. Cancelamento (automático via AlertDialogCancel)
// Não precisa handler, apenas fecha o dialog

// 5. UI
<DropdownMenuItem onClick={(e) => handleDeleteClick(e, item.id)}>
  <Trash2 className="mr-2 h-4 w-4" />
  Excluir
</DropdownMenuItem>

<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  {/* ... conteúdo ... */}
</AlertDialog>
```

### 3.2 Tratamento de Erros

```tsx
const handleConfirmDelete = async () => {
  if (!itemToDelete) return;
  
  try {
    await deleteItem(itemToDelete);
    
    showToast.success({ 
      title: 'Item excluído com sucesso'
    });
    
    setItemToDelete(null);
    setDeleteDialogOpen(false);
  } catch (error) {
    showToast.error({ 
      title: 'Erro ao excluir item',
      description: 'Tente novamente em alguns instantes'
    });
    // Dialog permanece aberto para nova tentativa
  }
};
```

---

## 4. Casos de Uso por Contexto

### 4.1 Notificações
```tsx
// Marcar como lida
showToast.success({ title: 'Notificação marcada como lida' });

// Excluir
showToast.success({ title: 'Notificação excluída com sucesso' });

// Erro ao processar
showToast.error({ 
  title: 'Erro ao processar',
  description: 'Tente novamente em alguns instantes'
});
```

### 4.2 Câmeras/Dispositivos
```tsx
// Conexão perdida
showToast.warning({ 
  title: 'Câmera offline detectada',
  description: 'Verifique a conexão do dispositivo'
});

// Reconexão
showToast.success({ 
  title: 'Câmera reconectada',
  description: 'Dispositivo está operacional'
});
```

### 4.3 Alertas IA
```tsx
// Classificação
showToast.success({ title: 'Alerta classificado com sucesso' });

// Falso positivo
showToast.info({ 
  title: 'Marcado como falso positivo',
  description: 'O sistema irá aprender com esta correção'
});
```

### 4.4 Financeiro
```tsx
// Pagamento confirmado
showToast.success({ 
  title: 'Pagamento confirmado',
  description: 'Recibo enviado por e-mail'
});

// Fatura vencida
showToast.warning({ 
  title: 'Fatura vencida',
  description: 'Regularize para manter o serviço ativo'
});
```

### 4.5 Configurações
```tsx
// Salvar alterações
showToast.success({ title: 'Configurações salvas com sucesso' });

// Perfil atualizado
showToast.success({ 
  title: 'Perfil atualizado',
  description: 'Suas informações foram atualizadas'
});
```

---

## 5. Boas Práticas

### 5.1 Toast
✅ **FAZER**
- Usar mensagens curtas e diretas
- Incluir descrição apenas se necessário para contexto
- Usar o tipo correto (success/error/info/warning)
- Duração padrão (3s) para maioria dos casos
- Permitir dismiss manual (X) sempre visível

❌ **EVITAR**
- Textos longos (quebra layout)
- Toasts em cascata (usar debounce se necessário)
- Informações críticas que precisam de ação (usar AlertDialog)
- Duração muito curta (<2s) ou muito longa (>5s)

### 5.2 AlertDialog
✅ **FAZER**
- Usar para ações destrutivas/irreversíveis
- Título claro e objetivo
- Descrição explicando consequências
- Botão de cancelamento sempre visível
- Botão de ação com cor apropriada (vermelho para destrutivo)
- Feedback com toast após confirmação

❌ **EVITAR**
- Uso excessivo (criar friction desnecessária)
- Múltiplos dialogs sobrepostos
- Textos longos (manter conciso)
- Botões com labels ambíguas

---

## 6. Integração com App.tsx

### 6.1 Setup Inicial

```tsx
// App.tsx
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <UserProfileProvider>
      <AppContent />
      <Toaster position="top-center" />
    </UserProfileProvider>
  );
}
```

### 6.2 Rotas de Showcase

- `/toast-showcase` - Demonstração completa do sistema de toasts
- Acesse via URL: `?screen=toast-showcase`

---

## 7. Customização

### 7.1 Adicionar Novo Tipo de Toast

```tsx
// toast-utils.tsx
const toastStyles = {
  // ... existentes
  custom: {
    bg: 'var(--sua-cor)',
    icon: <SeuIcone className="size-5 text-white" />,
  },
};

export const showToast = {
  // ... existentes
  custom: (options: ToastOptions) => createToast('custom', options),
};
```

### 7.2 Modificar Duração Global

```tsx
// toast-utils.tsx
function createToast(type: ToastType, { title, description, duration = 4000 }: ToastOptions) {
  // Alterado de 3000 para 4000
}
```

---

## 8. Dependências

- **Sonner**: `sonner@2.0.3` (biblioteca de toasts)
- **Radix AlertDialog**: Via shadcn/ui
- **Lucide Icons**: Para ícones dos toasts
- **Design Tokens**: `/styles/globals.css`

---

## Resumo Executivo

| Feature | Implementação | Status |
|---------|--------------|--------|
| Toast System | `/components/ui/toast-utils.tsx` | ✅ Completo |
| AlertDialog | Shadcn/ui component | ✅ Integrado |
| Showcase | `/components/ToastShowcase.tsx` | ✅ Disponível |
| Integração NotificationsScreen | Exemplo funcional | ✅ Implementado |
| Cores SegVision | Design tokens aplicados | ✅ Conforme |
| Tipografia | Inter + regras globais | ✅ Conforme |
| Documentação | Este arquivo | ✅ Completo |

---

**Design System**: SegVision Light Mode  
**Versão**: 1.0  
**Data**: Janeiro 2025
