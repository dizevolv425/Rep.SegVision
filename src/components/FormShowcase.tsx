import React from 'react';
import { FieldGroup } from './ui/field-group';
import { Input } from './ui/input';
import { SearchInput } from './ui/search-input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';

export default function FormShowcase() {
  return (
    <div className="min-h-screen bg-[var(--white-50)] p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-[var(--black-300)]">Form System - SegVision Design System</h1>
          <p className="text-sm text-[var(--black-200)]">
            Sistema completo de formulários com cores cinza padronizadas e espaçamentos 8pt grid.
          </p>
        </div>

        {/* Color Tokens */}
        <section className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
          <h2 className="text-[var(--black-300)] mb-4">Color Tokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm text-[var(--black-300)]">Surface</h3>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded border bg-[var(--gray-50)] border-[var(--gray-200)]"></div>
                <span className="text-xs text-[var(--black-200)]">Gray/50 bg + Gray/200 border</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-[var(--black-300)]">Hover</h3>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded border bg-[var(--gray-50)] border-[var(--gray-300)]"></div>
                <span className="text-xs text-[var(--black-200)]">Border → Gray/300</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-[var(--black-300)]">Focus</h3>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded border-2 bg-[var(--gray-50)] border-[var(--blue-primary-300)]"></div>
                <span className="text-xs text-[var(--black-200)]">Border → Blue/300</span>
              </div>
            </div>
          </div>
        </section>

        {/* Input States */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">Input - All States</h2>
            <p className="text-sm text-[var(--black-200)]">Gray/50 bg + Gray/200 border (padrão)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm text-[var(--black-300)]">Default State</h3>
              <Input placeholder="Placeholder text..." />
              <p className="text-xs text-[var(--black-100)]">
                Hover muda border para Gray/300
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm text-[var(--black-300)]">With Value</h3>
              <Input defaultValue="Texto digitado" />
              <p className="text-xs text-[var(--black-100)]">
                Texto em Black/300
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm text-[var(--black-300)]">Error State</h3>
              <Input error placeholder="Email inválido" />
              <p className="text-xs text-[var(--red-alert-400)]">
                Border Red Alert/300, ring Red Alert/100
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm text-[var(--black-300)]">Success State</h3>
              <Input success placeholder="Email disponível" />
              <p className="text-xs text-[var(--green-alert-300)]">
                Border Green Alert/300
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm text-[var(--black-300)]">Disabled State</h3>
              <Input disabled placeholder="Campo desabilitado" />
              <p className="text-xs text-[var(--black-100)]">
                Border Gray/100, texto Gray/300
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm text-[var(--black-300)]">Search Input</h3>
              <SearchInput placeholder="Buscar..." />
              <p className="text-xs text-[var(--black-100)]">
                Ícone em Gray/300
              </p>
            </div>
          </div>
        </section>

        {/* FieldGroup Examples */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">FieldGroup - Espaçamentos Padronizados</h2>
            <p className="text-sm text-[var(--black-200)]">
              Label→Control: 8px | Control→Assist: 6px | Between Fields: 12px
            </p>
          </div>

          <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
            <div className="space-y-3">
              <FieldGroup
                label="Nome completo"
                required
                help="Digite seu nome como aparece no documento"
              >
                <Input placeholder="João Silva" />
              </FieldGroup>

              <FieldGroup
                label="Email"
                required
                error="Este email já está cadastrado"
              >
                <Input type="email" placeholder="joao@exemplo.com" error />
              </FieldGroup>

              <FieldGroup
                label="Username"
                success="Username disponível"
              >
                <Input placeholder="joaosilva" success />
              </FieldGroup>

              <FieldGroup
                label="Telefone"
              >
                <Input type="tel" placeholder="(11) 98765-4321" />
              </FieldGroup>
            </div>
          </div>
        </section>

        {/* Select */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">Select / Dropdown</h2>
            <p className="text-sm text-[var(--black-200)]">Chevron em Gray/300</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm text-[var(--black-300)]">Default Size</h3>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma escola" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Escola ABC</SelectItem>
                  <SelectItem value="2">Colégio XYZ</SelectItem>
                  <SelectItem value="3">Instituto 123</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm text-[var(--black-300)]">Small Size</h3>
              <Select>
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Tipo de alerta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="warning">Atenção</SelectItem>
                  <SelectItem value="info">Informação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 md:col-span-2">
              <h3 className="text-sm text-[var(--black-300)]">With FieldGroup</h3>
              <FieldGroup
                label="Plano de assinatura"
                required
                help="Escolha o plano adequado para sua escola"
              >
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básico - R$ 299/mês</SelectItem>
                    <SelectItem value="premium">Premium - R$ 599/mês</SelectItem>
                    <SelectItem value="enterprise">Enterprise - Customizado</SelectItem>
                  </SelectContent>
                </Select>
              </FieldGroup>
            </div>
          </div>
        </section>

        {/* Textarea */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">Textarea</h2>
            <p className="text-sm text-[var(--black-200)]">Min height 88px, auto-resize</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm text-[var(--black-300)]">Default</h3>
              <Textarea placeholder="Digite sua mensagem..." />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm text-[var(--black-300)]">With FieldGroup</h3>
              <FieldGroup
                label="Observações"
                help="Máximo 500 caracteres"
              >
                <Textarea placeholder="Adicione observações adicionais..." />
              </FieldGroup>
            </div>
          </div>
        </section>

        {/* Checkbox & Radio */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">Checkbox & Radio</h2>
            <p className="text-sm text-[var(--black-200)]">Gap de 8px entre ícone e label</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm text-[var(--black-300)]">Checkbox</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="c1" />
                  <label htmlFor="c1" className="text-sm text-[var(--black-300)] cursor-pointer">
                    Receber notificações por email
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="c2" defaultChecked />
                  <label htmlFor="c2" className="text-sm text-[var(--black-300)] cursor-pointer">
                    Aceito os termos de uso
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="c3" disabled />
                  <label htmlFor="c3" className="text-sm text-[var(--black-300)] opacity-50">
                    Opção desabilitada
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm text-[var(--black-300)]">Radio Group</h3>
              <RadioGroup defaultValue="option1">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="option1" id="r1" />
                  <label htmlFor="r1" className="text-sm text-[var(--black-300)] cursor-pointer">
                    Mensalmente (R$ 599/mês)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="option2" id="r2" />
                  <label htmlFor="r2" className="text-sm text-[var(--black-300)] cursor-pointer">
                    Anualmente (R$ 5.990/ano)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="option3" id="r3" disabled />
                  <label htmlFor="r3" className="text-sm text-[var(--black-300)] opacity-50">
                    Trimestral (indisponível)
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </section>

        {/* Switch */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">Switch / Toggle</h2>
            <p className="text-sm text-[var(--black-200)]">Track Gray/200 (off) / Blue Primary/300 (on)</p>
          </div>

          <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--black-300)]">Notificações push</p>
                  <p className="text-xs text-[var(--gray-300)]">Receber alertas em tempo real</p>
                </div>
                <Switch id="s1" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--black-300)]">Modo escuro</p>
                  <p className="text-xs text-[var(--gray-300)]">Ativar tema escuro</p>
                </div>
                <Switch id="s2" defaultChecked />
              </div>

              <div className="flex items-center justify-between opacity-50">
                <div>
                  <p className="text-sm text-[var(--black-300)]">Sincronização automática</p>
                  <p className="text-xs text-[var(--gray-300)]">Requer plano Premium</p>
                </div>
                <Switch id="s3" disabled />
              </div>
            </div>
          </div>
        </section>

        {/* Complete Form Example */}
        <section className="space-y-6">
          <div>
            <h2 className="text-[var(--black-300)] mb-1">Formulário Completo</h2>
            <p className="text-sm text-[var(--black-200)]">Exemplo de cadastro de escola</p>
          </div>

          <div className="bg-[var(--white-100)] rounded-lg p-6 border border-[var(--gray-100)]">
            <form className="space-y-6">
              {/* Seção 1: Dados da Escola */}
              <div>
                <h3 className="text-sm text-[var(--black-300)] mb-4">Dados da Escola</h3>
                <div className="space-y-3">
                  <FieldGroup label="Nome da escola" required>
                    <Input placeholder="Ex: Colégio São Paulo" />
                  </FieldGroup>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldGroup label="CNPJ" required>
                      <Input placeholder="00.000.000/0000-00" />
                    </FieldGroup>

                    <FieldGroup label="Telefone" required>
                      <Input type="tel" placeholder="(11) 3000-0000" />
                    </FieldGroup>
                  </div>

                  <FieldGroup label="Plano" required>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Básico</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </div>
              </div>

              {/* Seção 2: Endereço */}
              <div>
                <h3 className="text-sm text-[var(--black-300)] mb-4">Endereço</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FieldGroup label="CEP" required className="md:col-span-1">
                      <Input placeholder="00000-000" />
                    </FieldGroup>

                    <FieldGroup label="Rua" required className="md:col-span-2">
                      <Input placeholder="Rua dos Exemplos" />
                    </FieldGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FieldGroup label="Número" required>
                      <Input placeholder="123" />
                    </FieldGroup>

                    <FieldGroup label="Complemento" className="md:col-span-2">
                      <Input placeholder="Apto 45" />
                    </FieldGroup>
                  </div>
                </div>
              </div>

              {/* Seção 3: Observações */}
              <div>
                <h3 className="text-sm text-[var(--black-300)] mb-4">Observações</h3>
                <FieldGroup
                  label="Informações adicionais"
                  help="Caso necessário, adicione informações relevantes"
                >
                  <Textarea placeholder="Digite observações..." />
                </FieldGroup>
              </div>

              {/* Termos */}
              <div className="flex items-start gap-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm text-[var(--black-300)]">
                  Concordo com os <a href="#" className="text-[var(--blue-primary-300)] hover:underline">termos de uso</a> e <a href="#" className="text-[var(--blue-primary-300)] hover:underline">política de privacidade</a>
                </label>
              </div>
            </form>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-xs text-[var(--black-100)] pt-8 border-t border-[var(--gray-100)]">
          <p>SegVision Form System v1.0 - Cores Gray + Espaçamentos 8pt Grid</p>
        </div>

      </div>
    </div>
  );
}
