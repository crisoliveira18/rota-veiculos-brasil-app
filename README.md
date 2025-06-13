
# Nova Rota Veículos

Sistema completo de gestão de veículos para locação, desenvolvido com React, TypeScript, Vite e Capacitor para geração de APK Android.

## 🚀 Funcionalidades

### Dashboard
- Métricas em tempo real (veículos disponíveis, contratos ativos, pagamentos pendentes)
- Gráficos de receita mensal
- Visão geral do negócio

### Gestão de Clientes
- Cadastro completo com CPF/CNPJ, CNH, contato e endereço
- Histórico de locações e multas
- Busca e edição de dados

### Gestão de Veículos
- Cadastro com marca, modelo, ano, placa, quilometragem
- Status: disponível, ocupado, manutenção
- Histórico de manutenções

### Contratos
- Criação automática de cronograma de pagamentos semanais
- Formato: "Nome do Cliente - Número" (ex: "João Silva - 001")
- Status: ativo, vencido, finalizado
- Visualização completa do cronograma de pagamentos

### Sistema de Pagamentos
- Registro manual de pagamentos (PIX, dinheiro, transferência)
- Cronograma com parcelas: pagas, a vencer, vencidas
- Aplicação automática de multas e juros por atraso
- Relatórios financeiros

### Multas
- Registro por veículo ou contrato
- Atribuição automática ao cliente
- Controle de status (pendente/pago)

### Impostos
- Gestão de IPVA, Taxa de Licenciamento e DPVAT
- Controle de vencimentos e pagamentos
- Organização por veículo e ano

### Manutenções
- Agendamento com dados da oficina e mecânico
- Orçamentos e previsão de entrega
- Status: agendado, em andamento, concluído

### Configuração de Multas e Juros
- Definição de percentual de multa por atraso
- Configuração de juros diários
- Aplicação automática nas parcelas vencidas

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Roteamento**: React Router DOM
- **Mobile**: Capacitor (para APK Android)
- **Armazenamento**: localStorage (sem dependência de backend)

## 📱 Geração do APK Android

### Pré-requisitos
- Node.js (versão 18+)
- Android Studio
- Java Development Kit (JDK 11+)

### Instruções para gerar o APK

1. **Clone o projeto do GitHub**
   ```bash
   git clone <seu-repositorio>
   cd nova-rota-veiculos
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Build do projeto**
   ```bash
   npm run build
   ```

4. **Adicionar plataforma Android**
   ```bash
   npx cap add android
   ```

5. **Sincronizar arquivos**
   ```bash
   npx cap sync android
   ```

6. **Abrir no Android Studio**
   ```bash
   npx cap open android
   ```

7. **No Android Studio:**
   - Aguarde a sincronização do Gradle
   - Vá em `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - O APK será gerado em `android/app/build/outputs/apk/debug/`

### Alternativa via linha de comando
```bash
cd android
./gradlew assembleDebug
```

## 🔧 Desenvolvimento

### Executar localmente
```bash
npm install
npm run dev
```

### Build para produção
```bash
npm run build
```

### Preview da build
```bash
npm run preview
```

## 📚 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
├── services/           # Serviços de armazenamento (localStorage)
├── types/              # Definições TypeScript
├── utils/              # Funções utilitárias
└── hooks/              # Hooks customizados
```

## 💾 Armazenamento de Dados

O aplicativo utiliza localStorage para persistir todos os dados, incluindo:
- Clientes, veículos, contratos
- Pagamentos e multas
- Impostos e manutenções
- Configurações de multa e juros

Todos os dados são salvos localmente no dispositivo, não dependendo de conexão com internet após o primeiro carregamento.

## 🎨 Design

Interface otimizada para dispositivos móveis com:
- Navegação por abas na parte inferior
- Cards informativos e intuitivos
- Cores profissionais (azul e cinza)
- Responsividade completa
- Toques e gestos otimizados para tela de celular

## 📄 Licença

Este projeto foi desenvolvido para Nova Rota Veículos.
