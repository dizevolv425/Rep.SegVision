import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CameraOff, Camera, Clock, AlertTriangle } from 'lucide-react';
import { useUserProfile } from './UserProfileContext';

interface VideoPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertId: string;
  alertTitle: string;
  cameraName: string;
  capturedAt: string;
  status: 'novo' | 'confirmado' | 'resolvido' | 'falso';
  description?: string;
  streamUrl?: string;
}

export function VideoPreviewModal({
  open,
  onOpenChange,
  alertId,
  alertTitle,
  cameraName,
  capturedAt,
  status,
  description,
  streamUrl
}: VideoPreviewModalProps) {
  const { currentProfile } = useUserProfile();
  
  // Admin profile: block video preview for LGPD compliance
  const isAdmin = currentProfile === 'admin';
  const hasStream = !isAdmin && streamUrl;

  const getStatusBadge = () => {
    switch (status) {
      case 'novo':
        return <Badge variant="heavy" tone="danger" size="s">Novo</Badge>;
      case 'confirmado':
        return <Badge variant="medium" tone="caution" size="s">Confirmado</Badge>;
      case 'resolvido':
        return <Badge variant="medium" tone="success" size="s">Resolvido</Badge>;
      case 'falso':
        return <Badge variant="light" tone="neutral" size="s">Falso Positivo</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[880px] rounded-xl p-5">
        <DialogHeader className="pt-6 sm:pt-0">
          <DialogTitle className="text-[var(--neutral-text)]">
            Visualização de Vídeo — {alertTitle}
          </DialogTitle>
          <DialogDescription className="text-[var(--neutral-text-muted)]">
            Evidência capturada pela câmera
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Video Player Frame */}
          <div className="relative w-full rounded-lg overflow-hidden bg-black aspect-video">
            {isAdmin ? (
              // LGPD Placeholder for Admin
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--gray-400)]">
                <CameraOff className="w-12 h-12 text-white" />
                <p className="text-white text-center px-4">
                  Visualização de vídeo bloqueada (LGPD)
                </p>
                <p className="text-white text-xs opacity-80">
                  Administradores não têm acesso a imagens por questões de privacidade
                </p>
              </div>
            ) : hasStream ? (
              // Video stream (placeholder - in production would be actual player)
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-white mx-auto mb-2" />
                  <p className="text-white text-sm">Player de vídeo</p>
                  <p className="text-white text-xs opacity-60 mt-1">Stream: {streamUrl}</p>
                </div>
              </div>
            ) : (
              // Offline state
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--black-300)]">
                <CameraOff className="w-12 h-12 text-white" />
                <p className="text-white">Frame capturado do evento</p>
                <Badge variant="light" tone="danger" size="s">Offline</Badge>
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-[var(--neutral-text-muted)]">Câmera</p>
              <p className="text-[var(--neutral-text)]">{cameraName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-[var(--neutral-text-muted)]">Data e Hora</p>
              <p className="text-[var(--neutral-text)]">{capturedAt}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-[var(--neutral-text-muted)]">Tipo de Evento</p>
              <p className="text-[var(--neutral-text)]">{alertTitle}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-[var(--neutral-text-muted)]">Status</p>
              <div>{getStatusBadge()}</div>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="space-y-1">
              <p className="text-xs text-[var(--neutral-text-muted)]">Descrição</p>
              <p className="text-[var(--neutral-text)]">{description}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[rgb(47,95,255)] text-white hover:bg-[var(--gray-400)] hover:opacity-95"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}