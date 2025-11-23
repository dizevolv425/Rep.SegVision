import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { MessageCircle, Plus, Clock, CheckCircle, AlertCircle, User, Bot, ExternalLink } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'aberto' | 'em_andamento' | 'resolvido';
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  message: string;
  time: string;
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Câmera offline no pátio',
    description: 'A câmera do pátio central está fora do ar desde ontem',
    priority: 'alta',
    status: 'em_andamento',
    createdAt: '2024-01-15 09:30',
    updatedAt: '2024-01-15 14:20'
  },
  {
    id: '2',
    title: 'Configuração de alertas',
    description: 'Preciso de ajuda para configurar alertas personalizados',
    priority: 'media',
    status: 'resolvido',
    createdAt: '2024-01-14 16:45',
    updatedAt: '2024-01-14 18:30'
  },
  {
    id: '3',
    title: 'Problema no reconhecimento facial',
    description: 'O sistema não está identificando alguns funcionários',
    priority: 'media',
    status: 'aberto',
    createdAt: '2024-01-13 11:20',
    updatedAt: '2024-01-13 11:20'
  }
];

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'admin',
    message: 'Olá! Como posso ajudá-lo hoje?',
    time: '14:30'
  },
  {
    id: '2',
    sender: 'user',
    message: 'Estou com dificuldades para configurar os alertas de movimento',
    time: '14:32'
  },
  {
    id: '3',
    sender: 'admin',
    message: 'Entendi. Vou te orientar no processo. Primeiro, vá até a seção de Alertas Inteligentes...',
    time: '14:33'
  }
];

const faqItems = [
  {
    id: 'faq-1',
    question: 'Como adicionar uma nova câmera ao sistema?',
    answer: 'Para adicionar uma câmera, acesse a seção "Câmeras" no menu lateral, clique no botão "Adicionar Câmera" e preencha as informações necessárias: nome da câmera, endereço RTSP, localização e credenciais de acesso. O sistema testará a conexão automaticamente antes de salvar.'
  },
  {
    id: 'faq-2',
    question: 'Como configurar alertas inteligentes personalizados?',
    answer: 'Na Central de Inteligência, acesse a aba "Configurações de Alertas". Você pode definir regras específicas para cada tipo de evento (invasão, queda, aglomeração, etc.), horários de monitoramento, zonas de exclusão e destinatários das notificações. As configurações são aplicadas em tempo real.'
  },
  {
    id: 'faq-3',
    question: 'O que fazer quando uma câmera fica offline?',
    answer: 'Primeiro, verifique a conexão de rede do equipamento e se está recebendo energia. Acesse a seção "Câmeras" para visualizar o status detalhado. Se o problema persistir, abra um chamado de suporte técnico através desta tela ou do chat em tempo real.'
  },
  {
    id: 'faq-4',
    question: 'Como funciona o reconhecimento facial do SegVision?',
    answer: 'O sistema utiliza IA para identificar rostos em tempo real. Para cadastrar pessoas, acesse "Contatos", adicione foto e dados. O reconhecimento acontece automaticamente nas câmeras configuradas, gerando alertas quando pessoas não autorizadas são detectadas ou quando há necessidade de verificação.'
  },
  {
    id: 'faq-5',
    question: 'Posso exportar relatórios de eventos e alertas?',
    answer: 'Sim! Na seção "Analytics", você pode gerar relatórios personalizados por período, tipo de evento, câmera ou ambiente. Os relatórios podem ser exportados em PDF ou Excel e incluem gráficos, estatísticas e histórico detalhado de ocorrências.'
  },
  {
    id: 'faq-6',
    question: 'Como gerenciar múltiplos usuários e permissões?',
    answer: 'Nas Configurações, acesse "Usuários e Permissões". Você pode criar diferentes perfis (administrador, operador, visualizador) com acessos específicos a câmeras, ambientes e funcionalidades. Cada usuário recebe credenciais individuais para acesso ao sistema.'
  },
  {
    id: 'faq-7',
    question: 'Qual o tempo de armazenamento das gravações?',
    answer: 'O tempo de retenção varia de acordo com seu plano contratado. Planos básicos mantêm 7 dias de gravação, planos profissionais 30 dias e planos enterprise até 90 dias. Eventos marcados como importantes podem ser arquivados permanentemente.'
  },
  {
    id: 'faq-8',
    question: 'Como acessar o sistema via aplicativo mobile?',
    answer: 'O SegVision possui aplicativos nativos para iOS e Android. Baixe o app "SegVision" na App Store ou Google Play, faça login com suas credenciais e tenha acesso a todas as funcionalidades: visualização ao vivo, alertas, playback e gerenciamento remoto.'
  }
];

interface SupportScreenProps {
  onNavigate: (screen: string) => void;
}

export function SupportScreen({ onNavigate }: SupportScreenProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        message: newMessage,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
      
      // Simular resposta do admin
      setTimeout(() => {
        const adminResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'admin',
          message: 'Obrigado pela mensagem! Vou analisar sua solicitação e retorno em breve.',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, adminResponse]);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Chat em Tempo Real */}
        <Card className="flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-[var(--neutral-text)]">
              <MessageCircle size={20} />
              Chat com Especialista
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 pb-6 px-6">
            <div className="flex-1 overflow-y-auto bg-[var(--neutral-subtle)] dark:bg-[#0D1238] rounded-md p-3 space-y-3 mb-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-2 rounded-md ${
                    message.sender === 'user' 
                      ? 'bg-[var(--primary-bg)] text-[var(--primary-text-on)]' 
                      : 'bg-[var(--card)] border border-[var(--neutral-border)]'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === 'admin' ? (
                        <Bot size={12} className="text-[var(--neutral-text-muted)]" />
                      ) : (
                        <User size={12} className="opacity-75" />
                      )}
                      <span className="text-xs opacity-75">{message.time}</span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 border-[var(--neutral-border)] focus:border-[var(--primary-bg)] focus:ring-[var(--primary-bg)]"
              />
              <Button 
                onClick={sendMessage}
                className="bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
              >
                Enviar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)] text-[16px] font-bold font-normal">Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="bg-[var(--analytics-list-bg)] border-[var(--neutral-border)] px-4 rounded-md mb-2">
                <AccordionTrigger className="text-[var(--neutral-text)] hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[var(--neutral-text-muted)] px-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}