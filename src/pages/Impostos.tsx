
import React, { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import Card from '../components/Card';
import { Imposto, Veiculo } from '../types';
import { impostoService, veiculoService } from '../services/storage';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { formatDate, formatCurrency } from '../utils/dateUtils';

const Impostos: React.FC = () => {
  const [impostos, setImpostos] = useState<Imposto[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    veiculoId: '',
    tipo: 'ipva' as const,
    ano: new Date().getFullYear(),
    valor: 0,
    dataVencimento: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setImpostos(impostoService.getAll());
    setVeiculos(veiculoService.getAll());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const imposto: Imposto = {
      id: Date.now().toString(),
      veiculoId: formData.veiculoId,
      tipo: formData.tipo,
      ano: formData.ano,
      valor: formData.valor,
      dataVencimento: formData.dataVencimento,
      status: 'pendente'
    };

    impostoService.save(imposto);
    loadData();
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      veiculoId: '',
      tipo: 'ipva',
      ano: new Date().getFullYear(),
      valor: 0,
      dataVencimento: ''
    });
  };

  const marcarComoPago = (imposto: Imposto) => {
    const impostoAtualizado = {
      ...imposto,
      status: 'pago' as const,
      dataPagamento: new Date().toISOString().split('T')[0]
    };
    
    impostoService.save(impostoAtualizado);
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

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'ipva': return 'IPVA';
      case 'licenciamento': return 'Licenciamento';
      case 'dpvat': return 'DPVAT';
      default: return tipo;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Impostos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus size={20} className="mr-2" />
              Novo Imposto
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Novo Imposto</DialogTitle>
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
                <Label htmlFor="tipo">Tipo de Imposto</Label>
                <Select value={formData.tipo} onValueChange={(value: any) => setFormData({...formData, tipo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ipva">IPVA</SelectItem>
                    <SelectItem value="licenciamento">Taxa de Licenciamento</SelectItem>
                    <SelectItem value="dpvat">DPVAT</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                <Input
                  id="dataVencimento"
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
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

      {/* Lista de Impostos */}
      <div className="space-y-3">
        {impostos.map((imposto) => {
          const veiculo = veiculos.find(v => v.id === imposto.veiculoId);
          
          return (
            <Card key={imposto.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {getTipoText(imposto.tipo)} {imposto.ano}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Veículo: {veiculo?.marca} {veiculo?.modelo} - {veiculo?.placa}
                    </p>
                    <p className="text-sm text-gray-600">
                      Vencimento: {formatDate(imposto.dataVencimento)}
                    </p>
                    {imposto.dataPagamento && (
                      <p className="text-sm text-green-600">
                        Pago em: {formatDate(imposto.dataPagamento)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(imposto.valor)}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(imposto.status)}`}>
                      {getStatusText(imposto.status)}
                    </span>
                  </div>
                </div>
                
                {imposto.status === 'pendente' && (
                  <Button
                    onClick={() => marcarComoPago(imposto)}
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
        
        {impostos.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum imposto cadastrado</p>
              <p className="text-sm">Toque no botão "Novo Imposto" para começar</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Impostos;
