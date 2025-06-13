
import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import { Multa, Cliente, Veiculo, Contrato } from '../types';
import { 
  multaService, 
  clienteService, 
  veiculoService, 
  contratoService 
} from '../services/storage';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { formatDate, formatCurrency } from '../utils/dateUtils';

const Multas: React.FC = () => {
  const [multas, setMultas] = useState<Multa[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    clienteId: '',
    veiculoId: '',
    contratoId: '',
    descricao: '',
    valor: 0,
    dataOcorrencia: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMultas(multaService.getAll());
    setClientes(clienteService.getAll());
    setVeiculos(veiculoService.getAll());
    setContratos(contratoService.getAll());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const multa: Multa = {
      id: Date.now().toString(),
      clienteId: formData.clienteId,
      veiculoId: formData.veiculoId || undefined,
      contratoId: formData.contratoId || undefined,
      descricao: formData.descricao,
      valor: formData.valor,
      dataOcorrencia: formData.dataOcorrencia,
      status: 'pendente'
    };

    multaService.save(multa);
    loadData();
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      veiculoId: '',
      contratoId: '',
      descricao: '',
      valor: 0,
      dataOcorrencia: new Date().toISOString().split('T')[0]
    });
  };

  const marcarComoPago = (multa: Multa) => {
    const multaAtualizada = {
      ...multa,
      status: 'pago' as const,
      dataPagamento: new Date().toISOString().split('T')[0]
    };
    
    multaService.save(multaAtualizada);
    loadData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'text-green-600 bg-green-100';
      case 'pendente': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pago': return 'Pago';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  };

  const totalPendente = multas
    .filter(m => m.status === 'pendente')
    .reduce((total, m) => total + m.valor, 0);

  const totalPago = multas
    .filter(m => m.status === 'pago')
    .reduce((total, m) => total + m.valor, 0);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Multas</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus size={20} className="mr-2" />
              Nova Multa
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Nova Multa</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="clienteId">Cliente</Label>
                <Select value={formData.clienteId} onValueChange={(value) => setFormData({...formData, clienteId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="veiculoId">Veículo (Opcional)</Label>
                <Select value={formData.veiculoId} onValueChange={(value) => setFormData({...formData, veiculoId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum veículo</SelectItem>
                    {veiculos.map(veiculo => (
                      <SelectItem key={veiculo.id} value={veiculo.id}>
                        {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="contratoId">Contrato (Opcional)</Label>
                <Select value={formData.contratoId} onValueChange={(value) => setFormData({...formData, contratoId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum contrato</SelectItem>
                    {contratos.map(contrato => {
                      const cliente = clientes.find(c => c.id === contrato.clienteId);
                      return (
                        <SelectItem key={contrato.id} value={contrato.id}>
                          {cliente?.nome} - {contrato.numero}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Ex: Multa por velocidade, Danos no veículo..."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value)})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dataOcorrencia">Data da Ocorrência</Label>
                <Input
                  id="dataOcorrencia"
                  type="date"
                  value={formData.dataOcorrencia}
                  onChange={(e) => setFormData({...formData, dataOcorrencia: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Cadastrar
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

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Pendente</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(totalPendente)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Pago</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalPago)}</p>
          </div>
        </Card>
      </div>

      {/* Lista de Multas */}
      <div className="space-y-3">
        {multas.map((multa) => {
          const cliente = clientes.find(c => c.id === multa.clienteId);
          const veiculo = multa.veiculoId ? veiculos.find(v => v.id === multa.veiculoId) : null;
          const contrato = multa.contratoId ? contratos.find(c => c.id === multa.contratoId) : null;
          
          return (
            <Card key={multa.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {cliente?.nome || 'Cliente não encontrado'}
                    </h3>
                    <p className="text-sm text-gray-600">{multa.descricao}</p>
                    <p className="text-sm text-gray-600">
                      Data: {formatDate(multa.dataOcorrencia)}
                    </p>
                    {veiculo && (
                      <p className="text-sm text-gray-600">
                        Veículo: {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                      </p>
                    )}
                    {contrato && (
                      <p className="text-sm text-gray-600">
                        Contrato: {contrato.numero}
                      </p>
                    )}
                    {multa.dataPagamento && (
                      <p className="text-sm text-green-600">
                        Pago em: {formatDate(multa.dataPagamento)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(multa.valor)}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(multa.status)}`}>
                      {getStatusText(multa.status)}
                    </span>
                  </div>
                </div>
                
                {multa.status === 'pendente' && (
                  <Button
                    onClick={() => marcarComoPago(multa)}
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Marcar como Pago
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
        
        {multas.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <Trash2 size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma multa cadastrada</p>
              <p className="text-sm">Toque no botão "Nova Multa" para começar</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Multas;
