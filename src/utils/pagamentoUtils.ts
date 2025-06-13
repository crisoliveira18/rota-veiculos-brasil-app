
import { Pagamento, ConfiguracaoMultaJuros } from '../types';
import { isDatePast, calculateDaysBetween } from './dateUtils';

export function updatePagamentoStatus(pagamento: Pagamento, config: ConfiguracaoMultaJuros): Pagamento {
  if (pagamento.dataPagamento) {
    pagamento.status = 'pago';
    return pagamento;
  }
  
  if (isDatePast(pagamento.dataVencimento)) {
    pagamento.status = 'vencido';
    
    // Calcular multa e juros
    const diasAtraso = calculateDaysBetween(pagamento.dataVencimento, new Date().toISOString().split('T')[0]);
    const multa = (pagamento.valorOriginal * config.multaPercentual) / 100;
    const juros = (pagamento.valorOriginal * config.jurosPercentualDiario * diasAtraso) / 100;
    
    pagamento.multa = multa;
    pagamento.juros = juros;
    pagamento.valor = pagamento.valorOriginal + multa + juros;
  } else {
    pagamento.status = 'a_vencer';
    pagamento.multa = 0;
    pagamento.juros = 0;
    pagamento.valor = pagamento.valorOriginal;
  }
  
  return pagamento;
}
