import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { storageService } from '@/services/storage';
import { Veiculo } from '@/types';

const Veiculos: React.FC = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState<Veiculo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    placa: '',
    km: '',
    status: 'disponivel' as const
  });

  useEffect(() => {
    loadVeiculos();
  }, []);

  const loadVeiculos = () => {
    const data = storageService.getVeiculos();
    setVeiculos(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const veiculoData: Omit<Veiculo, 'id'> = {
      marca: formData.marca,
      modelo: formData.modelo,
      ano: parseInt(formData.ano),
      placa: formData.placa,
      km: parseInt(formData.km),
      status: formData.status,
      manutencoes: [],
      multas: []
    };

    if (editingVeiculo) {
      storageService.updateVeiculo(editingVeiculo.id, veiculoData);
    } else {
      storageService.addVeiculo(veiculoData);
    }

    loadVeiculos();
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (veiculo: Veiculo) => {
    setEditingVeiculo(veiculo);
    setFormData({
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      ano: veiculo.ano.toString(),
      placa: veiculo.placa,
      km: veiculo.km.toString(),
      status: veiculo.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      storageService.deleteVeiculo(id);
      loadVeiculos();
    }
  };

  const resetForm = () => {
    setFormData({
      marca: '',
      modelo: '',
      ano: '',
      placa: '',
      km: '',
      status: 'disponivel'
    });
    setEditingVeiculo(null);
  };

  const filteredVeiculos = veiculos.filter(veiculo =>
    veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Veiculo['status']) => {
    switch (status) {
      case 'disponivel': return 'bg-green-100 text-green-800';
      case 'ocupado': return 'bg-red-100 text-red-800';
      case 'manutencao': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Veiculo['status']) => {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'ocupado': return 'Ocupado';
      case 'manutencao': return 'Manutenção';
      default: return status;
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Veículos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent>
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
                  onChange={(e) => setFormData({...formData, ano: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  value={formData.placa}
                  onChange={(e) => setFormData({...formData, placa: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="km">Quilometragem</Label>
                <Input
                  id="km"
                  type="number"
                  value={formData.km}
                  onChange={(e) => setFormData({...formData, km: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'disponivel' | 'ocupado' | 'manutencao') => 
                    setFormData({...formData, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="ocupado">Ocupado</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingVeiculo ? 'Atualizar' : 'Cadastrar'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por marca, modelo ou placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredVeiculos.map((veiculo) => (
          <div key={veiculo.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {veiculo.marca} {veiculo.modelo}
                </h3>
                <p className="text-gray-600">Placa: {veiculo.placa}</p>
                <p className="text-gray-600">Ano: {veiculo.ano}</p>
                <p className="text-gray-600">KM: {veiculo.km.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(veiculo)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(veiculo.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(veiculo.status)}`}>
                {getStatusLabel(veiculo.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredVeiculos.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum veículo encontrado</p>
        </div>
      )}
    </div>
  );
};

export default Veiculos;
