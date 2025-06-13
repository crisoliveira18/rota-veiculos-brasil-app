
import { Contrato, Pagamento } from '../types';
import { addWeeks } from './dateUtils';

export function generateNumeroContrato(contratos: Contrato[]): string {
  const count = contratos.length + 1;
  return count.toString().padStart(3, '0');
}

export function generateNomeContrato(nomeCliente: string, numero: string): string {
  return `${nomeCliente} - ${numero}`;
}

export function generatePagamentosContrato(contrato: Contrato): Pagamento[] {
  const pagamentos: Pagamento[] = [];
  const dataInicio = new Date(contrato.dataInicio);
  const dataFim = new Date(contrato.dataFim);
  
  // Ajustar para o primeiro dia de vencimento
  const primeiroPagamento = new Date(dataInicio);
  const diasParaVencimento = (contrato.diaVencimento - dataInicio.getDay() + 7) % 7;
  primeiroPagamento.setDate(primeiroPagamento.getDate() + diasParaVencimento);
  
  let currentDate = new Date(primeiroPagamento);
  let contador = 1;
  
  while (currentDate <= dataFim) {
    const pagamento: Pagamento = {
      id: `${contrato.id}_${contador}`,
      contratoId: contrato.id,
      valor: contrato.valorSemanal,
      valorOriginal: contrato.valorSemanal,
      dataVencimento: currentDate.toISOString().split('T')[0],
      status: 'a_vencer'
    };
    
    pagamentos.push(pagamento);
    currentDate = addWeeks(currentDate, 1);
    contador++;
  }
  
  return pagamentos;
}
