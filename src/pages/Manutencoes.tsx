import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Calendar, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { storageService } from '@/services/storage';
import { Manutencao, Veiculo } from '@/types';

const Manutencoes: React.FC = () => {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingManutencao, setEditingManutencao] = useState<Manutencao | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    veiculoId: '',
    tipo: '',
    descricao: '',
    oficina: '',
    mecanico: '',
    endereco: '',
    telefone: '',
    orcamento: '',
    dataAgendamento: '',
    previsaoEntrega: '',
    status: 'agendado' as const
  });

  useEffect(() => {
    loadManutencoes();
    loadVeiculos();
  }, []);

  const loadManutencoes = () => {
    const data = storageService.getManutencoes();
    setManutencoes(data);
  };

  const loadVeiculos = () => {
    const data = storageService.getVeiculos();
    setVeiculos(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const manutencaoData: Omit<Manutencao, 'id'> = {
      veiculoId: formData.veiculoId,
      tipo: formData.tipo,
      descricao: formData.descricao,
      oficina: formData.oficina,
      mecanico: formData.mecanico,
      endereco: formData.endereco,
      telefone: formData.telefone,
      orcamento: parseFloat(formData.orcamento) || 0,
      dataAgendamento: new Date(formData.dataAgendamento),
      previsaoEntrega: new Date(formData.previsaoEntrega),
      status: formData.status
    };

    if (editingManutencao) {
      storageService.updateManutencao(editingManutencao.id, manutencaoData);
    } else {
      storageService.addManutencao(manutencaoData);
    }

    loadManutencoes();
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (manutencao: Manutencao) => {
    setEditingManutencao(manutencao);
    setFormData({
      veiculoId: manutencao.veiculoId,
      tipo: manutencao.tipo,
      descricao: manutencao.descricao,
      oficina: manutencao.oficina,
      mecanico: manutencao.mecanico,
      endereco: manutencao.endereco,
      telefone: manutencao.telefone,
      orcamento: manutencao.orcamento.toString(),
      dataAgendamento: manutencao.dataAgendamento.toISOString().split('T')[0],
      previsaoEntrega: manutencao.previsaoEntrega.toISOString().split('T')[0],
      status: manutencao.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta manutenção?')) {
      storageService.deleteManutencao(id);
      loadManutencoes();
    }
  };

  const resetForm = () => {
    setFormData({
      veiculoId: '',
      tipo: '',
      descricao: '',
      oficina: '',
      mecanico: '',
      endereco: '',
      telefone: '',
      orcamento: '',
      dataAgendamento: '',
      previsaoEntrega: '',
      status: 'agendado'
    });
    setEditingManutencao(null);
  };

  const getVeiculoInfo = (veiculoId: string) => {
    const veiculo = veiculos.find(v => v.id === veiculoId);
    return veiculo ? `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}` : 'Veículo não encontrado';
  };

  const filteredManutencoes = manutencoes.filter(manutencao =>
    manutencao.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manutencao.oficina.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getVeiculoInfo(manutencao.veiculoId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Manutencao['status']) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Manutencao['status']) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'em_andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manutenções</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Manutenção
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingManutencao ? 'Editar Manutenção' : 'Nova Manutenção'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="veiculoId">Veículo</Label>
                <Select
                  value={formData.veiculoId}
                  onValueChange={(value) => setFormData({...formData, veiculoId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {veiculos.map((veiculo) => (
                      <SelectItem key={veiculo.id} value={veiculo.id}>
                        {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipo">Tipo de Manutenção</Label>
                <Input
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  placeholder="Ex: Troca de óleo, Revisão, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Detalhes sobre a manutenção..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="oficina">Oficina</Label>
                  <Input
                    id="oficina"
                    value={formData.oficina}
                    onChange={(e) => setFormData({...formData, oficina: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mecanico">Mecânico</Label>
                  <Input
                    id="mecanico"
                    value={formData.mecanico}
                    onChange={(e) => setFormData({...formData, mecanico: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="orcamento">Orçamento (R$)</Label>
                  <Input
                    id="orcamento"
                    type="number"
                    step="0.01"
                    value={formData.orcamento}
                    onChange={(e) => setFormData({...formData, orcamento: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataAgendamento">Data de Agendamento</Label>
                  <Input
                    id="dataAgendamento"
                    type="date"
                    value={formData.dataAgendamento}
                    onChange={(e) => setFormData({...formData, dataAgendamento: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="previsaoEntrega">Previsão de Entrega</Label>
                  <Input
                    id="previsaoEntrega"
                    type="date"
                    value={formData.previsaoEntrega}
                    onChange={(e) => setFormData({...formData, previsaoEntrega: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'agendado' | 'em_andamento' | 'concluido') => 
                    setFormData({...formData, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingManutencao ? 'Atualizar' : 'Cadastrar'}
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
            placeholder="Buscar por tipo, oficina ou veículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredManutencoes.map((manutencao) => (
          <div key={manutencao.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  {manutencao.tipo}
                </h3>
                <p className="text-gray-600">Veículo: {getVeiculoInfo(manutencao.veiculoId)}</p>
                <p className="text-gray-600">Oficina: {manutencao.oficina}</p>
                {manutencao.mecanico && (
                  <p className="text-gray-600">Mecânico: {manutencao.mecanico}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm text-gray-600">
                      {manutencao.dataAgendamento.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Entrega: {manutencao.previsaoEntrega.toLocaleDateString('pt-BR')}
                  </div>
                </div>
                {manutencao.orcamento > 0 && (
                  <p className="text-lg font-semibold text-green-600 mt-2">
                    R$ {manutencao.orcamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(manutencao)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(manutencao.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(manutencao.status)}`}>
                {getStatusLabel(manutencao.status)}
              </span>
            </div>
            {manutencao.descricao && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-700">{manutencao.descricao}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredManutencoes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma manutenção encontrada</p>
        </div>
      )}
    </div>
  );
};

export default Manutencoes;
