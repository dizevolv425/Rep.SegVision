import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AlertClassifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertId: string;
  alertTitle: string;
  defaultOption?: 'incidente_tratado' | 'falso_positivo' | 'ignorado';
  onConfirm: (alertId: string, classification: string, notes: string) => void;
}

export function AlertClassifyModal({
  open,
  onOpenChange,
  alertId,
  alertTitle,
  defaultOption = 'incidente_tratado',
  onConfirm
}: AlertClassifyModalProps) {
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(alertId, selectedOption, notes);
    
    // Toast messages
    const toastMessages = {
      incidente_tratado: 'Alerta resolvido com sucesso.',
      falso_positivo: 'Alerta marcado como Falso Positivo.',
      ignorado: 'Alerta marcado como Ignorado.'
    };
    
    toast.success(toastMessages[selectedOption]);
    onOpenChange(false);
    
    // Reset
    setNotes('');
    setSelectedOption(defaultOption);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setNotes('');
    setSelectedOption(defaultOption);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] rounded-xl p-5">
        <DialogHeader>
          <DialogTitle className="text-[var(--neutral-text)]">
            Encerrar Alerta e Classificar
          </DialogTitle>
          <DialogDescription className="text-[var(--neutral-text-muted)]">
            Alerta: {alertTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-[var(--neutral-text)]">
            Como você deseja classificar este alerta?
          </p>

          <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-3">
            {/* Incidente Tratado */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                selectedOption === 'incidente_tratado'
                  ? 'border-[var(--green-alert-300)] bg-[var(--green-alert-50)] dark:bg-[var(--green-alert-400)]/20'
                  : 'border-[var(--gray-200)] bg-[var(--card)] hover:border-[var(--gray-300)]'
              }`}
            >
              <RadioGroupItem value="incidente_tratado" id="incidente_tratado" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--green-alert-400)]" />
                  <p className="text-[var(--neutral-text)]">
                    Incidente Tratado (Resolvido)
                  </p>
                </div>
                <p className="text-xs text-[var(--neutral-text-muted)] mt-1">
                  A IA detectou corretamente. O incidente foi verificado e tratado.
                </p>
              </div>
            </label>

            {/* Falso Positivo */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                selectedOption === 'falso_positivo'
                  ? 'border-[var(--red-alert-300)] bg-[var(--red-alert-50)] dark:bg-[var(--red-alert-400)]/20'
                  : 'border-[var(--gray-200)] bg-[var(--card)] hover:border-[var(--gray-300)]'
              }`}
            >
              <RadioGroupItem value="falso_positivo" id="falso_positivo" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-[var(--red-alert-400)]" />
                  <p className="text-[var(--neutral-text)]">
                    Falso Positivo (Erro da IA)
                  </p>
                </div>
                <p className="text-xs text-[var(--neutral-text-muted)] mt-1">
                  A IA detectou incorretamente. Este alerta não era um incidente real.
                </p>
              </div>
            </label>

            {/* Ignorado */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                selectedOption === 'ignorado'
                  ? 'border-[var(--gray-300)] bg-[var(--card)]'
                  : 'border-[var(--gray-200)] bg-[var(--card)] hover:border-[var(--gray-300)]'
              }`}
            >
              <RadioGroupItem value="ignorado" id="ignorado" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <MinusCircle className="w-4 h-4 text-[var(--gray-400)]" />
                  <p className="text-[var(--neutral-text)]">
                    Ignorado / Outro
                  </p>
                </div>
                <p className="text-xs text-[var(--neutral-text-muted)] mt-1">
                  Alerta visualizado mas não requer ação específica ou classificação.
                </p>
              </div>
            </label>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[var(--neutral-text)]">
              Notas Operacionais
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva como o incidente foi tratado (opcional)"
              rows={3}
              className="bg-[var(--card)] border-[var(--gray-200)] hover:border-[var(--gray-300)] focus:border-[var(--blue-primary-300)] dark:border-transparent resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="text-[var(--neutral-text)]"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-[var(--green-alert-300)] text-white hover:bg-[var(--green-alert-300)] hover:opacity-95"
          >
            Confirmar Resolução
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}