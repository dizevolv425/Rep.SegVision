import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Check, Loader2, CreditCard, QrCode, FileText, ArrowLeft } from 'lucide-react';
import { showToast } from '../ui/toast-utils';

interface CheckoutScreenProps {
  planType: 'basic' | 'pro';
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export function CheckoutScreen({ planType, onPaymentSuccess, onBack }: CheckoutScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Card form data
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  const planDetails = {
    basic: {
      name: 'Basic',
      subtitle: 'Vigilância Essencial - 1 Canal',
      monthly: 299.00,
      setup: 0.00,
    },
    pro: {
      name: 'Pro',
      subtitle: 'Segurança Completa - Até 16 Canais',
      monthly: 899.90,
      setup: 299.00,
    }
  };

  const plan = planDetails[planType];
  const total = plan.monthly + plan.setup;

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.match(/.{1,4}/g)?.join(' ') || numbers;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
  };

  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 4);
  };

  const validateCardData = () => {
    const errors: Record<string, string> = {};

    const cardNumber = cardData.number.replace(/\D/g, '');
    if (!cardNumber || cardNumber.length < 13) {
      errors.number = 'Número do cartão inválido';
    }

    if (!cardData.name || cardData.name.length < 3) {
      errors.name = 'Nome no cartão é obrigatório';
    }

    const expiry = cardData.expiry.replace(/\D/g, '');
    if (!expiry || expiry.length !== 4) {
      errors.expiry = 'Data de validade inválida';
    } else {
      const month = parseInt(expiry.substring(0, 2));
      const year = parseInt('20' + expiry.substring(2, 4));
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        errors.expiry = 'Mês inválido';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiry = 'Cartão vencido';
      }
    }

    if (!cardData.cvv || cardData.cvv.length < 3) {
      errors.cvv = 'CVV inválido';
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = () => {
    if (paymentMethod === 'credit_card') {
      if (!validateCardData()) {
        showToast.error({ title: 'Verifique os dados do cartão' });
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentCompleted(true);
      showToast.success({ 
        title: 'Pagamento confirmado!', 
        description: 'Sua assinatura foi ativada com sucesso' 
      });
    }, 2000);
  };

  const handleCardChange = (field: string, value: string) => {
    setCardData({ ...cardData, [field]: value });
    if (cardErrors[field]) {
      setCardErrors({ ...cardErrors, [field]: '' });
    }
  };

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-[#090F36] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#19215A] border-[#2F5FFF]/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-[#47D238] flex items-center justify-center">
                <Check className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-white">Assinatura Confirmada!</CardTitle>
            <p className="text-white/70 mt-2">
              Seu plano <strong>{plan.name}</strong> foi ativado com sucesso
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-[#090F36] border border-[#47D238]/30">
              <h4 className="text-white mb-2">Próximos passos:</h4>
              <ul className="space-y-1 text-sm text-white/70">
                <li>✓ Configure sua primeira câmera</li>
                <li>✓ Cadastre contatos de emergência</li>
                <li>✓ Explore os recursos de IA</li>
              </ul>
            </div>

            <Button
              onClick={onPaymentSuccess}
              className="w-full bg-[#2F5FFF] text-white hover:opacity-96"
            >
              Ir para o Sistema
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
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl text-white">Checkout</h1>
              <p className="text-white/70">Finalize sua assinatura</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Method */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#19215A] border-[#2F5FFF]/20">
                <CardHeader>
                  <CardTitle className="text-white">Método de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'credit_card' | 'pix' | 'boleto')}>
                    <div className="space-y-3">
                      {/* Credit Card */}
                      <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'credit_card' 
                          ? 'border-[#2F5FFF] bg-[#2F5FFF]/10' 
                          : 'border-[#2F5FFF]/20'
                      }`}>
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card" className="flex items-center gap-3 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5 text-white" />
                          <div>
                            <p className="text-white">Cartão de Crédito</p>
                            <p className="text-sm text-white/70">
                              Aprovação instantânea
                            </p>
                          </div>
                        </Label>
                        {paymentMethod === 'credit_card' && (
                          <Badge variant="medium" tone="success" size="s">Recomendado</Badge>
                        )}
                      </div>

                      {/* PIX */}
                      <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'pix' 
                          ? 'border-[#2F5FFF] bg-[#2F5FFF]/10' 
                          : 'border-[#2F5FFF]/20'
                      }`}>
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex items-center gap-3 cursor-pointer flex-1">
                          <QrCode className="h-5 w-5 text-white" />
                          <div>
                            <p className="text-white">PIX</p>
                            <p className="text-sm text-white/70">
                              Aprovação instantânea
                            </p>
                          </div>
                        </Label>
                      </div>

                      {/* Boleto */}
                      <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'boleto' 
                          ? 'border-[#2F5FFF] bg-[#2F5FFF]/10' 
                          : 'border-[#2F5FFF]/20'
                      }`}>
                        <RadioGroupItem value="boleto" id="boleto" />
                        <Label htmlFor="boleto" className="flex items-center gap-3 cursor-pointer flex-1">
                          <FileText className="h-5 w-5 text-white" />
                          <div>
                            <p className="text-white">Boleto Bancário</p>
                            <p className="text-sm text-white/70">
                              Aprovação em até 2 dias úteis
                            </p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Credit Card Form */}
                  {paymentMethod === 'credit_card' && (
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-white">Número do Cartão</Label>
                        <Input
                          id="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={cardData.number}
                          onChange={(e) => handleCardChange('number', formatCardNumber(e.target.value))}
                          className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${cardErrors.number ? 'border-[#F03948]' : ''}`}
                        />
                        {cardErrors.number && (
                          <p className="text-sm text-[#F03948]">{cardErrors.number}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName" className="text-white">Nome no Cartão</Label>
                        <Input
                          id="cardName"
                          placeholder="NOME COMO ESTÁ NO CARTÃO"
                          value={cardData.name}
                          onChange={(e) => handleCardChange('name', e.target.value.toUpperCase())}
                          className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${cardErrors.name ? 'border-[#F03948]' : ''}`}
                        />
                        {cardErrors.name && (
                          <p className="text-sm text-[#F03948]">{cardErrors.name}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry" className="text-white">Validade</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM/AA"
                            value={cardData.expiry}
                            onChange={(e) => handleCardChange('expiry', formatExpiry(e.target.value))}
                            maxLength={5}
                            className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${cardErrors.expiry ? 'border-[#F03948]' : ''}`}
                          />
                          {cardErrors.expiry && (
                            <p className="text-sm text-[#F03948]">{cardErrors.expiry}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardCvv" className="text-white">CVV</Label>
                          <Input
                            id="cardCvv"
                            placeholder="123"
                            type="password"
                            value={cardData.cvv}
                            onChange={(e) => handleCardChange('cvv', formatCVV(e.target.value))}
                            maxLength={4}
                            className={`bg-[#090F36] border-[#2F5FFF]/30 text-white placeholder:text-white/50 ${cardErrors.cvv ? 'border-[#F03948]' : ''}`}
                          />
                          {cardErrors.cvv && (
                            <p className="text-sm text-[#F03948]">{cardErrors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'pix' && (
                    <div className="mt-4 p-4 rounded-lg bg-[#090F36] border border-[#63BDF7]/30">
                      <p className="text-sm text-white/70">
                        Após confirmar, você receberá um QR Code para pagamento via PIX.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'boleto' && (
                    <div className="mt-4 p-4 rounded-lg bg-[#090F36] border border-[#FDEC85]/30">
                      <p className="text-sm text-white/70">
                        O boleto será enviado para seu e-mail e a assinatura será ativada após compensação (até 2 dias úteis).
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-[#19215A] border-[#2F5FFF]/20 sticky top-0">
                <CardHeader>
                  <CardTitle className="text-white">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white">Plano {plan.name}</p>
                        <p className="text-sm text-white/70">{plan.subtitle}</p>
                      </div>
                      <Badge variant="heavy" tone="primary" size="s">{plan.name}</Badge>
                    </div>
                  </div>

                  <div className="border-t border-[#2F5FFF]/20 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Mensalidade</span>
                      <span className="text-white">
                        R$ {plan.monthly.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Setup (única vez)</span>
                      <span className="text-white">
                        R$ {plan.setup.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#2F5FFF]/20 pt-4">
                    <div className="flex justify-between">
                      <span className="text-white">Total</span>
                      <span className="text-xl text-white">
                        R$ {total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 mt-2">
                      Renovação automática mensal de R$ {plan.monthly.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-[#2F5FFF] text-white hover:opacity-96"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Confirmar Assinatura
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-white/70">
                    Ao confirmar, você concorda com os{' '}
                    <a href="#" className="text-[#2F5FFF] hover:opacity-80">
                      Termos de Serviço
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
