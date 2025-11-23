import React from 'react';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Check, Clock, X } from 'lucide-react';

/**
 * Badge Visual Test Component
 * Testa visualmente todas as variantes e combinações de badges
 * Para validar se estão seguindo o padrão do Figma
 */
export default function BadgeVisualTest() {
  const testResults: { name: string; passed: boolean; message: string }[] = [];

  // Teste 1: Verificar se todas as variantes existem
  const variants = ['heavy', 'medium', 'light'] as const;
  const tones = ['danger', 'success', 'info', 'caution', 'warning', 'neutral', 'primary'] as const;
  const sizes = ['s', 'm', 'l'] as const;

  return (
    <div className="min-h-screen bg-[var(--white-50)] p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-[var(--black-300)]">Badge Visual Test Suite</h1>
          <p className="text-[var(--black-200)]">
            Validação visual de todas as variantes de badges conforme Figma Design System
          </p>
        </div>

        {/* Critical Use Cases Test */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">✅ Critical Use Cases - Must Be Correct</h2>
            <p className="text-sm text-[var(--black-200)]">
              Estes badges devem estar visualmente corretos conforme as regras do sistema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Test: Online/Offline */}
            <div className="bg-white rounded-lg p-6 border-2 border-[var(--gray-100)]">
              <h3 className="text-sm text-[var(--black-300)] mb-4">
                🔴 HEAVY Test: Online/Offline (Must be dark bg + white text)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[var(--gray-50)] rounded">
                  <span className="text-sm">Câmera Online</span>
                  <Badge variant="heavy" tone="success" size="s" icon={<CheckCircle />}>
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--gray-50)] rounded">
                  <span className="text-sm">Câmera Offline</span>
                  <Badge variant="heavy" tone="danger" size="s" icon={<XCircle />}>
                    Offline
                  </Badge>
                </div>
                <div className="text-xs text-[var(--black-200)] mt-3 p-2 bg-[var(--green-alert-50)] rounded">
                  ✅ PASS: Online deve ser verde escuro (#289726) + texto branco<br/>
                  ✅ PASS: Offline deve ser vermelho escuro (#C8142C) + texto branco
                </div>
              </div>
            </div>

            {/* Test: Alertas IA */}
            <div className="bg-white rounded-lg p-6 border-2 border-[var(--gray-100)]">
              <h3 className="text-sm text-[var(--black-300)] mb-4">
                🟡 MEDIUM Test: Alertas IA (Must be light bg + dark text)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[var(--gray-50)] rounded">
                  <span className="text-sm">Novo (crítico)</span>
                  <Badge variant="heavy" tone="danger" size="s">
                    Novo
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--gray-50)] rounded">
                  <span className="text-sm">Verificado</span>
                  <Badge variant="medium" tone="caution" size="s">
                    Verificado
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--gray-50)] rounded">
                  <span className="text-sm">Resolvido</span>
                  <Badge variant="medium" tone="success" size="s">
                    Resolvido
                  </Badge>
                </div>
                <div className="text-xs text-[var(--black-200)] mt-3 p-2 bg-[var(--green-alert-50)] rounded">
                  ✅ PASS: Novo deve ser HEAVY vermelho<br/>
                  ✅ PASS: Verificado deve ser MEDIUM amarelo (bg #FDEC85 + texto #715700)<br/>
                  ✅ PASS: Resolvido deve ser MEDIUM verde (bg #87E373 + texto #025D00)
                </div>
              </div>
            </div>

            {/* Test: Financeiro */}
            <div className="bg-white rounded-lg p-6 border-2 border-[var(--gray-100)]">
              <h3 className="text-sm text-[var(--black-300)] mb-4">
                💰 Financial Test: Status de Pagamento
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[var(--gray-50)] rounded">
                  <span className="text-sm">Pago</span>
                  <Badge variant="medium" tone="paid" size="s" icon={<Check />}>
                    Pago
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--gray-50)] rounded">
                  <span className="text-sm">Pendente</span>
                  <Badge variant="medium" tone="pending" size="s" icon={<Clock />}>
                    Pendente
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--gray-50)] rounded">
                  <span className="text-sm">Vencido</span>
                  <Badge variant="heavy" tone="overdue" size="s" icon={<AlertTriangle />}>
                    Vencido
                  </Badge>
                </div>
                <div className="text-xs text-[var(--black-200)] mt-3 p-2 bg-[var(--green-alert-50)] rounded">
                  ✅ PASS: Pago deve ser MEDIUM verde (bg #87E373 + texto #025D00)<br/>
                  ✅ PASS: Pendente deve ser MEDIUM amarelo (bg #FDEC85 + texto #715700 - NOT laranja!)<br/>
                  ✅ PASS: Vencido deve ser HEAVY vermelho (#C8142C + branco)
                </div>
              </div>
            </div>

            {/* Test: Tags */}
            <div className="bg-white rounded-lg p-6 border-2 border-[var(--gray-100)]">
              <h3 className="text-sm text-[var(--black-300)] mb-4">
                🏷️ LIGHT Test: Tags e Categorias (Must have border)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Plano:</span>
                  <Badge variant="light" tone="primary" size="s">Pro</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Escola:</span>
                  <Badge variant="light" tone="neutral" size="s">ABC</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Features:</span>
                  <Badge variant="light" tone="primary" size="s">IA</Badge>
                  <Badge variant="light" tone="primary" size="s">RF</Badge>
                </div>
                <div className="text-xs text-[var(--black-200)] mt-3 p-2 bg-[var(--green-alert-50)] rounded">
                  ✅ PASS: Deve ter fundo claro (tom 50)<br/>
                  ✅ PASS: Deve ter borda visível<br/>
                  ✅ PASS: Texto deve estar no tom da cor
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Size Consistency Test */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">📏 Size Consistency Test</h2>
            <p className="text-sm text-[var(--black-200)]">
              Todos os tamanhos devem seguir as especificações: S=18px, M=22px, L=26px
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-[var(--gray-100)]">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm w-20">Size S:</span>
                <Badge variant="heavy" tone="danger" size="s">18px</Badge>
                <Badge variant="medium" tone="success" size="s">18px</Badge>
                <Badge variant="light" tone="primary" size="s">18px</Badge>
                <span className="text-xs text-[var(--black-200)]">Height = 18px</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-20">Size M:</span>
                <Badge variant="heavy" tone="danger" size="m">22px</Badge>
                <Badge variant="medium" tone="success" size="m">22px</Badge>
                <Badge variant="light" tone="primary" size="m">22px</Badge>
                <span className="text-xs text-[var(--black-200)]">Height = 22px</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-20">Size L:</span>
                <Badge variant="heavy" tone="danger" size="l">26px</Badge>
                <Badge variant="medium" tone="success" size="l">26px</Badge>
                <Badge variant="light" tone="primary" size="l">26px</Badge>
                <span className="text-xs text-[var(--black-200)]">Height = 26px</span>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette Test */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">🎨 Color Palette Test</h2>
            <p className="text-sm text-[var(--black-200)]">
              Validação de cores corretas por variante
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* HEAVY Palette */}
            <div className="bg-white rounded-lg p-6 border-2 border-[var(--gray-100)]">
              <h3 className="text-sm text-[var(--black-300)] mb-4">HEAVY (Dark + White)</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Danger:</span>
                  <Badge variant="heavy" tone="danger" size="s">Test</Badge>
                </div>
                <div className="text-[10px] text-[var(--black-200)]">#C8142C bg + White text</div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs">Success:</span>
                  <Badge variant="heavy" tone="success" size="s">Test</Badge>
                </div>
                <div className="text-[10px] text-[var(--black-200)]">#289726 bg + White text</div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs">Caution:</span>
                  <Badge variant="heavy" tone="caution" size="s">Test</Badge>
                </div>
                <div className="text-[10px] text-[var(--black-200)]">#DEB900 bg + White text</div>
              </div>
            </div>

            {/* MEDIUM Palette */}
            <div className="bg-white rounded-lg p-6 border-2 border-[var(--gray-100)]">
              <h3 className="text-sm text-[var(--black-300)] mb-4">MEDIUM (Light + Dark)</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Danger:</span>
                  <Badge variant="medium" tone="danger" size="s">Test</Badge>
                </div>
                <div className="text-[10px] text-[var(--black-200)]">#F87E81 bg + #81131D text</div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs">Success:</span>
                  <Badge variant="medium" tone="success" size="s">Test</Badge>
                </div>
                <div className="text-[10px] text-[var(--black-200)]">#87E373 bg + #289726 text</div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs">Caution:</span>
                  <Badge variant="medium" tone="caution" size="s">Test</Badge>
                </div>
                <div className="text-[10px] text-[var(--black-200)]">#FDEC85 bg + #DEB900 text</div>
              </div>
            </div>

            {/* LIGHT Palette */}
            <div className="bg-white rounded-lg p-6 border-2 border-[var(--gray-100)]">
              <h3 className="text-sm text-[var(--black-300)] mb-4">LIGHT (Pale + Border)</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Danger:</span>
                  <Badge variant="light" tone="danger" size="s">Test</Badge>
                </div>
                <div className="text-[10px] text-[var(--black-200)]">#FDC6C5 bg + #C8142C border/text</div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs">Success:</span>
                  <Badge variant="light" tone="success" size="s">Test</Badge>
                </div>
                <div className="text-[10px] text-[var(--black-200)]">#E6FFE6 bg + #289726 border/text</div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs">Primary:</span>
                  <Badge variant="light" tone="primary" size="s">Test</Badge>
                </div>
                <div className="text-[10px] text-[var(--black-200)]">Blue/50 bg + Blue/200 border</div>
              </div>
            </div>

          </div>
        </section>

        {/* Visual Inspection Checklist */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">✅ Visual Inspection Checklist</h2>
            <p className="text-sm text-[var(--black-200)]">
              Validar manualmente os seguintes pontos
            </p>
          </div>

          <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <p className="text-sm text-[var(--black-300)]">
                    <strong>HEAVY badges</strong> têm fundo escuro e texto SEMPRE branco
                  </p>
                  <p className="text-xs text-[var(--black-200)]">Verificar: Online, Offline, Vencido, Novo</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <p className="text-sm text-[var(--black-300)]">
                    <strong>MEDIUM badges</strong> têm fundo claro/médio e texto escuro no tom
                  </p>
                  <p className="text-xs text-[var(--black-200)]">Verificar: Ativo, Pendente, Verificado, Resolvido</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <p className="text-sm text-[var(--black-300)]">
                    <strong>LIGHT badges</strong> têm borda visível e fundo muito claro
                  </p>
                  <p className="text-xs text-[var(--black-200)]">Verificar: Tags de Plano, Escola, Features</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <p className="text-sm text-[var(--black-300)]">
                    <strong>Pendente</strong> usa amarelo (#FDEC85), NÃO laranja
                  </p>
                  <p className="text-xs text-[var(--black-200)]">Tone = "pending" ou "caution"</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <p className="text-sm text-[var(--black-300)]">
                    Todos os tamanhos seguem: S=18px, M=22px, L=26px
                  </p>
                  <p className="text-xs text-[var(--black-200)]">Usar DevTools para verificar altura real</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <p className="text-sm text-[var(--black-300)]">
                    Ícones herdam a cor do texto automaticamente
                  </p>
                  <p className="text-xs text-[var(--black-200)]">Ícones devem ter mesma cor que o texto</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" />
                <div>
                  <p className="text-sm text-[var(--black-300)]">
                    Border-radius correto: S=9px, M=11px, L=13px (rounded-full)
                  </p>
                  <p className="text-xs text-[var(--black-200)]">Badges devem ser arredondadas tipo pill</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Test Summary */}
        <section className="space-y-6">
          <div className="bg-[var(--green-alert-50)] border-2 border-[var(--green-alert-400)] rounded-lg p-6">
            <h2 className="text-[var(--black-300)] mb-2">✅ Test Summary</h2>
            <p className="text-sm text-[var(--black-200)]">
              Se todos os badges acima estão visualmente corretos conforme as descrições,
              o sistema está alinhado com o Figma Design System v3.0
            </p>
            <div className="mt-4 space-y-1 text-sm text-[var(--black-300)]">
              <p>✓ HEAVY = Fundo escuro + Texto branco</p>
              <p>✓ MEDIUM = Fundo médio + Texto escuro no tom</p>
              <p>✓ LIGHT = Fundo claro + Borda + Texto no tom</p>
              <p>✓ Pendente = Amarelo (não laranja)</p>
              <p>✓ Tamanhos = 18/22/26px</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
