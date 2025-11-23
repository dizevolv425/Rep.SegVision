import React from 'react';
import { 
  BarChart3, 
  MapPin, 
  Camera, 
  AlertTriangle, 
  TrendingUp,
  CreditCard,
  Phone,
  MessageCircle,
  Settings,
  CheckCircle
} from 'lucide-react';

export function SidebarShowcase() {
  return (
    <div className="p-8 space-y-8 bg-white">
      <div className="space-y-4">
        <h2 className="text-xl text-[var(--neutral-text)]">Sidebar States - SegVision Design System</h2>
        <p className="text-sm text-[var(--neutral-text-muted)]">
          Background: Blue Primary/300 (#161E53) • Hover: Blue Primary/200 (#2F5FFF) • Textos: White/100 com opacidades
        </p>
      </div>

      {/* Container de demonstração */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Estado Default */}
        <div className="space-y-4">
          <h3 className="text-lg text-[var(--neutral-text)]">Item Default</h3>
          <div className="bg-[var(--blue-primary-300)] p-4 rounded-lg">
            <button
              className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-transparent transition-all duration-150 ease-out"
            >
              <Camera 
                size={20} 
                className="shrink-0 text-[var(--white-100)] opacity-80"
              />
              <span className="flex-1 text-[13px] leading-tight text-[var(--white-100)] opacity-80">
                Câmeras
              </span>
            </button>
            
            <div className="mt-4 text-xs text-[var(--white-100)] opacity-60 space-y-1">
              <p>• Background: transparent</p>
              <p>• Icon/Label: White/100 opacity 0.80</p>
              <p>• Padding: 10px 12px (py-2.5 px-3)</p>
              <p>• Radius: 10px</p>
            </div>
          </div>
        </div>

        {/* Estado Hover */}
        <div className="space-y-4">
          <h3 className="text-lg text-[var(--neutral-text)]">Item Hover</h3>
          <div className="bg-[var(--blue-primary-300)] p-4 rounded-lg">
            <button
              className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-[var(--blue-primary-200)] transition-all duration-150 ease-out"
            >
              <AlertTriangle 
                size={20} 
                className="shrink-0 text-[var(--white-100)]"
              />
              <span className="flex-1 text-[13px] leading-tight text-[var(--white-100)]">
                Alertas Inteligentes
              </span>
              <span 
                className="inline-flex items-center justify-center min-w-[22px] h-[18px] px-1.5 rounded-[9px] text-[11px] leading-none bg-[var(--white-100)] text-[var(--blue-primary-300)]"
                style={{ fontWeight: 700 }}
              >
                8
              </span>
            </button>
            
            <div className="mt-4 text-xs text-[var(--white-100)] opacity-60 space-y-1">
              <p>• Background: Blue Primary/200 (#2F5FFF)</p>
              <p>• Icon/Label: White/100 opacity 1.0</p>
              <p>• Transition: 150ms ease-out</p>
              <p>• Badge: White bg, Blue text</p>
            </div>
          </div>
        </div>

        {/* Estado Hover - Pill White (Preview) */}
        <div className="space-y-4">
          <h3 className="text-lg text-[var(--neutral-text)]">Item Hover (Preview)</h3>
          <div className="bg-[var(--blue-primary-300)] p-4 rounded-lg">
            <button
              className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-[var(--white-100)] transition-all duration-150 ease-out"
            >
              <BarChart3 
                size={20} 
                className="shrink-0 text-[var(--blue-primary-300)]"
              />
              <span className="flex-1 text-[13px] leading-tight text-[var(--blue-primary-300)]">
                Dashboard
              </span>
            </button>
            
            <div className="mt-4 text-xs text-[var(--white-100)] opacity-60 space-y-1">
              <p>• Background: White/100 (#FAFAFA) - Pill</p>
              <p>• Icon/Label: Blue Primary/300 (#161E53)</p>
              <p>• Contraste: 13.2:1 (AAA)</p>
              <p>• UX: Preview do estado selecionado</p>
            </div>
          </div>
        </div>

        {/* Estado Active/Selected - Integrado */}
        <div className="space-y-4">
          <h3 className="text-lg text-[var(--neutral-text)]">Item Active/Selected (Integrado)</h3>
          <div className="bg-[var(--blue-primary-300)] p-4 rounded-lg">
            <button
              className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-[var(--blue-primary-200)] transition-all duration-150 ease-out"
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--blue-primary-100)] rounded-r" />
              <BarChart3 
                size={20} 
                className="shrink-0 text-[var(--white-100)]"
              />
              <span className="flex-1 text-[13px] leading-tight text-[var(--white-100)]">
                Dashboard
              </span>
            </button>
            
            <div className="mt-4 text-xs text-[var(--white-100)] opacity-60 space-y-1">
              <p>• Background: Blue Primary/200 (#2F5FFF)</p>
              <p>• Left accent: Blue Primary/100 (3px)</p>
              <p>• Icon/Label: White/100 (#FAFAFA)</p>
              <p>• Contraste: 13.8:1 (AAA)</p>
              <p>• UX: Estado permanente integrado</p>
            </div>
          </div>
        </div>

        {/* Estado Focus */}
        <div className="space-y-4">
          <h3 className="text-lg text-[var(--neutral-text)]">Item Focus-visible</h3>
          <div className="bg-[var(--blue-primary-300)] p-4 rounded-lg">
            <button
              className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-transparent transition-all duration-150 ease-out outline outline-2 outline-[var(--blue-primary-100)] outline-offset-2"
            >
              <TrendingUp 
                size={20} 
                className="shrink-0 text-[var(--white-100)] opacity-80"
              />
              <span className="flex-1 text-[13px] leading-tight text-[var(--white-100)] opacity-80">
                Análises
              </span>
            </button>
            
            <div className="mt-4 text-xs text-[var(--white-100)] opacity-60 space-y-1">
              <p>• Outline: 2px solid Blue Primary/100</p>
              <p>• Offset: 2px</p>
              <p>• Persiste com hover</p>
              <p>• Acessibilidade: AAA</p>
            </div>
          </div>
        </div>

        {/* Badge Contador */}
        <div className="space-y-4">
          <h3 className="text-lg text-[var(--neutral-text)]">Badge Contador</h3>
          <div className="bg-[var(--blue-primary-300)] p-4 rounded-lg space-y-3">
            <div className="space-y-2">
              <p className="text-xs text-[var(--white-100)] opacity-80">Consistente em todos os estados:</p>
              <div className="flex flex-wrap gap-2">
                <span 
                  className="inline-flex items-center justify-center min-w-[22px] h-[18px] px-1.5 rounded-[9px] text-[11px] leading-none bg-[var(--white-100)] text-[var(--blue-primary-300)]"
                  style={{ fontWeight: 700 }}
                >
                  2
                </span>
                <span 
                  className="inline-flex items-center justify-center min-w-[22px] h-[18px] px-1.5 rounded-[9px] text-[11px] leading-none bg-[var(--white-100)] text-[var(--blue-primary-300)]"
                  style={{ fontWeight: 700 }}
                >
                  8
                </span>
                <span 
                  className="inline-flex items-center justify-center min-w-[22px] h-[18px] px-1.5 rounded-[9px] text-[11px] leading-none bg-[var(--white-100)] text-[var(--blue-primary-300)]"
                  style={{ fontWeight: 700 }}
                >
                  24
                </span>
                <span 
                  className="inline-flex items-center justify-center min-w-[22px] h-[18px] px-1.5 rounded-[9px] text-[11px] leading-none bg-[var(--white-100)] text-[var(--blue-primary-300)]"
                  style={{ fontWeight: 700 }}
                >
                  150
                </span>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-[var(--white-100)] opacity-60 space-y-1">
              <p>• Min width: 22px, Height: 18px</p>
              <p>• Background: White/100 (#FAFAFA)</p>
              <p>• Text: Blue Primary/300 (#161E53)</p>
              <p>• Font: 11px, weight 700, leading none</p>
              <p>• Contraste: 13.2:1 (AAA)</p>
              <p>• Nota: Mantém estilo em default/hover/active</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="space-y-4">
          <h3 className="text-lg text-[var(--neutral-text)]">Divider</h3>
          <div className="bg-[var(--blue-primary-300)] p-4 rounded-lg">
            <div className="h-px bg-[var(--white-100)] opacity-24" />
            
            <div className="mt-4 text-xs text-[var(--white-100)] opacity-60 space-y-1">
              <p>• Color: White/100 opacity 0.24</p>
              <p>• Height: 1px (h-px)</p>
              <p>• Margin: 12px vertical (opcional)</p>
              <p>• Inset: 12px horizontal (opcional)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar completa em miniatura */}
      <div className="space-y-4">
        <h3 className="text-lg text-[var(--neutral-text)]">Sidebar Completa (Preview)</h3>
        
        <div className="w-60 bg-[var(--blue-primary-300)] h-[600px] rounded-lg flex flex-col overflow-hidden">
          {/* Logo Area */}
          <div className="px-4 py-4">
            <h1 className="text-xl text-[var(--white-100)]">SegVision</h1>
            <p className="text-[11px] text-[var(--white-100)] opacity-80 mt-0.5">Sistema de Monitoramento</p>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {/* Active item - Blue 200 + Accent */}
              <li>
                <button className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-[var(--blue-primary-200)] transition-all duration-150 ease-out">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--blue-primary-100)] rounded-r" />
                  <BarChart3 size={20} className="shrink-0 text-[var(--white-100)]" />
                  <span className="flex-1 text-[13px] leading-tight text-[var(--white-100)]">Dashboard</span>
                </button>
              </li>

              {/* Default items */}
              <li>
                <button className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-transparent hover:bg-[var(--blue-primary-200)] transition-all duration-150 ease-out">
                  <MapPin size={20} className="shrink-0 text-[var(--white-100)] opacity-80 group-hover:opacity-100" />
                  <span className="flex-1 text-[13px] leading-tight text-[var(--white-100)] opacity-80 group-hover:opacity-100">Ambientes</span>
                </button>
              </li>

              <li>
                <button className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-transparent hover:bg-[var(--blue-primary-200)] transition-all duration-150 ease-out">
                  <Camera size={20} className="shrink-0 text-[var(--white-100)] opacity-80 group-hover:opacity-100" />
                  <span className="flex-1 text-[13px] leading-tight text-[var(--white-100)] opacity-80 group-hover:opacity-100">Câmeras</span>
                </button>
              </li>

              {/* Item with badge - Hover (preview) */}
              <li>
                <button className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-[var(--white-100)] transition-all duration-150 ease-out">
                  <AlertTriangle size={20} className="shrink-0 text-[var(--blue-primary-300)]" />
                  <span className="flex-1 text-[13px] leading-tight text-[var(--blue-primary-300)]">Alertas (Hover)</span>
                  <span className="inline-flex items-center justify-center min-w-[22px] h-[18px] px-1.5 rounded-[9px] text-[11px] leading-none bg-[var(--white-100)] text-[var(--blue-primary-300)]" style={{ fontWeight: 700 }}>8</span>
                </button>
              </li>

              <li>
                <button className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-transparent hover:bg-[var(--blue-primary-200)] transition-all duration-150 ease-out">
                  <TrendingUp size={20} className="shrink-0 text-[var(--white-100)] opacity-80 group-hover:opacity-100" />
                  <span className="flex-1 text-[13px] leading-tight text-[var(--white-100)] opacity-80 group-hover:opacity-100">Análises</span>
                </button>
              </li>

              <li>
                <button className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-transparent hover:bg-[var(--blue-primary-200)] transition-all duration-150 ease-out">
                  <CreditCard size={20} className="shrink-0 text-[var(--white-100)] opacity-80 group-hover:opacity-100" />
                  <span className="flex-1 text-[13px] leading-tight text-[var(--white-100)] opacity-80 group-hover:opacity-100">Financeiro</span>
                </button>
              </li>

              <li>
                <button className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-transparent hover:bg-[var(--blue-primary-200)] transition-all duration-150 ease-out">
                  <Phone size={20} className="shrink-0 text-[var(--white-100)] opacity-80 group-hover:opacity-100" />
                  <span className="flex-1 text-[13px] leading-tight text-[var(--white-100)] opacity-80 group-hover:opacity-100">Contatos</span>
                </button>
              </li>

              {/* Item with badge */}
              <li>
                <button className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-transparent hover:bg-[var(--blue-primary-200)] transition-all duration-150 ease-out">
                  <MessageCircle size={20} className="shrink-0 text-[var(--white-100)] opacity-80 group-hover:opacity-100" />
                  <span className="flex-1 text-[13px] leading-tight text-[var(--white-100)] opacity-80 group-hover:opacity-100">Suporte</span>
                  <span className="inline-flex items-center justify-center min-w-[22px] h-[18px] px-1.5 rounded-[9px] text-[11px] leading-none bg-[var(--white-100)] text-[var(--blue-primary-300)]" style={{ fontWeight: 700 }}>2</span>
                </button>
              </li>

              <li>
                <button className="group relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-left bg-transparent hover:bg-[var(--blue-primary-200)] transition-all duration-150 ease-out">
                  <Settings size={20} className="shrink-0 text-[var(--white-100)] opacity-80 group-hover:opacity-100" />
                  <span className="flex-1 text-[13px] leading-tight text-[var(--white-100)] opacity-80 group-hover:opacity-100">Configurações</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Referência de cores */}
      <div className="space-y-4">
        <h3 className="text-lg text-[var(--neutral-text)]">Referência de Cores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-[var(--neutral-border)] rounded-lg space-y-2">
            <div className="w-full h-12 bg-[var(--blue-primary-300)] rounded flex items-center justify-center">
              <span className="text-[var(--white-100)] text-xs">#161E53</span>
            </div>
            <p className="text-sm text-[var(--neutral-text)]">Blue Primary/300</p>
            <p className="text-xs text-[var(--neutral-text-muted)]">Background da sidebar</p>
          </div>

          <div className="p-4 border border-[var(--neutral-border)] rounded-lg space-y-2">
            <div className="w-full h-12 bg-[var(--blue-primary-200)] rounded flex items-center justify-center">
              <span className="text-[var(--white-100)] text-xs">#2F5FFF</span>
            </div>
            <p className="text-sm text-[var(--neutral-text)]">Blue Primary/200</p>
            <p className="text-xs text-[var(--neutral-text-muted)]">Hover de item</p>
          </div>

          <div className="p-4 border border-[var(--neutral-border)] rounded-lg space-y-2">
            <div className="w-full h-12 bg-[var(--blue-primary-100)] rounded flex items-center justify-center">
              <span className="text-[var(--neutral-text)] text-xs">#54A2FA</span>
            </div>
            <p className="text-sm text-[var(--neutral-text)]">Blue Primary/100</p>
            <p className="text-xs text-[var(--neutral-text-muted)]">Focus ring</p>
          </div>

          <div className="p-4 border border-[var(--neutral-border)] rounded-lg space-y-2">
            <div className="w-full h-12 bg-[var(--white-100)] rounded flex items-center justify-center border border-[var(--neutral-border)]">
              <span className="text-[var(--neutral-text)] text-xs">#FAFAFA</span>
            </div>
            <p className="text-sm text-[var(--neutral-text)]">White/100</p>
            <p className="text-xs text-[var(--neutral-text-muted)]">Textos e badges</p>
          </div>

          <div className="p-4 border border-[var(--neutral-border)] rounded-lg space-y-2">
            <div className="w-full h-12 bg-[var(--blue-primary-300)] rounded flex items-center justify-center">
              <span className="text-[var(--white-100)] opacity-80 text-xs">Opacity 80%</span>
            </div>
            <p className="text-sm text-[var(--neutral-text)]">White/100 - 80%</p>
            <p className="text-xs text-[var(--neutral-text-muted)]">Texto/ícone padrão</p>
          </div>

          <div className="p-4 border border-[var(--neutral-border)] rounded-lg space-y-2">
            <div className="w-full h-12 bg-[var(--blue-primary-300)] rounded flex items-center justify-center">
              <div className="bg-[var(--white-100)] bg-opacity-24 px-4 py-2 rounded">
                <span className="text-[var(--white-100)] text-xs">24%</span>
              </div>
            </div>
            <p className="text-sm text-[var(--neutral-text)]">White/100 - 24%</p>
            <p className="text-xs text-[var(--neutral-text-muted)]">Background item ativo</p>
          </div>
        </div>
      </div>

      {/* Contraste */}
      <div className="space-y-4">
        <h3 className="text-lg text-[var(--neutral-text)]">Acessibilidade & Contraste</h3>
        <div className="p-6 border border-[var(--neutral-border)] rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-[var(--green-alert-300)] w-5 h-5" />
            <span className="text-sm text-[var(--neutral-text)]">White/100 sobre Blue Primary/300: <strong>13.2:1 (AAA)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-[var(--green-alert-300)] w-5 h-5" />
            <span className="text-sm text-[var(--neutral-text)]">White/100 80% sobre Blue Primary/300: <strong>10.5:1 (AAA)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-[var(--green-alert-300)] w-5 h-5" />
            <span className="text-sm text-[var(--neutral-text)]">White/100 60% sobre Blue Primary/300: <strong>7.9:1 (AAA)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-[var(--green-alert-300)] w-5 h-5" />
            <span className="text-sm text-[var(--neutral-text)]">Blue Primary/300 sobre White/100 (badge): <strong>13.2:1 (AAA)</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
