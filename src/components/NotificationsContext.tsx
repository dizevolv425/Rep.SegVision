import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUserProfile } from './UserProfileContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export type NotificationType = 'alert' | 'school' | 'contract' | 'payment' | 'system';
export type NotificationSeverity = 'high' | 'medium' | 'low';
export type NotificationStatus = 'unread' | 'read';

export interface Notification {
  id: string;
  type: NotificationType;
  severity?: NotificationSeverity;
  title: string;
  description: string;
  origin: string;
  timestamp: Date;
  status: NotificationStatus;
  actionLabel?: string;
  actionPath?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  loading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { userProfile } = useUserProfile();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!userProfile?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedNotifications: Notification[] = (data || []).map(notif => ({
        id: notif.id,
        type: notif.type as NotificationType,
        severity: notif.severity as NotificationSeverity | undefined,
        title: notif.title,
        description: notif.description,
        origin: notif.origin,
        timestamp: new Date(notif.created_at),
        status: notif.status as NotificationStatus,
        actionLabel: notif.action_label || undefined,
        actionPath: notif.action_path || undefined
      }));

      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.id) {
      loadNotifications();
    }
  }, [userProfile?.id]);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, status: 'read' as NotificationStatus } : n))
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast.error('Erro ao marcar notificação como lida');
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!userProfile?.id) return;

      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('user_id', userProfile.id)
        .eq('status', 'unread');

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'read' as NotificationStatus }))
      );

      toast.success('Todas as notificações foram marcadas como lidas');
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      toast.error('Erro ao marcar todas as notificações como lidas');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notificação removida');
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
      toast.error('Erro ao remover notificação');
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loading
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}