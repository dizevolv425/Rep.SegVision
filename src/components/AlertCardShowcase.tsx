import React from 'react';
import { AlertCard } from './AlertCard';
import { Ban, User, Users, Package, AlertTriangle } from 'lucide-react';

export function AlertCardShowcase() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-[var(--neutral-text)] text-2xl mb-2">Alert Card Component Showcase</h1>
          <p className="text-[var(--neutral-text-muted)]">
            Demonstração do componente AlertCard redesenhado com hierarquia visual e botões com texto branco.
          </p>
        </div>

        <div className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-[var(--neutral-text)] text-xl">Status: Novo (Alta Prioridade)</h2>
            <p className="text-[var(--neutral-text-muted)] text-sm">
              Badge heavy/danger, destaque vermelho na borda esquerda, todos os botões disponíveis
            </p>
            <AlertCard
              id="1"
              type="intrusion"
              title="Movimento após horário"
              description="Movimento detectado fora do horário escolar na área restrita do portão principal. Sistema de IA identificou pessoa não autorizada."
              camera="Câmera Pátio 01"
              time="18:45"
              date="2024-01-15"
              status="novo"
              priority="alta"
              icon={Ban}
              location="Portão Principal"
              onViewVideo={(id) => console.log('View video', id)}
              onConfirm={(id) => console.log('Confirm', id)}
              onResolve={(id) => console.log('Resolve', id)}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-[var(--neutral-text)] text-xl">Status: Confirmado (Média Prioridade)</h2>
            <p className="text-[var(--neutral-text-muted)] text-sm">
              Badge light/caution amarelo, botão Resolver habilitado, com informação do autor
            </p>
            <AlertCard
              id="2"
              type="face"
              title="Pessoa não autorizada identificada"
              description="Rosto não identificado detectado na entrada. Sistema aguardando confirmação de acesso ou acionamento de protocolo de segurança."
              camera="Câmera Entrada Principal"
              time="14:23"
              date="2024-01-15"
              status="confirmado"
              priority="media"
              icon={User}
              location="Recepção Norte"
              actionBy={{
                name: 'Ana Silva',
                role: 'Seg.'
              }}
              onViewVideo={(id) => console.log('View video', id)}
              onConfirm={(id) => console.log('Confirm', id)}
              onResolve={(id) => console.log('Resolve', id)}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-[var(--neutral-text)] text-xl">Status: Resolvido (Baixa Prioridade)</h2>
            <p className="text-[var(--neutral-text-muted)] text-sm">
              Badge medium/success verde, botão Resolver desabilitado (cinza com texto branco)
            </p>
            <AlertCard
              id="3"
              type="crowd"
              title="Aglomeração detectada no corredor"
              description="Mais de 15 pessoas detectadas simultaneamente no corredor B durante o intervalo. Situação normalizada após dispersão natural."
              camera="Câmera Corredor B"
              time="12:30"
              date="2024-01-15"
              status="resolvido"
              priority="baixa"
              icon={Users}
              location="Corredor B - 2º Andar"
              actionBy={{
                name: 'João Santos',
                role: 'Vice-Dir.'
              }}
              onViewVideo={(id) => console.log('View video', id)}
              onConfirm={(id) => console.log('Confirm', id)}
              onResolve={(id) => console.log('Resolve', id)}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-[var(--neutral-text)] text-xl">Status: Novo (Média Prioridade) - Objeto Suspeito</h2>
            <p className="text-[var(--neutral-text-muted)] text-sm">
              Sem destaque crítico (não é alta prioridade), botão Confirmar disponível
            </p>
            <AlertCard
              id="4"
              type="object"
              title="Mochila vermelha detectada"
              description="Mochila vermelha deixada sem supervisão por mais de 10 minutos na biblioteca. Protocolo de verificação iniciado automaticamente."
              camera="Câmera Biblioteca"
              time="10:15"
              date="2024-01-15"
              status="novo"
              priority="media"
              icon={Package}
              location="Biblioteca - Mesa 12"
              onViewVideo={(id) => console.log('View video', id)}
              onConfirm={(id) => console.log('Confirm', id)}
              onResolve={(id) => console.log('Resolve', id)}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-[var(--neutral-text)] text-xl">Status: Falso Positivo</h2>
            <p className="text-[var(--neutral-text-muted)] text-sm">
              Badge light/neutral cinza, apenas botão Ver Vídeo disponível
            </p>
            <AlertCard
              id="5"
              type="movement"
              title="Movimento detectado - Falso alarme"
              description="Sistema detectou movimento que foi posteriormente identificado como animal (gato) na área externa. Alerta classificado como falso positivo."
              camera="Câmera Pátio Externo"
              time="06:30"
              date="2024-01-15"
              status="falso"
              priority="baixa"
              icon={AlertTriangle}
              location="Pátio Externo"
              actionBy={{
                name: 'Carlos Mendes',
                role: 'Coord. Seg.'
              }}
              onViewVideo={(id) => console.log('View video', id)}
              onConfirm={(id) => console.log('Confirm', id)}
              onResolve={(id) => console.log('Resolve', id)}
            />
          </section>
        </div>

        <div className="pt-8 border-t border-[var(--neutral-border)]">
          <h2 className="text-[var(--neutral-text)] text-xl mb-4">Características Principais</h2>
          <ul className="space-y-2 text-[var(--neutral-text-muted)]">
            <li>✓ Layout horizontal responsivo (desktop) e vertical (mobile)</li>
            <li>✓ Ícone circular colorido por tipo de alerta</li>
            <li>✓ Hierarquia visual clara: Título → Status → Timestamp → Descrição → Metadados</li>
            <li>✓ Badges corretas: Status (heavy/medium/light), Gravidade (medium), Tipo (light)</li>
            <li>✓ Botões com texto SEMPRE branco: Primary (azul), Warning (laranja), Success (verde)</li>
            <li>✓ Estado disabled com background cinza e texto branco opaco</li>
            <li>✓ Hover state com shadow sutil e borda destacada</li>
            <li>✓ Critical highlight: borda esquerda vermelha quando Alta + Novo</li>
            <li>✓ Lógica de botões: Confirmar só em Novo, Resolver só ativo em Confirmado</li>
            <li>✓ Timestamp como badge neutral no header</li>
          </ul>
        </div>

        <div className="pt-4 pb-8">
          <h2 className="text-[var(--neutral-text)] text-xl mb-4">Cores dos Botões</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-12 bg-[var(--blue-primary-200)] rounded-[10px] flex items-center justify-center">
                <span className="text-white font-semibold text-[13px]">Ver Vídeo</span>
              </div>
              <p className="text-xs text-[var(--neutral-text-muted)]">Primary: #2F5FFF</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 bg-[var(--orange-alert-400)] rounded-[10px] flex items-center justify-center">
                <span className="text-white font-semibold text-[13px]">Confirmar</span>
              </div>
              <p className="text-xs text-[var(--neutral-text-muted)]">Warning: #BA870B</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 bg-[var(--green-alert-300)] rounded-[10px] flex items-center justify-center">
                <span className="text-white font-semibold text-[13px]">Resolver</span>
              </div>
              <p className="text-xs text-[var(--neutral-text-muted)]">Success: #47D238</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 bg-[var(--gray-200)] rounded-[10px] flex items-center justify-center opacity-60">
                <span className="text-white font-semibold text-[13px]">Resolver</span>
              </div>
              <p className="text-xs text-[var(--neutral-text-muted)]">Disabled: #B3B4C1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
