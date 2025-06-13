
import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, Clock } from 'lucide-react';
import Card from '../components/Card';
import { Pagamento, Contrato, Cliente } from '../types';
import { 
  pagamentoService, 
  contratoService, 
  clienteService,
  configMultaJurosService 
} from '../services/storage';
import { updatePagamentoStatus } from '../utils/pagamentoUtils';
import { formatDate, formatCurrency } from '../utils/dateUtils';

const Pagamentos: React.FC = () => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'pago' | 'a_vencer' | 'vencido'>('todos');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const pagamentosRaw = pagamentoService.getAll();
    const config = configMultaJurosService.get();
    
    // Atualizar status dos pagamentos
    const pagamentosAtualizados = pagamentosRaw.map(p => {
      const updated = updatePagamentoStatus(p, config);
      pagamentoService.save(updated);
      return updated;
    });
    
    setPagamentos(pagamentosAtualizados);
    setContratos(contratoService.getAll());
    setClientes(clienteService.getAll());
  };

  const filteredPagamentos = pagamentos.filter(pagamento => {
    if (filtro === 'todos') return true;
    return pagamento.status === filtro;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago': return <Check size={20} className="text-green-600" />;
      case 'a_vencer': return <Clock size={20} className="text-blue-600" />;
      case 'vencido': return <X size={20} className="text-red-600" />;
      default: return <Calendar size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'text-green-600 bg-green-100';
      case 'a_vencer': return 'text-blue-600 bg-blue-100';
      case 'vencido': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pago': return 'Pago';
      case 'a_vencer': return 'A Vencer';
      case 'vencido': return 'Vencido';
      default: return status;
    }
  };

  const totalPagos = pagamentos
    .filter(p => p.status === 'pago')
    .reduce((total, p) => total + p.valor, 0);

  const totalPendente = pagamentos
    .filter(p => p.status !== 'pago')
    .reduce((total, p) => total + p.valor, 0);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Pagamentos</h2>
      
      {/* Resumo Financeiro */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Recebido</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalPagos)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Pendente</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(totalPendente)}</p>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'pago', label: 'Pagos' },
          { key: 'a_vencer', label: 'A Vencer' },
          { key: 'vencido', label: 'Vencidos' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              filtro === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista de Pagamentos */}
      <div className="space-y-3">
        {filteredPagamentos.map((pagamento) => {
          const contrato = contratos.find(c => c.id === pagamento.contratoId);
          const cliente = clientes.find(c => c.id === contrato?.clienteId);
          
          return (
            <Card key={pagamento.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(pagamento.status)}
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">
                      {cliente?.nome || 'Cliente não encontrado'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Contrato: {contrato?.numero}
                    </p>
                    <p className="text-sm text-gray-600">
                      Vencimento: {formatDate(pagamento.dataVencimento)}
                    </p>
                    {pagamento.dataPagamento && (
                      <p className="text-sm text-green-600">
                        Pago em: {formatDate(pagamento.dataPagamento)}
                      </p>
                    )}
                    {pagamento.multa && pagamento.multa > 0 && (
                      <p className="text-sm text-red-600">
                        Multa/Juros: {formatCurrency(pagamento.multa + (pagamento.juros || 0))}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(pagamento.valor)}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pagamento.status)}`}>
                    {getStatusText(pagamento.status)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
        
        {filteredPagamentos.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum pagamento encontrado</p>
              <p className="text-sm">
                {filtro === 'todos' 
                  ? 'Crie contratos para gerar pagamentos'
                  : `Nenhum pagamento com status "${getStatusText(filtro)}"`
                }
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Pagamentos;
