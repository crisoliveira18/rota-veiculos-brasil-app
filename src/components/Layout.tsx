
import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { 
  Calendar, 
  Settings, 
  Activity, 
  FileText,
  Trash2,
  List,
  Menu,
  X
} from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Activity, label: 'Dashboard' },
    { path: '/clientes', icon: List, label: 'Clientes' },
    { path: '/veiculos', icon: Settings, label: 'Veículos' },
    { path: '/contratos', icon: FileText, label: 'Contratos' },
    { path: '/pagamentos', icon: Calendar, label: 'Pagamentos' },
    { path: '/multas', icon: Trash2, label: 'Multas' }
  ];

  const menuItems = [
    { path: '/impostos', label: 'Impostos' },
    { path: '/manutencoes', label: 'Manutenções' },
    { path: '/config-multa-juros', label: 'Multa e Juros' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Nova Rota Veículos</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="mt-4 bg-blue-700 rounded-lg p-2">
            {menuItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`block p-3 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-600'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-10">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                location.pathname === path
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
