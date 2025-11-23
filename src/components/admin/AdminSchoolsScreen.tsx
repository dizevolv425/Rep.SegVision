import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Plus, Edit, Trash2, Building2, Users, Camera, DollarSign, MoreVertical, FileText, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { EmptyState } from '../EmptyState';
import { supabase } from '../../lib/supabase';

interface School {
  id: string;
  name: string;
  cnpj: string;
  plan: string;
  status: 'active' | 'suspended' | 'pending';
  cameras: number;
  users: number;
  monthlyValue: number;
  contractDate: string;
  contact: string;
  email: string;
}

interface AdminSchoolsScreenProps {
  isFirstAccess?: boolean;
}

// Helper functions to map between frontend and database formats
const mapPlanToDb = (plan: string): 'basic' | 'pro' | 'enterprise' => {
  const planMap: Record<string, 'basic' | 'pro' | 'enterprise'> = {
    'Standard': 'basic',
    'Premium': 'pro',
    'Enterprise': 'enterprise'
  };
  return planMap[plan] || 'basic';
};

const mapPlanFromDb = (plan: string): string => {
  const planMap: Record<string, string> = {
    'basic': 'Standard',
    'pro': 'Premium',
    'enterprise': 'Enterprise'
  };
  return planMap[plan] || 'Standard';
};

const mapStatusToDb = (status: string): 'active' | 'inactive' | 'pending' => {
  if (status === 'suspended') return 'inactive';
  return status as 'active' | 'inactive' | 'pending';
};

const mapStatusFromDb = (status: string): 'active' | 'suspended' | 'pending' => {
  if (status === 'inactive') return 'suspended';
  return status as 'active' | 'suspended' | 'pending';
};

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateCNPJ = (cnpj: string): boolean => {
  // Remove non-numeric characters
  const numbers = cnpj.replace(/\D/g, '');
  // Check if has 14 digits
  return numbers.length === 14;
};

const validateSchoolForm = (school: {
  name: string;
  cnpj: string;
  contact: string;
  email: string;
  cameras: number;
  users: number;
  monthlyValue: number;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!school.name || school.name.trim().length < 3) {
    errors.push('Nome da escola deve ter no mínimo 3 caracteres');
  }

  if (!school.cnpj || !validateCNPJ(school.cnpj)) {
    errors.push('CNPJ inválido (deve ter 14 dígitos)');
  }

  if (!school.contact || school.contact.trim().length < 3) {
    errors.push('Nome do responsável deve ter no mínimo 3 caracteres');
  }

  if (!school.email || !validateEmail(school.email)) {
    errors.push('E-mail inválido');
  }

  if (school.cameras < 0) {
    errors.push('Limite de câmeras deve ser maior ou igual a zero');
  }

  if (school.users < 0) {
    errors.push('Limite de usuários deve ser maior ou igual a zero');
  }

  if (school.monthlyValue < 0) {
    errors.push('Valor mensal deve ser maior ou igual a zero');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Get default values based on plan
const getDefaultValuesByPlan = (plan: string): { cameras: number; users: number; monthlyValue: number } => {
  const defaults: Record<string, { cameras: number; users: number; monthlyValue: number }> = {
    'Standard': { cameras: 10, users: 5, monthlyValue: 299 },
    'Premium': { cameras: 30, users: 15, monthlyValue: 599 },
    'Enterprise': { cameras: 100, users: 50, monthlyValue: 1499 }
  };

  return defaults[plan] || { cameras: 0, users: 0, monthlyValue: 0 };
};

export function AdminSchoolsScreen({ isFirstAccess = false }: AdminSchoolsScreenProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newSchool, setNewSchool] = useState({
    name: '',
    cnpj: '',
    plan: 'Standard',
    contact: '',
    email: '',
    cameras: 0,
    users: 0,
    monthlyValue: 0,
    status: 'active' as 'active' | 'suspended' | 'pending',
  });
  const [editSchool, setEditSchool] = useState({
    name: '',
    cnpj: '',
    plan: 'Standard',
    contact: '',
    email: '',
    cameras: 0,
    users: 0,
    monthlyValue: 0,
    status: 'active' as 'active' | 'suspended' | 'pending',
  });

  // Load schools from Supabase
  const loadSchools = async () => {
    try {
      setLoading(true);

      // Fetch schools with camera and user counts
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      if (schoolsError) throw schoolsError;

      // Fetch camera counts for each school
      const { data: cameraCounts, error: cameraError } = await supabase
        .from('cameras')
        .select('school_id');

      if (cameraError) throw cameraError;

      // Fetch user counts for each school
      const { data: userCounts, error: userError } = await supabase
        .from('users')
        .select('school_id');

      if (userError) throw userError;

      // Count cameras and users per school
      const cameraCountMap: Record<string, number> = {};
      (cameraCounts || []).forEach(cam => {
        if (cam.school_id) {
          cameraCountMap[cam.school_id] = (cameraCountMap[cam.school_id] || 0) + 1;
        }
      });

      const userCountMap: Record<string, number> = {};
      (userCounts || []).forEach(user => {
        if (user.school_id) {
          userCountMap[user.school_id] = (userCountMap[user.school_id] || 0) + 1;
        }
      });

      // Transform database schools to frontend format
      const transformedSchools: School[] = (schoolsData || []).map(school => {
        const plan = mapPlanFromDb(school.plan);
        const status = mapStatusFromDb(school.status);
        const camerasInUse = cameraCountMap[school.id] || 0;
        const usersInUse = userCountMap[school.id] || 0;

        return {
          id: school.id,
          name: school.name,
          cnpj: school.cnpj,
          plan,
          status,
          cameras: school.cameras_limit || 0,
          users: school.users_limit || 0,
          monthlyValue: school.monthly_value || 0,
          contractDate: new Date(school.created_at).toISOString().split('T')[0],
          contact: school.contact_name || '',
          email: school.contact_email || ''
        };
      });

      setSchools(transformedSchools);
    } catch (error) {
      console.error('Erro ao carregar escolas:', error);
      toast.error('Erro ao carregar escolas');
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  // Load schools on mount
  useEffect(() => {
    loadSchools();
  }, []);

  const filteredSchools = schools.filter(school => {
    const matchesSearch = (school.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (school.cnpj || '').includes(searchTerm) ||
                         (school.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || school.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddSchool = async () => {
    // Validate form
    const validation = validateSchoolForm(newSchool);
    if (!validation.valid) {
      toast.error(validation.errors[0]); // Show first error
      return;
    }

    try {
      const { error } = await supabase
        .from('schools')
        .insert({
          name: newSchool.name,
          cnpj: newSchool.cnpj,
          plan: mapPlanToDb(newSchool.plan),
          status: mapStatusToDb(newSchool.status),
          contact_name: newSchool.contact,
          contact_email: newSchool.email,
          cameras_limit: newSchool.cameras,
          users_limit: newSchool.users,
          monthly_value: newSchool.monthlyValue
        });

      if (error) throw error;

      await loadSchools();
      setIsAddDialogOpen(false);
      setNewSchool({
        name: '',
        cnpj: '',
        plan: 'Standard',
        contact: '',
        email: '',
        cameras: 0,
        users: 0,
        monthlyValue: 0,
        status: 'active' as 'active' | 'suspended' | 'pending',
      });
      toast.success('Escola adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar escola:', error);
      toast.error('Erro ao adicionar escola');
    }
  };

  const handleOpenEditDialog = (school: School) => {
    setSelectedSchool(school);
    setEditSchool({
      name: school.name,
      cnpj: school.cnpj,
      plan: school.plan,
      contact: school.contact,
      email: school.email,
      cameras: school.cameras,
      users: school.users,
      monthlyValue: school.monthlyValue,
      status: school.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSchool = async () => {
    if (!selectedSchool) return;

    // Validate form
    const validation = validateSchoolForm(editSchool);
    if (!validation.valid) {
      toast.error(validation.errors[0]); // Show first error
      return;
    }

    try {
      const { error } = await supabase
        .from('schools')
        .update({
          name: editSchool.name,
          cnpj: editSchool.cnpj,
          plan: mapPlanToDb(editSchool.plan),
          status: mapStatusToDb(editSchool.status),
          contact_name: editSchool.contact,
          contact_email: editSchool.email,
          cameras_limit: editSchool.cameras,
          users_limit: editSchool.users,
          monthly_value: editSchool.monthlyValue
        })
        .eq('id', selectedSchool.id);

      if (error) throw error;

      await loadSchools();
      setIsEditDialogOpen(false);
      setSelectedSchool(null);
      toast.success('Escola atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar escola:', error);
      toast.error('Erro ao atualizar escola');
    }
  };

  const handleOpenDeleteDialog = (school: School) => {
    setSchoolToDelete(school);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!schoolToDelete) return;

    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', schoolToDelete.id);

      if (error) throw error;

      await loadSchools();
      setIsDeleteDialogOpen(false);
      setSchoolToDelete(null);
      toast.success('Escola removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover escola:', error);
      toast.error('Erro ao remover escola');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { variant: 'medium' as const, tone: 'success' as const, label: 'Ativa' },
      suspended: { variant: 'heavy' as const, tone: 'danger' as const, label: 'Suspensa' },
      pending: { variant: 'medium' as const, tone: 'caution' as const, label: 'Pendente' }
    };
    const { variant, tone, label } = config[status as keyof typeof config];
    return <Badge variant={variant} tone={tone} size="s" className="px-[12px] py-[0px]">{label}</Badge>;
  };

  const getPlanBadge = (plan: string) => {
    const config = {
      Standard: { variant: 'light' as const, tone: 'neutral' as const },
      Premium: { variant: 'medium' as const, tone: 'info' as const },
      Enterprise: { variant: 'medium' as const, tone: 'primary' as const }
    };
    const { variant, tone } = config[plan as keyof typeof config];
    return <Badge variant={variant} tone={tone} size="s">{plan}</Badge>;
  };

  const totalRevenue = schools
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.monthlyValue, 0);

  // Show empty state for first access
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-[var(--neutral-text-muted)]">Carregando escolas...</p>
        </div>
      </div>
    );
  }

  if (isFirstAccess && schools.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]">
                <Plus className="h-4 w-4" />
                Adicionar Primeira Escola
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
              <DialogHeader>
                <DialogTitle className="text-[var(--neutral-text)]">Adicionar Nova Escola</DialogTitle>
                <DialogDescription className="text-[var(--neutral-text-muted)]">
                  Preencha os dados da escola que será adicionada ao sistema SegVision.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[var(--neutral-text)]">Nome da Escola</Label>
                    <Input
                      id="name"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                      placeholder="Ex: Colégio São Pedro"
                      className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj" className="text-[var(--neutral-text)]">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={newSchool.cnpj}
                      onChange={(e) => setNewSchool({ ...newSchool, cnpj: e.target.value })}
                      placeholder="00.000.000/0000-00"
                      className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-[var(--neutral-text)]">Responsável</Label>
                    <Input
                      id="contact"
                      value={newSchool.contact}
                      onChange={(e) => setNewSchool({ ...newSchool, contact: e.target.value })}
                      placeholder="Nome do responsável"
                      className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[var(--neutral-text)]">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newSchool.email}
                      onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                      placeholder="contato@escola.edu.br"
                      className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan" className="text-[var(--neutral-text)]">Plano</Label>
                  <Select
                    value={newSchool.plan}
                    onValueChange={(value) => {
                      const defaults = getDefaultValuesByPlan(value);
                      setNewSchool({
                        ...newSchool,
                        plan: value,
                        // Auto-preencher apenas se campos estiverem vazios (0)
                        cameras: newSchool.cameras === 0 ? defaults.cameras : newSchool.cameras,
                        users: newSchool.users === 0 ? defaults.users : newSchool.users,
                        monthlyValue: newSchool.monthlyValue === 0 ? defaults.monthlyValue : newSchool.monthlyValue
                      });
                    }}
                  >
                    <SelectTrigger className="border-[var(--neutral-border)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-[var(--neutral-text)]">Status</Label>
                  <Select value={newSchool.status} onValueChange={(value: 'active' | 'suspended' | 'pending') => setNewSchool({ ...newSchool, status: value })}>
                    <SelectTrigger className="border-[var(--neutral-border)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="suspended">Suspensa</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cameras" className="text-[var(--neutral-text)]">Câmeras</Label>
                    <Input
                      id="cameras"
                      type="number"
                      value={newSchool.cameras}
                      onChange={(e) => setNewSchool({ ...newSchool, cameras: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="users" className="text-[var(--neutral-text)]">Usuários</Label>
                    <Input
                      id="users"
                      type="number"
                      value={newSchool.users}
                      onChange={(e) => setNewSchool({ ...newSchool, users: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyValue" className="text-[var(--neutral-text)]">Valor Mensal (R$)</Label>
                    <Input
                      id="monthlyValue"
                      type="number"
                      value={newSchool.monthlyValue}
                      onChange={(e) => setNewSchool({ ...newSchool, monthlyValue: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddSchool}
                    className="bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
                  >
                    Adicionar Escola
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <EmptyState
          icon={Building2}
          title="Nenhuma escola cadastrada"
          description="Comece adicionando a primeira escola cliente ao sistema SegVision. Você poderá gerenciar câmeras, usuários e planos de cada escola."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ações */}
      <div className="flex items-center justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]">
              <Plus className="h-4 w-4" />
              Adicionar Escola
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
            <DialogHeader>
              <DialogTitle className="text-[var(--neutral-text)]">Adicionar Nova Escola</DialogTitle>
              <DialogDescription className="text-[var(--neutral-text-muted)]">
                Preencha os dados da escola que será adicionada ao sistema SegVision.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[var(--neutral-text)]">Nome da Escola</Label>
                  <Input
                    id="name"
                    value={newSchool.name}
                    onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                    placeholder="Ex: Colégio São Pedro"
                    className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="text-[var(--neutral-text)]">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={newSchool.cnpj}
                    onChange={(e) => setNewSchool({ ...newSchool, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                    className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-[var(--neutral-text)]">Responsável</Label>
                  <Input
                    id="contact"
                    value={newSchool.contact}
                    onChange={(e) => setNewSchool({ ...newSchool, contact: e.target.value })}
                    placeholder="Nome do responsável"
                    className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[var(--neutral-text)]">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSchool.email}
                    onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                    placeholder="contato@escola.edu.br"
                    className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan" className="text-[var(--neutral-text)]">Plano</Label>
                <Select value={newSchool.plan} onValueChange={(value) => setNewSchool({ ...newSchool, plan: value })}>
                  <SelectTrigger className="border-[var(--neutral-border)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[var(--neutral-text)]">Status</Label>
                <Select value={newSchool.status} onValueChange={(value: 'active' | 'suspended' | 'pending') => setNewSchool({ ...newSchool, status: value })}>
                  <SelectTrigger className="border-[var(--neutral-border)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="suspended">Suspensa</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cameras" className="text-[var(--neutral-text)]">Câmeras</Label>
                  <Input
                    id="cameras"
                    type="number"
                    value={newSchool.cameras}
                    onChange={(e) => setNewSchool({ ...newSchool, cameras: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="users" className="text-[var(--neutral-text)]">Usuários</Label>
                  <Input
                    id="users"
                    type="number"
                    value={newSchool.users}
                    onChange={(e) => setNewSchool({ ...newSchool, users: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyValue" className="text-[var(--neutral-text)]">Valor Mensal (R$)</Label>
                  <Input
                    id="monthlyValue"
                    type="number"
                    value={newSchool.monthlyValue}
                    onChange={(e) => setNewSchool({ ...newSchool, monthlyValue: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddSchool}
                  className="bg-[var(--primary-bg)] text-[var(--primary-text-on)] hover:bg-[var(--primary-bg-hover)]"
                >
                  Adicionar Escola
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[var(--neutral-border)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-[var(--neutral-text-muted)]">Total de Escolas</CardTitle>
            <Building2 className="h-4 w-4 text-[var(--neutral-icon)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[var(--neutral-text)]">{schools.length}</div>
            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">
              {schools.filter(s => s.status === 'active').length} ativas
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--neutral-border)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-[var(--neutral-text-muted)]">Câmeras Totais</CardTitle>
            <Camera className="h-4 w-4 text-[var(--neutral-icon)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[var(--neutral-text)]">
              {schools.reduce((sum, s) => sum + s.cameras, 0)}
            </div>
            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">Em todas as escolas</p>
          </CardContent>
        </Card>

        <Card className="border-[var(--neutral-border)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-[var(--neutral-text-muted)]">Usuários Totais</CardTitle>
            <Users className="h-4 w-4 text-[var(--neutral-icon)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[var(--neutral-text)]">
              {schools.reduce((sum, s) => sum + s.users, 0)}
            </div>
            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">Usuários ativos</p>
          </CardContent>
        </Card>

        <Card className="border-[var(--neutral-border)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-[var(--neutral-text-muted)]">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-[var(--neutral-icon)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-[var(--neutral-text)]">
              R$ {totalRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-[var(--neutral-text-muted)] mt-1">Escolas ativas</p>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <div className="space-y-3">
        {/* Search Section */}
        <div className="bg-[rgba(243,243,249,0)] rounded-xl p-3 border border-[var(--border)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--neutral-icon)]" />
            <Input
              placeholder="Buscar por nome, CNPJ ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[var(--neutral-border)] hover:border-[var(--gray-300)] text-[var(--neutral-text)]"
            />
          </div>
        </div>

        {/* Filters - FilterBar Pattern */}
        <div className="bg-[rgba(243,243,249,0)] rounded-xl p-3 border border-[var(--border)] flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px]">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="border-[var(--neutral-border)] hover:border-[var(--gray-300)]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="suspended">Suspensas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabela de Escolas */}
      <Card className="border-[var(--neutral-border)]">
        <CardContent className="pt-[16px] pr-[24px] pb-[24px] pl-[24px]">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[var(--neutral-border)]">
                  <TableHead className="text-[var(--neutral-text-muted)]">Escola</TableHead>
                  <TableHead className="text-[var(--neutral-text-muted)]">CNPJ</TableHead>
                  <TableHead className="text-[var(--neutral-text-muted)]">Plano</TableHead>
                  <TableHead className="text-[var(--neutral-text-muted)]">Status</TableHead>
                  <TableHead className="text-right text-[var(--neutral-text-muted)]">Câmeras</TableHead>
                  <TableHead className="text-right text-[var(--neutral-text-muted)]">Usuários</TableHead>
                  <TableHead className="text-right text-[var(--neutral-text-muted)]">Valor Mensal</TableHead>
                  <TableHead className="text-right text-[var(--neutral-text-muted)]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => (
                  <TableRow key={school.id} className="border-[var(--neutral-border)] hover:bg-[var(--table-row-hover)]">
                    <TableCell>
                      <div>
                        <div className="text-sm text-[var(--neutral-text)]">{school.name}</div>
                        <div className="text-xs text-[var(--neutral-text-muted)]">{school.contact}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[var(--neutral-text-muted)]">{school.cnpj}</TableCell>
                    <TableCell>{getPlanBadge(school.plan)}</TableCell>
                    <TableCell>{getStatusBadge(school.status)}</TableCell>
                    <TableCell className="text-right text-sm text-[var(--neutral-text)]">{school.cameras}</TableCell>
                    <TableCell className="text-right text-sm text-[var(--neutral-text)]">{school.users}</TableCell>
                    <TableCell className="text-right text-sm text-[var(--neutral-text)]">
                      R$ {school.monthlyValue.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-[var(--neutral-icon)] hover:bg-[var(--neutral-subtle)]">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
                          <DropdownMenuItem 
                            className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                            onClick={() => {
                              toast.success(`Baixando contrato de ${school.name}...`);
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Baixar PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                            onClick={() => handleOpenEditDialog(school)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-[var(--danger-bg)] hover:bg-[var(--neutral-subtle)]"
                            onClick={() => handleOpenDeleteDialog(school)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredSchools.length === 0 && (
            <EmptyState
              title="Nenhuma escola encontrada"
              description="Tente ajustar os filtros ou a pesquisa para encontrar a escola que está procurando."
            />
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição de Escola */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--neutral-text)]">Editar Escola</DialogTitle>
            <DialogDescription className="text-[var(--neutral-text-muted)]">
              Atualize as informações da escola conforme necessário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-[var(--neutral-text)]">Nome da Escola</Label>
                <Input
                  id="edit-name"
                  value={editSchool.name}
                  onChange={(e) => setEditSchool({ ...editSchool, name: e.target.value })}
                  placeholder="Ex: Colégio São Pedro"
                  className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cnpj" className="text-[var(--neutral-text)]">CNPJ</Label>
                <Input
                  id="edit-cnpj"
                  value={editSchool.cnpj}
                  onChange={(e) => setEditSchool({ ...editSchool, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                  className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contact" className="text-[var(--neutral-text)]">Responsável</Label>
                <Input
                  id="edit-contact"
                  value={editSchool.contact}
                  onChange={(e) => setEditSchool({ ...editSchool, contact: e.target.value })}
                  placeholder="Nome do responsável"
                  className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-[var(--neutral-text)]">E-mail</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editSchool.email}
                  onChange={(e) => setEditSchool({ ...editSchool, email: e.target.value })}
                  placeholder="contato@escola.edu.br"
                  className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-plan" className="text-[var(--neutral-text)]">Plano</Label>
                <Select
                  value={editSchool.plan}
                  onValueChange={(value) => {
                    const defaults = getDefaultValuesByPlan(value);
                    setEditSchool({
                      ...editSchool,
                      plan: value,
                      // Auto-preencher apenas se campos estiverem vazios (0)
                      cameras: editSchool.cameras === 0 ? defaults.cameras : editSchool.cameras,
                      users: editSchool.users === 0 ? defaults.users : editSchool.users,
                      monthlyValue: editSchool.monthlyValue === 0 ? defaults.monthlyValue : editSchool.monthlyValue
                    });
                  }}
                >
                  <SelectTrigger className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-[var(--neutral-text)]">Status</Label>
                <Select value={editSchool.status} onValueChange={(value: 'active' | 'suspended' | 'pending') => setEditSchool({ ...editSchool, status: value })}>
                  <SelectTrigger className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--neutral-border)]">
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="suspended">Suspensa</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cameras" className="text-[var(--neutral-text)]">Câmeras</Label>
                <Input
                  id="edit-cameras"
                  type="number"
                  value={editSchool.cameras}
                  onChange={(e) => setEditSchool({ ...editSchool, cameras: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-users" className="text-[var(--neutral-text)]">Usuários</Label>
                <Input
                  id="edit-users"
                  type="number"
                  value={editSchool.users}
                  onChange={(e) => setEditSchool({ ...editSchool, users: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-monthlyValue" className="text-[var(--neutral-text)]">Valor Mensal (R$)</Label>
                <Input
                  id="edit-monthlyValue"
                  type="number"
                  value={editSchool.monthlyValue}
                  onChange={(e) => setEditSchool({ ...editSchool, monthlyValue: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-text)]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdateSchool}
                className="bg-[var(--primary-bg)] text-white hover:opacity-96"
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[var(--neutral-bg)] border-[var(--neutral-border)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--neutral-text)]">
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--neutral-text-muted)]">
              Tem certeza que deseja remover a escola <span className="font-semibold text-[var(--neutral-text)]">{schoolToDelete?.name}</span>? 
              Esta ação não pode ser desfeita e todos os dados associados serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-[var(--danger-bg)] text-white hover:opacity-96"
            >
              Excluir Escola
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}