import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ChevronRight, Info, Camera, Brain, Shield, Users, Zap, MessageCircle, ArrowLeft, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../../lib/supabase';

interface AIFeature {
  id: string;
  nome: string;
  descricao: string;
  enabled: boolean;
  consumo: 'baixo' | 'moderado' | 'alto';
}

interface Plan {
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

type PresetType = 'basic' | 'pro' | 'enterprise' | 'custom';

const presets: Record<PresetType, Partial<Plan>> = {
  basic: {
    nome: 'Plano Basic',
    subtitulo: 'Vigilância Essencial (1 Canal)',
    capacidadeRTSP: 1,
    capacityOver16: false,
    aiFeatures: [
      { id: 'detecaoObjetos', nome: 'Detecção de Objetos/Ações', descricao: 'Identifica armas, agressões e quedas em tempo real.', enabled: true, consumo: 'moderado' },
      { id: 'reconhecimentoFacial', nome: 'Reconhecimento Facial de Risco', descricao: 'Compara rostos detectados com banco de dados de indivíduos de risco.', enabled: false, consumo: 'alto' }
    ],
    suporte: 'padrao',
    historicoAlertas: false,
    precoMensal: 299.00,
    priceOnRequest: false,
  },
  pro: {
    nome: 'Plano Pro',
    subtitulo: 'Segurança Completa (Até 16 Canais)',
    capacidadeRTSP: 16,
    capacityOver16: false,
    aiFeatures: [
      { id: 'detecaoObjetos', nome: 'Detecção de Objetos/Ações', descricao: 'Identifica armas, agressões e quedas em tempo real.', enabled: true, consumo: 'moderado' },
      { id: 'reconhecimentoFacial', nome: 'Reconhecimento Facial de Risco', descricao: 'Compara rostos detectados com banco de dados de indivíduos de risco.', enabled: true, consumo: 'alto' }
    ],
    suporte: 'prioritario',
    historicoAlertas: true,
    precoMensal: 899.90,
    priceOnRequest: false,
  },
  enterprise: {
    nome: 'Plano Enterprise',
    subtitulo: 'Solução Customizada (Escala Ilimitada)',
    capacidadeRTSP: null,
    capacityOver16: true,
    aiFeatures: [
      { id: 'detecaoObjetos', nome: 'Detecção de Objetos/Ações', descricao: 'Identifica armas, agressões e quedas em tempo real.', enabled: true, consumo: 'moderado' },
      { id: 'reconhecimentoFacial', nome: 'Reconhecimento Facial de Risco', descricao: 'Compara rostos detectados com banco de dados de indivíduos de risco.', enabled: true, consumo: 'alto' }
    ],
    suporte: 'dedicado',
    historicoAlertas: true,
    precoMensal: null,
    priceOnRequest: true,
  },
  custom: {}
};

interface AdminCreatePlanScreenProps {
  onBack: () => void;
  onSave: (plan: Plan) => void;
  editingPlan?: Plan | null;
}

export function AdminCreatePlanScreen({ onBack, onSave, editingPlan }: AdminCreatePlanScreenProps) {
  const [selectedPreset, setSelectedPreset] = useState<PresetType>(editingPlan ? 'custom' : 'basic');
  const [allowAdvancedEdit, setAllowAdvancedEdit] = useState(!!editingPlan);

  const [formData, setFormData] = useState<Partial<Plan>>(
    editingPlan || {
      nome: '',
      subtitulo: '',
      capacidadeRTSP: 1,
      capacityOver16: false,
      aiFeatures: [
        { id: 'detecaoObjetos', nome: 'Detecção de Objetos/Ações', descricao: 'Identifica armas, agressões e quedas em tempo real.', enabled: true, consumo: 'moderado' },
        { id: 'reconhecimentoFacial', nome: 'Reconhecimento Facial de Risco', descricao: 'Compara rostos detectados com banco de dados de indivíduos de risco.', enabled: false, consumo: 'alto' }
      ],
      suporte: 'padrao',
      historicoAlertas: false,
      precoMensal: 0,
      priceOnRequest: false,
      observacoes: '',
      exibirPublicamente: true,
    }
  );

  const applyPreset = (preset: PresetType) => {
    setSelectedPreset(preset);
    if (preset !== 'custom') {
      setFormData({ ...formData, ...presets[preset] });
      setAllowAdvancedEdit(false);
    } else {
      setAllowAdvancedEdit(true);
    }
  };

  const handleSavePlan = async () => {
    // Validações
    if (!formData.nome || formData.nome.length < 5 || formData.nome.length > 40) {
      toast.error('Nome do plano deve ter entre 5 e 40 caracteres');
      return;
    }

    if (!formData.subtitulo || formData.subtitulo.length < 5 || formData.subtitulo.length > 60) {
      toast.error('Subtítulo deve ter entre 5 e 60 caracteres');
      return;
    }

    if (!formData.capacityOver16 && (!formData.capacidadeRTSP || formData.capacidadeRTSP < 1)) {
      toast.error('Capacidade mínima é 1 link RTSP');
      return;
    }

    try {
      // Mapear dados do frontend (camelCase) para banco (snake_case)
      const dbData = {
        nome: formData.nome!,
        subtitulo: formData.subtitulo!,
        capacidade_rtsp: formData.capacityOver16 ? null : formData.capacidadeRTSP!,
        capacity_over_16: formData.capacityOver16!,
        ai_features: formData.aiFeatures!,
        suporte: formData.suporte!,
        historico_alertas: formData.historicoAlertas!,
        preco_mensal: formData.priceOnRequest ? null : formData.precoMensal!,
        price_on_request: formData.priceOnRequest!,
        observacoes: formData.observacoes || null,
        exibir_publicamente: formData.exibirPublicamente!,
      };

      if (editingPlan) {
        // UPDATE
        const { error: updateError } = await supabase
          .from('pricing_plans')
          .update(dbData)
          .eq('id', editingPlan.id);

        if (updateError) throw updateError;

        toast.success('Plano atualizado com sucesso');
      } else {
        // INSERT
        const { error: insertError } = await supabase
          .from('pricing_plans')
          .insert(dbData);

        if (insertError) throw insertError;

        toast.success('Plano criado com sucesso');
      }

      // Notifica o wrapper para refresh
      const planToSave: Plan = {
        id: editingPlan?.id || 'temp',
        nome: formData.nome!,
        subtitulo: formData.subtitulo!,
        capacidadeRTSP: formData.capacityOver16 ? null : formData.capacidadeRTSP!,
        capacityOver16: formData.capacityOver16!,
        aiFeatures: formData.aiFeatures!,
        suporte: formData.suporte!,
        historicoAlertas: formData.historicoAlertas!,
        precoMensal: formData.priceOnRequest ? null : formData.precoMensal!,
        priceOnRequest: formData.priceOnRequest!,
        observacoes: formData.observacoes,
        exibirPublicamente: formData.exibirPublicamente!,
      };

      onSave(planToSave);
    } catch (err: any) {
      console.error('Erro ao salvar plano:', err);
      toast.error(err.message || 'Erro ao salvar plano');
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData({
      ...formData,
      aiFeatures: formData.aiFeatures?.map(f =>
        f.id === featureId ? { ...f, enabled: !f.enabled } : f
      )
    });
  };

  const getConsumoColor = (consumo: string) => {
    switch (consumo) {
      case 'baixo': return 'text-[var(--green-alert-300)]';
      case 'moderado': return 'text-[var(--yellow-alert-400)]';
      case 'alto': return 'text-[var(--red-alert-300)]';
      default: return 'text-[var(--neutral-text-muted)]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-[var(--neutral-text-muted)]">
          <span>Planos & Preços</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[var(--neutral-text)]">
            {editingPlan ? 'Editar Plano' : 'Criar Novo Plano'}
          </span>
        </div>
        <Button 
          onClick={onBack}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Planos & Preços
        </Button>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[var(--neutral-text)]">
            {editingPlan ? 'Editar Plano' : 'Criar Novo Plano'}
          </h2>
          <p className="text-[var(--neutral-text-muted)] mt-1">
            {editingPlan ? 'Atualize as configurações do plano' : 'Configure um novo plano de assinatura para o sistema'}
          </p>
        </div>
      </div>

      {/* Presets Selection */}
      {!editingPlan && (
        <Card className="bg-[var(--card)] border-[var(--neutral-border)]">
          <CardHeader>
            <CardTitle className="text-[var(--neutral-text)]">1. Escolha um Preset</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedPreset} onValueChange={(value: PresetType) => applyPreset(value)}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Basic */}
                <label className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPreset === 'basic' ? 'border-[var(--primary-bg)] bg-[var(--primary-bg)]/5' : 'border-[var(--neutral-border)] hover:border-[var(--primary-bg)]/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <RadioGroupItem value="basic" id="basic" />
                    <h4 className="text-[var(--neutral-text)]">Basic</h4>
                  </div>
                  <p className="text-sm text-[var(--neutral-text-muted)]">1 Canal RTSP, Detecção básica</p>
                </label>

                {/* Pro */}
                <label className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPreset === 'pro' ? 'border-[var(--primary-bg)] bg-[var(--primary-bg)]/5' : 'border-[var(--neutral-border)] hover:border-[var(--primary-bg)]/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <RadioGroupItem value="pro" id="pro" />
                    <h4 className="text-[var(--neutral-text)]">Pro</h4>
                  </div>
                  <p className="text-sm text-[var(--neutral-text-muted)]">Até 16 Canais, IA Avançada</p>
                </label>

                {/* Enterprise */}
                <label className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPreset === 'enterprise' ? 'border-[var(--primary-bg)] bg-[var(--primary-bg)]/5' : 'border-[var(--neutral-border)] hover:border-[var(--primary-bg)]/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <RadioGroupItem value="enterprise" id="enterprise" />
                    <h4 className="text-[var(--neutral-text)]">Enterprise</h4>
                  </div>
                  <p className="text-sm text-[var(--neutral-text-muted)]">Ilimitado, Tudo incluso</p>
                </label>

                {/* Custom */}
                <label className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPreset === 'custom' ? 'border-[var(--primary-bg)] bg-[var(--primary-bg)]/5' : 'border-[var(--neutral-border)] hover:border-[var(--primary-bg)]/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <h4 className="text-[var(--neutral-text)]">Personalizado</h4>
                  </div>
                  <p className="text-sm text-[var(--neutral-text-muted)]">Configure do zero</p>
                </label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card className="bg-[var(--card)] border-[var(--neutral-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)]">
            {editingPlan ? '1. Informações Básicas' : '2. Informações Básicas'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[var(--neutral-text)]">
                Nome do Plano <span className="text-[var(--red-alert-200)]">*</span>
              </Label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Plano Basic"
                disabled={!allowAdvancedEdit && selectedPreset !== 'custom'}
                className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
              />
              <p className="text-xs text-[var(--neutral-text-muted)]">5-40 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label className="text-[var(--neutral-text)]">
                Subtítulo <span className="text-[var(--red-alert-200)]">*</span>
              </Label>
              <Input
                value={formData.subtitulo}
                onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                placeholder="Ex: Vigilância Essencial"
                disabled={!allowAdvancedEdit && selectedPreset !== 'custom'}
                className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
              />
              <p className="text-xs text-[var(--neutral-text-muted)]">5-60 caracteres</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacity Configuration */}
      <Card className="bg-[var(--card)] border-[var(--neutral-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)]">
            {editingPlan ? '2. Capacidade de Canais RTSP' : '3. Capacidade de Canais RTSP'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--neutral-bg)] border border-[var(--neutral-border)]">
            <div>
              <h4 className="text-[var(--neutral-text)]">Capacidade Ilimitada</h4>
              <p className="text-sm text-[var(--neutral-text-muted)]">Para planos Enterprise ou customizados</p>
            </div>
            <Switch
              checked={formData.capacityOver16}
              onCheckedChange={(checked) => setFormData({ ...formData, capacityOver16: checked, capacidadeRTSP: checked ? null : 1 })}
              disabled={!allowAdvancedEdit && selectedPreset !== 'custom'}
            />
          </div>

          {!formData.capacityOver16 && (
            <div className="space-y-2">
              <Label className="text-[var(--neutral-text)]">
                Número de Canais RTSP <span className="text-[var(--red-alert-200)]">*</span>
              </Label>
              <Input
                type="number"
                min={1}
                value={formData.capacidadeRTSP || ''}
                onChange={(e) => setFormData({ ...formData, capacidadeRTSP: parseInt(e.target.value) || 0 })}
                disabled={!allowAdvancedEdit && selectedPreset !== 'custom'}
                className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card className="bg-[var(--card)] border-[var(--neutral-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)]">
            {editingPlan ? '3. Funcionalidades de IA' : '4. Funcionalidades de IA'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {formData.aiFeatures?.map((feature) => (
            <div key={feature.id} className="flex items-start justify-between p-4 rounded-lg bg-[var(--neutral-bg)] border border-[var(--neutral-border)]">
              <div className="flex items-start gap-3 flex-1">
                <Checkbox
                  checked={feature.enabled}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                  disabled={!allowAdvancedEdit && selectedPreset !== 'custom'}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[var(--neutral-text)]">{feature.nome}</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-[var(--neutral-text-muted)]" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-[var(--card)] border-[var(--neutral-border)]">
                          <p className="text-[var(--neutral-text-muted)]">{feature.descricao}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-[var(--neutral-text-muted)] mt-1">{feature.descricao}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Zap className={`h-4 w-4 ${getConsumoColor(feature.consumo)}`} />
                    <span className={`text-xs ${getConsumoColor(feature.consumo)}`}>
                      Consumo: {feature.consumo.charAt(0).toUpperCase() + feature.consumo.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Support & Features */}
      <Card className="bg-[var(--card)] border-[var(--neutral-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)]">
            {editingPlan ? '4. Suporte e Recursos Extras' : '5. Suporte e Recursos Extras'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[var(--neutral-text)]">Nível de Suporte</Label>
            <Select
              value={formData.suporte}
              onValueChange={(value: 'padrao' | 'prioritario' | 'dedicado') => setFormData({ ...formData, suporte: value })}
              disabled={!allowAdvancedEdit && selectedPreset !== 'custom'}
            >
              <SelectTrigger className="border-[var(--neutral-border)] bg-[var(--neutral-bg)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                <SelectItem value="padrao">Padrão (Email)</SelectItem>
                <SelectItem value="prioritario">Prioritário (Email + Chat)</SelectItem>
                <SelectItem value="dedicado">Dedicado 24/7 (Gerente Exclusivo)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--neutral-bg)] border border-[var(--neutral-border)]">
            <div>
              <h4 className="text-[var(--neutral-text)]">Histórico de Alertas Completo</h4>
              <p className="text-sm text-[var(--neutral-text-muted)]">Acesso ilimitado ao histórico de eventos</p>
            </div>
            <Switch
              checked={formData.historicoAlertas}
              onCheckedChange={(checked) => setFormData({ ...formData, historicoAlertas: checked })}
              disabled={!allowAdvancedEdit && selectedPreset !== 'custom'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="bg-[var(--card)] border-[var(--neutral-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)]">
            {editingPlan ? '5. Precificação' : '6. Precificação'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--neutral-bg)] border border-[var(--neutral-border)]">
            <div>
              <h4 className="text-[var(--neutral-text)]">Sob Consulta</h4>
              <p className="text-sm text-[var(--neutral-text-muted)]">Preço será negociado com o cliente</p>
            </div>
            <Switch
              checked={formData.priceOnRequest}
              onCheckedChange={(checked) => setFormData({ ...formData, priceOnRequest: checked, precoMensal: checked ? null : 0 })}
              disabled={!allowAdvancedEdit && selectedPreset !== 'custom'}
            />
          </div>

          {!formData.priceOnRequest && (
            <div className="space-y-2">
              <Label className="text-[var(--neutral-text)]">
                Preço Mensal (R$) <span className="text-[var(--red-alert-200)]">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={formData.precoMensal || ''}
                onChange={(e) => setFormData({ ...formData, precoMensal: parseFloat(e.target.value) || 0 })}
                disabled={!allowAdvancedEdit && selectedPreset !== 'custom'}
                className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Settings */}
      <Card className="bg-[var(--card)] border-[var(--neutral-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)]">
            {editingPlan ? '6. Configurações Adicionais' : '7. Configurações Adicionais'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--neutral-bg)] border border-[var(--neutral-border)]">
            <div>
              <h4 className="text-[var(--neutral-text)]">Exibir Publicamente</h4>
              <p className="text-sm text-[var(--neutral-text-muted)]">Tornar plano visível para novos clientes</p>
            </div>
            <Switch
              checked={formData.exibirPublicamente}
              onCheckedChange={(checked) => setFormData({ ...formData, exibirPublicamente: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--neutral-text)]">Observações Internas</Label>
            <Textarea
              value={formData.observacoes || ''}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Notas ou detalhes adicionais sobre este plano..."
              className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)] min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSavePlan}
          className="bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
        >
          {editingPlan ? 'Atualizar Plano' : 'Criar Plano'}
        </Button>
      </div>
    </div>
  );
}