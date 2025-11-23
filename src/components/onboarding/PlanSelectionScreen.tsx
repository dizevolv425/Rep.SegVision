import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, Sparkles, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface PlanSelectionScreenProps {
  onSelectPlan: (planType: 'basic' | 'pro' | 'enterprise') => void;
}

export function PlanSelectionScreen({ onSelectPlan }: PlanSelectionScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      tagline: 'Vigilância Essencial',
      subtitle: '1 Canal RTSP',
      price: 'R$ 299,00',
      setup: 'R$ 0,00',
      period: '/mês',
      features: [
        { text: '1 Link RTSP ativo', highlight: false },
        { text: 'Detecção de Objetos/Ações', highlight: true, aiToken: true },
        { text: 'Armas, Agressão, Queda', highlight: false },
        { text: 'Suporte padrão', highlight: false },
      ],
      notIncluded: ['Reconhecimento Facial de Risco'],
      recommended: false,
      cta: 'Assinar Basic'
    },
    {
      id: 'pro',
      name: 'Pro',
      tagline: 'Segurança Completa',
      subtitle: 'Até 16 Canais RTSP',
      price: 'R$ 899,90',
      setup: 'R$ 299,00',
      period: '/mês',
      features: [
        { text: 'Até 16 Links RTSP em paralelo', highlight: false },
        { text: 'Detecção completa de IA', highlight: true, aiToken: true },
        { text: 'Reconhecimento Facial de Risco', highlight: true, aiToken: true },
        { text: 'Suporte prioritário', highlight: false },
        { text: 'Histórico completo de alertas', highlight: false },
      ],
      notIncluded: [],
      recommended: true,
      cta: 'Assinar Pro'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'Solução Customizada',
      subtitle: 'Acima de 16 Canais',
      price: 'Sob consulta',
      setup: 'Sob consulta',
      period: '',
      features: [
        { text: '> 16 Links RTSP', highlight: false },
        { text: 'Solução customizada', highlight: true },
        { text: 'Hardware/módulos negociáveis', highlight: false },
        { text: 'Suporte dedicado', highlight: false },
        { text: 'SLA personalizado', highlight: false },
      ],
      notIncluded: [],
      recommended: false,
      cta: 'Falar com Suporte'
    }
  ];

  return (
    <div className="min-h-screen bg-[#090F36] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#2F5FFF]/20 bg-[#0B1343]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl text-white mb-2">SegVision</h1>
            <h2 className="text-white mb-1">Escolha seu Plano</h2>
            <p className="text-white/70">
              Selecione o plano ideal para sua escola
            </p>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative bg-[#19215A] border-[#2F5FFF]/20 transition-all ${
                  selectedPlan === plan.id ? 'ring-2 ring-[#2F5FFF]' : ''
                } ${plan.recommended ? 'border-[#2F5FFF]' : ''}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="heavy" tone="primary" size="s">
                      Recomendado
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="text-center space-y-2">
                    <h3 className="text-white">{plan.name}</h3>
                    <p className="text-sm text-white/70">{plan.tagline}</p>
                    <p className="text-white">{plan.subtitle}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="text-center py-4 border-y border-[#2F5FFF]/20">
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-2xl text-white">{plan.price}</span>
                      {plan.period && (
                        <span className="text-sm text-white/70 mb-1">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/70 mt-2">
                      Setup: {plan.setup}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-[#47D238] flex-shrink-0 mt-0.5" />
                        <span className={`text-sm ${feature.highlight ? 'text-white' : 'text-white/70'}`}>
                          {feature.text}
                          {feature.aiToken && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="ml-1 inline-flex">
                                    <Sparkles className="h-3 w-3 text-[#2F5FFF]" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#19215A] border-[#2F5FFF]/20">
                                  <p className="text-xs text-white">Consome tokens de IA</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </span>
                      </div>
                    ))}

                    {plan.notIncluded.length > 0 && (
                      <>
                        <div className="border-t border-[#2F5FFF]/20 pt-3 mt-3">
                          {plan.notIncluded.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2 opacity-50">
                              <div className="h-4 w-4 flex-shrink-0 mt-0.5">
                                <div className="w-3 h-0.5 bg-white/50"></div>
                              </div>
                              <span className="text-sm text-white/70 line-through">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      onSelectPlan(plan.id as 'basic' | 'pro' | 'enterprise');
                    }}
                    className={`w-full ${
                      plan.recommended
                        ? 'bg-[#2F5FFF] text-white hover:opacity-96'
                        : plan.id === 'enterprise'
                        ? 'bg-[#BA870B] text-white hover:opacity-96'
                        : 'bg-[#2F5FFF] text-white hover:opacity-96'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Banner */}
          <div className="mt-8 p-4 rounded-lg bg-[#19215A] border border-[#63BDF7]/30 max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-[#63BDF7] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-white">
                  <strong>Recursos que consomem tokens de IA:</strong>
                </p>
                <ul className="text-sm text-white/70 list-disc list-inside space-y-1">
                  <li>Detecção de Objetos/Ações (Armas, Agressão, Queda)</li>
                  <li>Reconhecimento Facial de Risco (apenas nos planos Pro e Enterprise)</li>
                </ul>
                <p className="text-sm text-white/70 mt-2">
                  Os tokens são incluídos no valor da mensalidade e calculados conforme o uso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}