import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Clock, CheckCircle, AlertCircle, Search } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'aberto' | 'em_andamento' | 'resolvido';
  createdAt: string;
  updatedAt: string;
  category: string;
}

const allTickets: Ticket[] = [
  {
    id: '1',
    title: 'Câmera offline no pátio',
    description: 'A câmera do pátio central está fora do ar desde ontem',
    priority: 'alta',
    status: 'em_andamento',
    createdAt: '2024-01-15 09:30',
    updatedAt: '2024-01-15 14:20',
    category: 'Hardware'
  },
  {
    id: '2',
    title: 'Configuração de alertas',
    description: 'Preciso de ajuda para configurar alertas personalizados',
    priority: 'media',
    status: 'resolvido',
    createdAt: '2024-01-14 16:45',
    updatedAt: '2024-01-14 18:30',
    category: 'Configuração'
  },
  {
    id: '3',
    title: 'Problema no reconhecimento facial',
    description: 'O sistema não está identificando alguns funcionários',
    priority: 'media',
    status: 'aberto',
    createdAt: '2024-01-13 11:20',
    updatedAt: '2024-01-13 11:20',
    category: 'IA'
  },
  {
    id: '4',
    title: 'Erro ao exportar relatório',
    description: 'Ao tentar exportar o relatório mensal, recebo mensagem de erro',
    priority: 'baixa',
    status: 'aberto',
    createdAt: '2024-01-12 14:15',
    updatedAt: '2024-01-12 14:15',
    category: 'Relatórios'
  },
  {
    id: '5',
    title: 'Câmera com imagem tremida',
    description: 'Câmera da entrada apresenta imagem com muita vibração',
    priority: 'media',
    status: 'em_andamento',
    createdAt: '2024-01-11 10:00',
    updatedAt: '2024-01-12 09:30',
    category: 'Hardware'
  },
  {
    id: '6',
    title: 'Adicionar novos usuários',
    description: 'Como adiciono mais usuários com permissões limitadas?',
    priority: 'baixa',
    status: 'resolvido',
    createdAt: '2024-01-10 15:20',
    updatedAt: '2024-01-10 16:45',
    category: 'Configuração'
  },
  {
    id: '7',
    title: 'Falha na detecção de movimento',
    description: 'Sistema não está gerando alertas de movimento na quadra',
    priority: 'alta',
    status: 'aberto',
    createdAt: '2024-01-09 08:45',
    updatedAt: '2024-01-09 08:45',
    category: 'IA'
  },
  {
    id: '8',
    title: 'Atualização de firmware',
    description: 'Solicitação de atualização de firmware para câmeras',
    priority: 'urgente',
    status: 'em_andamento',
    createdAt: '2024-01-08 13:00',
    updatedAt: '2024-01-09 10:15',
    category: 'Sistema'
  }
];

interface AllTicketsScreenProps {
  onNavigate: (screen: string) => void;
}

export function AllTicketsScreen({ onNavigate }: AllTicketsScreenProps) {
  const [tickets, setTickets] = useState<Ticket[]>(allTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [priorityFilter, setPriorityFilter] = useState<string>('todos');

  const getPriorityBadge = (priority: string) => {
    const config = {
      'baixa': { variant: 'medium' as const, tone: 'success' as const, label: 'Baixa' },
      'media': { variant: 'medium' as const, tone: 'warning' as const, label: 'Média' },
      'alta': { variant: 'medium' as const, tone: 'danger' as const, label: 'Alta' },
      'urgente': { variant: 'medium' as const, tone: 'danger' as const, label: 'Urgente' }
    };
    const badgeConfig = config[priority as keyof typeof config] || { variant: 'medium' as const, tone: 'neutral' as const, label: priority };
    return <Badge variant={badgeConfig.variant} tone={badgeConfig.tone} size="s">{badgeConfig.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberto': return <AlertCircle size={16} className="text-[var(--danger-bg)]" />;
      case 'em_andamento': return <Clock size={16} className="text-[var(--warning-bg)]" />;
      case 'resolvido': return <CheckCircle size={16} className="text-[var(--success-bg)]" />;
      default: return <AlertCircle size={16} className="text-[var(--neutral-text-muted)]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      'aberto': { variant: 'light' as const, tone: 'danger' as const, label: 'Aberto' },
      'em_andamento': { variant: 'light' as const, tone: 'warning' as const, label: 'Em Andamento' },
      'resolvido': { variant: 'light' as const, tone: 'success' as const, label: 'Resolvido' }
    };
    const badgeConfig = config[status as keyof typeof config] || { variant: 'light' as const, tone: 'neutral' as const, label: status };
    return <Badge variant={badgeConfig.variant} tone={badgeConfig.tone} size="s">{badgeConfig.label}</Badge>;
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'todos' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusCounts = {
    todos: tickets.length,
    aberto: tickets.filter(t => t.status === 'aberto').length,
    em_andamento: tickets.filter(t => t.status === 'em_andamento').length,
    resolvido: tickets.filter(t => t.status === 'resolvido').length
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => onNavigate('support')}>
                Central de Inteligência
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Meus chamados</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-[var(--neutral-text)] text-[20px] font-bold font-normal">Meus chamados</h1>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl text-[var(--neutral-text)] mb-1">{statusCounts.todos}</div>
              <div className="text-[var(--neutral-text-muted)]">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl text-[var(--danger-bg)] mb-1">{statusCounts.aberto}</div>
              <div className="text-[var(--neutral-text-muted)]">Abertos</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl text-[var(--warning-bg)] mb-1">{statusCounts.em_andamento}</div>
              <div className="text-[var(--neutral-text-muted)]">Em Andamento</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl text-[var(--success-bg)] mb-1">{statusCounts.resolvido}</div>
              <div className="text-[var(--neutral-text-muted)]">Resolvidos</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)]">Filtrar Chamados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-text-muted)]" />
              <Input
                placeholder="Buscar por título, descrição ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[var(--neutral-border)] focus:border-[var(--primary-bg)] focus:ring-[var(--primary-bg)]"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-[var(--neutral-border)]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="border-[var(--neutral-border)]">
                <SelectValue placeholder="Filtrar por prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Prioridades</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Chamados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)]">
            Todos os Chamados ({filteredTickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8 text-[var(--neutral-text-muted)]">
                Nenhum chamado encontrado com os filtros aplicados.
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div key={ticket.id} className="bg-[var(--analytics-list-bg)] border border-[var(--neutral-border)] rounded-md p-4 hover:bg-[var(--neutral-subtle)] dark:hover:bg-[#0F1854] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(ticket.status)}
                        <h4 className="text-[var(--neutral-text)]">{ticket.title}</h4>
                      </div>
                      <p className="text-[var(--neutral-text-muted)] mb-2">{ticket.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                      <Badge variant="light" tone="neutral" size="s">{ticket.category}</Badge>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[var(--neutral-text-muted)]">Criado: {ticket.createdAt}</span>
                      {ticket.createdAt !== ticket.updatedAt && (
                        <span className="text-[var(--neutral-text-muted)]">Atualizado: {ticket.updatedAt}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
