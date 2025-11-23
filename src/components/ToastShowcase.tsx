import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { showToast } from './ui/toast-utils';

export function ToastShowcase() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)]">Sistema de Toasts - SegVision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-[var(--neutral-text)] mb-3">Toasts Simples</h4>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => showToast.success({ title: 'Sucesso' })}
                className="bg-[var(--green-alert-300)] text-white hover:opacity-96"
              >
                Toast de Sucesso
              </Button>
              <Button
                onClick={() => showToast.error({ title: 'Erro' })}
                className="bg-[var(--red-alert-300)] text-white hover:opacity-96"
              >
                Toast de Erro
              </Button>
              <Button
                onClick={() => showToast.info({ title: 'Info' })}
                className="bg-[var(--turquoise-alert-300)] text-white hover:opacity-96"
              >
                Toast de Info
              </Button>
              <Button
                onClick={() => showToast.warning({ title: 'Atenção' })}
                className="bg-[var(--orange-alert-400)] text-white hover:opacity-96"
              >
                Toast de Atenção
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-[var(--neutral-text)] mb-3">Toasts com Descrição</h4>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => showToast.success({ 
                  title: 'Operação concluída',
                  description: 'Os dados foram salvos com sucesso'
                })}
                className="bg-[var(--green-alert-300)] text-white hover:opacity-96"
              >
                Sucesso + Descrição
              </Button>
              <Button
                onClick={() => showToast.error({ 
                  title: 'Erro ao processar',
                  description: 'Não foi possível conectar ao servidor'
                })}
                className="bg-[var(--red-alert-300)] text-white hover:opacity-96"
              >
                Erro + Descrição
              </Button>
              <Button
                onClick={() => showToast.warning({ 
                  title: 'Atenção necessária',
                  description: 'Verifique os dados antes de continuar'
                })}
                className="bg-[var(--orange-alert-400)] text-white hover:opacity-96"
              >
                Atenção + Descrição
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-[var(--neutral-text)] mb-3">Casos de Uso - Sistema</h4>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => showToast.success({ 
                  title: 'Notificação excluída com sucesso'
                })}
                className="bg-[var(--green-alert-300)] text-white hover:opacity-96"
              >
                Exclusão OK
              </Button>
              <Button
                onClick={() => showToast.success({ 
                  title: 'Notificação marcada como lida'
                })}
                className="bg-[var(--green-alert-300)] text-white hover:opacity-96"
              >
                Marcar Lida
              </Button>
              <Button
                onClick={() => showToast.error({ 
                  title: 'Erro ao excluir',
                  description: 'Tente novamente em alguns instantes'
                })}
                className="bg-[var(--red-alert-300)] text-white hover:opacity-96"
              >
                Erro Exclusão
              </Button>
              <Button
                onClick={() => showToast.warning({ 
                  title: 'Câmera offline detectada',
                  description: 'Verifique a conexão do dispositivo'
                })}
                className="bg-[var(--orange-alert-400)] text-white hover:opacity-96"
              >
                Aviso Câmera
              </Button>
            </div>
          </div>

          <div className="border-t border-[var(--neutral-border)] pt-6">
            <h4 className="text-[var(--neutral-text)] mb-3">Especificações Técnicas</h4>
            <div className="space-y-2 text-[var(--neutral-text-muted)]">
              <p>• <strong>Cores SegVision:</strong> Usando tokens oficiais do design system</p>
              <p>• <strong>Sucesso:</strong> Green Alert 300 (#47D238)</p>
              <p>• <strong>Erro:</strong> Red Alert 300 (#C8142C)</p>
              <p>• <strong>Info:</strong> Turquoise Alert 300 (#20A4ED)</p>
              <p>• <strong>Atenção:</strong> Orange Alert 400 (#BA870B)</p>
              <p>• <strong>Duração padrão:</strong> 3000ms (customizável)</p>
              <p>• <strong>Posição:</strong> Top-center (fixo no App.tsx)</p>
              <p>• <strong>Tipografia:</strong> 14px para título, 12px para descrição</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
