import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Loader2, CheckCircle, Phone, Mail, Building2 } from 'lucide-react';
import { showToast } from '../ui/toast-utils';

interface EnterpriseSupportScreenProps {
  onBack: () => void;
}

export function EnterpriseSupportScreen({ onBack }: EnterpriseSupportScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    estimatedCameras: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone inválido';
    }

    if (!formData.estimatedCameras) {
      newErrors.estimatedCameras = 'Campo obrigatório';
    }

    if (!formData.message || formData.message.length < 10) {
      newErrors.message = 'Mensagem deve ter no mínimo 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error({ title: 'Verifique os campos do formulário' });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setRequestSent(true);
      showToast.success({ 
        title: 'Solicitação enviada!', 
        description: 'Nossa equipe entrará em contato em breve' 
      });
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (requestSent) {
    return (
      <div className="min-h-screen bg-[#090F36] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#19215A] border-[#2F5FFF]/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-[#47D238] flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-white">Solicitação Enviada!</CardTitle>
            <CardDescription className="text-white/70">
              Recebemos sua solicitação para o plano Enterprise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-[#090F36] border border-[#63BDF7]/30">
              <h4 className="text-white mb-2">Próximos passos:</h4>
              <ul className="space-y-1 text-sm text-white/70">
                <li>✓ Nossa equipe comercial analisará sua solicitação</li>
                <li>✓ Você receberá um e-mail em até 24 horas</li>
                <li>✓ Prepararemos uma proposta personalizada</li>
              </ul>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-[#090F36] border border-[#2F5FFF]/20">
              <p className="text-sm text-white">
                Precisa de atendimento imediato?
              </p>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4" />
                <span>(11) 3456-7890</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4" />
                <span>enterprise@segvision.com</span>
              </div>
            </div>

            <Button
              onClick={onBack}
              variant="outline"
              className="w-full border-[#2F5FFF]/30 text-white hover:bg-[#2F5FFF]/10"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090F36] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#2F5FFF]/20 bg-[#0B1343]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl text-white">Plano Enterprise</h1>
              <p className="text-white/70">
                Solicite uma proposta personalizada
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-[#19215A] border-[#2F5FFF]/20">
            <CardHeader>
              <CardTitle className="text-white">
                Conte-nos sobre sua necessidade
              </CardTitle>
              <CardDescription className="text-white/70">
                Preencha o formulário e nossa equipe comercial entrará em contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-white">Informações de Contato</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        Nome Completo *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${errors.name ? 'border-[#F03948]' : ''}`}
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <p className="text-sm text-[#F03948]">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        E-mail *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${errors.email ? 'border-[#F03948]' : ''}`}
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="text-sm text-[#F03948]">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      Telefone *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
                      maxLength={15}
                      className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${errors.phone ? 'border-[#F03948]' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.phone && (
                      <p className="text-sm text-[#F03948]">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-4 pt-4 border-t border-[#2F5FFF]/20">
                  <h4 className="text-white">Detalhes do Projeto</h4>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedCameras" className="text-white">
                      Número Estimado de Câmeras *
                    </Label>
                    <Input
                      id="estimatedCameras"
                      type="number"
                      placeholder="Ex: 20"
                      min="17"
                      value={formData.estimatedCameras}
                      onChange={(e) => handleChange('estimatedCameras', e.target.value)}
                      className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${errors.estimatedCameras ? 'border-[#F03948]' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.estimatedCameras && (
                      <p className="text-sm text-[#F03948]">{errors.estimatedCameras}</p>
                    )}
                    <p className="text-sm text-white/70">
                      Plano Enterprise: acima de 16 câmeras
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white">
                      Mensagem / Necessidades Específicas *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Descreva suas necessidades, recursos especiais ou dúvidas..."
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      rows={5}
                      className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 resize-none ${errors.message ? 'border-[#F03948]' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.message && (
                      <p className="text-sm text-[#F03948]">{errors.message}</p>
                    )}
                  </div>
                </div>

                {/* Info Banner */}
                <div className="p-4 rounded-lg bg-[#090F36] border border-[#63BDF7]/30">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-[#63BDF7] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white">
                        <strong>O plano Enterprise inclui:</strong>
                      </p>
                      <ul className="text-sm text-white/70 mt-1 space-y-1">
                        <li>• Solução customizada para grandes volumes</li>
                        <li>• Hardware e módulos negociáveis</li>
                        <li>• Suporte dedicado e SLA personalizado</li>
                        <li>• Integração com sistemas existentes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#BA870B] text-white hover:opacity-96"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Solicitar Contato'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
