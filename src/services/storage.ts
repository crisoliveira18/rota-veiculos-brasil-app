
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

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Serviços individuais mantidos para compatibilidade
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

export const manutencaoService = {
  getAll: (): Manutencao[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MANUTENCOES);
    if (!data) return [];
    const manutencoes = JSON.parse(data);
    return manutencoes.map((m: any) => ({
      ...m,
      dataAgendamento: new Date(m.dataAgendamento),
      previsaoEntrega: new Date(m.previsaoEntrega)
    }));
  },
  save: (manutencao: Manutencao): void => {
    const manutencoes = manutencaoService.getAll();
    const index = manutencoes.findIndex(m => m.id === manutencao.id);
    if (index >= 0) {
      manutencoes[index] = manutencao;
    } else {
      manutencoes.push(manutencao);
    }
    localStorage.setItem(STORAGE_KEYS.MANUTENCOES, JSON.stringify(manutencoes));
  },
  delete: (id: string): void => {
    const manutencoes = manutencaoService.getAll().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MANUTENCOES, JSON.stringify(manutencoes));
  }
};

export const configMultaJurosService = {
  get: (): ConfiguracaoMultaJuros => {
    const config = localStorage.getItem(STORAGE_KEYS.CONFIG_MULTA_JUROS);
    return config ? JSON.parse(config) : { multaPercentual: 10, jurosPercentualDiario: 1 };
  },
  save: (config: ConfiguracaoMultaJuros): void => {
    localStorage.setItem(STORAGE_KEYS.CONFIG_MULTA_JUROS, JSON.stringify(config));
  }
};

// Interface unificada para compatibilidade
export const storageService = {
  getClientes: clienteService.getAll,
  addCliente: (clienteData: Omit<Cliente, 'id'>) => {
    const cliente: Cliente = {
      ...clienteData,
      id: generateId()
    };
    clienteService.save(cliente);
    return cliente;
  },
  updateCliente: (id: string, clienteData: Omit<Cliente, 'id'>) => {
    const cliente: Cliente = { ...clienteData, id };
    clienteService.save(cliente);
    return cliente;
  },
  deleteCliente: clienteService.delete,

  getVeiculos: veiculoService.getAll,
  addVeiculo: (veiculoData: Omit<Veiculo, 'id'>) => {
    const veiculo: Veiculo = {
      ...veiculoData,
      id: generateId()
    };
    veiculoService.save(veiculo);
    return veiculo;
  },
  updateVeiculo: (id: string, veiculoData: Omit<Veiculo, 'id'>) => {
    const veiculo: Veiculo = { ...veiculoData, id };
    veiculoService.save(veiculo);
    return veiculo;
  },
  deleteVeiculo: veiculoService.delete,

  getContratos: contratoService.getAll,
  addContrato: (contratoData: Omit<Contrato, 'id'>) => {
    const contrato: Contrato = {
      ...contratoData,
      id: generateId()
    };
    contratoService.save(contrato);
    return contrato;
  },
  updateContrato: (id: string, contratoData: Omit<Contrato, 'id'>) => {
    const contrato: Contrato = { ...contratoData, id };
    contratoService.save(contrato);
    return contrato;
  },
  deleteContrato: contratoService.delete,

  getManutencoes: manutencaoService.getAll,
  addManutencao: (manutencaoData: Omit<Manutencao, 'id'>) => {
    const manutencao: Manutencao = {
      ...manutencaoData,
      id: generateId()
    };
    manutencaoService.save(manutencao);
    return manutencao;
  },
  updateManutencao: (id: string, manutencaoData: Omit<Manutencao, 'id'>) => {
    const manutencao: Manutencao = { ...manutencaoData, id };
    manutencaoService.save(manutencao);
    return manutencao;
  },
  deleteManutencao: manutencaoService.delete,

  getPagamentos: pagamentoService.getAll,
  getMultas: multaService.getAll,
  getImpostos: impostoService.getAll
};
