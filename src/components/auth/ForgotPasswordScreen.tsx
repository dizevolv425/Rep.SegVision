import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowLeft, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { showToast } from '../ui/toast-utils';
import { supabase } from '../../lib/supabase';

interface ForgotPasswordScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToReset: () => void;
}

export function ForgotPasswordScreen({ onNavigateToLogin, onNavigateToReset }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('E-mail é obrigatório');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('E-mail inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      showToast.success({
        title: 'E-mail enviado!',
        description: 'Verifique sua caixa de entrada'
      });

    } catch (error: any) {
      console.error('Error sending reset email:', error);

      let errorMessage = 'Erro ao enviar e-mail de recuperação';

      if (error.message) {
        errorMessage = error.message;
      }

      showToast.error({
        title: 'Erro ao enviar e-mail',
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[#090F36] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#19215A] border-[#2F5FFF]/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#47D238] flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-white">E-mail Enviado!</CardTitle>
            <CardDescription className="text-white/70">
              Enviamos um link de redefinição de senha para <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-[#090F36] border border-[#63BDF7]/30">
              <p className="text-sm text-white/70">
                Clique no link que enviamos para <strong className="text-white">{email}</strong> para redefinir sua senha.
                O link expira em 1 hora.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#2F5FFF]/10 border border-[#2F5FFF]/30">
              <p className="text-sm text-white/90">
                <strong>Não recebeu o e-mail?</strong> Verifique sua caixa de spam ou solicite um novo envio.
              </p>
            </div>

            <Button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              className="w-full bg-[#2F5FFF] text-white hover:opacity-96"
            >
              Enviar Novamente
            </Button>

            <Button
              onClick={onNavigateToLogin}
              variant="outline"
              className="w-full border-[#2F5FFF]/30 text-white hover:bg-[#2F5FFF]/10"
            >
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090F36] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#19215A] border-[#2F5FFF]/20">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onNavigateToLogin}
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <CardTitle className="text-white">Esqueci minha senha</CardTitle>
              <CardDescription className="text-white/70">
                Informe seu e-mail para recuperar o acesso
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  className={`pl-10 bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${emailError ? 'border-[#F03948]' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {emailError && (
                <p className="text-sm text-[#F03948]">{emailError}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2F5FFF] text-white hover:opacity-96"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Link de Recuperação'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}