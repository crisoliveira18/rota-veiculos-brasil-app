
import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import Card from '../components/Card';
import { ConfiguracaoMultaJuros } from '../types';
import { configMultaJurosService } from '../services/storage';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from '../hooks/use-toast';

const ConfiguracaoMultaJurosPage: React.FC = () => {
  const [config, setConfig] = useState<ConfiguracaoMultaJuros>({
    multaPercentual: 10,
    jurosPercentualDiario: 1
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = () => {
    setConfig(configMultaJurosService.get());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    configMultaJurosService.save(config);
    
    toast({
      title: "Configuração salva",
      description: "As configurações de multa e juros foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Settings size={28} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Multa e Juros por Atraso</h2>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="multaPercentual">Multa por Atraso (%)</Label>
              <Input
                id="multaPercentual"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={config.multaPercentual}
                onChange={(e) => setConfig({...config, multaPercentual: parseFloat(e.target.value)})}
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                Percentual aplicado sobre o valor da parcela em caso de atraso
              </p>
            </div>
            
            <div>
              <Label htmlFor="jurosPercentualDiario">Juros por Dia de Atraso (%)</Label>
              <Input
                id="jurosPercentualDiario"
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={config.jurosPercentualDiario}
                onChange={(e) => setConfig({...config, jurosPercentualDiario: parseFloat(e.target.value)})}
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                Percentual aplicado por dia de atraso sobre o valor da parcela
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Exemplo de Cálculo:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Valor da parcela: R$ 1.000,00</p>
              <p>• Atraso de 5 dias</p>
              <p>• Multa: R$ {(1000 * config.multaPercentual / 100).toFixed(2)} ({config.multaPercentual}%)</p>
              <p>• Juros: R$ {(1000 * config.jurosPercentualDiario * 5 / 100).toFixed(2)} ({config.jurosPercentualDiario}% × 5 dias)</p>
              <p className="font-semibold">• Valor total: R$ {(1000 + (1000 * config.multaPercentual / 100) + (1000 * config.jurosPercentualDiario * 5 / 100)).toFixed(2)}</p>
            </div>
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Salvar Configurações
          </Button>
        </form>
      </Card>
      
      <Card>
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Como Funciona:</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• <strong>Multa:</strong> Valor fixo aplicado uma única vez quando a parcela atrasa</p>
            <p>• <strong>Juros:</strong> Valor calculado diariamente conforme o número de dias de atraso</p>
            <p>• Os valores são aplicados automaticamente nos cronogramas de pagamento</p>
            <p>• As configurações afetam apenas parcelas que vencerem após a alteração</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConfiguracaoMultaJurosPage;
