
import { 
  Cliente, 
  Veiculo, 
  Contrato, 
  Pagamento, 
  Multa, 
  Imposto, 
  Manutencao,
  ConfiguracaoMultaJuros 
} from '../types';

const STORAGE_KEYS = {
  CLIENTES: 'nova_rota_clientes',
  VEICULOS: 'nova_rota_veiculos',
  CONTRATOS: 'nova_rota_contratos',
  PAGAMENTOS: 'nova_rota_pagamentos',
  MULTAS: 'nova_rota_multas',
  IMPOSTOS: 'nova_rota_impostos',
  MANUTENCOES: 'nova_rota_manutencoes',
  CONFIG_MULTA_JUROS: 'nova_rota_config_multa_juros'
};

// Generic storage functions
function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Clientes
export const clienteService = {
  getAll: (): Cliente[] => loadFromStorage<Cliente>(STORAGE_KEYS.CLIENTES),
  save: (cliente: Cliente): void => {
    const clientes = clienteService.getAll();
    const index = clientes.findIndex(c => c.id === cliente.id);
    if (index >= 0) {
      clientes[index] = cliente;
    } else {
      clientes.push(cliente);
    }
    saveToStorage(STORAGE_KEYS.CLIENTES, clientes);
  },
  delete: (id: string): void => {
    const clientes = clienteService.getAll().filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CLIENTES, clientes);
  },
  getById: (id: string): Cliente | undefined => {
    return clienteService.getAll().find(c => c.id === id);
  }
};

// Veículos
export const veiculoService = {
  getAll: (): Veiculo[] => loadFromStorage<Veiculo>(STORAGE_KEYS.VEICULOS),
  save: (veiculo: Veiculo): void => {
    const veiculos = veiculoService.getAll();
    const index = veiculos.findIndex(v => v.id === veiculo.id);
    if (index >= 0) {
      veiculos[index] = veiculo;
    } else {
      veiculos.push(veiculo);
    }
    saveToStorage(STORAGE_KEYS.VEICULOS, veiculos);
  },
  delete: (id: string): void => {
    const veiculos = veiculoService.getAll().filter(v => v.id !== id);
    saveToStorage(STORAGE_KEYS.VEICULOS, veiculos);
  },
  getById: (id: string): Veiculo | undefined => {
    return veiculoService.getAll().find(v => v.id === id);
  }
};

// Contratos
export const contratoService = {
  getAll: (): Contrato[] => loadFromStorage<Contrato>(STORAGE_KEYS.CONTRATOS),
  save: (contrato: Contrato): void => {
    const contratos = contratoService.getAll();
    const index = contratos.findIndex(c => c.id === contrato.id);
    if (index >= 0) {
      contratos[index] = contrato;
    } else {
      contratos.push(contrato);
    }
    saveToStorage(STORAGE_KEYS.CONTRATOS, contratos);
  },
  delete: (id: string): void => {
    const contratos = contratoService.getAll().filter(c => c.id !== id);
    saveToStorage(STORAGE_KEYS.CONTRATOS, contratos);
  },
  getById: (id: string): Contrato | undefined => {
    return contratoService.getAll().find(c => c.id === id);
  }
};

// Pagamentos
export const pagamentoService = {
  getAll: (): Pagamento[] => loadFromStorage<Pagamento>(STORAGE_KEYS.PAGAMENTOS),
  save: (pagamento: Pagamento): void => {
    const pagamentos = pagamentoService.getAll();
    const index = pagamentos.findIndex(p => p.id === pagamento.id);
    if (index >= 0) {
      pagamentos[index] = pagamento;
    } else {
      pagamentos.push(pagamento);
    }
    saveToStorage(STORAGE_KEYS.PAGAMENTOS, pagamentos);
  },
  delete: (id: string): void => {
    const pagamentos = pagamentoService.getAll().filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.PAGAMENTOS, pagamentos);
  },
  getByContratoId: (contratoId: string): Pagamento[] => {
    return pagamentoService.getAll().filter(p => p.contratoId === contratoId);
  }
};

// Multas
export const multaService = {
  getAll: (): Multa[] => loadFromStorage<Multa>(STORAGE_KEYS.MULTAS),
  save: (multa: Multa): void => {
    const multas = multaService.getAll();
    const index = multas.findIndex(m => m.id === multa.id);
    if (index >= 0) {
      multas[index] = multa;
    } else {
      multas.push(multa);
    }
    saveToStorage(STORAGE_KEYS.MULTAS, multas);
  },
  delete: (id: string): void => {
    const multas = multaService.getAll().filter(m => m.id !== id);
    saveToStorage(STORAGE_KEYS.MULTAS, multas);
  }
};

// Impostos
export const impostoService = {
  getAll: (): Imposto[] => loadFromStorage<Imposto>(STORAGE_KEYS.IMPOSTOS),
  save: (imposto: Imposto): void => {
    const impostos = impostoService.getAll();
    const index = impostos.findIndex(i => i.id === imposto.id);
    if (index >= 0) {
      impostos[index] = imposto;
    } else {
      impostos.push(imposto);
    }
    saveToStorage(STORAGE_KEYS.IMPOSTOS, impostos);
  },
  delete: (id: string): void => {
    const impostos = impostoService.getAll().filter(i => i.id !== id);
    saveToStorage(STORAGE_KEYS.IMPOSTOS, impostos);
  }
};

// Manutenções
export const manutencaoService = {
  getAll: (): Manutencao[] => loadFromStorage<Manutencao>(STORAGE_KEYS.MANUTENCOES),
  save: (manutencao: Manutencao): void => {
    const manutencoes = manutencaoService.getAll();
    const index = manutencoes.findIndex(m => m.id === manutencao.id);
    if (index >= 0) {
      manutencoes[index] = manutencao;
    } else {
      manutencoes.push(manutencao);
    }
    saveToStorage(STORAGE_KEYS.MANUTENCOES, manutencoes);
  },
  delete: (id: string): void => {
    const manutencoes = manutencaoService.getAll().filter(m => m.id !== id);
    saveToStorage(STORAGE_KEYS.MANUTENCOES, manutencoes);
  }
};

// Configuração Multa e Juros
export const configMultaJurosService = {
  get: (): ConfiguracaoMultaJuros => {
    const config = localStorage.getItem(STORAGE_KEYS.CONFIG_MULTA_JUROS);
    return config ? JSON.parse(config) : { multaPercentual: 10, jurosPercentualDiario: 1 };
  },
  save: (config: ConfiguracaoMultaJuros): void => {
    localStorage.setItem(STORAGE_KEYS.CONFIG_MULTA_JUROS, JSON.stringify(config));
  }
};
