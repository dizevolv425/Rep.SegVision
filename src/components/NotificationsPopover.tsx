import React from 'react';
import { Bell, AlertCircle, DollarSign, Info, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useNotifications, type Notification } from './NotificationsContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useIsMobile } from './ui/use-mobile';

interface NotificationsPopoverProps {
  onNavigate?: (screen: string) => void;
}

export function NotificationsPopover({ onNavigate }: NotificationsPopoverProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  // Don't render on mobile
  if (isMobile) {
    return null;
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return AlertCircle;
      case 'financial':
        return DollarSign;
      case 'system':
        return Info;
      default:
        return Bell;
    }
  };

  const getSeverityBadge = (severity?: Notification['severity']) => {
    if (!severity) return null;
    
    const config = {
      high: { tone: 'danger' as const, label: 'Alta' },
      medium: { tone: 'warning' as const, label: 'Média' },
      low: { tone: 'info' as const, label: 'Baixa' },
    };

    const badgeConfig = config[severity];
    return <Badge variant="light" tone={badgeConfig.tone} size="s">{badgeConfig.label}</Badge>;
  };

  const handleItemClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionPath && onNavigate) {
      onNavigate(notification.actionPath);
      setOpen(false);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleViewAll = () => {
    if (onNavigate) {
      onNavigate('notifications');
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label="Abrir notificações"
        >
          <Bell size={20} className="text-[var(--neutral-icon)]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[var(--danger-bg)] text-[var(--white-50)] flex items-center justify-center text-[10px]">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[420px] p-0 bg-[var(--neutral-bg)] border-[var(--neutral-border)]" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-[var(--neutral-border)]">
          <div>
            <h3 className="text-[var(--neutral-text)]">Notificações</h3>
            <p className="text-[var(--neutral-text-muted)] mt-0.5">
              {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-[rgb(47,95,255)] hover:text-[var(--neutral-text)] h-8 px-2"
            >
              Marcar como lidas
            </Button>
          )}
        </div>

        {/* List */}
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="h-12 w-12 text-[var(--neutral-border)] mb-4" />
              <p className="text-[var(--neutral-text)]">Sem notificações</p>
              <p className="text-[var(--neutral-text-muted)] text-center mt-1">
                Avisaremos quando algo novo chegar.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--neutral-border)]">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const isUnread = notification.status === 'unread';
                const isCritical = notification.severity === 'high';

                return (
                  <div
                    key={notification.id}
                    className={`
                      relative px-4 py-3 cursor-pointer transition-colors
                      hover:bg-[var(--neutral-subtle)]
                      ${isUnread ? 'bg-[var(--neutral-subtle)]' : ''}
                    `}
                    onClick={() => handleItemClick(notification)}
                  >
                    {/* Unread accent */}
                    {isUnread && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--blue-primary-200)]" />
                    )}

                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        ${notification.type === 'alert' ? 'bg-[var(--red-alert-50)] text-[var(--red-alert-300)]' : ''}
                        ${notification.type === 'financial' ? 'bg-[var(--green-alert-50)] text-[var(--green-alert-300)]' : ''}
                        ${notification.type === 'system' ? 'bg-[var(--turquoise-alert-50)] text-[var(--turquoise-alert-300)]' : ''}
                      `}>
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-[var(--neutral-text)] line-clamp-1">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getSeverityBadge(notification.severity)}
                            {isUnread && (
                              <div className="w-2 h-2 rounded-full bg-[var(--blue-primary-200)]" />
                            )}
                          </div>
                        </div>
                        <p className="text-[var(--neutral-text-muted)] line-clamp-2 mb-1">
                          {notification.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--neutral-text-muted)] text-[14px]">
                            {notification.origin}
                          </span>
                          <span className="text-[var(--neutral-text-muted)] text-[14px]">
                            {formatDistanceToNow(notification.timestamp, { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-[var(--neutral-border)]">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-[var(--primary-bg)] hover:bg-[var(--neutral-subtle)] hover:text-[var(--primary-bg-hover)]"
              onClick={handleViewAll}
            >
              Ver todas
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}