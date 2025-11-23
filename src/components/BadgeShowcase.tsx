import React from 'react';
import { Badge } from './ui/badge';
import { Check, X, Clock, AlertTriangle, Info, Circle, DollarSign, FileText, User, CheckCircle, XCircle } from 'lucide-react';

export default function BadgeShowcase() {
  return (
    <div className="min-h-screen bg-[var(--white-50)] p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-[var(--black-300)]">Badge Component - SegVision Design System v3.0</h1>
          <p className="text-[var(--black-200)]">
            Sistema de badges com 3 variantes de peso visual: HEAVY (crítico), MEDIUM (intermediário), LIGHT (categorização).
            Alinhado com o design do Figma.
          </p>
        </div>

        {/* Quick Reference Table */}
        <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
          <h2 className="text-[var(--black-300)] mb-4">Quick Reference</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm text-[var(--black-300)] mb-3">HEAVY Variant</h3>
              <p className="text-xs text-[var(--black-200)] mb-2">
                • Fundo escuro (300/400)<br/>
                • Texto SEMPRE branco<br/>
                • Para alertas críticos
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="heavy" tone="danger" size="s">Offline</Badge>
                <Badge variant="heavy" tone="success" size="s">Online</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-sm text-[var(--black-300)] mb-3">MEDIUM Variant</h3>
              <p className="text-xs text-[var(--black-200)] mb-2">
                • Fundo médio (100/200)<br/>
                • Texto escuro no tom (400)<br/>
                • Para status intermediários
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="medium" tone="success" size="s">Ativo</Badge>
                <Badge variant="medium" tone="pending" size="s">Pendente</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-sm text-[var(--black-300)] mb-3">LIGHT Variant</h3>
              <p className="text-xs text-[var(--black-200)] mb-2">
                • Fundo claro (50) + borda<br/>
                • Texto no tom (300/400)<br/>
                • Para tags e categorias
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="light" tone="primary" size="s">Tag</Badge>
                <Badge variant="light" tone="neutral" size="s">Label</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases - Contextos Reais */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">Use Cases - Contextos Reais</h2>
            <p className="text-sm text-[var(--black-200)]">
              Exemplos práticos de uso no SegVision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Câmeras */}
            <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
              <h3 className="text-sm text-[var(--black-300)] mb-4">Status de Câmeras</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded border border-[var(--gray-100)]">
                  <span className="text-sm text-[var(--black-300)]">Câmera Portaria</span>
                  <Badge variant="heavy" tone="success" size="s" icon={<CheckCircle />}>
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border border-[var(--gray-100)]">
                  <span className="text-sm text-[var(--black-300)]">Câmera Quadra</span>
                  <Badge variant="heavy" tone="danger" size="s" icon={<XCircle />}>
                    Offline
                  </Badge>
                </div>
                <p className="text-xs text-[var(--black-200)] mt-3">
                  ✅ HEAVY para status críticos de conectividade
                </p>
              </div>
            </div>

            {/* Alertas IA */}
            <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
              <h3 className="text-sm text-[var(--black-300)] mb-4">Alertas de IA</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded border border-[var(--gray-100)]">
                  <span className="text-sm text-[var(--black-300)]">Intruso detectado</span>
                  <Badge variant="heavy" tone="danger" size="s">
                    Novo
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border border-[var(--gray-100)]">
                  <span className="text-sm text-[var(--black-300)]">Movimento suspeito</span>
                  <Badge variant="medium" tone="caution" size="s">
                    Verificado
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border border-[var(--gray-100)]">
                  <span className="text-sm text-[var(--black-300)]">Falso positivo</span>
                  <Badge variant="medium" tone="success" size="s">
                    Resolvido
                  </Badge>
                </div>
                <p className="text-xs text-[var(--black-200)] mt-3">
                  ✅ Novo = HEAVY, Verificado/Resolvido = MEDIUM
                </p>
              </div>
            </div>

            {/* Financeiro */}
            <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
              <h3 className="text-sm text-[var(--black-300)] mb-4">Status Financeiro</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded border border-[var(--gray-100)]">
                  <span className="text-sm text-[var(--black-300)]">Fatura Out/2024</span>
                  <Badge variant="medium" tone="paid" size="s" icon={<Check />}>
                    Pago
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border border-[var(--gray-100)]">
                  <span className="text-sm text-[var(--black-300)]">Fatura Nov/2024</span>
                  <Badge variant="medium" tone="pending" size="s" icon={<Clock />}>
                    Pendente
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border border-[var(--gray-100)]">
                  <span className="text-sm text-[var(--black-300)]">Fatura Set/2024</span>
                  <Badge variant="heavy" tone="overdue" size="s" icon={<AlertTriangle />}>
                    Vencido
                  </Badge>
                </div>
                <p className="text-xs text-[var(--black-200)] mt-3">
                  ✅ Vencido = HEAVY (crítico), Pago/Pendente = MEDIUM
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
              <h3 className="text-sm text-[var(--black-300)] mb-4">Tags e Categorias</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--black-300)]">Plano:</span>
                  <Badge variant="light" tone="primary" size="s">Pro</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--black-300)]">Escola:</span>
                  <Badge variant="light" tone="neutral" size="s">Colégio ABC</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--black-300)]">Features:</span>
                  <Badge variant="light" tone="primary" size="s">IA</Badge>
                  <Badge variant="light" tone="primary" size="s">RF</Badge>
                  <Badge variant="light" tone="primary" size="s">CP</Badge>
                </div>
                <p className="text-xs text-[var(--black-200)] mt-3">
                  ✅ LIGHT sempre para tags e categorias
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* HEAVY VARIANT - All Tones */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">HEAVY Variant (Alertas Críticos)</h2>
            <p className="text-sm text-[var(--black-200)]">
              Fundo escuro (tons 300/400) + Texto branco - Máximo contraste
            </p>
          </div>

          <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
            <h3 className="text-sm text-[var(--black-300)] mb-4">Core Tones</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              
              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Danger (Red)</p>
                <div className="space-y-2">
                  <Badge variant="heavy" tone="danger" size="s">Small</Badge>
                  <Badge variant="heavy" tone="danger" size="m">Medium</Badge>
                  <Badge variant="heavy" tone="danger" size="l">Large</Badge>
                  <Badge variant="heavy" tone="danger" size="m" icon={<X />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  #C8142C (Red 300) + White text
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Success (Green)</p>
                <div className="space-y-2">
                  <Badge variant="heavy" tone="success" size="s">Small</Badge>
                  <Badge variant="heavy" tone="success" size="m">Medium</Badge>
                  <Badge variant="heavy" tone="success" size="l">Large</Badge>
                  <Badge variant="heavy" tone="success" size="m" icon={<Check />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  #289726 (Green 400) + White text
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Info (Turquoise)</p>
                <div className="space-y-2">
                  <Badge variant="heavy" tone="info" size="s">Small</Badge>
                  <Badge variant="heavy" tone="info" size="m">Medium</Badge>
                  <Badge variant="heavy" tone="info" size="l">Large</Badge>
                  <Badge variant="heavy" tone="info" size="m" icon={<Info />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  #126AAF (Turquoise 400) + White text
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Caution (Yellow)</p>
                <div className="space-y-2">
                  <Badge variant="heavy" tone="caution" size="s">Small</Badge>
                  <Badge variant="heavy" tone="caution" size="m">Medium</Badge>
                  <Badge variant="heavy" tone="caution" size="l">Large</Badge>
                  <Badge variant="heavy" tone="caution" size="m" icon={<AlertTriangle />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  #DEB900 (Yellow 400) + White text
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Warning (Orange)</p>
                <div className="space-y-2">
                  <Badge variant="heavy" tone="warning" size="s">Small</Badge>
                  <Badge variant="heavy" tone="warning" size="m">Medium</Badge>
                  <Badge variant="heavy" tone="warning" size="l">Large</Badge>
                  <Badge variant="heavy" tone="warning" size="m" icon={<AlertTriangle />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  #BA870B (Orange 400) + White text
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Neutral (Gray)</p>
                <div className="space-y-2">
                  <Badge variant="heavy" tone="neutral" size="s">Small</Badge>
                  <Badge variant="heavy" tone="neutral" size="m">Medium</Badge>
                  <Badge variant="heavy" tone="neutral" size="l">Large</Badge>
                  <Badge variant="heavy" tone="neutral" size="m" icon={<FileText />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  #7A7A88 (Gray 300) + White text
                </p>
              </div>

            </div>
          </div>

          <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
            <h3 className="text-sm text-[var(--black-300)] mb-4">Semantic Tones</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="heavy" tone="overdue" icon={<AlertTriangle />}>Vencido</Badge>
              <Badge variant="heavy" tone="connected" icon={<CheckCircle />}>Online</Badge>
              <Badge variant="heavy" tone="disconnected" icon={<XCircle />}>Offline</Badge>
              <Badge variant="heavy" tone="failure" icon={<X />}>Falha</Badge>
              <Badge variant="heavy" tone="new">Novo</Badge>
            </div>
          </div>
        </section>

        {/* MEDIUM VARIANT - All Tones */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">MEDIUM Variant (Status Intermediários)</h2>
            <p className="text-sm text-[var(--black-200)]">
              Fundo médio (tons 100/200) + Texto escuro no tom (400) - Contraste médio
            </p>
          </div>

          <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
            <h3 className="text-sm text-[var(--black-300)] mb-4">Core Tones</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              
              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Danger (Red)</p>
                <div className="space-y-2">
                  <Badge variant="medium" tone="danger" size="s">Small</Badge>
                  <Badge variant="medium" tone="danger" size="m">Medium</Badge>
                  <Badge variant="medium" tone="danger" size="l">Large</Badge>
                  <Badge variant="medium" tone="danger" size="m" icon={<X />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  BG: #F87E81 (Red 100) + Text: #63000D (Red 400)
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Success (Green)</p>
                <div className="space-y-2">
                  <Badge variant="medium" tone="success" size="s">Small</Badge>
                  <Badge variant="medium" tone="success" size="m">Medium</Badge>
                  <Badge variant="medium" tone="success" size="l">Large</Badge>
                  <Badge variant="medium" tone="success" size="m" icon={<Check />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  BG: #87E373 (Green 200) + Text: #025D00 (Green 500)
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Info (Turquoise)</p>
                <div className="space-y-2">
                  <Badge variant="medium" tone="info" size="s">Small</Badge>
                  <Badge variant="medium" tone="info" size="m">Medium</Badge>
                  <Badge variant="medium" tone="info" size="l">Large</Badge>
                  <Badge variant="medium" tone="info" size="m" icon={<Info />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  BG: #63BDF7 (Turquoise 200) + Text: #126AAF (Turquoise 400)
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Caution (Yellow)</p>
                <div className="space-y-2">
                  <Badge variant="medium" tone="caution" size="s">Small</Badge>
                  <Badge variant="medium" tone="caution" size="m">Medium</Badge>
                  <Badge variant="medium" tone="caution" size="l">Large</Badge>
                  <Badge variant="medium" tone="caution" size="m" icon={<Clock />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  BG: #FDEC85 (Yellow 200) + Text: #715700 (Yellow 500)
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Warning (Orange)</p>
                <div className="space-y-2">
                  <Badge variant="medium" tone="warning" size="s">Small</Badge>
                  <Badge variant="medium" tone="warning" size="m">Medium</Badge>
                  <Badge variant="medium" tone="warning" size="l">Large</Badge>
                  <Badge variant="medium" tone="warning" size="m" icon={<AlertTriangle />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  BG: #FACD64 (Orange 200) + Text: #BA870B (Orange 400)
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Neutral (Gray)</p>
                <div className="space-y-2">
                  <Badge variant="medium" tone="neutral" size="s">Small</Badge>
                  <Badge variant="medium" tone="neutral" size="m">Medium</Badge>
                  <Badge variant="medium" tone="neutral" size="l">Large</Badge>
                  <Badge variant="medium" tone="neutral" size="m" icon={<FileText />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  BG: #B3B4C1 (Gray 200) + Text: #474748 (Gray 400)
                </p>
              </div>

            </div>
          </div>

          <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
            <h3 className="text-sm text-[var(--black-300)] mb-4">Semantic Tones</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="medium" tone="paid" icon={<Check />}>Pago</Badge>
              <Badge variant="medium" tone="pending" icon={<Clock />}>Pendente</Badge>
              <Badge variant="medium" tone="active" icon={<Circle />}>Ativo</Badge>
              <Badge variant="medium" tone="suspended">Suspenso</Badge>
              <Badge variant="medium" tone="processing" icon={<Clock />}>Processando</Badge>
              <Badge variant="medium" tone="resolved" icon={<Check />}>Resolvido</Badge>
            </div>
          </div>
        </section>

        {/* LIGHT VARIANT - All Tones */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">LIGHT Variant (Tags e Categorias)</h2>
            <p className="text-sm text-[var(--black-200)]">
              Fundo claro (tons 50) + Borda + Texto no tom (300/400) - Contraste baixo
            </p>
          </div>

          <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
            <h3 className="text-sm text-[var(--black-300)] mb-4">Core Tones</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              
              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Primary (Blue)</p>
                <div className="space-y-2">
                  <Badge variant="light" tone="primary" size="s">Small</Badge>
                  <Badge variant="light" tone="primary" size="m">Medium</Badge>
                  <Badge variant="light" tone="primary" size="l">Large</Badge>
                  <Badge variant="light" tone="primary" size="m" icon={<Circle />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  BG: Blue/50 + Border: Blue/200 + Text: Blue/300
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Success (Green)</p>
                <div className="space-y-2">
                  <Badge variant="light" tone="success" size="s">Small</Badge>
                  <Badge variant="light" tone="success" size="m">Medium</Badge>
                  <Badge variant="light" tone="success" size="l">Large</Badge>
                  <Badge variant="light" tone="success" size="m" icon={<Check />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  BG: Green/50 + Border: Green/400 + Text: Green/400
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Danger (Red)</p>
                <div className="space-y-2">
                  <Badge variant="light" tone="danger" size="s">Small</Badge>
                  <Badge variant="light" tone="danger" size="m">Medium</Badge>
                  <Badge variant="light" tone="danger" size="l">Large</Badge>
                  <Badge variant="light" tone="danger" size="m" icon={<X />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  BG: Red/50 + Border: Red/300 + Text: Red/300
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Info (Turquoise)</p>
                <div className="space-y-2">
                  <Badge variant="light" tone="info" size="s">Small</Badge>
                  <Badge variant="light" tone="info" size="m">Medium</Badge>
                  <Badge variant="light" tone="info" size="l">Large</Badge>
                  <Badge variant="light" tone="info" size="m" icon={<Info />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  BG: Turquoise/50 + Border: Turquoise/400 + Text: Turquoise/400
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Caution (Yellow)</p>
                <div className="space-y-2">
                  <Badge variant="light" tone="caution" size="s">Small</Badge>
                  <Badge variant="light" tone="caution" size="m">Medium</Badge>
                  <Badge variant="light" tone="caution" size="l">Large</Badge>
                  <Badge variant="light" tone="caution" size="m" icon={<Clock />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  BG: Yellow/50 + Border: Yellow/400 + Text: Yellow/400
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[var(--black-200)]">Neutral (Gray)</p>
                <div className="space-y-2">
                  <Badge variant="light" tone="neutral" size="s">Small</Badge>
                  <Badge variant="light" tone="neutral" size="m">Medium</Badge>
                  <Badge variant="light" tone="neutral" size="l">Large</Badge>
                  <Badge variant="light" tone="neutral" size="m" icon={<FileText />}>
                    With Icon
                  </Badge>
                </div>
                <p className="text-[10px] text-[var(--black-100)] mt-2">
                  BG: Gray/50 + Border: Gray/300 + Text: Gray/300
                </p>
              </div>

            </div>
          </div>

          <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
            <h3 className="text-sm text-[var(--black-300)] mb-4">Semantic Tones (Tags)</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="light" tone="primary">Plano Pro</Badge>
              <Badge variant="light" tone="neutral">Escola ABC</Badge>
              <Badge variant="light" tone="success">Ativo</Badge>
              <Badge variant="light" tone="info">Categoria</Badge>
              <Badge variant="light" tone="caution">Tag</Badge>
            </div>
          </div>
        </section>

        {/* Decision Guide */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">Guia de Decisão</h2>
            <p className="text-sm text-[var(--black-200)]">
              Quando usar cada variante?
            </p>
          </div>

          <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-[var(--black-300)] mb-2">✅ Use HEAVY quando:</h3>
                <ul className="text-sm text-[var(--black-200)] list-disc list-inside space-y-1">
                  <li>Alertas críticos que exigem ação imediata (Offline, Erro, Vencido)</li>
                  <li>Status que precisam de máxima atenção visual</li>
                  <li>Informações urgentes que não podem ser ignoradas</li>
                </ul>
                <div className="flex gap-2 mt-3">
                  <Badge variant="heavy" tone="danger">Offline</Badge>
                  <Badge variant="heavy" tone="overdue">Vencido</Badge>
                  <Badge variant="heavy" tone="new">Novo Alerta</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-[var(--black-300)] mb-2">✅ Use MEDIUM quando:</h3>
                <ul className="text-sm text-[var(--black-200)] list-disc list-inside space-y-1">
                  <li>Status padrão do sistema (Ativo, Processando, Pendente)</li>
                  <li>Informações relevantes mas não urgentes</li>
                  <li>Estados intermediários (Verificado, Em análise)</li>
                </ul>
                <div className="flex gap-2 mt-3">
                  <Badge variant="medium" tone="success">Ativo</Badge>
                  <Badge variant="medium" tone="pending">Pendente</Badge>
                  <Badge variant="medium" tone="processing">Processando</Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-[var(--black-300)] mb-2">✅ Use LIGHT quando:</h3>
                <ul className="text-sm text-[var(--black-200)] list-disc list-inside space-y-1">
                  <li>Tags de categorização (Planos, Tipos, Grupos)</li>
                  <li>Metadados (Escola, Turma, Features)</li>
                  <li>Filtros e labels de baixa prioridade</li>
                </ul>
                <div className="flex gap-2 mt-3">
                  <Badge variant="light" tone="primary">Plano Pro</Badge>
                  <Badge variant="light" tone="neutral">Escola</Badge>
                  <Badge variant="light" tone="info">Tag</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">Paleta de Cores Completa</h2>
            <p className="text-sm text-[var(--black-200)]">
              Tokens CSS usados nas badges
            </p>
          </div>

          <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <h3 className="text-sm text-[var(--black-300)] mb-3">Red Alert (Danger)</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: '#FDC6C5' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">50: #FDC6C5</p>
                      <p className="text-[var(--black-200)]">LIGHT background</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: '#F87E81' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">100: #F87E81</p>
                      <p className="text-[var(--black-200)]">MEDIUM background</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: '#C8142C' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">300: #C8142C</p>
                      <p className="text-[var(--black-200)]">HEAVY bg + LIGHT border/text</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: '#81131D' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">400: #81131D</p>
                      <p className="text-[var(--black-200)]">MEDIUM text</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-[var(--black-300)] mb-3">Green Alert (Success)</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: '#E6FFE6' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">50: #E6FFE6</p>
                      <p className="text-[var(--black-200)]">LIGHT background</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: '#87E373' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">200: #87E373</p>
                      <p className="text-[var(--black-200)]">MEDIUM background</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: '#289726' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">400: #289726</p>
                      <p className="text-[var(--black-200)]">HEAVY bg + MEDIUM text + LIGHT border/text</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-[var(--black-300)] mb-3">Yellow Alert (Caution)</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded border border-gray-200" style={{ backgroundColor: '#FFFEF0' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">50: #FFFEF0</p>
                      <p className="text-[var(--black-200)]">LIGHT background</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: '#FDEC85' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">200: #FDEC85</p>
                      <p className="text-[var(--black-200)]">MEDIUM background</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: '#DEB900' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">400: #DEB900</p>
                      <p className="text-[var(--black-200)]">HEAVY bg + MEDIUM text + LIGHT border/text</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-[var(--black-300)] mb-3">Turquoise Alert (Info)</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: '#EBF6FF' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">50: #EBF6FF</p>
                      <p className="text-[var(--black-200)]">LIGHT background</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: '#63BDF7' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">200: #63BDF7</p>
                      <p className="text-[var(--black-200)]">MEDIUM background</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded" style={{ backgroundColor: '#126AAF' }} />
                    <div className="text-xs">
                      <p className="text-[var(--black-300)]">400: #126AAF</p>
                      <p className="text-[var(--black-200)]">HEAVY bg + MEDIUM text + LIGHT border/text</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
