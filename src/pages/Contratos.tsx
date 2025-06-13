
import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar } from 'lucide-react';
import Card from '../components/Card';
import { Contrato, Cliente, Veiculo, Pagamento } from '../types';
import { 
  contratoService, 
  clienteService, 
  veiculoService, 
  pagamentoService,
  configMultaJurosService 
} from '../services/storage';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { generateNumeroContrato, generateNomeContrato, generatePagamentosContrato } from '../utils/contratoUtils';
import { updatePagamentoStatus } from '../utils/pagamentoUtils';
import { formatDate, formatCurrency, getDayOfWeek } from '../utils/dateUtils';

const Contratos: React.FC = () => {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const [pagamentosContrato, setPagamentosContrato] = useState<Pagamento[]>([]);
  
  const [formData, setFormData] = useState({
    clienteId: '',
    veiculoId: '',
    dataInicio: '',
    dataFim: '',
    valorSemanal: 0,
    diaVencimento: 1,
    observacoes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setContratos(contratoService.getAll());
    setClientes(clienteService.getAll());
    setVeiculos(veiculoService.getAll().filter(v => v.status === 'disponivel'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cliente = clientes.find(c => c.id === formData.clienteId);
    if (!cliente) return;

    const numero = generateNumeroContrato(contratos);
    const contrato: Contrato = {
      id: Date.now().toString(),
      numero,
      clienteId: formData.clienteId,
      veiculoId: formData.veiculoId,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim,
      valorSemanal: formData.valorSemanal,
      diaVencimento: formData.diaVencimento,
      status: 'ativo',
      observacoes: formData.observacoes,
      dataCriacao: new Date().toISOString()
    };

    contratoService.save(contrato);
    
    // Gerar pagamentos do contrato
    const pagamentos = generatePagamentosContrato(contrato);
    pagamentos.forEach(pagamento => pagamentoService.save(pagamento));
    
    // Atualizar status do veículo
    const veiculo = veiculoService.getById(formData.veiculoId);
    if (veiculo) {
      veiculo.status = 'ocupado';
      veiculoService.save(veiculo);
    }
    
    loadData();
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      veiculoId: '',
      dataInicio: '',
      dataFim: '',
      valorSemanal: 0,
      diaVencimento: 1,
      observacoes: ''
    });
  };

  const showPaymentSchedule = (contrato: Contrato) => {
    const pagamentos = pagamentoService.getByContratoId(contrato.id);
    const config = configMultaJurosService.get();
    const pagamentosAtualizados = pagamentos.map(p => updatePagamentoStatus(p, config));
    
    setPagamentosContrato(pagamentosAtualizados);
    setSelectedContrato(contrato);
    setIsPaymentDialogOpen(true);
  };

  const registrarPagamento = (pagamento: Pagamento) => {
    const pagamentoAtualizado = {
      ...pagamento,
      dataPagamento: new Date().toISOString().split('T')[0],
      status: 'pago' as const,
      tipoPagamento: 'pix' as const
    };
    
    pagamentoService.save(pagamentoAtualizado);
    
    // Recarregar pagamentos
    const pagamentos = pagamentoService.getByContratoId(selectedContrato!.id);
    const config = configMultaJurosService.get();
    const pagamentosAtualizados = pagamentos.map(p => updatePagamentoStatus(p, config));
    setPagamentosContrato(pagamentosAtualizados);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'text-green-600 bg-green-100';
      case 'vencido': return 'text-red-600 bg-red-100';
      case 'finalizado': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'text-green-600 bg-green-100';
      case 'a_vencer': return 'text-blue-600 bg-blue-100';
      case 'vencido': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Contratos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus size={20} className="mr-2" />
              Novo Contrato
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Contrato</DialogTitle>
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
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dataFim">Data de Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={formData.dataFim}
                  onChange={(e) => setFormData({...formData, dataFim: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="valorSemanal">Valor Semanal (R$)</Label>
                <Input
                  id="valorSemanal"
                  type="number"
                  step="0.01"
                  value={formData.valorSemanal}
                  onChange={(e) => setFormData({...formData, valorSemanal: parseFloat(e.target.value)})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="diaVencimento">Dia de Vencimento</Label>
                <Select 
                  value={formData.diaVencimento.toString()} 
                  onValueChange={(value) => setFormData({...formData, diaVencimento: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3,4,5,6].map(day => (
                      <SelectItem key={day} value={day.toString()}>
                        {getDayOfWeek(day)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Criar Contrato
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
        {contratos.map((contrato) => {
          const cliente = clientes.find(c => c.id === contrato.clienteId);
          const veiculo = veiculos.find(v => v.id === contrato.veiculoId) || 
                         veiculoService.getById(contrato.veiculoId);
          
          return (
            <Card key={contrato.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {generateNomeContrato(cliente?.nome || 'Cliente não encontrado', contrato.numero)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Veículo: {veiculo?.marca} {veiculo?.modelo} - {veiculo?.placa}
                    </p>
                    <p className="text-sm text-gray-600">
                      Período: {formatDate(contrato.dataInicio)} até {formatDate(contrato.dataFim)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Valor: {formatCurrency(contrato.valorSemanal)}/semana
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contrato.status)}`}>
                      {contrato.status.charAt(0).toUpperCase() + contrato.status.slice(1)}
                    </span>
                    <FileText size={20} className="text-gray-400 mt-2" />
                  </div>
                </div>
                
                {contrato.status === 'ativo' && (
                  <Button 
                    onClick={() => showPaymentSchedule(contrato)}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Calendar size={16} className="mr-2" />
                    Ver Cronograma de Pagamentos
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
        
        {contratos.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum contrato cadastrado</p>
              <p className="text-sm">Toque no botão "Novo Contrato" para começar</p>
            </div>
          </Card>
        )}
      </div>

      {/* Dialog de Cronograma de Pagamentos */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Cronograma de Pagamentos
            </DialogTitle>
            {selectedContrato && (
              <p className="text-sm text-gray-600">
                {generateNomeContrato(
                  clientes.find(c => c.id === selectedContrato.clienteId)?.nome || '', 
                  selectedContrato.numero
                )}
              </p>
            )}
          </DialogHeader>
          
          <div className="space-y-3">
            {pagamentosContrato.map((pagamento) => (
              <div key={pagamento.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{formatDate(pagamento.dataVencimento)}</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(pagamento.valor)}
                      {pagamento.multa && pagamento.multa > 0 && (
                        <span className="text-red-600">
                          {' '}(+{formatCurrency(pagamento.multa + (pagamento.juros || 0))} multa/juros)
                        </span>
                      )}
                    </p>
                    {pagamento.dataPagamento && (
                      <p className="text-sm text-green-600">
                        Pago em: {formatDate(pagamento.dataPagamento)}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(pagamento.status)}`}>
                    {pagamento.status === 'pago' ? 'Pago' : pagamento.status === 'a_vencer' ? 'A Vencer' : 'Vencido'}
                  </span>
                </div>
                
                {pagamento.status !== 'pago' && (
                  <Button
                    onClick={() => registrarPagamento(pagamento)}
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Registrar Pagamento
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => setIsPaymentDialogOpen(false)}
            variant="outline"
            className="w-full"
          >
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contratos;
