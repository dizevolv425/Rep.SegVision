import React from 'react';
import { AlertsScreen } from '../AlertsScreen';

export function AdminAlertsScreen() {
  // Admin usa o mesmo componente de Alertas
  // mas o VideoPreviewModal já bloqueia visualização de vídeo por LGPD
  return <AlertsScreen />;
}
