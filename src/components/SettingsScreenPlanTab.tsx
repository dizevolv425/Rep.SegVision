import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Package,
  CreditCard,
  CheckCircle,
  Check,
  X,
  Brain,
  Shield,
  Info
} from 'lucide-react';
import { useIsMobile } from './ui/use-mobile';

interface AIFeature {
  id: string;
  nome: string;
  descricao: string;
  enabled: boolean;
  consumo: 'baixo' | 'moderado' | 'alto';
}

interface PlanTabProps {
  currentPlan: {
    name: string;
    price: number | null;
    billingCycle: string;
    cameras: number;
    users: number;
    storage: string;
    startDate: string;
    nextBilling: string;
    status: string;
  };
  paymentMethod: {
    type: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    brand: string;
  };
  plans: Array<{
    id: string;
    name: string;
    subtitle: string;
    price: number | null;
    priceOnRequest: boolean;
    capacidadeRTSP: number | null;
    capacityOver16: boolean;
    aiFeatures: AIFeature[];
    suporte: 'padrao' | 'prioritario' | 'dedicado';
    historicoAlertas: boolean;
  }>;
  selectedPlanId: string | null;
  setSelectedPlanId: (id: string | null) => void;
  isChangePlanDialogOpen: boolean;
  setIsChangePlanDialogOpen: (open: boolean) => void;
  isCancelPlanDialogOpen: boolean;
  setIsCancelPlanDialogOpen: (open: boolean) => void;
  isUpdatePaymentDialogOpen: boolean;
  setIsUpdatePaymentDialogOpen: (open: boolean) => void;
  newCardData: {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  };
  setNewCardData: (data: any) => void;
  handleChangePlan: () => void;
  handleCancelPlan: () => void;
  handleUpdatePaymentMethod: () => void;
}

export function PlanTab({
  currentPlan,
  paymentMethod,
  plans,
  selectedPlanId,
  setSelectedPlanId,
  isChangePlanDialogOpen,
  setIsChangePlanDialogOpen,
  isCancelPlanDialogOpen,
  setIsCancelPlanDialogOpen,
  isUpdatePaymentDialogOpen,
  setIsUpdatePaymentDialogOpen,
  newCardData,
  setNewCardData,
  handleChangePlan,
  handleCancelPlan,
  handleUpdatePaymentMethod
}: PlanTabProps) {
  const [confirmPlanDialogOpen, setConfirmPlanDialogOpen] = React.useState(false);
  const [planToConfirm, setPlanToConfirm] = React.useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);
  const [autoPaymentEnabled, setAutoPaymentEnabled] = React.useState(true);
  const isMobile = useIsMobile();

  const handlePlanSelection = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan && plan.name !== currentPlan.name) {
      setPlanToConfirm(planId);
      setConfirmPlanDialogOpen(true);
    }
  };

  const confirmPlanChange = () => {
    if (planToConfirm) {
      setSelectedPlanId(planToConfirm);
      handleChangePlan();
      setConfirmPlanDialogOpen(false);
      setPlanToConfirm(null);
    }
  };

  const getCapacityDisplay = (plan: typeof plans[0]) => {
    if (plan.capacityOver16) return '+16 Links RTSP';
    if (plan.capacidadeRTSP === 1) return '1 Link RTSP Ativo';
    return `Até ${plan.capacidadeRTSP} Links RTSP Ativos`;
  };

  const getSupporteLabel = (suporte: string) => {
    switch (suporte) {
      case 'padrao': return 'Padrão';
      case 'prioritario': return 'Prioritário';
      case 'dedicado': return 'Dedicado';
      default: return suporte;
    }
  };

  return (
    <div className="space-y-6">
      {/* Plano Atual e Método de Pagamento - Lado a Lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plano Atual - Card Visual */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle>Seu Plano Atual</CardTitle>
                  <Badge variant="heavy" tone="success" size="s">Ativo</Badge>
                </div>
                <CardDescription>Detalhes e informações do seu plano</CardDescription>
              </div>
              <div className="w-12 h-12 rounded-lg bg-[var(--primary-bg)]/10 flex items-center justify-center text-[var(--primary-bg)]">
                <Package className="h-8 w-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {/* Pricing */}
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl text-[var(--neutral-text)]">R$ {currentPlan.price.toFixed(2)}</span>
                <span className="text-sm text-[var(--neutral-text-muted)]">/mês</span>
              </div>
              <p className="text-[var(--neutral-text)]">{currentPlan.name}</p>
              <p className="text-sm text-[var(--neutral-text-muted)] mt-1">
                Renovação automática em {new Date(currentPlan.nextBilling).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardContent>
          
          {/* Actions */}
          <div className="px-6 pb-6">
            <Button 
              onClick={() => setIsCancelPlanDialogOpen(true)} 
              variant="outline"
              className="w-full border-[var(--red-alert-300)] text-[var(--red-alert-300)] hover:bg-[var(--red-alert-300)] hover:text-white"
            >
              Cancelar Plano
            </Button>
          </div>
        </Card>

        {/* Método de Pagamento */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Método de Pagamento</CardTitle>
                <CardDescription>Cartão de crédito cadastrado</CardDescription>
              </div>
              <Button 
                onClick={() => setIsUpdatePaymentDialogOpen(true)} 
                variant="outline"
                size="sm"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-[var(--primary-bg)] to-[#1a3fbf] rounded-xl p-8 text-white min-h-[200px] flex flex-col justify-between">
              <div className="flex items-start justify-between mb-12">
                <div>
                  <p className="text-sm opacity-80 mb-2">Cartão de Crédito</p>
                  <p className="text-2xl tracking-wider">{paymentMethod.cardNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80">{paymentMethod.brand}</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm opacity-80 mb-1">Titular</p>
                  <p className="text-lg">{paymentMethod.cardHolder}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80 mb-1">Validade</p>
                  <p className="text-lg">{paymentMethod.expiryDate}</p>
                </div>
              </div>
            </div>

            {/* Pagamento Automático */}
            <div className="pt-4 border-t border-[var(--neutral-border)]">
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[var(--neutral-text)]">Pagamento Automático</h4>
                    {autoPaymentEnabled && (
                      <Badge variant="heavy" tone="success" size="s">Ativo</Badge>
                    )}
                  </div>
                  <p className="text-sm text-[var(--neutral-text-muted)]">
                    {autoPaymentEnabled 
                      ? 'As faturas serão cobradas automaticamente no cartão cadastrado na data de vencimento'
                      : 'Você receberá notificações para realizar o pagamento manualmente via boleto ou PIX'
                    }
                  </p>
                </div>
                <Switch
                  checked={autoPaymentEnabled}
                  onCheckedChange={setAutoPaymentEnabled}
                  className="data-[state=checked]:bg-[var(--primary-bg)]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Todos os Planos Disponíveis */}
      <div>
        <div className="mb-4">
          <h4 className="text-[var(--neutral-text)] mb-1">Planos Disponíveis</h4>
          <p className="text-sm text-[var(--neutral-text-muted)]">Escolha o plano que melhor atende às suas necessidades</p>
        </div>

        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan.name === plan.name;
            
            return (
              <Card
                key={plan.id}
                className={`relative transition-all duration-200 flex flex-col hover:shadow-lg ${
                  plan.id === 'pro' && !isCurrentPlan ? 'ring-2 ring-[var(--primary-bg)]/20 border-[var(--neutral-border)]' : ''
                } ${isCurrentPlan ? 'border-2 border-[var(--primary-bg)]' : 'border-[var(--neutral-border)] hover:border-[var(--primary-bg)]/50'}`}
              >
                {plan.id === 'pro' && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="px-4 py-1.5 bg-[var(--primary-bg)] text-white rounded-md text-sm">
                      Mais Popular
                    </div>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="px-4 py-1.5 bg-[var(--primary-bg)] text-white rounded-md text-sm">
                      Plano Atual
                    </div>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-[var(--neutral-text)] mb-1">{plan.name}</h3>
                    </div>
                  </div>

                  {/* Capacidade Máxima Badge */}
                  <div className="mb-4">
                    <Badge variant="medium" tone="info" size="m">
                      Capacidade Máxima: {getCapacityDisplay(plan)}
                    </Badge>
                  </div>

                  {/* Preço */}
                  <div className="mb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl text-[var(--neutral-text)]">
                        {plan.priceOnRequest ? 'Sob Consulta' : `R$ ${plan.price?.toFixed(2).replace('.', ',')}`}
                      </span>
                      {!plan.priceOnRequest && (
                        <span className="text-sm text-[var(--neutral-text-muted)]">/mês</span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Recursos de IA */}
                  <div className="space-y-3">
                    <h4 className="text-[var(--neutral-text)] flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Recursos de IA
                    </h4>
                    
                    <TooltipProvider>
                      <div className="space-y-2">
                        {plan.aiFeatures.map((feature) => (
                          <div key={feature.id} className="flex items-start gap-2">
                            {feature.enabled ? (
                              <Check className="h-4 w-4 text-[var(--green-alert-400)] flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="h-4 w-4 text-[var(--gray-300)] flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 flex items-center gap-2">
                              <span className={`text-sm ${feature.enabled ? 'text-[var(--neutral-text)]' : 'text-[var(--neutral-text-muted)] line-through'}`}>
                                {feature.nome}
                              </span>
                              {!feature.enabled && plan.id === 'basic' && feature.id === 'reconhecimentoFacial' && (
                                <Badge variant="light" tone="caution" size="s">Add-on</Badge>
                              )}
                              {feature.enabled && feature.descricao && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-[var(--neutral-text-muted)]" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p className="text-xs">{feature.descricao}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TooltipProvider>
                  </div>

                  {/* Suporte e Histórico */}
                  <div className="space-y-2 pt-2 border-t border-[var(--neutral-border)]">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-[var(--neutral-text-muted)]" />
                      <span className="text-[var(--neutral-text)]">Suporte: {getSupporteLabel(plan.suporte)}</span>
                    </div>
                    {plan.historicoAlertas && (
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-[var(--green-alert-400)]" />
                        <span className="text-[var(--neutral-text)]">Histórico Completo de Alertas</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Action Buttons */}
                <div className="p-6 pt-0 space-y-2">
                  <Button
                    onClick={() => handlePlanSelection(plan.id)}
                    disabled={isCurrentPlan}
                    className={`w-full h-11 rounded-lg ${
                      isCurrentPlan
                        ? 'bg-[var(--gray-200)] text-white opacity-60 cursor-not-allowed'
                        : 'bg-[var(--primary-bg)] text-white hover:opacity-96'
                    }`}
                  >
                    {isCurrentPlan ? 'Plano Atual' : plan.id === 'enterprise' ? 'Falar com Vendas' : `Assinar ${plan.name}`}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[var(--primary-bg)] hover:bg-[var(--primary-bg)]/10"
                    onClick={() => setDetailsModalOpen(true)}
                  >
                    Ver detalhes do que a IA faz
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dialog: Cancelar Plano */}
      <AlertDialog open={isCancelPlanDialogOpen} onOpenChange={setIsCancelPlanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Plano</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja cancelar o seu plano atual? Você terá acesso até o fim do período de faturamento ({new Date(currentPlan.nextBilling).toLocaleDateString('pt-BR')}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelPlan}
              className="bg-[var(--red-alert-300)] text-white hover:opacity-95"
            >
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog: Atualizar Cartão */}
      <Dialog open={isUpdatePaymentDialogOpen} onOpenChange={setIsUpdatePaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Cartão de Crédito</DialogTitle>
            <DialogDescription>
              Preencha os dados do seu novo cartão de crédito
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-card-number">Número do Cartão</Label>
              <Input
                id="new-card-number"
                value={newCardData.cardNumber}
                onChange={(e) => setNewCardData({ ...newCardData, cardNumber: e.target.value })}
                placeholder="**** **** **** 1234"
                className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-card-holder">Titular do Cartão</Label>
              <Input
                id="new-card-holder"
                value={newCardData.cardHolder}
                onChange={(e) => setNewCardData({ ...newCardData, cardHolder: e.target.value })}
                placeholder="Nome completo"
                className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-card-expiry">Data de Vencimento</Label>
                <Input
                  id="new-card-expiry"
                  value={newCardData.expiryDate}
                  onChange={(e) => setNewCardData({ ...newCardData, expiryDate: e.target.value })}
                  placeholder="MM/AA"
                  className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-card-cvv">CVV</Label>
                <Input
                  id="new-card-cvv"
                  value={newCardData.cvv}
                  onChange={(e) => setNewCardData({ ...newCardData, cvv: e.target.value })}
                  placeholder="123"
                  type="password"
                  maxLength={3}
                  className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsUpdatePaymentDialogOpen(false);
              setNewCardData({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
            }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdatePaymentMethod} className="bg-[var(--primary-bg)] text-white hover:opacity-95">
              Atualizar Cartão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Confirmar Alteração de Plano */}
      <AlertDialog open={confirmPlanDialogOpen} onOpenChange={setConfirmPlanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Alteração de Plano</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja alterar para o plano selecionado?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmPlanChange}
              className="bg-[var(--primary-bg)] text-white hover:opacity-95"
            >
              Confirmar Alteração
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details Modal sobre IA */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl bg-[var(--card)] border-[var(--neutral-border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--neutral-text)]">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-[var(--primary-bg)]" />
                Detalhes do Consumo de IA
              </div>
            </DialogTitle>
            <DialogDescription className="text-[var(--neutral-text-muted)]">
              Entenda como cada recurso de IA funciona no seu plano
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="p-4 border border-[var(--neutral-border)] rounded-lg">
                <h4 className="text-[var(--neutral-text)] mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[var(--green-alert-400)]" />
                  Detecção de Objetos/Ações
                </h4>
                <p className="text-sm text-[var(--neutral-text-muted)]">
                  Identifica armas, agressões e quedas em tempo real. Consome <strong>tokens de inferência por evento processado</strong>. 
                  Consumo moderado, ideal para vigilância contínua.
                </p>
              </div>

              <div className="p-4 border border-[var(--neutral-border)] rounded-lg">
                <h4 className="text-[var(--neutral-text)] mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[var(--yellow-alert-400)]" />
                  Reconhecimento Facial de Risco
                </h4>
                <p className="text-sm text-[var(--neutral-text-muted)]">
                  Compara rostos detectados com banco de dados de indivíduos de risco. Consome <strong>mais tokens por comparação facial</strong> 
                  devido à complexidade do matching. Disponível no Plano Pro e Enterprise.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--neutral-border)]">
              <p className="text-sm text-[var(--neutral-text-muted)]">
                <strong className="text-[var(--neutral-text)]">Nota:</strong> O consumo de tokens varia conforme volume de processamento. 
                Escolas com muitas câmeras ou alta atividade terão consumo proporcional maior.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setDetailsModalOpen(false)}
                className="bg-[var(--primary-bg)] text-white hover:opacity-96"
              >
                Entendido
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}