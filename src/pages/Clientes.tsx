
import React, { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import Card from '../components/Card';
import { Cliente } from '../types';
import { clienteService } from '../services/storage';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    cpfCnpj: '',
    cnh: '',
    telefone: '',
    email: '',
    endereco: ''
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = () => {
    setClientes(clienteService.getAll());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cliente: Cliente = {
      id: editingCliente?.id || Date.now().toString(),
      ...formData,
      dataCadastro: editingCliente?.dataCadastro || new Date().toISOString()
    };

    clienteService.save(cliente);
    loadClientes();
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpfCnpj: '',
      cnh: '',
      telefone: '',
      email: '',
      endereco: ''
    });
    setEditingCliente(null);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      cpfCnpj: cliente.cpfCnpj,
      cnh: cliente.cnh,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus size={20} className="mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <Input
                  id="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={(e) => setFormData({...formData, cpfCnpj: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cnh">CNH</Label>
                <Input
                  id="cnh"
                  value={formData.cnh}
                  onChange={(e) => setFormData({...formData, cnh: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {editingCliente ? 'Atualizar' : 'Cadastrar'}
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
        {clientes.map((cliente) => (
          <Card key={cliente.id} onClick={() => handleEdit(cliente)}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{cliente.nome}</h3>
                <p className="text-sm text-gray-600">CPF/CNPJ: {cliente.cpfCnpj}</p>
                <p className="text-sm text-gray-600">CNH: {cliente.cnh}</p>
                <p className="text-sm text-gray-600">Tel: {cliente.telefone}</p>
              </div>
              <FileText size={20} className="text-gray-400" />
            </div>
          </Card>
        ))}
        
        {clientes.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum cliente cadastrado</p>
              <p className="text-sm">Toque no botão "Novo Cliente" para começar</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Clientes;
