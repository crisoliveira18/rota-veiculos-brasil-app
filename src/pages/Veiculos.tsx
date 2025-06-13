
import React, { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import Card from '../components/Card';
import { Veiculo } from '../types';
import { veiculoService } from '../services/storage';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

const Veiculos: React.FC = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState<Veiculo | null>(null);
  
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    placa: '',
    km: 0,
    status: 'disponivel' as const
  });

  useEffect(() => {
    loadVeiculos();
  }, []);

  const loadVeiculos = () => {
    setVeiculos(veiculoService.getAll());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const veiculo: Veiculo = {
      id: editingVeiculo?.id || Date.now().toString(),
      ...formData,
      dataCadastro: editingVeiculo?.dataCadastro || new Date().toISOString()
    };

    veiculoService.save(veiculo);
    loadVeiculos();
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      marca: '',
      modelo: '',
      ano: new Date().getFullYear(),
      placa: '',
      km: 0,
      status: 'disponivel'
    });
    setEditingVeiculo(null);
  };

  const handleEdit = (veiculo: Veiculo) => {
    setEditingVeiculo(veiculo);
    setFormData({
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      ano: veiculo.ano,
      placa: veiculo.placa,
      km: veiculo.km,
      status: veiculo.status
    });
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'text-green-600 bg-green-100';
      case 'ocupado': return 'text-blue-600 bg-blue-100';
      case 'manutencao': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'ocupado': return 'Ocupado';
      case 'manutencao': return 'Manutenção';
      default: return status;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Veículos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus size={20} className="mr-2" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVeiculo ? 'Editar Veículo' : 'Novo Veículo'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => setFormData({...formData, marca: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  value={formData.modelo}
                  onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  type="number"
                  value={formData.ano}
                  onChange={(e) => setFormData({...formData, ano: parseInt(e.target.value)})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  value={formData.placa}
                  onChange={(e) => setFormData({...formData, placa: e.target.value.toUpperCase()})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="km">Quilometragem</Label>
                <Input
                  id="km"
                  type="number"
                  value={formData.km}
                  onChange={(e) => setFormData({...formData, km: parseInt(e.target.value)})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: any) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="ocupado">Ocupado</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {editingVeiculo ? 'Atualizar' : 'Cadastrar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {veiculos.map((veiculo) => (
          <Card key={veiculo.id} onClick={() => handleEdit(veiculo)}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {veiculo.marca} {veiculo.modelo}
                </h3>
                <p className="text-sm text-gray-600">Ano: {veiculo.ano}</p>
                <p className="text-sm text-gray-600">Placa: {veiculo.placa}</p>
                <p className="text-sm text-gray-600">KM: {veiculo.km.toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(veiculo.status)}`}>
                  {getStatusText(veiculo.status)}
                </span>
                <Settings size={20} className="text-gray-400 mt-2" />
              </div>
            </div>
          </Card>
        ))}
        
        {veiculos.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <Settings size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum veículo cadastrado</p>
              <p className="text-sm">Toque no botão "Novo Veículo" para começar</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Veiculos;
