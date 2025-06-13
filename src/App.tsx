
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Veiculos from "./pages/Veiculos";
import Contratos from "./pages/Contratos";
import Pagamentos from "./pages/Pagamentos";
import Multas from "./pages/Multas";
import Impostos from "./pages/Impostos";
import Manutencoes from "./pages/Manutencoes";
import ConfiguracaoMultaJuros from "./pages/ConfiguracaoMultaJuros";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="veiculos" element={<Veiculos />} />
            <Route path="contratos" element={<Contratos />} />
            <Route path="pagamentos" element={<Pagamentos />} />
            <Route path="multas" element={<Multas />} />
            <Route path="impostos" element={<Impostos />} />
            <Route path="manutencoes" element={<Manutencoes />} />
            <Route path="config-multa-juros" element={<ConfiguracaoMultaJuros />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
