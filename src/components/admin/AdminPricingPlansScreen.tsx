import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, X, Plus, Pencil, Trash2, Info, Brain, Shield, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { toast } from 'sonner@2.0.3';
import { useIsMobile } from '../ui/use-mobile';
import { EmptyState } from '../EmptyState';
import { supabase } from '../../lib/supabase';

interface AIFeature {
  id: string;
  nome: string;
  descricao: string;
  enabled: boolean;
  consumo: 'baixo' | 'moderado' | 'alto';
}

export interface Plan {
  id: string;
  nome: string;
  subtitulo: string;
  capacidadeRTSP: number | null;
  capacityOver16: boolean;
  aiFeatures: AIFeature[];
  suporte: 'padrao' | 'prioritario' | 'dedicado';
  historicoAlertas: boolean;
  precoMensal: number | null;
  priceOnRequest: boolean;
  observacoes?: string;
  exibirPublicamente: boolean;
}

interface AdminPricingPlansScreenProps {
  onCreatePlan: () => void;
  onEditPlan: (plan: Plan) => void;
  isFirstAccess?: boolean;
  refreshTrigger?: number;
}

export function AdminPricingPlansScreen({ onCreatePlan, onEditPlan, isFirstAccess = false, refreshTrigger }: AdminPricingPlansScreenProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Mapeia dados do banco (snake_case) para formato do frontend (camelCase)
  const mapDbPlanToFrontend = (dbPlan: any): Plan => {
    return {
      id: dbPlan.id,
      nome: dbPlan.nome,
      subtitulo: dbPlan.subtitulo,
      capacidadeRTSP: dbPlan.capacidade_rtsp,
      capacityOver16: dbPlan.capacity_over_16,
      aiFeatures: dbPlan.ai_features,
      suporte: dbPlan.suporte,
      historicoAlertas: dbPlan.historico_alertas,
      precoMensal: dbPlan.preco_mensal,
      priceOnRequest: dbPlan.price_on_request,
      observacoes: dbPlan.observacoes,
      exibirPublicamente: dbPlan.exibir_publicamente,
    };
  };

  // Carrega planos do Supabase
  const loadPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const mappedPlans = (data || []).map(mapDbPlanToFrontend);
      setPlans(mappedPlans);
    } catch (err: any) {
      console.error('Erro ao carregar planos:', err);
      setError(err.message || 'Erro ao carregar planos');
      toast.error('Erro ao carregar planos de preços');
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega dados na montagem
  useEffect(() => {
    loadPlans();
  }, []);

  // Recarrega quando refreshTrigger mudar (após criar/editar)
  useEffect(() => {
    if (refreshTrigger) {
      loadPlans();
    }
  }, [refreshTrigger]);

  // Deleta plano do Supabase
  const handleDeletePlan = async () => {
    if (!planToDelete) return;

    try {
      const { error: deleteError } = await supabase
        .from('pricing_plans')
        .delete()
        .eq('id', planToDelete);

      if (deleteError) throw deleteError;

      // Remove da lista local
      setPlans(plans.filter(p => p.id !== planToDelete));
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
      toast.success('Plano excluído com sucesso');
    } catch (err: any) {
      console.error('Erro ao excluir plano:', err);
      toast.error('Erro ao excluir plano');
    }
  };

  const getCapacityDisplay = (plan: Plan) => {
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button
            disabled
            className="gap-2 bg-[var(--primary-bg)] text-white hover:opacity-96"
          >
            <Plus className="h-4 w-4" />
            Novo Plano
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-[var(--neutral-text-muted)]">Carregando planos...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no plans
  if (plans.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button
            onClick={onCreatePlan}
            className="gap-2 bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
          >
            <Plus className="h-4 w-4" />
            Criar Primeiro Plano
          </Button>
        </div>
        <EmptyState
          icon={Shield}
          title="Nenhum plano cadastrado"
          description="Crie os planos de preços que as escolas poderão contratar. Você pode configurar recursos, valores e limites para cada plano."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-end">
        <Button 
          onClick={onCreatePlan}
          className="gap-2 bg-[var(--primary-bg)] text-white hover:opacity-96"
        >
          <Plus className="h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      {/* Info Card sobre IA */}
      <Card className="border-[var(--turquoise-alert-400)] bg-[var(--turquoise-alert-50)] dark:bg-[var(--turquoise-alert-400)]/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-[var(--turquoise-alert-400)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[var(--neutral-text)] mb-1">Precificação Baseada em Recursos de IA</h4>
              <p className="text-sm text-[var(--neutral-text-muted)]">
                Os planos evidenciam capacidade (número de links RTSP) e recursos de IA que consomem tokens. 
                Features como <strong>Reconhecimento Facial</strong> exigem maior processamento e têm custos elevados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-200 flex flex-col border-[var(--neutral-border)] hover:border-[var(--primary-bg)]/50 hover:shadow-lg ${
              plan.id === 'pro' ? 'ring-2 ring-[var(--primary-bg)]/20' : ''
            }`}
          >
            {plan.id === 'pro' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="px-4 py-1.5 bg-[var(--primary-bg)] text-white rounded-md text-sm">
                  Mais Popular
                </div>
              </div>
            )}

            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-[var(--neutral-text)] mb-1">{plan.nome}</h3>
                  {!plan.exibirPublicamente && (
                    <Badge variant="light" tone="caution" size="s" className="mt-1">
                      Privado
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditPlan(plan)}
                    className="h-8 w-8 p-0 border-[var(--neutral-border)]"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPlanToDelete(plan.id);
                      setDeleteDialogOpen(true);
                    }}
                    className="h-8 w-8 p-0 border-[var(--danger-border)] text-[var(--danger-bg)] hover:bg-[var(--danger-bg)] hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
                    {plan.priceOnRequest ? 'Sob Consulta' : `R$ ${plan.precoMensal?.toFixed(2).replace('.', ',')}`}
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
                disabled
                className="w-full h-11 rounded-lg bg-[var(--gray-200)] text-white cursor-not-allowed opacity-60"
              >
                {plan.id === 'enterprise' ? 'Falar com Vendas' : `Assinar ${plan.nome}`}
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
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[var(--card)] border-[var(--neutral-border)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--neutral-text)]">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--neutral-text-muted)]">
              Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlan}
              className="bg-[var(--danger-bg)] text-white hover:opacity-96 border-0"
            >
              Excluir Plano
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
              Entenda como cada recurso de IA consome tokens de processamento
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="p-4 border border-[var(--neutral-border)] rounded-lg">
                <h4 className="text-[var(--neutral-text)] mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[var(--green-alert-400)]" />
                  Detecção de Objetos/Ações
                </h4>
                <p className="text-sm text-[var(--neutral-text-muted)]">
                  Identifica armas, agressões e quedas em tempo real. Consome <strong>tokens de inferência por evento processado</strong>. 
                  Consumo moderado, ideal para vigilância contínua.
                </p>
              </div>

              <div className="p-4 border border-[var(--neutral-border)] rounded-lg">
                <h4 className="text-[var(--neutral-text)] mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[var(--yellow-alert-400)]" />
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