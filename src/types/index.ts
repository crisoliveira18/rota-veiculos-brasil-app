
export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  cnh: string;
  telefone: string;
  email: string;
  endereco: string;
  dataCadastro: string;
}

export interface Veiculo {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  km: number;
  status: 'disponivel' | 'ocupado' | 'manutencao';
  dataCadastro: string;
}

export interface Contrato {
  id: string;
  numero: string;
  clienteId: string;
  veiculoId: string;
  dataInicio: string;
  dataFim: string;
  valorSemanal: number;
  diaVencimento: number; // 0-6 (domingo-sábado)
  status: 'ativo' | 'vencido' | 'finalizado';
  observacoes?: string;
  dataCriacao: string;
}

export interface Pagamento {
  id: string;
  contratoId: string;
  valor: number;
  valorOriginal: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pago' | 'a_vencer' | 'vencido';
  tipoPagamento?: 'pix' | 'dinheiro' | 'transferencia';
  multa?: number;
  juros?: number;
}

export interface Multa {
  id: string;
  veiculoId?: string;
  contratoId?: string;
  clienteId: string;
  descricao: string;
  valor: number;
  dataOcorrencia: string;
  dataPagamento?: string;
  status: 'pendente' | 'pago';
}

export interface Imposto {
  id: string;
  veiculoId: string;
  tipo: 'ipva' | 'licenciamento' | 'dpvat';
  ano: number;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pendente' | 'pago';
}

export interface Manutencao {
  id: string;
  veiculoId: string;
  oficina: string;
  mecanico: string;
  endereco: string;
  telefone: string;
  orcamento: number;
  servicos: string;
  previsaoEntrega: string;
  status: 'agendado' | 'em_andamento' | 'concluido';
  dataAgendamento: string;
}

export interface ConfiguracaoMultaJuros {
  multaPercentual: number;
  jurosPercentualDiario: number;
}
