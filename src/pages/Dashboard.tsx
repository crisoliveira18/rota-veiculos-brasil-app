
import React, { useMemo } from 'react';
import { Activity, Calendar, Settings, FileText } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import SimpleChart from '../components/SimpleChart';
import { 
  veiculoService, 
  contratoService, 
  pagamentoService,
  configMultaJurosService 
} from '../services/storage';
import { updatePagamentoStatus } from '../utils/pagamentoUtils';
import { formatCurrency } from '../utils/dateUtils';

const Dashboard: React.FC = () => {
  const metrics = useMemo(() => {
    const veiculos = veiculoService.getAll();
    const contratos = contratoService.getAll();
    const pagamentos = pagamentoService.getAll();
    const config = configMultaJurosService.get();

    // Atualizar status dos pagamentos
    const pagamentosAtualizados = pagamentos.map(p => updatePagamentoStatus(p, config));

    const veiculosDisponiveis = veiculos.filter(v => v.status === 'disponivel').length;
    const contratosAtivos = contratos.filter(c => c.status === 'ativo').length;
    const pagamentosPendentes = pagamentosAtualizados.filter(p => p.status !== 'pago').length;
    const receitaMensal = pagamentosAtualizados
      .filter(p => p.status === 'pago' && new Date(p.dataPagamento!).getMonth() === new Date().getMonth())
      .reduce((total, p) => total + p.valor, 0);

    return {
      veiculosDisponiveis,
      contratosAtivos,
      pagamentosPendentes,
      receitaMensal
    };
  }, []);

  const chartData = [
    { name: 'Jan', value: Math.random() * 10000 },
    { name: 'Fev', value: Math.random() * 10000 },
    { name: 'Mar', value: Math.random() * 10000 },
    { name: 'Abr', value: Math.random() * 10000 },
    { name: 'Mai', value: Math.random() * 10000 },
    { name: 'Jun', value: metrics.receitaMensal }
  ];

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      
      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Veículos Disponíveis"
          value={metrics.veiculosDisponiveis}
          icon={<Settings size={24} />}
          color="green"
        />
        <MetricCard
          title="Contratos Ativos"
          value={metrics.contratosAtivos}
          icon={<FileText size={24} />}
          color="blue"
        />
        <MetricCard
          title="Pagamentos Pendentes"
          value={metrics.pagamentosPendentes}
          icon={<Calendar size={24} />}
          color="red"
        />
        <MetricCard
          title="Receita Mensal"
          value={formatCurrency(metrics.receitaMensal)}
          icon={<Activity size={24} />}
          color="green"
        />
      </div>

      {/* Gráfico */}
      <SimpleChart 
        data={chartData}
        title="Receita por Mês"
      />
    </div>
  );
};

export default Dashboard;
