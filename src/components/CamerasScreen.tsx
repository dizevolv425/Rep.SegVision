import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Plus, Camera, Settings, Play, Pause, Eye, Users, Brain, Pencil, Info } from 'lucide-react';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { useAmbientes } from './AmbientesContext';
import { useIsMobile } from './ui/use-mobile';
import { EmptyState } from './EmptyState';
import { supabase } from '../lib/supabase';
import { useUserProfile } from './UserProfileContext';
import { toast } from 'sonner';

interface CameraData {
  id: string;
  name: string;
  location: string;
  locationId: string;
  rtsp: string;
  status: 'online' | 'offline';
  aiEnabled: boolean;
  facialRecognition: boolean;
  peopleCount: boolean;
  sensitivity: 'baixa' | 'media' | 'alta';
}

interface CamerasScreenProps {
  isFirstAccess?: boolean;
}

export function CamerasScreen({ isFirstAccess = false }: CamerasScreenProps) {
  const { getAllLocais } = useAmbientes();
  const { userProfile } = useUserProfile();
  const isMobile = useIsMobile();
  const [cameras, setCameras] = useState<CameraData[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<CameraData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<CameraData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newCamera, setNewCamera] = useState({
    name: '',
    locationId: '',
    rtsp: ''
  });

  const availableLocais = getAllLocais();

  // Load cameras from Supabase
  const loadCameras = async () => {
    if (!userProfile?.school_id) {
      setCameras([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cameras')
        .select('*')
        .eq('school_id', userProfile.school_id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform data to match CameraData interface
      const transformedCameras: CameraData[] = (data || []).map(cam => {
        const local = availableLocais.find(l => l.id === cam.location_id);
        return {
          id: cam.id,
          name: cam.name,
          location: local?.fullName || '',
          locationId: cam.location_id || '',
          rtsp: cam.rtsp_url,
          status: cam.status,
          aiEnabled: cam.ai_enabled,
          facialRecognition: cam.facial_recognition,
          peopleCount: cam.people_count,
          sensitivity: cam.sensitivity
        };
      });

      setCameras(transformedCameras);
    } catch (error) {
      console.error('Erro ao carregar câmeras:', error);
      toast.error('Erro ao carregar câmeras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.school_id) {
      loadCameras();
    }
  }, [userProfile?.school_id, availableLocais.length]);

  const handleAddCamera = async () => {
    if (!newCamera.name || !newCamera.locationId || !newCamera.rtsp || !userProfile?.school_id) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      const { error } = await supabase
        .from('cameras')
        .insert({
          school_id: userProfile.school_id,
          location_id: newCamera.locationId,
          name: newCamera.name,
          rtsp_url: newCamera.rtsp,
          status: 'online',
          ai_enabled: false,
          facial_recognition: false,
          people_count: false,
          sensitivity: 'media'
        });

      if (error) throw error;

      await loadCameras();
      setNewCamera({ name: '', locationId: '', rtsp: '' });
      setIsAddModalOpen(false);
      toast.success('Câmera adicionada com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar câmera:', error);
      toast.error('Erro ao adicionar câmera');
    }
  };

  const handleEditCamera = async () => {
    if (!editingCamera || !editingCamera.name || !editingCamera.locationId || !editingCamera.rtsp) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      const { error } = await supabase
        .from('cameras')
        .update({
          name: editingCamera.name,
          location_id: editingCamera.locationId,
          rtsp_url: editingCamera.rtsp
        })
        .eq('id', editingCamera.id);

      if (error) throw error;

      await loadCameras();
      setEditingCamera(null);
      setIsEditModalOpen(false);
      toast.success('Câmera atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar câmera:', error);
      toast.error('Erro ao atualizar câmera');
    }
  };

  const openEditModal = (camera: CameraData, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditingCamera({...camera});
    setIsEditModalOpen(true);
  };

  const toggleCameraFeature = async (cameraId: string, feature: keyof CameraData) => {
    const camera = cameras.find(c => c.id === cameraId);
    if (!camera) return;

    // Map frontend field names to database field names
    const fieldMap: Record<string, string> = {
      aiEnabled: 'ai_enabled',
      facialRecognition: 'facial_recognition',
      peopleCount: 'people_count'
    };

    const dbField = fieldMap[feature] || feature;
    const newValue = !camera[feature];

    try {
      const { error } = await supabase
        .from('cameras')
        .update({ [dbField]: newValue })
        .eq('id', cameraId);

      if (error) throw error;

      setCameras(cameras.map(cam =>
        cam.id === cameraId ? { ...cam, [feature]: newValue } : cam
      ));

      if (selectedCamera && selectedCamera.id === cameraId) {
        setSelectedCamera({ ...selectedCamera, [feature]: newValue });
      }

      toast.success('Configuração atualizada');
    } catch (error) {
      console.error('Erro ao atualizar câmera:', error);
      toast.error('Erro ao atualizar configuração');
    }
  };

  const updateCameraSensitivity = async (cameraId: string, sensitivity: 'baixa' | 'media' | 'alta') => {
    try {
      const { error } = await supabase
        .from('cameras')
        .update({ sensitivity })
        .eq('id', cameraId);

      if (error) throw error;

      setCameras(cameras.map(camera =>
        camera.id === cameraId ? { ...camera, sensitivity } : camera
      ));

      if (selectedCamera && selectedCamera.id === cameraId) {
        setSelectedCamera({ ...selectedCamera, sensitivity });
      }

      toast.success('Sensibilidade atualizada');
    } catch (error) {
      console.error('Erro ao atualizar sensibilidade:', error);
      toast.error('Erro ao atualizar sensibilidade');
    }
  };

  if (selectedCamera) {
    // Parse location to get area and sub-location
    const [area, subLocation] = selectedCamera.location.split(' → ');
    
    return (
      <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCamera(null);
                      }}
                    >
                      Câmeras
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{area}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCamera(null)}
              >
                Voltar para câmeras
              </Button>
            </div>
            <h1 className="text-[var(--neutral-text)] text-[20px]">{area} — {subLocation}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live View */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Visualização ao Vivo</CardTitle>
                    <Badge variant="heavy" tone={selectedCamera.status === 'online' ? 'success' : 'danger'} size="s">
                      {selectedCamera.status === 'online' ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-[var(--black-200)] rounded-md flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera size={48} className="mx-auto mb-2" />
                      <p>Transmissão ao vivo</p>
                      <p className="text-sm opacity-75">{selectedCamera.rtsp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Controles de IA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* IA Ativada - Switch Principal */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain size={16} />
                      <span className="text-sm">IA Ativada</span>
                    </div>
                    <Switch
                      checked={selectedCamera.aiEnabled}
                      onCheckedChange={() => toggleCameraFeature(selectedCamera.id, 'aiEnabled')}
                      className="data-[state=checked]:bg-[var(--blue-primary-200)]"
                    />
                  </div>

                  {/* Reconhecimento Facial - Switch com Tooltip */}
                  <TooltipProvider>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye size={16} className={!selectedCamera.aiEnabled ? 'text-[var(--neutral-icon)]' : ''} />
                        <span className={`text-sm ${!selectedCamera.aiEnabled ? 'text-[var(--neutral-text-muted)]' : ''}`}>
                          Reconhecimento Facial
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={14} className="text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">
                              Ativar esta análise aumenta o consumo do Custo Operacional (IA) da sua assinatura.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Switch
                        checked={selectedCamera.facialRecognition}
                        onCheckedChange={() => toggleCameraFeature(selectedCamera.id, 'facialRecognition')}
                        disabled={!selectedCamera.aiEnabled}
                        className="data-[state=checked]:bg-[var(--blue-primary-200)]"
                      />
                    </div>
                  </TooltipProvider>

                  {/* Contagem de Pessoas - Switch com Tooltip */}
                  <TooltipProvider>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users size={16} className={!selectedCamera.aiEnabled ? 'text-gray-400' : ''} />
                        <span className={`text-sm ${!selectedCamera.aiEnabled ? 'text-gray-400' : ''}`}>
                          Contagem de Pessoas
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={14} className="text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">
                              Ativar esta análise aumenta o consumo do Custo Operacional (IA) da sua assinatura.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Switch
                        checked={selectedCamera.peopleCount}
                        onCheckedChange={() => toggleCameraFeature(selectedCamera.id, 'peopleCount')}
                        disabled={!selectedCamera.aiEnabled}
                        className="data-[state=checked]:bg-[var(--blue-primary-200)]"
                      />
                    </div>
                  </TooltipProvider>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600">Nome</Label>
                    <p className="text-sm">{selectedCamera.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Localização</Label>
                    <p className="text-sm">{selectedCamera.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Endereço RTSP</Label>
                    <p className="text-sm font-mono text-xs break-all">{selectedCamera.rtsp}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-[var(--neutral-border)] dark:border-[var(--white-100)] dark:hover:border-[var(--blue-primary-200)] dark:active:border-[var(--blue-primary-200)]"
                    onClick={(e) => openEditModal(selectedCamera, e)}
                  >
                    <Pencil size={14} className="mr-2" />
                    Editar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

        {/* Modal de Edição de Câmera */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Câmera</DialogTitle>
              <DialogDescription>
                Atualize as informações da câmera
              </DialogDescription>
            </DialogHeader>
            {editingCamera && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-camera-name">Nome da Câmera</Label>
                  <Input
                    id="edit-camera-name"
                    value={editingCamera.name}
                    onChange={(e) => setEditingCamera({...editingCamera, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-camera-rtsp">Endereço RTSP</Label>
                  <Input
                    id="edit-camera-rtsp"
                    value={editingCamera.rtsp}
                    onChange={(e) => setEditingCamera({...editingCamera, rtsp: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-camera-location">Localização</Label>
                  <Select 
                    value={editingCamera.locationId} 
                    onValueChange={(value) => setEditingCamera({...editingCamera, locationId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocais.map((local) => (
                        <SelectItem key={local.id} value={local.id}>
                          {local.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleEditCamera} className="flex-1">
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Show empty state for first access
  if (isFirstAccess && cameras.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Adicionar Câmera
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Câmera</DialogTitle>
                <DialogDescription>
                  Configure uma nova câmera para o sistema de monitoramento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="camera-name">Nome da Câmera</Label>
                  <Input
                    id="camera-name"
                    placeholder="Ex: Entrada Principal"
                    value={newCamera.name}
                    onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="camera-rtsp">Endereço RTSP</Label>
                  <Input
                    id="camera-rtsp"
                    placeholder="rtsp://192.168.1.100:554/stream1"
                    value={newCamera.rtsp}
                    onChange={(e) => setNewCamera({...newCamera, rtsp: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="camera-location">Localização</Label>
                  <Select onValueChange={(value) => setNewCamera({...newCamera, locationId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a localização" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocais.map((local) => (
                        <SelectItem key={local.id} value={local.id}>
                          {local.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleAddCamera} className="flex-1">
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <EmptyState
          icon={Camera}
          title="Nenhuma câmera cadastrada"
          description="Adicione suas primeiras câmeras para começar o monitoramento inteligente com IA. Configure reconhecimento facial, contagem de pessoas e detecção de anomalias."
          actionLabel="Adicionar Primeira Câmera"
          onAction={() => setIsAddModalOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isMobile && (
        <div className="flex items-center justify-end">
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Adicionar Câmera
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Câmera</DialogTitle>
                <DialogDescription>
                  Configure uma nova câmera para o sistema de monitoramento
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="camera-name">Nome da Câmera</Label>
                  <Input
                    id="camera-name"
                    placeholder="Ex: Entrada Principal"
                    value={newCamera.name}
                    onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="camera-rtsp">Endereço RTSP</Label>
                  <Input
                    id="camera-rtsp"
                    placeholder="rtsp://192.168.1.100:554/stream1"
                    value={newCamera.rtsp}
                    onChange={(e) => setNewCamera({...newCamera, rtsp: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="camera-location">Localização</Label>
                  <Select onValueChange={(value) => setNewCamera({...newCamera, locationId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a localização" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLocais.map((local) => (
                        <SelectItem key={local.id} value={local.id}>
                          {local.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleAddCamera} className="flex-1">
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Modal de Edição de Câmera */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Câmera</DialogTitle>
            <DialogDescription>
              Atualize as informações da câmera
            </DialogDescription>
          </DialogHeader>
          {editingCamera && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-camera-name">Nome da Câmera</Label>
                <Input
                  id="edit-camera-name"
                  value={editingCamera.name}
                  onChange={(e) => setEditingCamera({...editingCamera, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-camera-rtsp">Endereço RTSP</Label>
                <Input
                  id="edit-camera-rtsp"
                  value={editingCamera.rtsp}
                  onChange={(e) => setEditingCamera({...editingCamera, rtsp: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-camera-location">Localização</Label>
                <Select 
                  value={editingCamera.locationId} 
                  onValueChange={(value) => setEditingCamera({...editingCamera, locationId: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLocais.map((local) => (
                      <SelectItem key={local.id} value={local.id}>
                        {local.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleEditCamera} className="flex-1">
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <Card 
            key={camera.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedCamera(camera)}
          >
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-900 rounded-md flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <Camera size={32} className="mx-auto mb-1" />
                  <p className="text-xs">Preview ao vivo</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm text-[var(--neutral-text)]">{camera.name}</h3>
                  <Badge variant="heavy" tone={camera.status === 'online' ? 'success' : 'danger'} size="s">
                    {camera.status === 'online' ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                
                <p className="text-xs text-[var(--neutral-text-muted)]">{camera.location}</p>
                
                <div className="flex items-center gap-2 text-xs">
                  {camera.aiEnabled && <Badge variant="light" tone="primary" size="s">IA</Badge>}
                  {camera.facialRecognition && <Badge variant="light" tone="primary" size="s">RF</Badge>}
                  {camera.peopleCount && <Badge variant="light" tone="primary" size="s">CP</Badge>}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCamera(camera);
                  }}
                >
                  <Settings size={14} className="mr-1" />
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}