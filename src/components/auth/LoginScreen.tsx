import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { showToast } from '../ui/toast-utils';
import { useIsMobile } from '../ui/use-mobile';
import { supabase } from '../../lib/supabase';

interface LoginScreenProps {
  onLoginSuccess: (userType: 'admin' | 'school') => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export function LoginScreen({ onLoginSuccess, onNavigateToRegister, onNavigateToForgotPassword }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('E-mail é obrigatório');
      return false;
    }
    if (email !== 'admin' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('E-mail inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Senha é obrigatória');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData.session) {
        throw signInError || new Error('Falha ao autenticar');
      }

      // Get user_type from session metadata (no database query needed)
      const userType = signInData.session.user.user_metadata?.user_type as 'admin' | 'school' | undefined;

      if (!userType) {
        // Fallback: try to get from database if not in metadata
        const userId = signInData.session?.user.id;
        const { data: profile } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', userId)
          .single();

        if (profile?.user_type) {
          // Update metadata for future logins
          await supabase.auth.updateUser({
            data: { user_type: profile.user_type }
          });

          // If "remember me" is off, clear persisted Supabase tokens
          if (!rememberMe && typeof window !== 'undefined') {
            Object.keys(localStorage)
              .filter((key) => key.startsWith('sb-'))
              .forEach((key) => localStorage.removeItem(key));
          }

          showToast.success({ title: 'Login realizado com sucesso!' });
          onLoginSuccess(profile.user_type);
          return;
        }

        throw new Error('Tipo de usuário não encontrado');
      }

      // If "remember me" is off, clear persisted Supabase tokens
      if (!rememberMe && typeof window !== 'undefined') {
        Object.keys(localStorage)
          .filter((key) => key.startsWith('sb-'))
          .forEach((key) => localStorage.removeItem(key));
      }

      showToast.success({ title: 'Login realizado com sucesso!' });
      onLoginSuccess(userType);
    } catch (error: any) {
      console.error('Erro no login:', error);
      showToast.error({
        title: 'Credenciais inválidas',
        description: error?.message || 'E-mail ou senha incorretos',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-[#090F36] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#19215A] border-[#2F5FFF]/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <h1 className="text-2xl text-white">SegVision</h1>
          </div>
          <CardTitle className="text-white">Bem-vindo de volta</CardTitle>
          <CardDescription className="text-white/70">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">E-mail</Label>
              <Input
                id="email"
                type="text"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${emailError ? 'border-[#F03948]' : ''}`}
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-sm text-[#F03948]">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm text-white/70 cursor-pointer"
                >
                  Lembrar-me
                </Label>
              </div>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-sm text-[#2F5FFF] hover:opacity-80"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2F5FFF] text-white hover:opacity-96"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            {!isMobile && (
              <div className="text-center pt-4 border-t border-[#2F5FFF]/20">
                <p className="text-sm text-white/70">
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={onNavigateToRegister}
                    className="text-[#2F5FFF] hover:opacity-80"
                  >
                    Criar conta
                  </button>
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
