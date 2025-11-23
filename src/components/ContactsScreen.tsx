import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Plus, Edit, Trash2, Phone, UserCircle, AlertTriangle, CheckCircle2, Mail, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from './ui/use-mobile';
import { EmptyState } from './EmptyState';
import { supabase } from '../lib/supabase';
import { useUserProfile } from './UserProfileContext';

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  receiveWhatsApp: boolean;
}

const MAX_WHATSAPP_CONTACTS = 5;

interface ContactsScreenProps {
  isFirstAccess?: boolean;
}

export function ContactsScreen({ isFirstAccess = false }: ContactsScreenProps) {
  const { userProfile } = useUserProfile();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    receiveWhatsApp: false
  });
  const isMobile = useIsMobile();

  const whatsAppEnabledCount = contacts.filter(c => c.receiveWhatsApp).length;
  const hasNoWhatsAppContacts = whatsAppEnabledCount === 0;

  // Load contacts from Supabase
  const loadContacts = async () => {
    if (!userProfile?.school_id) {
      setContacts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('school_id', userProfile.school_id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const transformedContacts: Contact[] = (data || []).map(contact => ({
        id: contact.id,
        name: contact.name,
        role: contact.role,
        phone: contact.phone,
        email: contact.email,
        receiveWhatsApp: contact.receive_whatsapp
      }));

      setContacts(transformedContacts);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      toast.error('Erro ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.school_id) {
      loadContacts();
    }
  }, [userProfile?.school_id]);

  const formatPhoneE164 = (phone: string): string => {
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '');
    
    // Formata para E.164 brasileiro
    if (numbers.length === 11) {
      return `+55 ${numbers.substring(0, 2)} ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
    } else if (numbers.length === 10) {
      return `+55 ${numbers.substring(0, 2)} ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
    }
    return phone;
  };

  const validatePhone = (phone: string): boolean => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 10 || numbers.length === 11;
  };

  const isPhoneDuplicate = (phone: string, excludeId?: string): boolean => {
    const normalizedPhone = phone.replace(/\D/g, '');
    return contacts.some(c =>
      c.id !== excludeId && c.phone.replace(/\D/g, '') === normalizedPhone
    );
  };

  const handleAddContact = async () => {
    if (!formData.name || formData.name.length < 3) {
      toast.error('Nome deve ter no mínimo 3 caracteres');
      return;
    }

    if (!formData.phone) {
      toast.error('Telefone é obrigatório');
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error('Telefone inválido. Use formato (XX) XXXXX-XXXX');
      return;
    }

    if (isPhoneDuplicate(formData.phone)) {
      toast.error('Este telefone já está cadastrado');
      return;
    }

    if (!userProfile?.school_id) {
      toast.error('School ID not found');
      return;
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .insert({
          school_id: userProfile.school_id,
          name: formData.name,
          role: formData.role,
          phone: formatPhoneE164(formData.phone),
          email: formData.email,
          receive_whatsapp: formData.receiveWhatsApp
        });

      if (error) throw error;

      await loadContacts();
      setFormData({ name: '', role: '', phone: '', email: '', receiveWhatsApp: false });
      setIsAddModalOpen(false);
      toast.success('Contato adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
      toast.error('Erro ao adicionar contato');
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      role: contact.role,
      phone: contact.phone.replace(/\D/g, ''),
      email: contact.email,
      receiveWhatsApp: contact.receiveWhatsApp
    });
  };

  const handleUpdateContact = async () => {
    if (!editingContact) return;

    if (!formData.name || formData.name.length < 3) {
      toast.error('Nome deve ter no mínimo 3 caracteres');
      return;
    }

    if (!formData.phone) {
      toast.error('Telefone é obrigatório');
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error('Telefone inválido. Use formato (XX) XXXXX-XXXX');
      return;
    }

    if (isPhoneDuplicate(formData.phone, editingContact.id)) {
      toast.error('Este telefone já está cadastrado');
      return;
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .update({
          name: formData.name,
          role: formData.role,
          phone: formatPhoneE164(formData.phone),
          email: formData.email,
          receive_whatsapp: formData.receiveWhatsApp
        })
        .eq('id', editingContact.id);

      if (error) throw error;

      await loadContacts();
      setEditingContact(null);
      setFormData({ name: '', role: '', phone: '', email: '', receiveWhatsApp: false });
      toast.success('Contato atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      toast.error('Erro ao atualizar contato');
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadContacts();
      setDeletingContactId(null);
      toast.success('Contato excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir contato:', error);
      toast.error('Erro ao excluir contato');
    }
  };

  const handleToggleWhatsApp = async (id: string, currentValue: boolean) => {
    const newValue = !currentValue;

    if (newValue) {
      const currentlyEnabledCount = contacts.filter(c => c.id !== id && c.receiveWhatsApp).length;
      if (currentlyEnabledCount >= MAX_WHATSAPP_CONTACTS) {
        toast.error(`Limite de ${MAX_WHATSAPP_CONTACTS} contatos para WhatsApp atingido`);
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .update({ receive_whatsapp: newValue })
        .eq('id', id);

      if (error) throw error;

      setContacts(contacts.map(contact =>
        contact.id === id ? { ...contact, receiveWhatsApp: newValue } : contact
      ));

      toast.success(
        newValue
          ? 'Contato marcado para receber alertas por WhatsApp'
          : 'Contato desmarcado para alertas por WhatsApp'
      );
    } catch (error) {
      console.error('Erro ao atualizar WhatsApp:', error);
      toast.error('Erro ao atualizar configuração de WhatsApp');
    }
  };

  const ContactForm = ({ onSubmit, submitLabel, isEditMode = false }: { onSubmit: () => void, submitLabel: string, isEditMode?: boolean }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[var(--neutral-text)]">Nome *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Nome completo"
          className="border-[var(--neutral-border)] focus:border-[var(--primary-bg)] focus:ring-[var(--primary-bg)]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role" className="text-[var(--neutral-text)]">Cargo</Label>
        <Input
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          placeholder="Ex: Diretor, Coordenador, Segurança"
          className="border-[var(--neutral-border)] focus:border-[var(--primary-bg)] focus:ring-[var(--primary-bg)]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-[var(--neutral-text)]">Telefone *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="11999999999"
          className="border-[var(--neutral-border)] focus:border-[var(--primary-bg)] focus:ring-[var(--primary-bg)]"
        />
        <p className="text-xs text-[var(--neutral-text-muted)]">
          Digite apenas números (DDD + número)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[var(--neutral-text)]">E-mail</Label>
        <Input
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="exemplo@exemplo.com"
          className="border-[var(--neutral-border)] focus:border-[var(--primary-bg)] focus:ring-[var(--primary-bg)]"
        />
      </div>
      
      {!isEditMode && (
        <div className="space-y-2 pt-2 border-t border-[var(--neutral-border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="receiveWhatsApp" className="text-[var(--neutral-text)]">
                Receber alertas por WhatsApp
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-[var(--neutral-text-muted)] cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-[var(--card)] border-[var(--neutral-border)]">
                    <p className="text-sm text-[var(--neutral-text-muted)]">
                      Quando ativado, este contato receberá notificações automáticas por WhatsApp sempre que um alerta de segurança for detectado pelo sistema. Você pode alterar isso depois.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id="receiveWhatsApp"
              checked={formData.receiveWhatsApp}
              onCheckedChange={(value) => setFormData({...formData, receiveWhatsApp: value})}
              className="data-[state=checked]:bg-[var(--primary-bg)]"
            />
          </div>
          <p className="text-xs text-[var(--neutral-text-muted)]">
            Limite: {whatsAppEnabledCount}/{MAX_WHATSAPP_CONTACTS} contatos configurados para receber alertas
          </p>
        </div>
      )}
      
      <Button 
        onClick={onSubmit}
        className="w-full bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
      >
        {submitLabel}
      </Button>
    </div>
  );

  // Show empty state for first access
  if (isFirstAccess && contacts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Contato
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[var(--card)] border-[var(--neutral-border)]">
              <DialogHeader>
                <DialogTitle className="text-[var(--neutral-text)]">Adicionar Contato</DialogTitle>
                <DialogDescription className="text-[var(--neutral-text-muted)]">
                  Cadastre contatos que devem receber notificações de alertas
                </DialogDescription>
              </DialogHeader>
              <ContactForm onSubmit={handleAddContact} submitLabel="Adicionar" />
            </DialogContent>
          </Dialog>
        </div>

        <EmptyState
          icon={UserCircle}
          title="Nenhum contato cadastrado"
          description="Adicione contatos de emergência que devem ser notificados quando houver alertas importantes. Você pode configurar até 5 contatos para receber notificações via WhatsApp."
          actionLabel="Adicionar Primeiro Contato"
          onAction={() => setIsAddModalOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {hasNoWhatsAppContacts && (
        <div className="bg-[var(--yellow-alert-50)] dark:bg-[var(--yellow-alert-400)]/10 border border-[var(--yellow-alert-400)] rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-[var(--yellow-alert-400)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[var(--neutral-text)] mb-1">Nenhum destinatário configurado para WhatsApp</h4>
              <p className="text-sm text-[var(--neutral-text-muted)]">
                Marque pelo menos um contato para receber notificações automáticas quando ocorrer um alerta.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Counter */}
      {whatsAppEnabledCount > 0 && (
        <div className="bg-[var(--green-alert-50)] dark:bg-[var(--green-alert-400)]/10 border border-[var(--green-alert-400)] rounded-lg p-4">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-[var(--green-alert-400)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[var(--neutral-text)]">
                {whatsAppEnabledCount}/{MAX_WHATSAPP_CONTACTS} contatos receberão alertas por WhatsApp
              </h4>
              <p className="text-sm text-[var(--neutral-text-muted)]">
                Estes contatos serão notificados automaticamente quando houver novos alertas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-end">
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Contato
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[var(--card)] border-[var(--neutral-border)]">
            <DialogHeader>
              <DialogTitle className="text-[var(--neutral-text)]">Novo Contato de Emergência</DialogTitle>
              <DialogDescription className="text-[var(--neutral-text-muted)]">
                Adicione um novo contato de emergência
              </DialogDescription>
            </DialogHeader>
            <ContactForm onSubmit={handleAddContact} submitLabel="Adicionar Contato" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Contacts Table */}
      <Card className="border-[var(--neutral-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--neutral-text)]">
            Contatos de Emergência ({contacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle className="mx-auto h-12 w-12 text-[var(--neutral-border)] mb-4" />
              <h4 className="text-[var(--neutral-text)] mb-2">Nenhum contato cadastrado</h4>
              <p className="text-sm text-[var(--neutral-text-muted)] mb-4">
                Cadastre e marque quem deve ser notificado por WhatsApp quando ocorrer um alerta.
              </p>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar contato
              </Button>
            </div>
          ) : isMobile ? (
            // Mobile: Card Layout
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 border border-[var(--neutral-border)] rounded-lg bg-[var(--card)] hover:bg-[var(--neutral-subtle)] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-[var(--neutral-text)]">{contact.name}</h4>
                      {contact.role && (
                        <p className="text-sm text-[var(--neutral-text-muted)] mt-1">{contact.role}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="h-4 w-4 text-[var(--neutral-text-muted)]" />
                    <span className="text-sm text-[var(--neutral-text-muted)]">{contact.phone}</span>
                  </div>

                  {contact.email && (
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="h-4 w-4 text-[var(--neutral-text-muted)]" />
                      <span className="text-sm text-[var(--neutral-text-muted)]">{contact.email}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--neutral-border)]">
                    <span className="text-sm text-[var(--neutral-text)]">Receber alertas via WhatsApp</span>
                    <Switch
                      checked={contact.receiveWhatsApp}
                      onCheckedChange={() => handleToggleWhatsApp(contact.id, contact.receiveWhatsApp)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditContact(contact)}
                          className="flex-1 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                        <DialogHeader>
                          <DialogTitle className="text-[var(--neutral-text)]">Editar Contato</DialogTitle>
                          <DialogDescription className="text-[var(--neutral-text-muted)]">
                            Altere as informações do contato
                          </DialogDescription>
                        </DialogHeader>
                        <ContactForm onSubmit={handleUpdateContact} submitLabel="Salvar Alterações" isEditMode={true} />
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-[var(--danger-border)] text-[var(--danger-bg)] hover:bg-[var(--danger-bg)] hover:text-white hover:border-[var(--danger-bg)]"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-[var(--neutral-text)]">Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription className="text-[var(--neutral-text-muted)]">
                            Tem certeza que deseja remover <span className="text-[var(--neutral-text)]">{contact.name}</span> da lista de contatos? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteContact(contact.id)}
                            className="bg-[var(--danger-bg)] text-white hover:opacity-96 border-0"
                          >
                            Confirmar Exclusão
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Desktop: Table Layout
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--gray-200)] dark:border-[rgba(250,250,250,0.15)]">
                    <th className="text-left py-3 px-4 text-[var(--neutral-text)]">Nome</th>
                    <th className="text-left py-3 px-4 text-[var(--neutral-text)]">Cargo</th>
                    <th className="text-left py-3 px-4 text-[var(--neutral-text)]">Telefone</th>
                    <th className="text-left py-3 px-4 text-[var(--neutral-text)]">E-mail</th>
                    <th className="text-left py-3 px-4 text-[var(--neutral-text)]">Receber alertas por WhatsApp</th>
                    <th className="text-right py-3 px-4 text-[var(--neutral-text)]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr 
                      key={contact.id} 
                      className="border-b border-[var(--gray-200)] dark:border-[rgba(250,250,250,0.15)] hover:bg-[var(--neutral-subtle)] dark:hover:bg-[var(--blue-primary-800)] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-[var(--neutral-text)]">{contact.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[var(--neutral-text-muted)]" style={{ fontSize: '14px' }}>
                          {contact.role || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[var(--neutral-text-muted)]" />
                          <span className="text-[var(--neutral-text-muted)]" style={{ fontSize: '14px' }}>
                            {contact.phone}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[var(--neutral-text-muted)]" style={{ fontSize: '14px' }}>
                          {contact.email || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Switch
                          checked={contact.receiveWhatsApp}
                          onCheckedChange={() => handleToggleWhatsApp(contact.id, contact.receiveWhatsApp)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditContact(contact)}
                                className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                              <DialogHeader>
                                <DialogTitle className="text-[var(--neutral-text)]">Editar Contato</DialogTitle>
                                <DialogDescription className="text-[var(--neutral-text-muted)]">
                                  Altere as informações do contato
                                </DialogDescription>
                              </DialogHeader>
                              <ContactForm onSubmit={handleUpdateContact} submitLabel="Salvar Alterações" isEditMode={true} />
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[var(--danger-border)] text-[var(--danger-bg)] hover:bg-[var(--danger-bg)] hover:text-white hover:border-[var(--danger-bg)] dark:border-[var(--danger-border)] dark:text-[var(--danger-bg)] dark:hover:bg-[var(--danger-bg)] dark:hover:text-white dark:hover:border-[var(--danger-bg)]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-[var(--neutral-text)]">Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription className="text-[var(--neutral-text-muted)]">
                                  Tem certeza que deseja remover <span className="text-[var(--neutral-text)]">{contact.name}</span> da lista de contatos? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteContact(contact.id)}
                                  className="bg-[var(--danger-bg)] text-white hover:opacity-96 border-0"
                                >
                                  Confirmar Exclusão
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}