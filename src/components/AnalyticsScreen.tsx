import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Search, User, Users, MapPin, UserCircle, HelpCircle, Download, FileText, AlertTriangle, ChevronDown, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useIsMobile } from './ui/use-mobile';
import { EmptyState } from './EmptyState';

const faceData = [
  { id: '1', name: 'João Silva', frequency: 45, lastSeen: '10:30', icon: User, type: 'teacher' },
  { id: '2', name: 'Maria Santos', frequency: 38, lastSeen: '11:15', icon: UserCircle, type: 'student' },
  { id: '3', name: 'Pedro Costa', frequency: 25, lastSeen: '09:45', icon: UserCircle, type: 'student' },
  { id: '4', name: 'Pessoa Desconhecida', frequency: 8, lastSeen: '14:20', icon: HelpCircle, type: 'unknown' },
  { id: '5', name: 'Ana Oliveira', frequency: 42, lastSeen: '13:30', icon: User, type: 'teacher' },
  { id: '6', name: 'Carlos Lima', frequency: 12, lastSeen: '08:15', icon: UserCircle, type: 'student' }
];

const countData = [
  { camera: 'Entrada', count: 124 },
  { camera: 'Pátio', count: 89 },
  { camera: 'Corredor A', count: 67 },
  { camera: 'Biblioteca', count: 34 },
  { camera: 'Quadra', count: 156 },
  { camera: 'Laboratório', count: 28 }
];

const peakHours = [
  { time: '07:00', people: 45 },
  { time: '08:00', people: 120 },
  { time: '09:00', people: 95 },
  { time: '10:00', people: 110 },
  { time: '11:00', people: 85 },
  { time: '12:00', people: 150 },
  { time: '13:00', people: 130 },
  { time: '14:00', people: 95 },
  { time: '15:00', people: 78 },
  { time: '16:00', people: 60 },
  { time: '17:00', people: 35 }
];

const heatmapData = [
  { area: 'Entrada Principal', intensity: 'high', level: 85 },
  { area: 'Pátio Central', intensity: 'high', level: 92 },
  { area: 'Corredor A', intensity: 'medium', level: 65 },
  { area: 'Corredor B', intensity: 'medium', level: 58 },
  { area: 'Biblioteca', intensity: 'low', level: 25 },
  { area: 'Laboratório 1', intensity: 'low', level: 18 },
  { area: 'Laboratório 2', intensity: 'low', level: 22 },
  { area: 'Quadra Esportiva', intensity: 'high', level: 88 },
  { area: 'Cantina', intensity: 'high', level: 95 }
];

const incidentData = [
  { name: 'Intrusão', value: 28, color: '#DC2626' },
  { name: 'Aglomeração', value: 42, color: '#F5A41D' },
  { name: 'Brigas', value: 8, color: '#991B1B' },
  { name: 'Objetos Suspeitos', value: 15, color: '#2F5FFF' },
  { name: 'Pessoas Não Autorizadas', value: 18, color: '#7C3AED' },
  { name: 'Outros', value: 12, color: '#6B7280' }
];

const COLORS = ['#DC2626', '#F5A41D', '#991B1B', '#2F5FFF', '#7C3AED', '#6B7280'];

interface AnalyticsScreenProps {
  onNavigateToAlerts: (searchTerm: string) => void;
  isFirstAccess?: boolean;
}

export function AnalyticsScreen({ onNavigateToAlerts, isFirstAccess = false }: AnalyticsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults] = useState([
    { id: '1', query: 'mochila vermelha', time: '14:30', camera: 'Entrada Principal', description: 'Pessoa com mochila vermelha detectada' },
    { id: '2', query: 'pessoa desconhecida', time: '13:45', camera: 'Biblioteca', description: 'Rosto não identificado no sistema' },
    { id: '3', query: 'grupo estudantes', time: '12:20', camera: 'Pátio Central', description: 'Aglomeração de 8 pessoas detectada' }
  ]);

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      onNavigateToAlerts(searchQuery.trim());
    }
  };

  const handleRecentSearchClick = (query: string) => {
    onNavigateToAlerts(query);
  };

  const handleExportData = (type: 'facial' | 'contagem' | 'incidentes') => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (type === 'facial') {
      // Exportar Dados de Reconhecimento Facial
      const exportData = {
        titulo: 'Relatório de Reconhecimento Facial - SegVision',
        dataExportacao: new Date().toLocaleString('pt-BR'),
        periodo: 'Últimos 30 dias',
        totalPessoas: faceData.length,
        reconhecimentos: faceData.map(f => ({
          nome: f.name,
          aparicoes: f.frequency,
          ultimaVez: f.lastSeen,
          tipo: f.type === 'teacher' ? 'Professor' : f.type === 'student' ? 'Estudante' : 'Desconhecido'
        }))
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reconhecimento-facial-segvision-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Relatório de Reconhecimento Facial exportado!\n\nFormato: JSON\nPessoas incluídas: ' + faceData.length);
    } else if (type === 'contagem') {
      // Exportar Dados de Contagem de Pessoas e Horários de Pico
      let csvContent = 'RELATÓRIO DE CONTAGEM E HORÁRIOS DE PICO - SEGVISION\n';
      csvContent += `Data de Exportação: ${new Date().toLocaleString('pt-BR')}\n`;
      csvContent += 'Período: Últimos 30 dias\n\n';
      
      // Contagem por Câmera
      csvContent += 'CONTAGEM DE PESSOAS POR CÂMERA\n';
      csvContent += 'Câmera,Contagem\n';
      countData.forEach(c => {
        csvContent += `${c.camera},${c.count}\n`;
      });
      csvContent += '\n';
      
      // Horários de Pico
      csvContent += 'HORÁRIOS DE PICO\n';
      csvContent += 'Horário,Pessoas\n';
      peakHours.forEach(h => {
        csvContent += `${h.time},${h.people}\n`;
      });

      const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contagem-horarios-pico-segvision-${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Relatório de Contagem e Horários de Pico exportado!\n\nFormato: CSV\nCâmeras: ' + countData.length);
    } else if (type === 'incidentes') {
      // Exportar Gráfico de Total de Incidentes por Tipo
      const exportData = {
        titulo: 'Relatório de Incidentes por Tipo - SegVision',
        dataExportacao: new Date().toLocaleString('pt-BR'),
        periodo: 'Últimos 30 dias',
        totalIncidentes: incidentData.reduce((acc, item) => acc + item.value, 0),
        distribuicao: incidentData.map(i => ({
          tipo: i.name,
          quantidade: i.value,
          percentual: ((i.value / incidentData.reduce((acc, item) => acc + item.value, 0)) * 100).toFixed(1) + '%',
          cor: i.color
        }))
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `incidentes-por-tipo-segvision-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Relatório de Incidentes por Tipo exportado!\n\nFormato: JSON\nTotal de Incidentes: ' + incidentData.reduce((acc, item) => acc + item.value, 0));
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'bg-[var(--danger-bg)]';
      case 'medium': return 'bg-[var(--warning-bg)]';
      case 'low': return 'bg-[var(--success-bg)]';
      default: return 'bg-[var(--neutral-border)]';
    }
  };

  const isMobile = useIsMobile();

  // Show empty state for first access
  if (isFirstAccess) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Análises em desenvolvimento"
        description="Assim que o sistema começar a processar dados das câmeras, você verá aqui análises detalhadas sobre reconhecimento facial, contagem de pessoas e padrões de movimento."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Botão de exportação */}
      <div className="flex items-start justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[var(--primary-bg)] hover:bg-[var(--primary-bg-hover)] text-[var(--primary-text-on)]">
              <Download className="h-4 w-4 mr-2" />
              Gerar Relatório
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuItem onClick={() => handleExportData('facial')}>
              <User className="h-4 w-4 mr-2" />
              Exportar Dados de Reconhecimento Facial
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportData('contagem')}>
              <Users className="h-4 w-4 mr-2" />
              Exportar Dados de Contagem/Horários
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExportData('incidentes')}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Exportar Gráfico de Incidentes por Tipo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Reconhecimento Facial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            Reconhecimento Facial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faceData.map((face) => {
              const FaceIcon = face.icon;
              return (
                <div key={face.id} className="flex items-center gap-3 p-3 border border-[var(--neutral-border)] rounded-md bg-[var(--card-inner-bg)]">
                  <div className={`p-2 rounded-full ${
                    face.type === 'teacher' ? 'bg-[var(--primary-bg)]/10' :
                    face.type === 'student' ? 'bg-[var(--success-bg)]/20' :
                    'bg-[var(--neutral-subtle)]'
                  }`}>
                    <FaceIcon className={`h-6 w-6 ${
                      face.type === 'teacher' ? 'text-[var(--primary-bg)]' :
                      face.type === 'student' ? 'text-[var(--success-bg)]' :
                      'text-[var(--neutral-icon)]'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[var(--neutral-text)]">{face.name}</p>
                    <p className="text-xs text-[var(--neutral-text-muted)]">Aparições: {face.frequency}</p>
                    <p className="text-xs text-[var(--neutral-text-muted)]">Última vez: {face.lastSeen}</p>
                  </div>
                  <Badge variant="light" tone="neutral" size="s">
                    {face.frequency > 30 ? 'Frequente' : face.frequency > 15 ? 'Regular' : 'Raro'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contagem de Pessoas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Contagem de Pessoas por Câmera
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-[rgba(255,255,255,0)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countData}>
                  <XAxis 
                    dataKey="camera" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                    tick={{ fill: 'var(--neutral-text)' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                    tick={{ fill: 'var(--neutral-text)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="var(--primary-bg)" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Horários de Pico */}
        <Card>
          <CardHeader>
            <CardTitle>Horários de Pico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {peakHours.slice(0, 6).map((hour) => (
                <div key={hour.time} className="flex items-center justify-between p-2 bg-[var(--analytics-list-bg)] rounded-md">
                  <span className="text-sm text-[var(--neutral-text)]">{hour.time}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-[var(--neutral-border)] rounded-full h-2">
                      <div 
                        className="bg-[var(--primary-bg)] h-2 rounded-full" 
                        style={{ width: `${(hour.people / 150) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-[var(--neutral-text-muted)] w-12 text-right">{hour.people}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total de Incidentes por Tipo - Gráfico de Rosca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={20} />
            Total de Incidentes por Tipo
          </CardTitle>
          <p className="text-sm text-[var(--neutral-text-muted)] mt-2">
            Distribuição percentual dos eventos detectados pela IA nos últimos 30 dias
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Rosca */}
            <div className="h-80 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {incidentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--neutral-border)',
                      borderRadius: '8px',
                      color: 'var(--neutral-text)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    itemStyle={{
                      color: 'var(--neutral-text)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Label central no meio da rosca */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-3xl text-[var(--neutral-text)]">
                    {incidentData.reduce((acc, item) => acc + item.value, 0)}
                  </p>
                  <p className="text-xs text-[var(--neutral-text-muted)] mt-1">Incidentes</p>
                </div>
              </div>
            </div>

            {/* Legenda e Detalhes */}
            <div className="space-y-3">
              <div className="mb-4">
                <p className="text-sm text-[var(--neutral-text-muted)]">Distribuição de Incidentes - Últimos 30 dias</p>
                <p className="text-2xl text-[var(--neutral-text)] mt-1">
                  {incidentData.reduce((acc, item) => acc + item.value, 0)} Total
                </p>
              </div>

              <div className="space-y-2">
                {incidentData.map((incident) => {
                  const total = incidentData.reduce((acc, item) => acc + item.value, 0);
                  const percentage = ((incident.value / total) * 100).toFixed(1);
                  
                  return (
                    <div key={incident.name} className="flex items-center justify-between p-3 bg-[var(--analytics-list-bg)] rounded-md">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: incident.color }}
                        ></div>
                        <div>
                          <p className="text-sm text-[var(--neutral-text)]">{incident.name}</p>
                          <p className="text-xs text-[var(--neutral-text-muted)]">{incident.value} ocorrências</p>
                        </div>
                      </div>
                      <Badge variant="light" tone="neutral" size="s">
                        {percentage}%
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapa de Calor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin size={20} />
            Mapa de Calor - Áreas de Movimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {heatmapData.map((area) => (
              <div key={area.area} className="p-4 border border-[var(--neutral-border)] rounded-md bg-[var(--card-inner-bg)]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-[var(--neutral-text)]">{area.area}</p>
                  <Badge variant="light" tone="neutral" size="s">
                    {area.level}%
                  </Badge>
                </div>
                <div className="w-full bg-[var(--neutral-border)] rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full ${getIntensityColor(area.intensity)}`}
                    style={{ width: `${area.level}%` }}
                  ></div>
                </div>
                <p className="text-xs text-[var(--neutral-text-muted)] capitalize">{area.intensity} activity</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Busca Avançada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search size={20} />
            Busca Avançada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ex: mochila vermelha, pessoa desconhecida, grupo estudantes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchClick();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={handleSearchClick}>
                <Search size={16} />
              </Button>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm text-[var(--neutral-text)]">Buscas Recentes:</h4>
              {searchResults.map((result) => (
                <div 
                  key={result.id} 
                  className="flex items-center justify-between p-3 bg-[var(--analytics-list-bg)] rounded-md cursor-pointer hover:bg-[var(--neutral-border)] dark:hover:bg-[var(--blue-primary-800)] transition-colors"
                  onClick={() => handleRecentSearchClick(result.query)}
                >
                  <div>
                    <p className="text-sm text-[var(--neutral-text)]">"{result.query}"</p>
                    <p className="text-xs text-[var(--neutral-text-muted)]">{result.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--neutral-text)]">{result.time}</p>
                    <p className="text-xs text-[var(--neutral-text-muted)]">{result.camera}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}