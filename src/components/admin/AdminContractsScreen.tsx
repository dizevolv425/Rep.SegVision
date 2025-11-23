import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Plus,
  Download,
  Edit,
  AlertCircle,
  CheckCircle2,
  Clock,
  MoreVertical,
  Activity,
  Eye,
  Users,
  Search,
  Zap,
  X
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useIsMobile } from '../ui/use-mobile';

interface Contract {
  id: string;
  school: string;
  plan: string;
  status: 'active' | 'expiring' | 'expired';
  startDate: string;
  endDate: string;
  monthlyValue: number;
  totalValue: number;
  cameras: number;
  users: number;
  renewalDate?: string;
}

const mockContracts: Contract[] = [
  {
    id: 'CONT-001',
    school: 'Colégio São Pedro',
    plan: 'Premium',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    monthlyValue: 3200,
    totalValue: 38400,
    cameras: 32,
    users: 45,
  },
  {
    id: 'CONT-002',
    school: 'Escola Municipal Centro',
    plan: 'Standard',
    status: 'expiring',
    startDate: '2024-02-20',
    endDate: '2024-07-20',
    monthlyValue: 1800,
    totalValue: 10800,
    cameras: 18,
    users: 28,
    renewalDate: '2024-07-20'
  },
  {
    id: 'CONT-003',
    school: 'Instituto Educacional Norte',
    plan: 'Premium',
    status: 'active',
    startDate: '2024-06-10',
    endDate: '2025-06-09',
    monthlyValue: 2800,
    totalValue: 33600,
    cameras: 24,
    users: 35,
  },
  {
    id: 'CONT-004',
    school: 'Colégio Adventista',
    plan: 'Enterprise',
    status: 'active',
    startDate: '2023-11-05',
    endDate: '2024-11-04',
    monthlyValue: 5200,
    totalValue: 62400,
    cameras: 48,
    users: 67,
  },
];

const subscriptionPlans = [
  {
    name: 'Standard',
    price: 'R$ 1.800/mês',
    features: [
      'Até 20 câmeras',
      'Até 30 usuários',
      'Detecção de Movimento (IA Básica)',
      'Detecção de Intrusão (IA Básica)',
      'Suporte por email',
      'Relatórios básicos'
    ],
    aiNote: 'Detecção básica com baixo consumo de tokens'
  },
  {
    name: 'Premium',
    price: 'R$ 3.200/mês',
    features: [
      'Até 40 câmeras',
      'Até 50 usuários',
      'Todas as features do Standard',
      'Reconhecimento Facial (IA Avançada)',
      'Contagem de Pessoas (IA Avançada)',
      'Suporte prioritário',
      'Relatórios avançados'
    ],
    aiNote: 'IA avançada com maior consumo de tokens'
  },
  {
    name: 'Enterprise',
    price: 'Customizado',
    features: [
      'Câmeras ilimitadas',
      'Usuários ilimitados',
      'Todas as features do Premium',
      'Busca Avançada por IA (Alto custo)',
      'API de Integração completa',
      'Suporte 24/7',
      'Relatórios personalizados',
      'Gerente dedicado'
    ],
    aiNote: 'Busca avançada consome mais tokens de IA'
  }
];

export function AdminContractsScreen() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [isCreateContractOpen, setIsCreateContractOpen] = useState(false);
  const isMobile = useIsMobile();

  const getStatusBadge = (status: string) => {
    const config = {
      active: { variant: 'medium' as const, tone: 'success' as const, label: 'Ativo' },
      expiring: { variant: 'medium' as const, tone: 'warning' as const, label: 'A Vencer' },
      expired: { variant: 'medium' as const, tone: 'danger' as const, label: 'Expirado' }
    };
    const { variant, tone, label } = config[status as keyof typeof config];
    return <Badge variant={variant} tone={tone} size="s">{label}</Badge>;
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

  const stats = [
    { title: 'Contratos Ativos', value: contracts.filter(c => c.status === 'active').length, icon: FileText, change: '+2 este mês' },
    { title: 'Contratos a Vencer', value: contracts.filter(c => c.status === 'expiring').length, icon: AlertCircle, change: 'Próximos 30 dias' },
    { title: 'Receita Mensal Total', value: `R$ ${contracts.reduce((sum, c) => sum + c.monthlyValue, 0).toLocaleString('pt-BR')}`, icon: DollarSign, change: '+8% vs. mês anterior' },
    { title: 'Taxa de Renovação', value: '92%', icon: TrendingUp, change: '+5% este ano' },
  ];

  return (
    <div className="space-y-6">
      {/* Ações */}
      <div className="flex items-center justify-end">
        <Dialog open={isCreateContractOpen} onOpenChange={setIsCreateContractOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]">
              <Plus className="h-4 w-4" />
              Novo Contrato
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
            <DialogHeader>
              <DialogTitle className="text-[var(--neutral-text)]">Criar Novo Contrato</DialogTitle>
              <DialogDescription className="text-[var(--neutral-text-muted)]">
                Configure um novo contrato para uma escola cliente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[var(--neutral-text)]">Escola</Label>
                <Select>
                  <SelectTrigger className="border-[var(--neutral-border)]">
                    <SelectValue placeholder="Selecione a escola" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Colégio São Pedro</SelectItem>
                    <SelectItem value="2">Escola Municipal Centro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--neutral-text)]">Plano</Label>
                <Select>
                  <SelectTrigger className="border-[var(--neutral-border)]">
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--neutral-text)]">Data de Início</Label>
                  <Input type="date" className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--neutral-text)]">Data de Término</Label>
                  <Input type="date" className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setIsCreateContractOpen(false)}
                  className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => setIsCreateContractOpen(false)}
                  className="bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
                >
                  Criar Contrato
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="bg-[var(--neutral-subtle)] border-[var(--neutral-border)]">
          <TabsTrigger value="contracts" className="data-[state=active]:bg-[var(--neutral-bg)]">Contratos Ativos</TabsTrigger>
          <TabsTrigger value="plans" className="data-[state=active]:bg-[var(--neutral-bg)]">Planos & Preços</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-[var(--neutral-border)]">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-[var(--neutral-text-muted)]">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-[var(--neutral-icon)]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl text-[var(--neutral-text)]">{stat.value}</div>
                    <p className="text-xs text-[var(--neutral-text-muted)] mt-1">{stat.change}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tabela de Contratos */}
          <Card className="border-[var(--neutral-border)]">
            <CardHeader>
              <CardTitle className="text-[var(--neutral-text)]">Contratos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[var(--gray-200)] dark:border-[rgba(250,250,250,0.15)]">
                      <TableHead className="text-[var(--neutral-text-muted)]">ID</TableHead>
                      <TableHead className="text-[var(--neutral-text-muted)]">Escola</TableHead>
                      <TableHead className="text-[var(--neutral-text-muted)]">Plano</TableHead>
                      <TableHead className="text-[var(--neutral-text-muted)]">Data Início</TableHead>
                      <TableHead className="text-[var(--neutral-text-muted)]">Data Término</TableHead>
                      <TableHead className="text-right text-[var(--neutral-text-muted)]">Valor Mensal</TableHead>
                      <TableHead className="text-right text-[var(--neutral-text-muted)]">Valor Total</TableHead>
                      <TableHead className="text-[var(--neutral-text-muted)]">Status</TableHead>
                      <TableHead className="text-right text-[var(--neutral-text-muted)]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => (
                      <TableRow key={contract.id} className="border-[var(--neutral-border)] hover:bg-[var(--table-row-hover)]">
                        <TableCell className="text-sm text-[var(--neutral-text)]">{contract.id}</TableCell>
                        <TableCell className="text-sm text-[var(--neutral-text)]">{contract.school}</TableCell>
                        <TableCell>{getPlanBadge(contract.plan)}</TableCell>
                        <TableCell className="text-sm text-[var(--neutral-text-muted)]">
                          {new Date(contract.startDate).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-sm text-[var(--neutral-text-muted)]">
                          {new Date(contract.endDate).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right text-sm text-[var(--neutral-text)]">
                          R$ {contract.monthlyValue.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right text-sm text-[var(--neutral-text)]">
                          R$ {contract.totalValue.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-[var(--neutral-icon)] hover:bg-[var(--neutral-subtle)]">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
                              <DropdownMenuItem className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]">
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]">
                                <Download className="mr-2 h-4 w-4" />
                                Baixar Contrato
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          {/* Card Informativo sobre Custos de IA */}
          <Card className="border-[var(--info-bg)] bg-[var(--info-bg)]/5">
            <CardHeader>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-[var(--info-bg)] mt-0.5 flex-shrink-0" />
                <div>
                  <CardTitle className="text-[var(--neutral-text)]">Precificação Baseada em Features de IA</CardTitle>
                  <p className="text-sm text-[var(--neutral-text-muted)] mt-2">
                    Os planos são precificados de acordo com o consumo de tokens de IA. Features mais avançadas como 
                    <strong> Reconhecimento Facial</strong>, <strong>Contagem de Pessoas</strong> e 
                    <strong> Busca Avançada</strong> exigem maior processamento de IA e, portanto, têm custos mais elevados.
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Cards de Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan, index) => (
              <Card key={index} className={`border-[var(--neutral-border)] ${index === 1 ? 'ring-2 ring-[var(--primary-bg)]/20' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-[var(--neutral-text)]">{plan.name}</CardTitle>
                    {index === 1 && (
                      <Badge variant="medium" tone="primary" size="s">Popular</Badge>
                    )}
                  </div>
                  <div className="text-2xl text-[var(--neutral-text)] mt-2">{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--success-bg)] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[var(--neutral-text-muted)]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Nota sobre consumo de IA */}
                  <div className="p-3 bg-[var(--neutral-subtle)] rounded-lg mb-4">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-[var(--neutral-icon)] mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-[var(--neutral-text-muted)]">
                        {plan.aiNote}
                      </p>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
                  >
                    Selecionar Plano
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabela de Comparação de Features de IA */}
          <Card className="border-[var(--neutral-border)]">
            <CardHeader>
              <CardTitle className="text-[var(--neutral-text)]">Comparação de Features de IA</CardTitle>
              <p className="text-sm text-[var(--neutral-text-muted)] mt-2">
                Entenda quais recursos de inteligência artificial estão inclusos em cada plano
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[var(--neutral-border)]">
                      <TableHead className="text-[var(--neutral-text-muted)] w-[250px]">Feature de IA</TableHead>
                      <TableHead className="text-center text-[var(--neutral-text-muted)]">Standard</TableHead>
                      <TableHead className="text-center text-[var(--neutral-text-muted)]">Premium</TableHead>
                      <TableHead className="text-center text-[var(--neutral-text-muted)]">Enterprise</TableHead>
                      <TableHead className="text-[var(--neutral-text-muted)]">Consumo de Tokens</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-[var(--neutral-border)] hover:bg-[var(--table-row-hover)]">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-[var(--neutral-icon)]" />
                          <span className="text-sm text-[var(--neutral-text)]">Detecção de Movimento</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success-bg)] mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success-bg)] mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success-bg)] mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Badge variant="light" tone="success" size="s">Baixo</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-[var(--neutral-border)] hover:bg-[var(--table-row-hover)]">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-[var(--neutral-icon)]" />
                          <span className="text-sm text-[var(--neutral-text)]">Detecção de Intrusão</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success-bg)] mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success-bg)] mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success-bg)] mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Badge variant="light" tone="success" size="s">Baixo</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-[var(--neutral-border)] hover:bg-[var(--table-row-hover)]">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-[var(--neutral-icon)]" />
                          <span className="text-sm text-[var(--neutral-text)]">Reconhecimento Facial</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="h-5 w-5 text-[var(--neutral-text-muted)] mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success-bg)] mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success-bg)] mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Badge variant="light" tone="warning" size="s">Médio</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-[var(--neutral-border)] hover:bg-[var(--table-row-hover)]">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[var(--neutral-icon)]" />
                          <span className="text-sm text-[var(--neutral-text)]">Contagem de Pessoas</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="h-5 w-5 text-[var(--neutral-text-muted)] mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success-bg)] mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success-bg)] mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Badge variant="light" tone="warning" size="s">Médio</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-[var(--neutral-border)] hover:bg-[var(--table-row-hover)]">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-[var(--neutral-icon)]" />
                          <span className="text-sm text-[var(--neutral-text)]">Busca Avançada por IA</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="h-5 w-5 text-[var(--neutral-text-muted)] mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="h-5 w-5 text-[var(--neutral-text-muted)] mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success-bg)] mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Badge variant="medium" tone="danger" size="s">Alto</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-[var(--neutral-border)] hover:bg-[var(--table-row-hover)]">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-[var(--neutral-icon)]" />
                          <span className="text-sm text-[var(--neutral-text)]">API de Integração</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="h-5 w-5 text-[var(--neutral-text-muted)] mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <X className="h-5 w-5 text-[var(--neutral-text-muted)] mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckCircle2 className="h-5 w-5 text-[var(--success-bg)] mx-auto" />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[var(--neutral-text-muted)]">-</span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}