import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import { useAmbientes, type Espaco, type Local } from './AmbientesContext';
import { EmptyState } from './EmptyState';

interface AmbientesScreenProps {
  isFirstAccess?: boolean;
}

export function AmbientesScreen({ isFirstAccess = false }: AmbientesScreenProps) {
  const { espacos, setEspacos } = useAmbientes();
  const [isAddEspacoModalOpen, setIsAddEspacoModalOpen] = useState(false);
  const [isAddLocalModalOpen, setIsAddLocalModalOpen] = useState(false);
  const [isEditEspacoModalOpen, setIsEditEspacoModalOpen] = useState(false);
  const [isEditLocalModalOpen, setIsEditLocalModalOpen] = useState(false);
  const [selectedEspaco, setSelectedEspaco] = useState<Espaco | null>(null);
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);
  const [deleteEspacoId, setDeleteEspacoId] = useState<string | null>(null);
  const [deleteLocalId, setDeleteLocalId] = useState<string | null>(null);
  
  const [newEspaco, setNewEspaco] = useState({
    name: '',
    description: ''
  });

  const [newLocal, setNewLocal] = useState({
    name: '',
    description: '',
    espacoId: ''
  });

  const handleAddEspaco = () => {
    if (newEspaco.name) {
      const espaco: Espaco = {
        id: Date.now().toString(),
        name: newEspaco.name,
        description: newEspaco.description,
        locais: []
      };
      
      setEspacos([...espacos, espaco]);
      setNewEspaco({ name: '', description: '' });
      setIsAddEspacoModalOpen(false);
    }
  };

  const handleAddLocal = () => {
    if (newLocal.name && newLocal.espacoId) {
      const local: Local = {
        id: Date.now().toString(),
        name: newLocal.name,
        description: newLocal.description,
        espacoId: newLocal.espacoId
      };
      
      setEspacos(espacos.map(espaco => 
        espaco.id === newLocal.espacoId 
          ? { ...espaco, locais: [...espaco.locais, local] }
          : espaco
      ));
      setNewLocal({ name: '', description: '', espacoId: '' });
      setIsAddLocalModalOpen(false);
    }
  };

  const handleEditEspaco = () => {
    if (selectedEspaco && newEspaco.name) {
      setEspacos(espacos.map(espaco => 
        espaco.id === selectedEspaco.id 
          ? { ...espaco, name: newEspaco.name, description: newEspaco.description }
          : espaco
      ));
      setNewEspaco({ name: '', description: '' });
      setSelectedEspaco(null);
      setIsEditEspacoModalOpen(false);
    }
  };

  const handleEditLocal = () => {
    if (selectedLocal && newLocal.name) {
      setEspacos(espacos.map(espaco => ({
        ...espaco,
        locais: espaco.locais.map(local => 
          local.id === selectedLocal.id 
            ? { ...local, name: newLocal.name, description: newLocal.description }
            : local
        )
      })));
      setNewLocal({ name: '', description: '', espacoId: '' });
      setSelectedLocal(null);
      setIsEditLocalModalOpen(false);
    }
  };

  const handleDeleteEspaco = () => {
    if (deleteEspacoId) {
      setEspacos(espacos.filter(espaco => espaco.id !== deleteEspacoId));
      setDeleteEspacoId(null);
    }
  };

  const handleDeleteLocal = () => {
    if (deleteLocalId) {
      setEspacos(espacos.map(espaco => ({
        ...espaco,
        locais: espaco.locais.filter(local => local.id !== deleteLocalId)
      })));
      setDeleteLocalId(null);
    }
  };

  const openEditEspaco = (espaco: Espaco) => {
    setSelectedEspaco(espaco);
    setNewEspaco({
      name: espaco.name,
      description: espaco.description || ''
    });
    setIsEditEspacoModalOpen(true);
  };

  const openEditLocal = (local: Local) => {
    setSelectedLocal(local);
    setNewLocal({
      name: local.name,
      description: local.description || '',
      espacoId: local.espacoId
    });
    setIsEditLocalModalOpen(true);
  };

  // Show empty state for first access
  if (isFirstAccess && espacos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Dialog open={isAddEspacoModalOpen} onOpenChange={setIsAddEspacoModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Adicionar Espaço
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Espaço</DialogTitle>
                <DialogDescription>
                  Configure um novo espaço para organizar os locais da escola
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="espaco-name">Nome do Espaço</Label>
                  <Input
                    id="espaco-name"
                    placeholder="Ex: Entrada Principal, Pátio, Corredor"
                    value={newEspaco.name}
                    onChange={(e) => setNewEspaco({...newEspaco, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="espaco-description">Descrição (opcional)</Label>
                  <Input
                    id="espaco-description"
                    placeholder="Descrição do espaço"
                    value={newEspaco.description}
                    onChange={(e) => setNewEspaco({...newEspaco, description: e.target.value})}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddEspacoModalOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleAddEspaco} className="flex-1">
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <EmptyState
          icon={MapPin}
          title="Nenhum ambiente cadastrado"
          description="Organize sua escola em espaços e locais. Isso facilita a identificação das câmeras e a análise dos alertas por região."
          actionLabel="Adicionar Primeiro Espaço"
          onAction={() => setIsAddEspacoModalOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Dialog open={isAddEspacoModalOpen} onOpenChange={setIsAddEspacoModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Adicionar Espaço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Espaço</DialogTitle>
              <DialogDescription>
                Configure um novo espaço para organizar os locais da escola
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="espaco-name">Nome do Espaço</Label>
                <Input
                  id="espaco-name"
                  placeholder="Ex: Entrada Principal, Pátio, Corredor"
                  value={newEspaco.name}
                  onChange={(e) => setNewEspaco({...newEspaco, name: e.target.value})} className="text-[14px] mx-[0px] my-[8px]"
                />
              </div>
              <div>
                <Label htmlFor="espaco-description">Descrição (opcional)</Label>
                <Input
                  id="espaco-description"
                  placeholder="Descrição do espaço"
                  value={newEspaco.description}
                  onChange={(e) => setNewEspaco({...newEspaco, description: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddEspacoModalOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleAddEspaco} className="flex-1">
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Add Local Modal */}
      <Dialog open={isAddLocalModalOpen} onOpenChange={setIsAddLocalModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Local</DialogTitle>
            <DialogDescription>
              Configure um novo local dentro deste espaço
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="px-[0px] py-[6px]">
              <Label htmlFor="local-name">Nome do Local</Label>
              <Input
                id="local-name"
                placeholder="Ex: Portão 1, Quadra, Bloco A"
                value={newLocal.name}
                onChange={(e) => setNewLocal({...newLocal, name: e.target.value})} className="rounded-[8px] text-[14px]"
              />
            </div>
            <div>
              <Label htmlFor="local-description">Descrição (opcional)</Label>
              <Input
                id="local-description"
                placeholder="Descrição do local"
                value={newLocal.description}
                onChange={(e) => setNewLocal({...newLocal, description: e.target.value})}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddLocalModalOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleAddLocal} className="flex-1">
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Espaco Modal */}
      <Dialog open={isEditEspacoModalOpen} onOpenChange={setIsEditEspacoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Espaço</DialogTitle>
            <DialogDescription>
              Atualize as informações do espaço
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-espaco-name">Nome do Espaço</Label>
              <Input
                id="edit-espaco-name"
                value={newEspaco.name}
                onChange={(e) => setNewEspaco({...newEspaco, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-espaco-description">Descrição (opcional)</Label>
              <Input
                id="edit-espaco-description"
                value={newEspaco.description}
                onChange={(e) => setNewEspaco({...newEspaco, description: e.target.value})}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditEspacoModalOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleEditEspaco} className="flex-1">
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Local Modal */}
      <Dialog open={isEditLocalModalOpen} onOpenChange={setIsEditLocalModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Local</DialogTitle>
            <DialogDescription>
              Atualize as informações do local
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-local-name">Nome do Local</Label>
              <Input
                id="edit-local-name"
                value={newLocal.name}
                onChange={(e) => setNewLocal({...newLocal, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-local-description">Descrição (opcional)</Label>
              <Input
                id="edit-local-description"
                value={newLocal.description}
                onChange={(e) => setNewLocal({...newLocal, description: e.target.value})}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditLocalModalOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleEditLocal} className="flex-1">
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Espaco Confirmation */}
      <AlertDialog open={!!deleteEspacoId} onOpenChange={() => setDeleteEspacoId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente excluir este espaço?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os locais vinculados a este espaço também serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEspaco}
              className="bg-[var(--red-alert-300)] text-white hover:opacity-96"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Local Confirmation */}
      <AlertDialog open={!!deleteLocalId} onOpenChange={() => setDeleteLocalId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente excluir este local?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLocal}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Espacos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {espacos.map((espaco) => (
          <Card key={espaco.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <CardTitle className="text-base">{espaco.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditEspaco(espaco)}
                    className="border-[var(--neutral-border)] dark:border-[var(--white-100)] dark:hover:border-[var(--blue-primary-200)] dark:active:border-[var(--blue-primary-200)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteEspacoId(espaco.id)}
                    className="border-[var(--danger-border)] text-[var(--danger-bg)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger-text-on)] hover:border-[var(--danger-bg)] dark:border-[var(--danger-border)] dark:text-[var(--danger-bg)] dark:hover:bg-[var(--danger-bg)] dark:hover:text-white dark:hover:border-[var(--danger-bg)]"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              {espaco.description && (
                <p className="text-sm text-[var(--neutral-text-muted)]">{espaco.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm text-[var(--neutral-text)] text-[14px] font-bold">Locais Vinculados</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="light" tone="neutral" size="s" className="text-[rgb(39,39,39)] font-bold text-[rgb(96,96,96)]">
                      {espaco.locais.length}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewLocal({ name: '', description: '', espacoId: espaco.id });
                        setIsAddLocalModalOpen(true);
                      }}
                      className="flex items-center gap-1 h-7 px-2 border-[var(--neutral-border)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                    >
                      <Plus size={14} />
                      <span className="text-xs">Adicionar</span>
                    </Button>
                  </div>
                </div>
                
                {espaco.locais.length > 0 ? (
                  <div className="space-y-2">
                    {espaco.locais.map((local) => (
                      <div key={local.id} className="flex items-center justify-between p-2 bg-[var(--card-inner-bg)] rounded-md">
                        <div>
                          <p className="text-sm text-[var(--neutral-text)]">{local.name}</p>
                          {local.description && (
                            <p className="text-xs text-[var(--neutral-text-muted)]">{local.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditLocal(local)}
                            className="border-[var(--neutral-border)] dark:border-[var(--white-100)] dark:hover:border-[var(--blue-primary-200)] dark:active:border-[var(--blue-primary-200)] text-[var(--neutral-text)] hover:bg-[var(--neutral-subtle)]"
                          >
                            <Edit size={12} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteLocalId(local.id)}
                            className="border-[var(--danger-border)] text-[var(--danger-bg)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger-text-on)] hover:border-[var(--danger-bg)] dark:border-[var(--danger-border)] dark:text-[var(--danger-bg)] dark:hover:bg-[var(--danger-bg)] dark:hover:text-white dark:hover:border-[var(--danger-bg)]"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--neutral-text-muted)] italic">Nenhum local cadastrado</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}