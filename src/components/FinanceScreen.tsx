import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CreditCard, FileText, Copy, DollarSign, Calendar, TrendingUp, Wallet, Loader2 } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { supabase } from '../lib/supabase';
import { useUserProfile } from './UserProfileContext';
import { showToast } from './ui/toast-utils';

type InvoiceStatus = 'paid' | 'pending' | 'overdue';

interface Invoice {
  id: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  paidDate?: string | null;
  referenceMonth?: string | null;
  createdAt?: string | null;
  plan?: string | null;
}

const planLabels: Record<string, string> = {
  basic: 'Plano Basic',
  pro: 'Plano Pro',
  enterprise: 'Plano Enterprise',
};

interface FinanceScreenProps {
  isFirstAccess?: boolean;
}

export function FinanceScreen({ isFirstAccess = false }: FinanceScreenProps) {
  const { profile } = useUserProfile();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  const loadInvoices = async () => {
    if (!profile?.school_id) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select(`id, amount, status, due_date, paid_date, reference_month, created_at, schools (plan)`)
        .eq('school_id', profile.school_id)
        .order('due_date', { ascending: true });

      if (error) throw error;

      const mapped = (data || []).map((invoice: any) => ({
        id: invoice.id,
        amount: Number(invoice.amount) || 0,
        status: invoice.status as InvoiceStatus,
        dueDate: invoice.due_date,
        paidDate: invoice.paid_date,
        referenceMonth: invoice.reference_month,
        createdAt: invoice.created_at,
        plan: invoice.schools?.plan || null,
      }));

      setInvoices(mapped);

      // Capture plan from any invoice (or fall back to profile info if needed)
      const planFromInvoices = mapped.find((inv) => inv.plan)?.plan;
      setCurrentPlan(planFromInvoices || null);
    } catch (err) {
      console.error('Erro ao carregar faturas:', err);
      showToast.error({
        title: 'Erro ao carregar financeiro',
        description: 'Não foi possível carregar suas faturas. Tente novamente.',
      });
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.school_id]);

  // Fallback: fetch school plan when no invoices found yet
  useEffect(() => {
    const fetchPlan = async () => {
      if (!profile?.school_id || currentPlan) return;
      const { data, error } = await supabase
        .from('schools')
        .select('plan')
        .eq('id', profile.school_id)
        .single();
      if (!error && data?.plan) {
        setCurrentPlan(data.plan);
      }
    };
    fetchPlan();
  }, [profile?.school_id, currentPlan]);

  const totals = useMemo(() => {
    const paid = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0);
    const pending = invoices
      .filter((i) => i.status === 'pending' || i.status === 'overdue')
      .reduce((sum, i) => sum + (i.amount || 0), 0);

    const next = invoices
      .filter((i) => i.status !== 'paid' && i.dueDate)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    return {
      totalPaid: paid,
      totalDue: pending,
      nextDueAmount: next?.amount ?? null,
      nextDueDate: next?.dueDate ?? null,
    };
  }, [invoices]);

  const formatCurrency = (value: number | null | undefined) =>
    typeof value === 'number'
      ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : 'R$ 0,00';

  const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleDateString('pt-BR') : '—');

  const handleGenerateBoleto = (invoiceId: string) => {
    alert(`Gerando boleto para a fatura ID: ${invoiceId}`);
  };

  const handleCopyPix = () => {
    const pixKey = '00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540510.005802BR5913SegVision6009SAO PAULO62070503***6304ABCD';
    
    // Fallback para navegadores que bloqueiam clipboard API
    try {
      navigator.clipboard.writeText(pixKey).then(() => {
        alert('Chave PIX copiada para a área de transferência!');
      }).catch(() => {
        // Fallback: criar elemento temporário
        const textArea = document.createElement('textarea');
        textArea.value = pixKey;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert('Chave PIX copiada para a área de transferência!');
        } catch (err) {
          alert('Não foi possível copiar. Chave PIX: ' + pixKey);
        }
        document.body.removeChild(textArea);
      });
    } catch (err) {
      // Fallback: criar elemento temporário
      const textArea = document.createElement('textarea');
      textArea.value = pixKey;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Chave PIX copiada para a área de transferência!');
      } catch (copyErr) {
        alert('Não foi possível copiar. Chave PIX: ' + pixKey);
      }
      document.body.removeChild(textArea);
    }
  };

  const handlePayWithCard = (invoiceId: string) => {
    alert(
      `Processando pagamento com cartão de crédito para a fatura ID: ${invoiceId}\n\nCartão cadastrado: •••• •••• •••• 4532\nPlano: ${currentPlan ? planLabels[currentPlan] || currentPlan : '—'}`
    );
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    const config: Record<InvoiceStatus, { label: string; tone: 'paid' | 'pending' | 'overdue' }> = {
      paid: { label: 'Pago', tone: 'paid' },
      pending: { label: 'Pendente', tone: 'pending' },
      overdue: { label: 'Atrasado', tone: 'overdue' },
    };
    const badge = config[status];
    return badge ? (
      <Badge variant="medium" tone={badge.tone} size="s">
        {badge.label}
      </Badge>
    ) : (
      <Badge variant="medium" tone="pending" size="s">Pendente</Badge>
    );
  };

  // Show empty state for first access
  if (!loading && isFirstAccess && invoices.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="Bem-vindo ao Financeiro"
        description="Suas faturas e informações de pagamento aparecerão aqui. A primeira fatura será gerada automaticamente no próximo ciclo de cobrança."
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-[320px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[var(--neutral-text-muted)]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando financeiro...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-[var(--neutral-text-muted)]">
              Total em Aberto
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[var(--neutral-text)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[rgb(169,7,28)]">{formatCurrency(totals.totalDue)}</div>
            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">Valor pendente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-[var(--neutral-text-muted)]">
              Total Pago
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[var(--neutral-text)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[rgb(54,192,52)]">{formatCurrency(totals.totalPaid)}</div>
            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">Pagamentos realizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-[var(--neutral-text-muted)]">
              Próximo Vencimento
            </CardTitle>
            <Calendar className="h-4 w-4 text-[var(--neutral-text)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[rgb(227,172,38)]">
              {totals.nextDueAmount ? formatCurrency(totals.nextDueAmount) : '—'}
            </div>
            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">
              {totals.nextDueDate ? `Vence em ${formatDate(totals.nextDueDate)}` : 'Sem vencimentos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-[var(--neutral-text-muted)]">
              Pagamento PIX
            </CardTitle>
            <Copy className="h-4 w-4 text-[var(--neutral-text)]" />
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleCopyPix}
              className="w-full bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
              size="sm"
            >
              Copiar Chave PIX
            </Button>
            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">Pagamento instantâneo</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Faturas */}
      <Card>
          <CardHeader>
            <CardTitle className="text-[var(--neutral-text)]">Histórico de Faturas</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <div className="text-center py-6 text-[var(--neutral-text-muted)]">
                Nenhuma fatura encontrada para sua escola.
              </div>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="bg-[var(--analytics-list-bg)] border border-[var(--neutral-border)] rounded-lg p-4 hover:bg-[var(--neutral-subtle)] dark:hover:bg-[var(--blue-primary-800)] transition-colors">
                  <div className="flex items-center justify-between bg-[rgba(33,46,112,0)]">
                    <div className="flex items-center gap-4">
                      <div className="bg-[var(--neutral-subtle)] p-3 rounded-full">
                        <FileText className="h-6 w-6 text-[var(--neutral-text)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-[var(--neutral-text)]">
                            {invoice.referenceMonth || `Fatura ${invoice.id.slice(0, 8).toUpperCase()}`}
                          </h3>
                          {getStatusBadge(invoice.status)}
                        </div>
                        <div className="text-sm text-[var(--neutral-text-muted)] mb-1">
                          {invoice.referenceMonth ? `Referência ${invoice.referenceMonth}` : 'Fatura da escola'}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--neutral-text-muted)]">
                          <span>Valor: <span className="font-medium text-[var(--neutral-text)]">{formatCurrency(invoice.amount)}</span></span>
                          <span>•</span>
                          <span>Vencimento: {formatDate(invoice.dueDate)}</span>
                          {invoice.paidDate && (
                            <>
                              <span>•</span>
                              <span className="text-[var(--green-alert-400)]">Pago em: {formatDate(invoice.paidDate)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {invoice.status !== 'paid' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateBoleto(invoice.id)}
                            className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Gerar Boleto
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyPix}
                            className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            PIX
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePayWithCard(invoice.id)}
                            className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Cartão
                          </Button>
                        </>
                      )}
                      {invoice.status === 'paid' && (
                        <div className="flex items-center gap-1 text-[var(--green-alert-400)] text-sm">
                          <div className="w-2 h-2 bg-[var(--green-alert-400)] rounded-full"></div>
                          Pagamento confirmado
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)] text-[18px]">Informações de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-[var(--neutral-text)] mb-3">Pagamento via Cartão de Crédito</h3>
              <ul className="text-sm text-[var(--neutral-text-muted)] space-y-1">
                <li>• Pagamento automático de acordo com o plano</li>
                <li>• Processamento imediato</li>
                <li>• Cartão cadastrado no plano contratado</li>
                <li>• Cobrança recorrente mensal</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[var(--neutral-text)] mb-3">Pagamento via PIX</h3>
              <ul className="text-sm text-[var(--neutral-text-muted)] space-y-1">
                <li>• Pagamento instantâneo</li>
                <li>• Disponível 24/7</li>
                <li>• Sem taxas adicionais</li>
                <li>• Confirmação automática</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[var(--neutral-text)] mb-3">Pagamento via Boleto</h3>
              <ul className="text-sm text-[var(--neutral-text-muted)] space-y-1">
                <li>• Prazo de 1-2 dias úteis para compensação</li>
                <li>• Pagamento em bancos, lotéricas e internet</li>
                <li>• Código de barras para facilitar</li>
                <li>• Sem taxas para o cliente</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
