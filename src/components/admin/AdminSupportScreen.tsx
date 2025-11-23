import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
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
    title: 'Integração com API de reconhecimento facial',
    description: 'Necessário configurar nova integração para melhorar precisão',
    priority: 'alta',
    status: 'em_andamento',
    createdAt: '2024-01-15 09:30',
    updatedAt: '2024-01-15 14:20'
  },
  {
    id: '2',
    title: 'Exportação de relatórios consolidados',
    description: 'Solicitação de feature para exportar dados em massa',
    priority: 'media',
    status: 'resolvido',
    createdAt: '2024-01-14 16:45',
    updatedAt: '2024-01-14 18:30'
  },
  {
    id: '3',
    title: 'Performance do dashboard geral',
    description: 'Dashboard apresentando lentidão com muitas escolas ativas',
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
    message: 'Preciso de suporte com a configuração de integrações',
    time: '14:32'
  },
  {
    id: '3',
    sender: 'admin',
    message: 'Claro! Vou te orientar no processo. Primeiro, acesse a seção de Integrações...',
    time: '14:33'
  }
];

const faqItems = [
  {
    id: 'faq-1',
    question: 'Como adicionar uma nova escola ao sistema?',
    answer: 'Para adicionar uma escola, acesse a seção "Escolas" no menu lateral, clique no botão "Adicionar Escola" e preencha as informações necessárias: nome da escola, CNPJ, endereço, responsável e plano contratado. O sistema criará automaticamente as credenciais de acesso.'
  },
  {
    id: 'faq-2',
    question: 'Como configurar uma nova integração de API?',
    answer: 'Na seção "Integrações", acesse a aba "APIs Disponíveis". Você pode conectar novas APIs fornecendo as credenciais necessárias (API Key, Secret, endpoints, etc.). As integrações são aplicadas automaticamente para todas as escolas ativas.'
  },
  {
    id: 'faq-3',
    question: 'Como gerenciar contratos e assinaturas?',
    answer: 'Acesse "Contratos & Assinaturas" para visualizar todos os contratos ativos, renovações pendentes e assinaturas vencidas. Você pode editar planos, alterar valores, definir vencimentos e gerar faturas diretamente pelo sistema.'
  },
  {
    id: 'faq-4',
    question: 'Como acessar relatórios de auditoria e métricas?',
    answer: 'Na seção "Relatórios & Auditoria", você pode visualizar métricas consolidadas de todas as escolas, logs de alertas processados e confiabilidade da IA. Os dados podem ser filtrados por período, escola ou tipo de métrica.'
  },
  {
    id: 'faq-5',
    question: 'Como funciona o sistema de permissões LGPD?',
    answer: 'Como Administrador do SaaS, você tem acesso apenas a métricas e dados operacionais agregados. Não é possível visualizar vídeos, imagens de alertas ou executar ações operacionais (como confirmar/resolver alertas) para garantir conformidade com LGPD.'
  },
  {
    id: 'faq-6',
    question: 'Como monitorar a saúde financeira do SaaS?',
    answer: 'No "Financeiro Geral", você visualiza MRR (receita recorrente mensal), taxa de churn, inadimplência e projeções de crescimento. Os dados são atualizados em tempo real e podem ser exportados para análise externa.'
  },
  {
    id: 'faq-7',
    question: 'O que fazer quando uma escola reporta problemas técnicos?',
    answer: 'Abra um chamado nesta Central de Inteligência ou utilize o chat em tempo real para contato com suporte técnico especializado. Para questões urgentes, acesse os contatos de emergência cadastrados pela escola.'
  },
  {
    id: 'faq-8',
    question: 'Como gerenciar notificações do sistema?',
    answer: 'Na seção "Notificações", você pode visualizar todas as notificações do sistema, incluindo novos contratos, renovações, problemas técnicos reportados e atualizações de integração. Configure preferências de notificação nas Configurações.'
  }
];

export function AdminSupportScreen() {
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
            <div className="flex-1 overflow-y-auto bg-[var(--neutral-subtle)] rounded-md p-3 space-y-3 mb-4">
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
          <CardTitle className="text-[var(--neutral-text)]">Perguntas Frequentes</CardTitle>
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