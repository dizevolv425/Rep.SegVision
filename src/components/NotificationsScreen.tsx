import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Checkbox } from './ui/checkbox';
import { Bell, MoreVertical, Eye, Trash2, Search } from 'lucide-react';
import { useNotifications, type Notification, type NotificationType } from './NotificationsContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { showToast } from './ui/toast-utils';
import { useIsMobile } from './ui/use-mobile';
import { EmptyState } from './EmptyState';

interface NotificationsScreenProps {
  onNavigate: (path: string) => void;
  isFirstAccess?: boolean;
}

export function NotificationsScreen({ onNavigate, isFirstAccess = false }: NotificationsScreenProps) {
  const { notifications, deleteNotification, markAsRead } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'alert':
        return 'Alerta';
      case 'financial':
        return 'Financeiro';
      case 'system':
        return 'Sistema';
      default:
        return 'Outro';
    }
  };

  const handleItemClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionPath) {
      onNavigate(notification.actionPath);
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsRead(id);
    showToast.success({ 
      title: 'Notificação marcada como lida',
    });
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotificationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (notificationToDelete) {
      deleteNotification(notificationToDelete);
      showToast.success({ 
        title: 'Notificação excluída com sucesso',
      });
      setNotificationToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true);
  };

  const handleConfirmBulkDelete = () => {
    selectedIds.forEach(id => deleteNotification(id));
    showToast.success({ 
      title: 'Notificações excluídas com sucesso',
    });
    setSelectedIds(new Set());
    setBulkDeleteDialogOpen(false);
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
  };

  // Filter and search
  const filteredNotifications = notifications
    .filter(n => {
      const matchesSearch = 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.origin.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || n.type === filterType;
      const matchesSeverity = filterSeverity === 'all' || n.severity === filterSeverity;
      const matchesStatus = filterStatus === 'all' || n.status === filterStatus;
      
      return matchesSearch && matchesType && matchesSeverity && matchesStatus;
    })
    .sort((a, b) => {
      // Critical alerts first
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      const aIsCritical = a.type === 'alert' && a.severity === 'high' && (now - a.timestamp.getTime()) < fiveMinutes;
      const bIsCritical = b.type === 'alert' && b.severity === 'high' && (now - b.timestamp.getTime()) < fiveMinutes;
      
      if (aIsCritical && !bIsCritical) return -1;
      if (!aIsCritical && bIsCritical) return 1;
      
      // Then by timestamp
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  const showSeverityFilter = filterType === 'alert' || filterType === 'all';

  // Show empty state for first access
  if (isFirstAccess && notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="Nenhuma notificação"
        description="Quando houver alertas, atualizações do sistema ou informações importantes, você receberá notificações aqui."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--neutral-icon)] h-4 w-4" />
              <Input
                placeholder="Buscar notificações"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[220px]">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="alert">Alertas</SelectItem>
                    <SelectItem value="financial">Financeiro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {showSeverityFilter && (
                <div className="flex-1 min-w-[220px]">
                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                      <SelectValue placeholder="Gravidade" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="all">Todas gravidades</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex-1 min-w-[220px]">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-[var(--input-background)] border-[var(--input-border)] hover:border-[var(--input-border-hover)]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="unread">Não lidas</SelectItem>
                    <SelectItem value="read">Lidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between min-h-[60px] gap-3">
            <CardTitle>Notificações ({filteredNotifications.length})</CardTitle>
            <div className="flex items-center gap-2 justify-end flex-wrap">
              {selectedIds.size > 0 && (
                <>
                  <span className="text-[var(--neutral-text-muted)] text-sm">{selectedIds.size} selecionada(s)</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      selectedIds.forEach(id => markAsRead(id));
                      showToast.success({ title: 'Notificações marcadas como lidas' });
                      setSelectedIds(new Set());
                    }}
                    className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Marcar como Lida</span>
                    <span className="sm:hidden">Lida</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleBulkDeleteClick}
                    className="border-[var(--danger-bg)] text-[var(--danger-bg)] hover:bg-[var(--danger-bg)] hover:text-white"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Excluir Selecionadas</span>
                    <span className="sm:hidden">Excluir</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-[var(--neutral-icon)] mb-4 opacity-50" />
              <p className="text-[var(--neutral-text)]">Nenhuma notificação encontrada</p>
              <Button variant="outline" className="mt-4" onClick={() => onNavigate('/dashboard')}>
                Voltar ao Dashboard
              </Button>
            </div>
          ) : isMobile ? (
            // Mobile: Card Layout
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const isCritical = notification.type === 'alert' && notification.severity === 'high' && 
                                  (Date.now() - notification.timestamp.getTime()) < 5 * 60 * 1000;
                
                return (
                  <div 
                    key={notification.id}
                    className={`bg-[var(--analytics-list-bg)] border border-[var(--neutral-border)] rounded-lg p-4 hover:bg-[var(--neutral-subtle)] dark:hover:bg-[var(--blue-primary-800)] transition-colors ${
                      isCritical ? 'border-l-4 border-l-[var(--danger-bg)]' : ''
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Header with badges */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="light" tone="neutral" size="s">
                              {getTypeLabel(notification.type)}
                            </Badge>
                            {notification.severity && (
                              <Badge 
                                variant="medium" 
                                tone={
                                  notification.severity === 'high' ? 'danger' : 
                                  notification.severity === 'medium' ? 'warning' : 
                                  'info'
                                } 
                                size="s"
                              >
                                {notification.severity === 'high' ? 'Alta' : 
                                 notification.severity === 'medium' ? 'Média' : 
                                 'Baixa'}
                              </Badge>
                            )}
                            <Badge 
                              variant={notification.status === 'unread' ? 'medium' : 'light'} 
                              tone={notification.status === 'unread' ? 'primary' : 'neutral'} 
                              size="s"
                            >
                              {notification.status === 'unread' ? 'Não lida' : 'Lida'}
                            </Badge>
                          </div>
                          <p className="text-sm text-[var(--neutral-text)]">{notification.title}</p>
                          <p className="text-sm text-[var(--neutral-text-muted)]">{notification.description}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[var(--neutral-text-muted)]">Origem:</span>
                          <span className="text-[var(--neutral-text)]">{notification.origin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--neutral-text-muted)]">Data/Hora:</span>
                          <span className="text-[var(--neutral-text)]">
                            {formatDistanceToNow(notification.timestamp, { locale: ptBR, addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-[var(--neutral-border)]">
                        {notification.status === 'unread' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 gap-1 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                          >
                            <Eye className="h-4 w-4" />
                            Marcar Lida
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-1 border-[var(--danger-bg)] text-[var(--danger-bg)] hover:bg-[var(--danger-bg)] hover:text-white"
                          onClick={(e) => handleDeleteClick(e, notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Desktop: Table Layout
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--neutral-border)] dark:border-b-white">
                    <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)] w-12">
                      <Checkbox 
                        checked={selectedIds.size === filteredNotifications.length && filteredNotifications.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIds(new Set(filteredNotifications.map(n => n.id)));
                          } else {
                            setSelectedIds(new Set());
                          }
                        }}
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)]">Tipo</th>
                    <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)] text-[16px]">Título</th>
                    <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)]">Origem</th>
                    <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)]">Data/Hora</th>
                    <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)]">Gravidade</th>
                    <th className="text-left py-3 px-4 text-[var(--neutral-text-muted)]">Status</th>
                    <th className="text-right py-3 px-4 text-[var(--neutral-text-muted)]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map((notification) => {
                    const isCritical = notification.type === 'alert' && notification.severity === 'high' && 
                                      (Date.now() - notification.timestamp.getTime()) < 5 * 60 * 1000;
                    
                    return (
                      <tr
                        key={notification.id}
                        className={`border-b border-[var(--neutral-border)] dark:border-b-white hover:bg-[var(--table-row-hover)] cursor-pointer ${
                          isCritical ? 'border-l-4 border-l-[var(--danger-bg)]' : ''
                        }`}
                        onClick={() => handleItemClick(notification)}
                      >
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={selectedIds.has(notification.id)}
                            onCheckedChange={(checked) => handleCheckboxChange(notification.id, checked as boolean)}
                          />
                        </td>
                        <td className="py-3 px-4 text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>
                          {getTypeLabel(notification.type)}
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-[var(--neutral-text)]" style={{ fontSize: '14px' }}>{notification.title}</p>
                          <p className="text-[var(--neutral-text-muted)]" style={{ fontSize: '14px' }}>{notification.description}</p>
                        </td>
                        <td className="py-3 px-4 text-[var(--neutral-text-muted)]" style={{ fontSize: '14px' }}>{notification.origin}</td>
                        <td className="py-3 px-4 text-[var(--neutral-text-muted)]" style={{ fontSize: '14px' }}>
                          {formatDistanceToNow(notification.timestamp, { locale: ptBR, addSuffix: true })}
                        </td>
                        <td className="py-3 px-4">
                          {notification.severity ? (
                            <Badge 
                              variant="medium" 
                              tone={
                                notification.severity === 'high' ? 'danger' : 
                                notification.severity === 'medium' ? 'warning' : 
                                'info'
                              } 
                              size="s"
                            >
                              {notification.severity === 'high' ? 'Alta' : 
                               notification.severity === 'medium' ? 'Média' : 
                               'Baixa'}
                            </Badge>
                          ) : (
                            <span className="text-[var(--neutral-text-muted)]" style={{ fontSize: '14px' }}>—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={notification.status === 'unread' ? 'medium' : 'light'} 
                            tone={notification.status === 'unread' ? 'primary' : 'neutral'} 
                            size="s"
                          >
                            {notification.status === 'unread' ? 'Não lida' : 'Lida'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-[var(--neutral-icon)] hover:bg-[var(--neutral-subtle)]">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[var(--card)] border-[var(--neutral-border)]">
                              {notification.status === 'unread' && (
                                <DropdownMenuItem 
                                  className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                                  onClick={(e) => handleMarkAsRead(e, notification.id)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Marcar como lida
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="text-[var(--danger-bg)] hover:bg-[var(--neutral-subtle)]"
                                onClick={(e) => handleDeleteClick(e, notification.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[var(--card)] border-[var(--border)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--neutral-text)]">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--neutral-text-muted)]">
              Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-[var(--red-alert-300)] text-white hover:opacity-96"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent className="bg-[var(--card)] border-[var(--border)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--neutral-text)]">Confirmar exclusão em massa</AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--neutral-text-muted)]">
              Tem certeza que deseja excluir as notificações selecionadas? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmBulkDelete}
              className="bg-[var(--red-alert-300)] text-white hover:opacity-96"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}