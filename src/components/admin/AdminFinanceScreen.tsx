import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, DollarSign, TrendingUp, AlertCircle, FileText, Plus, Download, CheckCircle2, Send, MoreVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useIsMobile } from '../ui/use-mobile';
import { EmptyState } from '../EmptyState';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface Invoice {
  id: string;
  schoolName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  plan: string;
  referenceMonth: string;
}

interface AdminFinanceScreenProps {
  isFirstAccess?: boolean;
}

const mapPlanFromDb = (plan: string): string => {
  const planMap: Record<string, string> = {
    'basic': 'Standard',
    'pro': 'Premium',
    'enterprise': 'Enterprise'
  };
  return planMap[plan] || 'Standard';
};

export function AdminFinanceScreen({ isFirstAccess = false }: AdminFinanceScreenProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [referenceMonth, setReferenceMonth] = useState('');
  const [dueDate, setDueDate] = useState('');
  const isMobile = useIsMobile();
  const [exporting, setExporting] = useState(false);

  // Load invoices and schools from Supabase
  const loadInvoices = async () => {
    try {
      setLoading(true);

      // Fetch invoices with school information
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          *,
          schools (
            id,
            name,
            plan
          )
        `)
        .order('created_at', { ascending: false });

      if (invoicesError) throw invoicesError;

      // Transform database invoices to frontend format
      const transformedInvoices: Invoice[] = (invoicesData || []).map(invoice => ({
        id: invoice.id,
        schoolName: invoice.schools?.name || 'Escola desconhecida',
        amount: invoice.amount,
        status: invoice.status,
        dueDate: invoice.due_date,
        paidDate: invoice.paid_date || undefined,
        plan: mapPlanFromDb(invoice.schools?.plan || 'basic'),
        referenceMonth: invoice.reference_month
      }));

      setInvoices(transformedInvoices);
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
      toast.error('Erro ao carregar faturas');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // Load schools for dropdown
  const loadSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;

      setSchools(data || []);
    } catch (error) {
      console.error('Erro ao carregar escolas:', error);
    }
  };

  useEffect(() => {
    loadInvoices();
    loadSchools();
  }, []);

  const updateInvoiceStatus = async (invoiceId: string, status: Invoice['status']) => {
    try {
      const updates: any = { status };
      if (status === 'paid') {
        updates.paid_date = new Date().toISOString().slice(0, 10);
      } else {
        updates.paid_date = null;
      }

      const { error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', invoiceId);

      if (error) throw error;

      toast.success('Status da fatura atualizado');
      await loadInvoices();
    } catch (error) {
      console.error('Erro ao atualizar status da fatura:', error);
      toast.error('Erro ao atualizar status da fatura');
    }
  };

  const exportCsv = () => {
    try {
      setExporting(true);
      const header = ['ID', 'Escola', 'Plano', 'Referência', 'Valor', 'Vencimento', 'Status', 'Pago em'];
      const rows = filteredInvoices.map((inv) => [
        inv.id,
        inv.schoolName,
        inv.plan,
        inv.referenceMonth,
        inv.amount?.toString().replace('.', ','),
        inv.dueDate,
        inv.status,
        inv.paidDate || ''
      ]);

      const csvContent = [header, ...rows]
        .map((cols) => cols.map((c) => `"${(c ?? '').toString().replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Nome do arquivo com status e data
      const statusLabel = filterStatus === 'all' ? 'todas' :
                          filterStatus === 'paid' ? 'pagas' :
                          filterStatus === 'pending' ? 'pendentes' : 'atrasadas';
      const today = new Date().toISOString().slice(0, 10);
      link.download = `faturas-${statusLabel}-${today}.csv`;

      link.click();
      URL.revokeObjectURL(url);

      // Mensagem com contador
      const count = filteredInvoices.length;
      toast.success(`Exportação CSV concluída - ${count} ${count === 1 ? 'fatura' : 'faturas'}`);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      toast.error('Erro ao exportar CSV');
    } finally {
      setExporting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    const fallbackCopy = () => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('ID copiado');
      } catch (err) {
        console.error('Erro ao copiar ID:', err);
        toast.error('Não foi possível copiar o ID');
      }
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success('ID copiado');
      } else {
        fallbackCopy();
      }
    } catch (error) {
      console.error('Erro ao copiar ID:', error);
      fallbackCopy();
    }
  };

  const generateInvoicePdf = (invoice: Invoice) => {
    const amountFormatted = invoice.amount
      ? `R$ ${invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      : 'R$ 0,00';
    const dueDateFormatted = new Date(invoice.dueDate).toLocaleDateString('pt-BR');
    const paidDateFormatted = invoice.paidDate
      ? new Date(invoice.paidDate).toLocaleDateString('pt-BR')
      : '—';
    const statusMap: Record<Invoice['status'], { label: string; bg: string; color: string }> = {
      paid: { label: 'Paga', bg: '#E7F9EE', color: '#0F9D58' },
      pending: { label: 'Pendente', bg: '#FFF7E6', color: '#F4A100' },
      overdue: { label: 'Atrasada', bg: '#FDECEC', color: '#D93025' },
    };
    const statusStyle = statusMap[invoice.status] || statusMap.pending;

    const html = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Fatura ${invoice.id}</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: "Inter", Arial, sans-serif; padding: 32px; color: #0F172A; background: #F7F9FB; }
            .container { max-width: 780px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; box-shadow: 0 14px 42px rgba(15, 23, 42, 0.08); }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
            .title { display: flex; flex-direction: column; gap: 4px; }
            h1 { font-size: 24px; margin: 0; color: #0F172A; }
            .muted { color: #6B7280; font-size: 13px; }
            .pill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: ${statusStyle.bg}; color: ${statusStyle.color}; font-weight: 700; font-size: 13px; border: 1px solid rgba(0,0,0,0.03); text-transform: uppercase; letter-spacing: 0.2px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-top: 12px; }
            .card { border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px 18px; background: #ffffff; }
            h2 { font-size: 16px; margin: 0 0 8px 0; color: #111827; }
            .table { width: 100%; border-collapse: collapse; }
            .table td { padding: 8px 0; font-size: 14px; color: #111827; vertical-align: top; }
            .table td.label-cell { color: #6B7280; width: 160px; }
            .divider { height: 1px; background: #e5e7eb; margin: 20px 0; }
            .footer { margin-top: 16px; color: #6B7280; font-size: 12px; text-align: right; }
            .logo { font-weight: 800; color: #2F5FFF; letter-spacing: -0.2px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="title">
                <div class="logo">SegVision</div>
                <h1>Fatura</h1>
                <div class="muted">ID ${invoice.id}</div>
              </div>
              <div class="pill">${statusStyle.label}</div>
            </div>

            <div class="grid">
              <div class="card">
                <h2>Dados da Escola</h2>
                <table class="table">
                  <tr><td class="label-cell">Escola</td><td>${invoice.schoolName}</td></tr>
                  <tr><td class="label-cell">Plano</td><td>${invoice.plan}</td></tr>
                  <tr><td class="label-cell">Referência</td><td>${invoice.referenceMonth || '—'}</td></tr>
                </table>
              </div>
              <div class="card">
                <h2>Valores & Datas</h2>
                <table class="table">
                  <tr><td class="label-cell">Valor</td><td>${amountFormatted}</td></tr>
                  <tr><td class="label-cell">Vencimento</td><td>${dueDateFormatted}</td></tr>
                  <tr><td class="label-cell">Pago em</td><td>${paidDateFormatted}</td></tr>
                </table>
              </div>
            </div>

            <div class="divider"></div>

            <div class="card">
              <h2>Resumo</h2>
              <p class="muted">Documento gerado automaticamente pelo painel Financeiro. Mantenha este comprovante para registros internos.</p>
            </div>

            <div class="footer">
              Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url);
    if (win) {
      win.addEventListener('load', () => {
        win.print();
      });
    }
  };

  const handleCreateInvoice = async () => {
    if (!selectedSchoolId || !referenceMonth || !dueDate) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      // Get school to calculate amount based on plan
      const school = schools.find(s => s.id === selectedSchoolId);
      if (!school) {
        toast.error('Escola não encontrada');
        return;
      }

      // Get school plan and calculate amount
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('plan')
        .eq('id', selectedSchoolId)
        .single();

      if (schoolError) throw schoolError;

      // Calculate amount based on plan
      const planValues: Record<string, number> = {
        'basic': 1800,
        'pro': 3200,
        'enterprise': 5200
      };
      const amount = planValues[schoolData.plan] || 1800;

      const { error } = await supabase
        .from('invoices')
        .insert({
          school_id: selectedSchoolId,
          amount,
          status: 'pending',
          due_date: dueDate,
          reference_month: referenceMonth
        });

      if (error) throw error;

      await loadInvoices();
      setIsCreateInvoiceOpen(false);
      setSelectedSchoolId('');
      setReferenceMonth('');
      setDueDate('');
      toast.success('Fatura gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar fatura:', error);
      toast.error('Erro ao gerar fatura');
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (filterStatus === 'all') return true;
    return invoice.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      paid: { label: 'Paga', tone: 'paid' as const },
      pending: { label: 'Pendente', tone: 'pending' as const },
      overdue: { label: 'Atrasada', tone: 'overdue' as const }
    };
    const { label, tone } = config[status as keyof typeof config];
    return <Badge variant="medium" tone={tone} size="s">{label}</Badge>;
  };

  const getPlanBadge = (plan: string) => {
    const config = {
      Standard: { variant: 'light' as const, tone: 'neutral' as const },
      Premium: { variant: 'medium' as const, tone: 'info' as const },
      Enterprise: { variant: 'medium' as const, tone: 'primary' as const }
    };
    const { variant, tone } = config[plan as keyof typeof config];
    return <Badge variant={variant} tone={tone} size="s">{plan}</Badge>;
  };

  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const pendingRevenue = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);

  const overdueRevenue = invoices
    .filter(i => i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-[var(--neutral-text-muted)]">Carregando faturas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ações */}
      <div className="flex items-center justify-end">
        <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]">
              <Plus className="h-4 w-4" />
              Gerar Fatura
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
            <DialogHeader>
              <DialogTitle className="text-[var(--neutral-text)]">Gerar Nova Fatura</DialogTitle>
              <DialogDescription className="text-[var(--neutral-text-muted)]">
                Selecione a escola e o período para gerar uma nova fatura.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="school" className="text-[var(--neutral-text)]">Escola</Label>
                <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                  <SelectTrigger className="border-[var(--neutral-border)]">
                    <SelectValue placeholder="Selecione a escola" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map(school => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="month" className="text-[var(--neutral-text)]">Mês de Referência</Label>
                <Input
                  id="month"
                  type="month"
                  value={referenceMonth}
                  onChange={(e) => setReferenceMonth(e.target.value)}
                  className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-[var(--neutral-text)]">Data de Vencimento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateInvoiceOpen(false)}
                  className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateInvoice}
                  className="bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
                >
                  Gerar Fatura
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[var(--neutral-border)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-[var(--neutral-text-muted)]">Receita Recebida</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-[var(--success-bg)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[var(--neutral-text)]">R$ {totalRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">
              {invoices.filter(i => i.status === 'paid').length} faturas pagas
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--neutral-border)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-[var(--neutral-text-muted)]">Receita Pendente</CardTitle>
            <DollarSign className="h-4 w-4 text-[var(--warning-bg)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[var(--neutral-text)]">R$ {pendingRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">
              {invoices.filter(i => i.status === 'pending').length} faturas pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--neutral-border)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-[var(--neutral-text-muted)]">Receita Atrasada</CardTitle>
            <AlertCircle className="h-4 w-4 text-[var(--danger-bg)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[var(--neutral-text)]">R$ {overdueRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">
              {invoices.filter(i => i.status === 'overdue').length} faturas atrasadas
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--neutral-border)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-[var(--neutral-text-muted)]">Total do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-[var(--neutral-icon)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[var(--neutral-text)]">
              R$ {(totalRevenue + pendingRevenue + overdueRevenue).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">{invoices.length} faturas no total</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Faturas */}
      <Card className="border-[var(--neutral-border)]">
        <CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[var(--neutral-text)]">Faturas</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportCsv}
                disabled={exporting}
                className="gap-2 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)] disabled:opacity-60"
              >
                <Download className="h-4 w-4" />
                {exporting ? 'Exportando...' : 'Exportar CSV'}
              </Button>
            </div>

            {/* Filters - FilterBar Pattern */}
            <div className="dark:bg-[#212E70] rounded-xl p-3 border border-[var(--border)] flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[220px]">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="border-[var(--neutral-border)] hover:border-[var(--gray-300)] dark:bg-[#0B1343]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="paid">Pagas</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="overdue">Atrasadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isMobile ? (
            // Desktop: Table view
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[var(--gray-200)] dark:border-[rgba(250,250,250,0.15)]">
                      <TableHead className="text-[var(--neutral-text-muted)]">ID</TableHead>
                      <TableHead className="text-[var(--neutral-text-muted)]">Escola</TableHead>
                      <TableHead className="text-[var(--neutral-text-muted)]">Plano</TableHead>
                      <TableHead className="text-[var(--neutral-text-muted)]">Referência</TableHead>
                      <TableHead className="text-right text-[var(--neutral-text-muted)]">Valor</TableHead>
                      <TableHead className="text-[var(--neutral-text-muted)]">Vencimento</TableHead>
                      <TableHead className="text-[var(--neutral-text-muted)]">Status</TableHead>
                      <TableHead className="text-right text-[var(--neutral-text-muted)]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="border-[var(--neutral-border)] hover:bg-[var(--table-row-hover)]">
                        <TableCell className="text-sm text-[var(--neutral-text)] max-w-[140px]">
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="w-full text-left truncate inline-flex items-center gap-1 text-[var(--neutral-text)] hover:text-[var(--primary-text)] bg-transparent"
                                    onClick={() => copyToClipboard(invoice.id)}
                                  >
                                    <span className="truncate">
                                      {invoice.id.slice(0, 6)}…{invoice.id.slice(-4)}
                                    </span>
                                  </button>
                                </TooltipTrigger>
                              <TooltipContent className="max-w-xs bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
                                <p className="text-xs break-all">{invoice.id}</p>
                                <p className="text-[10px] text-[var(--neutral-text-muted)]">Clique para copiar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-[var(--neutral-text)]">{invoice.schoolName}</div>
                        </TableCell>
                        <TableCell>
                          {getPlanBadge(invoice.plan)}
                        </TableCell>
                        <TableCell className="text-sm text-[var(--neutral-text-muted)]">{invoice.referenceMonth}</TableCell>
                        <TableCell className="text-right text-sm text-[var(--neutral-text)]">
                          R$ {invoice.amount.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-sm text-[var(--neutral-text-muted)]">
                          {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-[var(--neutral-icon)] hover:bg-[var(--neutral-subtle)]">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
                              <DropdownMenuItem
                                className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                                onClick={() => generateInvoicePdf(invoice)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Baixar PDF (imprimir)
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                                onClick={() => toast.info('Envio por email será implementado via gateway')}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Enviar por Email
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                                onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                              >
                                Marcar como paga
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                                onClick={() => updateInvoiceStatus(invoice.id, 'overdue')}
                              >
                                Marcar como atrasada
                              </DropdownMenuItem>
                              {invoice.status !== 'pending' && (
                                <DropdownMenuItem
                                  className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                                  onClick={() => updateInvoiceStatus(invoice.id, 'pending')}
                                >
                                  Reabrir como pendente
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            // Mobile: Card view
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => (
                <div 
                  key={invoice.id} 
                  className="bg-[var(--analytics-list-bg)] border border-[var(--neutral-border)] rounded-lg p-4 hover:bg-[var(--neutral-subtle)] dark:hover:bg-[var(--blue-primary-800)] transition-colors"
                >
                  <div className="space-y-3">
                    {/* Header with icon and status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-[var(--neutral-subtle)] p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-[var(--neutral-text)]" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <TooltipProvider delayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="text-sm text-[var(--neutral-text)] max-w-[160px] truncate text-left hover:text-[var(--primary-text)] bg-transparent"
                                    onClick={() => copyToClipboard(invoice.id)}
                                    title="Clique para copiar"
                                  >
                                    {invoice.id.slice(0, 6)}…{invoice.id.slice(-4)}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
                                  <p className="text-xs break-all">{invoice.id}</p>
                                  <p className="text-[10px] text-[var(--neutral-text-muted)]">Clique para copiar</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {getStatusBadge(invoice.status)}
                          </div>
                          <p className="text-sm text-[var(--neutral-text)]">{invoice.schoolName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[var(--neutral-text-muted)]">Plano:</span>
                        <span>{getPlanBadge(invoice.plan)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--neutral-text-muted)]">Referência:</span>
                        <span className="text-[var(--neutral-text)]">{invoice.referenceMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--neutral-text-muted)]">Valor:</span>
                        <span className="text-[var(--neutral-text)]">R$ {invoice.amount.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--neutral-text-muted)]">Vencimento:</span>
                        <span className="text-[var(--neutral-text)]">
                          {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      {invoice.paidDate && (
                        <div className="flex justify-between">
                          <span className="text-[var(--neutral-text-muted)]">Pago em:</span>
                          <span className="text-[var(--green-alert-400)]">
                            {new Date(invoice.paidDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-[var(--neutral-border)]">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                        onClick={() => generateInvoicePdf(invoice)}
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                        onClick={() => toast.info('Envio por email será implementado via gateway')}
                      >
                        <Send className="h-4 w-4" />
                        Enviar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                        onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                      >
                        Marcar paga
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                        onClick={() => updateInvoiceStatus(invoice.id, 'overdue')}
                      >
                        Atrasada
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-[var(--neutral-text-muted)]">
              Nenhuma fatura encontrada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
