
import React, { useState, useEffect } from 'react';
import { Plus, Settings } from 'lucide-react';
import Card from '../components/Card';
import { Manutencao, Veiculo } from '../types';
import { manutencaoService, veiculoService } from '../services/storage';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { formatDate, formatCurrency } from '../utils/dateUtils';

const Manutencoes: React.FC = () => {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingManutencao, setEditingManutencao] = useState<Manutencao | null>(null);
  
  const [formData, setFormData] = useState({
    veiculoId: '',
    oficina: '',
    mecanico: '',
    endereco: '',
    telefone: '',
    orcamento: 0,
    servicos: '',
    previsaoEntrega: '',
    status: 'agendado' as const
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setManutencoes(manutencaoService.getAll());
    setVeiculos(veiculoService.getAll());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const manutencao: Manutencao = {
      id: editingManutencao?.id || Date.now().toString(),
      veiculoId: formData.veiculoId,
      oficina: formData.oficina,
      mecanico: formData.mecanico,
      endereco: formData.endereco,
      telefone: formData.telefone,
      orcamento: formData.orcamento,
      servicos: formData.servicos,
      previsaoEntrega: formData.previsaoEntrega,
      status: formData.status,
      dataAgendamento: editingManutencao?.dataAgendamento || new Date().toISOString()
    };

    manutencaoService.save(manutencao);
    
    // Se a manutenção está em andamento, atualizar status do veículo
    if (manutencao.status === 'em_andamento') {
      const veiculo = veiculoService.getById(manutencao.veiculoId);
      if (veiculo && veiculo.status !== 'ocupado') {
        veiculo.status = 'manutencao';
        veiculoService.save(veiculo);
      }
    }
    
    // Se a manutenção foi concluída, liberar o veículo
    if (manutencao.status === 'concluido') {
      const veiculo = veiculoService.getById(manutencao.veiculoId);
      if (veiculo && veiculo.status === 'manutencao') {
        veiculo.status = 'disponivel';
        veiculoService.save(veiculo);
      }
    }
    
    loadData();
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      veiculoId: '',
      oficina: '',
      mecanico: '',
      endereco: '',
      telefone: '',
      orcamento: 0,
      servicos: '',
      previsaoEntrega: '',
      status: 'agendado'
    });
    setEditingManutencao(null);
  };

  const handleEdit = (manutencao: Manutencao) => {
    setEditingManutencao(manutencao);
    setFormData({
      veiculoId: manutencao.veiculoId,
      oficina: manutencao.oficina,
      mecanico: manutencao.mecanico,
      endereco: manutencao.endereco,
      telefone: manutencao.telefone,
      orcamento: manutencao.orcamento,
      servicos: manutencao.servicos,
      previsaoEntrega: manutencao.previsaoEntrega,
      status: manutencao.status
    });
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'text-blue-600 bg-blue-100';
      case 'em_andamento': return 'text-yellow-600 bg-yellow-100';
      case 'concluido': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'em_andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manutenções</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus size={20} className="mr-2" />
              Nova Manutenção
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingManutencao ? 'Editar Manutenção' : 'Nova Manutenção'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="veiculoId">Veículo</Label>
                <Select value={formData.veiculoId} onValueChange={(value) => setFormData({...formData, veiculoId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {veiculos.map(veiculo => (
                      <SelectItem key={veiculo.id} value={veiculo.id}>
                        {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="orcamento">Orçamento (R$)</Label>
                <Input
                  id="orcamento"
                  type="number"
                  step="0.01"
                  value={formData.orcamento}
                  onChange={(e) => setFormData({...formData, orcamento: parseFloat(e.target.value)})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="servicos">Serviços</Label>
                <Input
                  id="servicos"
                  value={formData.servicos}
                  onChange={(e) => setFormData({...formData, servicos: e.target.value})}
                  placeholder="Ex: Troca de óleo, revisão geral..."
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
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {editingManutencao ? 'Atualizar' : 'Agendar'}
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

      {/* Lista de Manutenções */}
      <div className="space-y-3">
        {manutencoes.map((manutencao) => {
          const veiculo = veiculos.find(v => v.id === manutencao.veiculoId);
          
          return (
            <Card key={manutencao.id} onClick={() => handleEdit(manutencao)}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {veiculo?.marca} {veiculo?.modelo} - {veiculo?.placa}
                  </h3>
                  <p className="text-sm text-gray-600">Oficina: {manutencao.oficina}</p>
                  <p className="text-sm text-gray-600">Mecânico: {manutencao.mecanico}</p>
                  <p className="text-sm text-gray-600">Serviços: {manutencao.servicos}</p>
                  <p className="text-sm text-gray-600">
                    Previsão: {formatDate(manutencao.previsaoEntrega)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Orçamento: {formatCurrency(manutencao.orcamento)}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(manutencao.status)}`}>
                    {getStatusText(manutencao.status)}
                  </span>
                  <Settings size={20} className="text-gray-400 mt-2" />
                </div>
              </div>
            </Card>
          );
        })}
        
        {manutencoes.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <Settings size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma manutenção agendada</p>
              <p className="text-sm">Toque no botão "Nova Manutenção" para começar</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Manutencoes;
