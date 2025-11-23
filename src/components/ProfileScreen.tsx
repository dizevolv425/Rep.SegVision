import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Lock, Monitor, Smartphone, Globe, LogOut, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUserProfile } from './UserProfileContext';
import { showToast } from './ui/toast-utils';

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const mockSessions: Session[] = [
  {
    id: '1',
    device: 'Desktop',
    browser: 'Chrome',
    location: 'Rio de Janeiro, BR',
    lastActive: 'Agora',
    isCurrent: true
  }
];

export function ProfileScreen() {
  const { profile, refreshProfile } = useUserProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data from context
  useEffect(() => {
    if (profile.name) {
      setName(profile.name);
    }
    if (profile.email) {
      setEmail(profile.email);
    }
  }, [profile]);

  const handleSavePersonalData = async () => {
    // Validações
    if (!name.trim()) {
      showToast.error({ title: 'Erro', description: 'Por favor, preencha o nome' });
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      showToast.error({ title: 'Erro', description: 'Por favor, insira um e-mail válido' });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }

      // Update user profile in database
      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: name,
          email: email
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh profile in context
      await refreshProfile();

      showToast.success({
        title: 'Sucesso!',
        description: 'Dados pessoais atualizados com sucesso!'
      });

    } catch (error: any) {
      console.error('Error updating profile:', error);
      showToast.error({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar dados pessoais'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast.error({ title: 'Erro', description: 'Por favor, preencha todos os campos de senha' });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast.error({ title: 'Erro', description: 'A nova senha e a confirmação não coincidem' });
      return;
    }

    if (newPassword.length < 8) {
      showToast.error({ title: 'Erro', description: 'A nova senha deve ter pelo menos 8 caracteres' });
      return;
    }

    setIsLoading(true);

    try {
      // Chamar Edge Function para alterar senha (valida senha atual e requisitos)
      const { data: result, error: functionError } = await supabase.functions.invoke(
        'change-password',
        {
          body: {
            currentPassword,
            newPassword,
          },
        }
      );

      if (functionError) throw functionError;
      if (result?.error) throw new Error(result.error);

      showToast.success({
        title: 'Sucesso!',
        description: 'Senha alterada com sucesso!'
      });

      // Limpar campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error: any) {
      console.error('Error changing password:', error);
      showToast.error({
        title: 'Erro',
        description: error.message || 'Erro ao alterar senha'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminateSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    console.log('Sessão encerrada:', sessionId);
  };

  const handleTerminateAllSessions = () => {
    setSessions(sessions.filter(s => s.isCurrent));
    console.log('Todas as outras sessões encerradas');
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Desktop':
        return Monitor;
      case 'Mobile':
        return Smartphone;
      default:
        return Globe;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna Esquerda */}
        <div className="space-y-6">
          {/* 1. Dados Pessoais e Login */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>Dados Pessoais e Login</CardTitle>
              <CardDescription>Informações da sua conta individual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome completo"
                />
                <p className="text-xs text-gray-500">
                  Este é o nome que aparecerá em seu perfil e relatórios
                </p>
              </div>

              {/* E-mail */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail (Login)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                />
                <p className="text-xs text-gray-500">
                  Você pode alterar seu e-mail de login a qualquer momento
                </p>
              </div>

              {/* Botão Salvar Dados Pessoais */}
              <div className="pt-2">
                <Button 
                  className="bg-[var(--primary-bg)] hover:bg-[var(--primary-bg-hover)] text-[var(--primary-text-on)]"
                  onClick={handleSavePersonalData}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>

              <Separator />

              {/* Troca de Senha */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-600" />
                  <h3 className="text-sm font-medium">Alterar Senha</h3>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Digite sua senha atual"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Digite novamente a nova senha"
                    />
                  </div>

                  <Button 
                    onClick={handlePasswordChange}
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    Alterar Senha
                  </Button>

                  <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded p-2">
                    Esta troca de senha afeta apenas o seu login individual, não toda a conta da escola
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita */}
        <div className="space-y-6">
          {/* 2. Segurança e Auditoria */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>Segurança e Auditoria</CardTitle>
              <CardDescription>Gerencie a segurança da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sessões Ativas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Sessões Ativas</h3>
                  {sessions.length > 1 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs">
                          Encerrar Todas
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Encerrar todas as sessões?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação encerrará todas as outras sessões ativas, exceto a atual. 
                            Você precisará fazer login novamente em outros dispositivos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleTerminateAllSessions}>
                            Encerrar Todas
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>

                <div className="space-y-3">
                  {sessions.map((session) => {
                    const DeviceIcon = getDeviceIcon(session.device);
                    return (
                      <div
                        key={session.id}
                        className="border border-gray-200 rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <DeviceIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-black">
                                  {session.device} - {session.browser}
                                </p>
                                {session.isCurrent && (
                                  <Badge variant="light" tone="success" size="s">
                                    Atual
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600">{session.location}</p>
                              <p className="text-xs text-gray-500">
                                Última atividade: {session.lastActive}
                              </p>
                            </div>
                          </div>
                          {!session.isCurrent && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <LogOut className="h-3 w-3 mr-1" />
                                  Encerrar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Encerrar esta sessão?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação encerrará a sessão em {session.device} ({session.location}). 
                                    Você precisará fazer login novamente neste dispositivo.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleTerminateSession(session.id)}>
                                    Encerrar Sessão
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-2">
                  Importante: Se você não reconhece alguma sessão, encerre-a imediatamente e altere sua senha
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
