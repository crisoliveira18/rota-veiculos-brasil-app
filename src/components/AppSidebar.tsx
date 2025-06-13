
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import {
  Activity,
  List,
  Settings,
  FileText,
  Calendar,
  Trash2,
  Receipt,
  Wrench,
  DollarSign,
} from 'lucide-react';

const AppSidebar: React.FC = () => {
  const location = useLocation();

  const mainItems = [
    { path: '/', icon: Activity, label: 'Dashboard' },
    { path: '/clientes', icon: List, label: 'Clientes' },
    { path: '/veiculos', icon: Settings, label: 'Veículos' },
    { path: '/contratos', icon: FileText, label: 'Contratos' },
    { path: '/pagamentos', icon: Calendar, label: 'Pagamentos' },
    { path: '/multas', icon: Trash2, label: 'Multas' },
  ];

  const additionalItems = [
    { path: '/impostos', icon: Receipt, label: 'Impostos' },
    { path: '/manutencoes', icon: Wrench, label: 'Manutenções' },
    { path: '/config-multa-juros', icon: DollarSign, label: 'Multa e Juros' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-bold text-blue-600">Nova Rota Veículos</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map(({ path, icon: Icon, label }) => (
                <SidebarMenuItem key={path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === path}
                  >
                    <Link to={path}>
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {additionalItems.map(({ path, icon: Icon, label }) => (
                <SidebarMenuItem key={path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === path}
                  >
                    <Link to={path}>
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
