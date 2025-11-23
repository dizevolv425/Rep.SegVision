import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Camera, Clock, MapPin, type LucideIcon } from 'lucide-react';

interface AlertCardProps {
  id: string;
  type: 'movement' | 'intrusion' | 'face' | 'crowd' | 'object';
  title: string;
  description: string;
  camera: string;
  time: string;
  date: string;
  status: 'novo' | 'confirmado' | 'resolvido' | 'falso';
  priority: 'baixa' | 'media' | 'alta';
  icon: LucideIcon;
  hasVideo?: boolean;
  location?: string;
  actionBy?: {
    name: string;
    role: string;
  };
  onViewVideo?: (id: string) => void;
  onConfirm?: (id: string) => void;
  onResolve?: (id: string) => void;
}

export function AlertCard({
  id,
  type,
  title,
  description,
  camera,
  time,
  date,
  status,
  priority,
  icon: Icon,
  hasVideo = true,
  location,
  actionBy,
  onViewVideo,
  onConfirm,
  onResolve,
}: AlertCardProps) {
  // Tipo icon tone
  const getTypeIconTone = () => {
    if (type === 'intrusion') return 'danger';
    if (type === 'face') return 'info';
    if (type === 'crowd') return 'success';
    return 'neutral';
  };

  // Status badge
  const getStatusBadge = () => {
    switch (status) {
      case 'novo':
        return <Badge variant="heavy" tone="danger" size="m">Novo</Badge>;
      case 'confirmado':
        return <Badge variant="light" tone="caution" size="m">Confirmado</Badge>;
      case 'resolvido':
        return <Badge variant="medium" tone="success" size="m">Resolvido</Badge>;
      case 'falso':
        return <Badge variant="light" tone="neutral" size="m">Falso Positivo</Badge>;
    }
  };

  // Gravidade badge
  const getPriorityBadge = () => {
    switch (priority) {
      case 'alta':
        return <Badge variant="medium" tone="danger" size="s">Alta</Badge>;
      case 'media':
        return <Badge variant="medium" tone="warning" size="s">Média</Badge>;
      case 'baixa':
        return <Badge variant="medium" tone="info" size="s">Baixa</Badge>;
    }
  };

  // Tipo badge
  const getTypeBadge = () => {
    const typeLabels = {
      intrusion: 'Intrusão',
      face: 'Reconhecimento Facial',
      crowd: 'Aglomeração',
      object: 'Objeto Suspeito',
      movement: 'Movimento',
    };
    return <Badge variant="light" tone="neutral" size="s">{typeLabels[type]}</Badge>;
  };

  const timestamp = `${date} às ${time}`;
  
  // Icon circle background
  const getIconCircleBg = () => {
    const tone = getTypeIconTone();
    switch (tone) {
      case 'danger': return 'bg-[var(--red-alert-50)]';
      case 'info': return 'bg-[var(--turquoise-alert-50)]';
      case 'success': return 'bg-[var(--green-alert-50)]';
      default: return 'bg-[var(--gray-50)]';
    }
  };

  const getIconColor = () => {
    const tone = getTypeIconTone();
    switch (tone) {
      case 'danger': return 'text-[var(--red-alert-400)]';
      case 'info': return 'text-[var(--turquoise-alert-400)]';
      case 'success': return 'text-[var(--green-alert-400)]';
      default: return 'text-[var(--gray-400)]';
    }
  };

  const isHighCritical = priority === 'alta' && status === 'novo';

  return (
    <div 
      className={`
        border border-[var(--border)] rounded-xl bg-[var(--card)] p-4
        hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] hover:border-[var(--neutral-border)]
        transition-all
        ${isHighCritical ? 'border-l-[3px] border-l-[var(--red-alert-300)]' : ''}
      `}
    >
      {/* Desktop/Tablet: Horizontal Layout */}
      <div className="hidden md:flex gap-4">
        {/* Left: Type Icon */}
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconCircleBg()}`}>
            <Icon className={`w-4 h-4 ${getIconColor()}`} />
          </div>
        </div>

        {/* Middle: Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-[var(--neutral-text)] text-sm">{title}</h4>
            {getStatusBadge()}
            <div className="ml-auto">
              <Badge variant="light" tone="neutral" size="s">{timestamp}</Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-[var(--neutral-text)] text-[13px] leading-5">{description}</p>

          {/* Meta Row */}
          <div className="flex items-center gap-3 flex-wrap text-[var(--neutral-text-muted)] text-xs">
            <div className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span className="font-medium">{camera}</span>
            </div>
            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-medium">{location}</span>
              </div>
            )}
            {actionBy && (
              <div className="flex items-center gap-1.5">
                <span className="font-medium">{actionBy.name} ({actionBy.role})</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {getPriorityBadge()}
              {getTypeBadge()}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex-shrink-0 w-[148px] flex flex-col gap-2">
          {hasVideo && onViewVideo && (
            <Button
              onClick={() => onViewVideo(id)}
              className="w-full h-9 bg-[var(--blue-primary-200)] text-white hover:bg-[var(--blue-primary-200)] hover:opacity-96 rounded-[10px] text-[13px] font-semibold"
            >
              Ver Vídeo
            </Button>
          )}
          {status === 'novo' && onConfirm && (
            <Button
              onClick={() => onConfirm(id)}
              className="w-full h-9 bg-[var(--orange-alert-400)] text-white hover:bg-[var(--orange-alert-400)] hover:opacity-96 rounded-[10px] text-[13px] font-semibold"
            >
              Confirmar
            </Button>
          )}
          {onResolve && (
            <Button
              onClick={() => onResolve(id)}
              disabled={status !== 'confirmado'}
              className={`
                w-full h-9 rounded-[10px] text-[13px] font-semibold
                ${status === 'confirmado' 
                  ? 'bg-[var(--green-alert-300)] text-white hover:bg-[var(--green-alert-300)] hover:opacity-96' 
                  : 'bg-[var(--gray-200)] text-white cursor-not-allowed opacity-60'
                }
              `}
            >
              Resolver
            </Button>
          )}
        </div>
      </div>

      {/* Mobile: Vertical Layout */}
      <div className="md:hidden space-y-3">
        {/* Icon + Title Row */}
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getIconCircleBg()}`}>
            <Icon className={`w-4 h-4 ${getIconColor()}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[var(--neutral-text)] text-sm mb-1">{title}</h4>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {getStatusBadge()}
              <Badge variant="light" tone="neutral" size="s">{timestamp}</Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[var(--neutral-text)] text-[13px] leading-5">{description}</p>

        {/* Meta Row */}
        <div className="flex items-center gap-3 flex-wrap text-[var(--neutral-text-muted)] text-xs">
          <div className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span className="font-medium">{camera}</span>
          </div>
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-medium">{location}</span>
            </div>
          )}
          {actionBy && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium">{actionBy.name} ({actionBy.role})</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {getPriorityBadge()}
          {getTypeBadge()}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          {hasVideo && onViewVideo && (
            <Button
              onClick={() => onViewVideo(id)}
              className="w-full h-9 bg-[var(--blue-primary-200)] text-white hover:bg-[var(--blue-primary-200)] hover:opacity-96 rounded-[10px] text-[13px] font-semibold"
            >
              Ver Vídeo
            </Button>
          )}
          {status === 'novo' && onConfirm && (
            <Button
              onClick={() => onConfirm(id)}
              className="w-full h-9 bg-[var(--orange-alert-400)] text-white hover:bg-[var(--orange-alert-400)] hover:opacity-96 rounded-[10px] text-[13px] font-semibold"
            >
              Confirmar
            </Button>
          )}
          {onResolve && (
            <Button
              onClick={() => onResolve(id)}
              disabled={status !== 'confirmado'}
              className={`
                w-full h-9 rounded-[10px] text-[13px] font-semibold
                ${status === 'confirmado' 
                  ? 'bg-[var(--green-alert-300)] text-white hover:bg-[var(--green-alert-300)] hover:opacity-96' 
                  : 'bg-[var(--gray-200)] text-white cursor-not-allowed opacity-60'
                }
              `}
            >
              Resolver
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
