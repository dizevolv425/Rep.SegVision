import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Bell, AlertTriangle, DollarSign, Settings, Clock } from 'lucide-react';
import { useNotifications, type Notification, type NotificationType } from './NotificationsContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (path: string) => void;
}

export function NotificationsModal({ open, onOpenChange, onNavigate }: NotificationsModalProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'alert':
        return AlertTriangle;
      case 'financial':
        return DollarSign;
      case 'system':
        return Settings;
      default:
        return Bell;
    }
  };

  const handleItemClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionPath) {
      onNavigate(notification.actionPath);
      onOpenChange(false);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  // Filter notifications
  const filteredNotifications = notifications
    .filter(n => filterType === 'all' || n.type === filterType)
    .filter(n => filterStatus === 'all' || n.status === filterStatus)
    .sort((a, b) => {
      // Critical alerts (high severity) on top for 5 minutes
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      const aIsCritical = a.type === 'alert' && a.severity === 'high' && (now - a.timestamp.getTime()) < fiveMinutes;
      const bIsCritical = b.type === 'alert' && b.severity === 'high' && (now - b.timestamp.getTime()) < fiveMinutes;
      
      if (aIsCritical && !bIsCritical) return -1;
      if (!aIsCritical && bIsCritical) return 1;
      
      // Then by timestamp
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Notificações</DialogTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                Marcar como lidas
              </Button>
            )}
          </div>
          <DialogDescription>
            {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas as notificações foram lidas'}
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex gap-2 pb-4 border-b border-[var(--neutral-border)]">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="alert">Alertas</SelectItem>
              <SelectItem value="financial">Financeiro</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="unread">Não lidas</SelectItem>
              <SelectItem value="read">Lidas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-[var(--neutral-icon)] mb-4 opacity-50" />
              <p className="text-[var(--neutral-text)]">Sem notificações</p>
              <p className="text-[var(--neutral-text-muted)] mt-1">
                Voltamos a avisar quando algo novo chegar.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const isCritical = notification.type === 'alert' && notification.severity === 'high' && 
                                (Date.now() - notification.timestamp.getTime()) < 5 * 60 * 1000;
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    notification.status === 'unread'
                      ? 'bg-[var(--blue-primary-50)]/30 border-[var(--primary-border)]'
                      : 'bg-[var(--card)] border-[var(--border)] hover:bg-[var(--table-row-hover)]'
                  } ${isCritical ? 'border-l-4 border-l-[var(--danger-bg)]' : ''}`}
                  onClick={() => handleItemClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                      notification.type === 'alert' 
                        ? 'text-[var(--danger-bg)]' 
                        : notification.type === 'financial'
                        ? 'text-[var(--primary-bg)]'
                        : 'text-[var(--neutral-icon)]'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-[var(--neutral-text)]">{notification.title}</p>
                        {notification.status === 'unread' && (
                          <div className="h-2 w-2 bg-[var(--primary-bg)] rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      
                      <p className="text-[var(--neutral-text-muted)] mb-2">
                        {notification.description}
                      </p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          variant="light" 
                          tone={
                            notification.type === 'alert' ? 'info' : 
                            notification.type === 'financial' ? 'primary' : 
                            'neutral'
                          } 
                          size="s"
                        >
                          {notification.type === 'alert' ? 'Alerta' : 
                           notification.type === 'financial' ? 'Financeiro' : 
                           'Sistema'}
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
                        
                        <span className="text-[var(--neutral-text-muted)] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(notification.timestamp, { locale: ptBR, addSuffix: true })}
                        </span>
                      </div>
                      
                      {notification.actionLabel && (
                        <Button variant="ghost" size="sm" className="mt-2 h-8 px-3">
                          {notification.actionLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="pt-4 border-t border-[var(--neutral-border)] flex items-center justify-between">
            <p className="text-[var(--neutral-text-muted)]">
              Mantemos as críticas no topo por 5 min
            </p>
            <Button 
              variant="link" 
              onClick={() => {
                onNavigate('/notifications');
                onOpenChange(false);
              }}
            >
              Ver todas
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
