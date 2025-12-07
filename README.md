# 🚀 Sistema D'ONGs - Frontend

Frontend React moderno e responsivo para o Sistema D'ONGs, uma aplicação web de gestão para Organizações Não Governamentais (ONGs) gerenciarem doações, beneficiados e gerar relatórios de impacto social.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Integração com Backend](#integração-com-backend)
- [Deploy](#deploy)

## 🎯 Visão Geral

O Sistema D'ONGs é uma plataforma completa de CRM (Customer Relationship Management) desenvolvida especificamente para ONGs de pequeno e médio porte. O frontend fornece uma interface intuitiva e moderna para:

- **Gestão de Doações**: Registro, acompanhamento e distribuição de doações recebidas
- **Cadastro de Beneficiados**: Controle detalhado de pessoas e famílias atendidas
- **Painel de Controle**: Visualização de métricas e estatísticas em tempo real
- **Relatórios**: Geração de relatórios mensais e anuais para prestação de contas
- **Configurações**: Gerenciamento das informações da organização

### Arquitetura

- **Frontend**: React 19 + Vite
- **Backend**: Supabase (PostgreSQL + API REST + Autenticação JWT)
- **Estilização**: Tailwind CSS + shadcn/ui
- **Estado**: TanStack Query para cache e sincronização de dados

## 📦 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no [Supabase](https://supabase.com) (para integração com backend)

## 🛠️ Instalação

1. **Clone o repositório**:

   ```bash
   git clone <url-do-repositorio>
   cd frontend
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente** (veja seção [Configuração](#configuração))

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

### Configuração do Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Settings > API**
3. Copie a **Project URL** e **anon public key**
4. Cole essas informações no arquivo `.env.local`

## 🚀 Executando o Projeto

### Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

### Preview do Build

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
frontend/
├── public/                    # Arquivos estáticos
│   └── heart-handshake.svg
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── beneficiaries/    # Componentes de beneficiados
│   │   ├── dashboard/        # Componentes do painel
│   │   ├── donations/        # Componentes de doações
│   │   ├── reports/          # Componentes de relatórios
│   │   ├── settings/         # Componentes de configurações
│   │   ├── shared/           # Componentes compartilhados
│   │   └── ui/               # Componentes de UI (shadcn/ui)
│   ├── context/              # Contextos React
│   │   └── AuthContext.jsx   # Contexto de autenticação
│   ├── entities/             # Definições de entidades
│   ├── hooks/                # Hooks customizados
│   ├── lib/                  # Utilitários e configurações
│   │   ├── supabase.js       # Configuração do Supabase
│   │   └── utils.js          # Funções utilitárias
│   ├── pages/                # Páginas da aplicação
│   │   ├── auth/             # Páginas de autenticação
│   │   ├── Beneficiaries.jsx # Página de beneficiados
│   │   ├── Dashboard.jsx     # Página do painel
│   │   ├── Donations.jsx     # Página de doações
│   │   ├── FirstSetup.jsx    # Configuração inicial
│   │   ├── Reports.jsx       # Página de relatórios
│   │   └── Settings.jsx      # Página de configurações
│   ├── services/             # Serviços de API
│   ├── utils/                # Utilitários diversos
│   ├── App.jsx               # Componente principal
│   ├── Layout.jsx            # Layout da aplicação
│   ├── index.css             # Estilos globais
│   └── main.jsx              # Ponto de entrada
├── .env.local                # Variáveis de ambiente (não versionado)
├── package.json
├── tailwind.config.js        # Configuração do Tailwind
├── vite.config.js            # Configuração do Vite
└── README.md                 # Este arquivo
```

## ✨ Funcionalidades

### 🔐 Autenticação

- Login e cadastro de usuários
- Recuperação de senha (futuro)
- Proteção de rotas autenticadas

### 🏢 Onboarding e Configuração

- Cadastro inicial da organização
- Vinculação automática do usuário administrador
- Configuração obrigatória antes do primeiro acesso

### 📊 Painel de Controle

- **Cartões de Estatísticas**: Totais de doações, valores, beneficiados ativos
- **Gráfico Mensal**: Doações recebidas por mês
- **Gráfico de Tipos**: Distribuição por tipo de doação (pizza)
- **Métricas de Impacto**: Famílias impactadas, taxas de distribuição
- **Atividades Recentes**: Últimas doações e cadastros

### 💰 Gestão de Doações

- **Registro**: Formulário completo para cadastrar doações
- **Listagem**: Visualização com filtros e busca
- **Distribuição**: Registro de saída para beneficiados
- **Edição/Exclusão**: Modificação segura com confirmações
- **Status Automático**: Atualização baseada na quantidade restante

### 👥 Gestão de Beneficiados

- **Cadastro**: Formulário detalhado com validações
- **Listagem**: Grid responsivo com filtros
- **Priorização**: Níveis de prioridade (alta, média, baixa)
- **Status**: Controle de beneficiados ativos/inativos
- **Histórico**: Rastreamento de distribuições recebidas

### 📋 Relatórios

- **Seleção de Tipo**: Doações ou Beneficiados
- **Período**: Filtragem por mês ou ano
- **Pré-visualização**: Visualização antes da impressão
- **Exportação**: PDF formatado para prestação de contas

### ⚙️ Configurações

- **Dados da Organização**: Atualização de informações
- **Upload de Logo**: Personalização da identidade visual
- **Informações de Contato**: Telefone, endereço, website

## 🛠️ Tecnologias Utilizadas

### Core

- **React 19**: Biblioteca para interfaces de usuário
- **Vite**: Build tool e dev server ultrarrápido
- **React Router DOM**: Roteamento SPA

### UI & Estilização

- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes de UI acessíveis e customizáveis
- **Radix UI**: Primitivos para componentes acessíveis
- **Lucide React**: Biblioteca de ícones

### Estado & Dados

- **TanStack Query**: Gerenciamento de estado server e cache
- **Axios**: Cliente HTTP para requisições
- **Supabase JS**: Cliente oficial do Supabase

### Formulários & Validação

- **React Hook Form**: Gerenciamento de formulários performático
- **Zod**: Validação de schemas TypeScript-first
- **@hookform/resolvers**: Integração entre RHF e Zod

### Utilitários

- **date-fns**: Manipulação de datas
- **clsx**: Utilitários para classes CSS condicionais
- **tailwind-merge**: Mesclagem inteligente de classes Tailwind
- **class-variance-authority**: Variantes de componentes

### Relatórios & Exportação

- **jsPDF**: Geração de PDFs
- **html2canvas**: Captura de elementos HTML
- **jspdf-autotable**: Tabelas em PDF

### Desenvolvimento

- **ESLint**: Linting e formatação de código
- **PostCSS**: Processamento de CSS
- **Autoprefixer**: Prefixos CSS automáticos

## 📜 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build local
npm run lint         # Executa o ESLint
```

## 🔗 Integração com Backend

Este frontend se integra com o backend Supabase através de:

- **API REST**: Endpoints automáticos do PostgREST
- **Autenticação JWT**: Supabase Auth
- **Row Level Security**: Isolamento automático de dados por organização
- **Real-time**: Atualizações em tempo real (futuro)

Para configurar a integração completa:

1. Configure o backend seguindo a documentação em `../backend/README.md`
2. Execute os scripts SQL na ordem correta
3. Configure as variáveis de ambiente no frontend
4. Teste a integração usando a coleção Postman incluída

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte o repositório** no [Vercel](https://vercel.com)
2. **Configure variáveis de ambiente**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Deploy automático** será executado

### Outras Opções

- **Netlify**: Configuração similar ao Vercel
- **Railway**: Deploy com Docker
- **AWS S3 + CloudFront**: Para maior controle

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de CORS**: Verifique se a URL do Supabase está correta nas variáveis de ambiente

**Erro 401 Unauthorized**: Token JWT expirado, faça login novamente

**Erro 403 Forbidden**: Verifique se o usuário tem organização configurada

**Dados não carregam**: Verifique conexão com Supabase e se as tabelas foram criadas

### Logs e Debug

- Use as **DevTools** do navegador (F12)
- Verifique a aba **Network** para requisições com erro
- Console do navegador para logs de erro

## 📞 Suporte

Para suporte técnico:

1. Consulte a documentação do backend (`../backend/README.md`)
2. Verifique os logs do Supabase
3. Teste com a coleção Postman incluída
4. Abra uma issue no repositório

## 📝 Notas Importantes

- **Responsividade**: Interface otimizada para desktop, tablet e mobile
- **Acessibilidade**: Componentes seguindo padrões WCAG
- **Performance**: Otimizações com React.memo, useMemo e lazy loading
- **Segurança**: Autenticação obrigatória e isolamento de dados
- **Escalabilidade**: Arquitetura preparada para crescimento

## 🎉 Próximos Passos

Após configurar o frontend:

1. ✅ Configure o backend Supabase
2. ✅ Teste todas as funcionalidades
3. ✅ Configure deploy em produção
4. ✅ Implemente monitoramento e analytics
5. ✅ Adicione testes automatizados

---

**Desenvolvido com ❤️ para potencializar o impacto social das ONGs**
