import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { showToast } from '../ui/toast-utils';
import { supabase } from '../../lib/supabase';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export function RegisterScreen({ onRegisterSuccess, onNavigateToLogin }: RegisterScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    schoolName: '',
    cnpj: '',
    responsibleName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 3;

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
  };

  const validateCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, '');
    return numbers.length === 14;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.schoolName || formData.schoolName.length < 3) {
      newErrors.schoolName = 'Nome da escola deve ter no mínimo 3 caracteres';
    }

    if (!validateCNPJ(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido (14 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.responsibleName || formData.responsibleName.length < 3) {
      newErrors.responsibleName = 'Nome do responsável deve ter no mínimo 3 caracteres';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'Você deve aceitar os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      showToast.error({ title: 'Verifique os campos do formulário' });
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) {
      showToast.error({ title: 'Verifique os campos do formulário' });
      return;
    }

    setIsLoading(true);

    try {
      // 1) Criar usuário no Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.responsibleName,
            user_type: 'school',
          },
        },
      });

      if (signUpError || !signUpData.user) {
        throw signUpError || new Error('Falha ao criar usuário');
      }

      const userId = signUpData.user.id;

      // 2) Criar a escola
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: formData.schoolName,
          cnpj: formData.cnpj,
          contact_name: formData.responsibleName,
          contact_email: formData.email,
          plan: 'basic',
          status: 'pending',
        })
        .select('id')
        .single();

      if (schoolError || !schoolData) {
        throw schoolError || new Error('Falha ao criar escola');
      }

      // 3) Atualizar perfil (tabela users) com school_id e nome
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          full_name: formData.responsibleName,
          school_id: schoolData.id,
          user_type: 'school',
        })
        .eq('id', userId);

      if (userUpdateError) {
        throw userUpdateError;
      }

      showToast.success({
        title: 'Conta criada com sucesso!',
        description: 'Processando seu pagamento...',
      });
      onRegisterSuccess();
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      showToast.error({
        title: 'Erro ao criar conta',
        description: error?.message || 'Tente novamente',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step < currentStep
                  ? 'bg-[#47D238] text-white'
                  : step === currentStep
                  ? 'bg-[#2F5FFF] text-white'
                  : 'bg-[#090F36] border-2 border-[#2F5FFF]/30 text-white/50'
              }`}
            >
              {step < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span>{step}</span>
              )}
            </div>
            <span className={`text-xs ${step === currentStep ? 'text-white' : 'text-white/50'}`}>
              {step === 1 ? 'Escola' : step === 2 ? 'Responsável' : 'Senha'}
            </span>
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-0.5 ${
                step < currentStep ? 'bg-[#47D238]' : 'bg-[#2F5FFF]/30'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-white mb-1">Dados da Escola</h3>
        <p className="text-sm text-white/70">Passo 1 de 3</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schoolName" className="text-white">
          Nome da Escola *
        </Label>
        <Input
          id="schoolName"
          placeholder="Ex: Colégio Dom Pedro II"
          value={formData.schoolName}
          onChange={(e) => handleChange('schoolName', e.target.value)}
          className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${errors.schoolName ? 'border-[#F03948]' : ''}`}
          autoFocus
        />
        {errors.schoolName && (
          <p className="text-sm text-[#F03948]">{errors.schoolName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cnpj" className="text-white">CNPJ *</Label>
        <Input
          id="cnpj"
          placeholder="00.000.000/0000-00"
          value={formData.cnpj}
          onChange={(e) => handleChange('cnpj', formatCNPJ(e.target.value))}
          maxLength={18}
          className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${errors.cnpj ? 'border-[#F03948]' : ''}`}
        />
        {errors.cnpj && (
          <p className="text-sm text-[#F03948]">{errors.cnpj}</p>
        )}
      </div>

      <Button
        onClick={handleNext}
        className="w-full bg-[#2F5FFF] text-white hover:opacity-96"
      >
        Próximo
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-white mb-1">Dados do Responsável</h3>
        <p className="text-sm text-white/70">Passo 2 de 3</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsibleName" className="text-white">
          Nome Completo *
        </Label>
        <Input
          id="responsibleName"
          placeholder="Ex: Maria da Silva"
          value={formData.responsibleName}
          onChange={(e) => handleChange('responsibleName', e.target.value)}
          className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${errors.responsibleName ? 'border-[#F03948]' : ''}`}
          autoFocus
        />
        {errors.responsibleName && (
          <p className="text-sm text-[#F03948]">{errors.responsibleName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">E-mail *</Label>
        <Input
          id="email"
          type="email"
          placeholder="maria@escola.com.br"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${errors.email ? 'border-[#F03948]' : ''}`}
        />
        {errors.email && (
          <p className="text-sm text-[#F03948]">{errors.email}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleBack}
          variant="outline"
          className="flex-1 border-[#2F5FFF]/30 text-white hover:bg-[#2F5FFF]/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1 bg-[#2F5FFF] text-white hover:opacity-96"
        >
          Próximo
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-white mb-1">Senha de Acesso</h3>
        <p className="text-sm text-white/70">Passo 3 de 3</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">Senha *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 pr-10 ${errors.password ? 'border-[#F03948]' : ''}`}
            autoFocus
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
        {errors.password && (
          <p className="text-sm text-[#F03948]">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">
          Confirmar Senha *
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repita a senha"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 pr-10 ${errors.confirmPassword ? 'border-[#F03948]' : ''}`}
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
        {errors.confirmPassword && (
          <p className="text-sm text-[#F03948]">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex items-start gap-2 pt-2">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => {
            setAcceptedTerms(checked as boolean);
            if (errors.terms) {
              setErrors({ ...errors, terms: '' });
            }
          }}
        />
        <Label
          htmlFor="terms"
          className={`text-sm cursor-pointer ${errors.terms ? 'text-[#F03948]' : 'text-white/70'}`}
        >
          Aceito os{' '}
          <a href="#" className="text-[#2F5FFF] hover:opacity-80">
            Termos de Uso
          </a>{' '}
          e{' '}
          <a href="#" className="text-[#2F5FFF] hover:opacity-80">
            Política de Privacidade
          </a>
        </Label>
      </div>
      {errors.terms && (
        <p className="text-sm text-[#F03948]">{errors.terms}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          onClick={handleBack}
          variant="outline"
          className="flex-1 border-[#2F5FFF]/30 text-white hover:bg-[#2F5FFF]/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#2F5FFF] text-white hover:opacity-96"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Criando...
            </>
          ) : (
            'Criar Conta'
          )}
        </Button>
      </div>
    </form>
  );

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
              <CardTitle className="text-white">Criar Conta</CardTitle>
              <CardDescription className="text-white/70">
                Cadastre sua escola no SegVision
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderStepIndicator()}
          
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </CardContent>
      </Card>
    </div>
  );
}
