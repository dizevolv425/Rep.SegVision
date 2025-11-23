import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { showToast } from '../ui/toast-utils';
import { ThemeToggle } from './ThemeToggle';
import { supabase } from '../../lib/supabase';

interface ResetPasswordScreenProps {
  onResetSuccess: () => void;
}

export function ResetPasswordScreen({ onResetSuccess }: ResetPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Senha é obrigatória');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Senha deve ter no mínimo 8 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Confirmação de senha é obrigatória');
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('As senhas não coincidem');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      showToast.success({
        title: 'Senha redefinida com sucesso!',
        description: 'Você já pode fazer login com sua nova senha'
      });

      onResetSuccess();

    } catch (error: any) {
      console.error('Error resetting password:', error);

      let errorMessage = 'Erro ao redefinir senha. Tente novamente.';

      if (error.message?.includes('Auth session missing')) {
        errorMessage = 'Link de redefinição expirado ou inválido. Solicite um novo.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast.error({
        title: 'Erro ao redefinir senha',
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090F36] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#19215A] border-[#2F5FFF]/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#2F5FFF] flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-white">Redefinir Senha</CardTitle>
          <CardDescription className="text-white/70">
            Crie uma nova senha de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                    if (confirmPassword && confirmPasswordError) {
                      validateConfirmPassword(confirmPassword);
                    }
                  }}
                  onBlur={() => validatePassword(password)}
                  className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 pr-10 ${passwordError ? 'border-[#F03948]' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-[#F03948]">{passwordError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirmar Nova Senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) validateConfirmPassword(e.target.value);
                  }}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                  className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 pr-10 ${confirmPasswordError ? 'border-[#F03948]' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="text-sm text-[#F03948]">{confirmPasswordError}</p>
              )}
            </div>

            <div className="p-3 rounded-lg bg-[#090F36] border border-[#63BDF7]/30">
              <p className="text-sm text-white/70">
                Sua senha deve ter no mínimo 8 caracteres e é recomendado incluir letras, números e símbolos.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2F5FFF] text-white hover:opacity-96"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Redefinindo...
                </>
              ) : (
                'Redefinir Senha'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}