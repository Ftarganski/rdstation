# 🚀 RD Station Recommendation System

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-18.3+-green?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Sistema inteligente de recomendação de produtos RD Station**

_Desenvolvido com arquitetura moderna, princípios SOLID e Tailwind CSS_

[🎯 Demo](#demo) • [🛠️ Instalação](#instalação) • [📖 Documentação](#documentação) • [🧪 Testes](#testes)

</div>

---

## 📋 Sobre o Projeto

O **RD Station Recommendation System** é uma aplicação web moderna desenvolvida em React.js que implementa um sistema inteligente de recomendação de produtos. O sistema analisa as preferências e funcionalidades desejadas pelos usuários para fornecer recomendações personalizadas dos produtos RD Station.

### ✨ Principais Características

- 🎯 **Sistema de Recomendação Inteligente** com algoritmos de scoring
- 🎨 **Interface Moderna** desenvolvida com Tailwind CSS
- 🏗️ **Arquitetura SOLID** com componentes reutilizáveis
- 📱 **Design Responsivo** para todos os dispositivos
- ♿ **Acessibilidade Completa** com suporte a screen readers
- 🔄 **Estado de Loading** e tratamento de erros
- 🎛️ **Formulário Inteligente** com validação em tempo real

---

## 🎯 Requisitos Iniciais Atendidos

### **Funcionalidades Core**

- ✅ Formulário de seleção de preferências e funcionalidades
- ✅ Sistema de recomendação baseado em critérios do usuário
- ✅ Suporte a recomendação única (`SingleProduct`)
- ✅ Suporte a múltiplas recomendações (`MultipleProducts`)
- ✅ Tratamento de empates com lógica de desempate
- ✅ Extensibilidade para novos tipos de preferências
- ✅ Arquitetura modular e extensível

### **Requisitos Técnicos**

- ✅ **React.js 18.2+** para desenvolvimento frontend
- ✅ **Tailwind CSS** para estilização moderna
- ✅ **json-server** para simulação de API REST
- ✅ **Node.js 18.3+** como runtime
- ✅ **Componentes funcionais** com hooks
- ✅ **Responsividade completa** mobile-first

---

## 🚀 O Que Foi Desenvolvido/Melhorado

### **🏗️ Arquitetura Refatorada (SOLID + DRY + Clean Code)**

#### **📁 Estrutura Modular**

```
src/
├── 📁 constants/           # Configurações centralizadas
│   └── formConstants.js    # Tipos, validações, mensagens
├── 📁 utils/              # Utilitários reutilizáveis
│   └── formValidation.js   # Funções puras de validação
├── 📁 hooks/              # Hooks customizados
│   ├── useMultipleSelection.js  # Seleção múltipla genérica
│   ├── useSingleSelection.js    # Seleção única genérica
│   └── useProducts.js           # Gerenciamento de produtos
├── 📁 components/
│   ├── 📁 shared/         # Componentes reutilizáveis
│   │   ├── StateComponents.jsx  # Loading, Error, Empty states
│   │   └── Input.jsx           # Input genérico acessível
│   ├── 📁 Form/           # Sistema de formulário
│   │   ├── RecommendationForm.jsx      # Formulário principal
│   │   ├── Fields/
│   │   │   ├── PreferencesField.jsx    # Campo de preferências
│   │   │   ├── FeaturesField.jsx       # Campo de funcionalidades
│   │   │   └── RecommendationTypeField.jsx # Campo tipo recomendação
│   │   └── SubmitButton/
│   │       └── SubmitButton.jsx        # Botão inteligente
│   └── 📁 RecommendationList/
│       └── RecommendationList.jsx      # Lista de resultados
└── 📁 services/
    └── recommendation.service.js       # Lógica de negócio
```

#### **🎯 Princípios Aplicados**

**SOLID:**

- **S**ingle Responsibility: Cada componente tem uma responsabilidade específica
- **O**pen/Closed: Extensível via Strategy Pattern nos algoritmos
- **L**iskov Substitution: Componentes intercambiáveis
- **I**nterface Segregation: Props específicas e enxutas
- **D**ependency Inversion: Hooks abstraem dependências

**DRY (Don't Repeat Yourself):**

- Hooks genéricos `useMultipleSelection` e `useSingleSelection`
- Componentes de estado reutilizáveis (`LoadingState`, `ErrorState`)
- Utilitários de validação centralizados

**Clean Code:**

- Nomenclatura descritiva e consistente
- Funções pequenas e focadas
- Separação clara de responsabilidades
- Documentação com JSDoc

### **🎨 Sistema de Design Moderno**

#### **Tailwind CSS Profissional**

- ✅ **100+ classes Tailwind** utilizadas estrategicamente
- ✅ **Sistema de grid responsivo** (`grid-cols-1 lg:grid-cols-2`)
- ✅ **Estados interativos** (`hover:`, `focus:`, `disabled:`)
- ✅ **Animações suaves** (`transition-all`, `animate-spin`)
- ✅ **Design tokens** com variáveis CSS customizadas

#### **Componentes Visuais**

```jsx
// Exemplo: Layout responsivo principal
<div className='min-h-screen bg-gray-50'>
	<div className='max-w-7xl mx-auto px-4 py-8'>
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>{/* Formulário e Resultados */}</div>
	</div>
</div>
```

### **⚡ Performance e UX**

- 🔄 **Loading states** com spinners elegantes
- ❌ **Error handling** com mensagens claras
- 📝 **Validação em tempo real** do formulário
- 🎭 **Feedback visual** para todas as ações
- ♿ **Acessibilidade completa** (ARIA, focus management)
- 📱 **Mobile-first** com breakpoints inteligentes

### **🧪 Qualidade de Código**

- 📋 **PropTypes** para validação de props
- 🔒 **TypeScript-like** documentation com JSDoc
- 🎯 **Hooks otimizados** com `useCallback` e `useMemo`
- 🔄 **Componentes memo** para evitar re-renders
- 🧹 **Linting** e formatação consistente

---

## 💻 Instalação e Execução

### **📋 Pré-requisitos**

- **Node.js 18.3+**
- **npm** ou **yarn**
- **Git**

### **🔧 Instalação Rápida**

```bash
# 1. Clone o repositório
git clone https://github.com/Ftarganski/rdstation.git
cd rdstation

# 2. Instale as dependências
npm install
# ou
yarn install

# 3. Execute o script de configuração (opcional)
./install.sh

# 4. Inicie o desenvolvimento
npm run dev
# ou
yarn dev
```

### **🚀 Scripts Disponíveis**

| Script           | Descrição                                            | Comando                  |
| ---------------- | ---------------------------------------------------- | ------------------------ |
| `dev`            | 🔥 **Desenvolvimento completo** (frontend + backend) | `npm run dev`            |
| `start`          | 🌐 Apenas frontend                                   | `npm start`              |
| `start:frontend` | ⚛️ Frontend isolado                                  | `npm run start:frontend` |
| `start:backend`  | 🗄️ Backend (json-server)                             | `npm run start:backend`  |
| `build`          | 📦 Build para produção                               | `npm run build`          |
| `test`           | 🧪 Executar testes                                   | `npm test`               |

### **🌐 URLs de Acesso**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Produtos API**: http://localhost:3001/products

### **📱 Instalação com Managers de Versão**

#### **Usando `nvm` (recomendado):**

```bash
# Instalar e usar Node.js 18.3+
nvm install 18.3
nvm use 18.3
npm install
```

#### **Usando `n`:**

```bash
# Instalar Node.js 18.3+
npm install -g n
n 18.3
npm install
```

---

## 🎮 Como Usar

### **1. 📝 Preenchimento do Formulário**

1. Selecione suas **preferências** (mínimo 1)
2. Escolha as **funcionalidades** desejadas (mínimo 1)
3. Defina o **tipo de recomendação**:
   - `SingleProduct`: Retorna o melhor produto
   - `MultipleProducts`: Retorna lista ordenada

### **2. 🎯 Visualização dos Resultados**

- Produtos são ordenados por **score de compatibilidade**
- **Ranking visual** mostra a relevância
- **Tags coloridas** destacam preferências e funcionalidades
- **Estados visuais** para loading e erros

### **3. 🔄 Interações Disponíveis**

- **Limpar formulário**: Reset completo dos campos
- **Seleção múltipla**: Checkboxes para preferências/funcionalidades
- **Seleção única**: Radio buttons para tipo de recomendação
- **Feedback visual**: Estados hover e focus

---

## 🧪 Testes

### **Executar Testes**

```bash
# Todos os testes
npm test

# Modo watch
npm test -- --watch

# Cobertura
npm test -- --coverage
```

### **Estrutura de Testes**

```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
└── setupTests.js
```

---

## 📖 Documentação

### **📚 Arquivos de Documentação**

- 📄 **[PROJETO_COMPLETO_REPORT.md](./PROJETO_COMPLETO_REPORT.md)**: Relatório completo das melhorias
- 🎨 **[CSS_CONSOLIDATION_REPORT.md](./CSS_CONSOLIDATION_REPORT.md)**: Detalhes da consolidação CSS
- 🏗️ **[REFACTORING_REPORT.md](./REFACTORING_REPORT.md)**: Processo de refatoração
- 🎯 **[TAILWIND_USAGE_REPORT.md](./TAILWIND_USAGE_REPORT.md)**: Uso do Tailwind CSS

### **🔍 API Reference**

#### **Produtos Endpoint**

```bash
GET /products
```

**Response:**

```json
{
	"products": [
		{
			"id": 1,
			"name": "RD Station Marketing",
			"description": "Plataforma de automação de marketing",
			"preferences": ["Marketing Digital", "Automação"],
			"features": ["Email Marketing", "Landing Pages", "Lead Scoring"]
		}
	]
}
```

---

## 🤝 Contribuição

### **🔄 Workflow de Desenvolvimento**

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### **📏 Padrões de Código**

- **ESLint** para linting
- **Prettier** para formatação
- **Conventional Commits** para mensagens
- **JSDoc** para documentação
- **PropTypes** para validação

---

## 🚀 Deploy

### **📦 Build para Produção**

```bash
npm run build
```

### **🌐 Deploy Sugerido**

- **Vercel**: Deploy automático via Git
- **Netlify**: Build e deploy contínuo
- **GitHub Pages**: Para projetos open source
- **AWS S3**: Para hospedagem estática

---

## 📊 Status do Projeto

- ✅ **Core Features**: 100% implementadas
- ✅ **UI/UX**: Design system completo
- ✅ **Responsividade**: Mobile-first
- ✅ **Acessibilidade**: WCAG 2.1 compliant
- ✅ **Performance**: Otimizado
- ✅ **Testes**: Cobertura básica
- 🔄 **Documentação**: Em progresso

---

## 👨‍💻 Autor

**Desenvolvido com ❤️ por [Ftarganski](https://github.com/Ftarganski)**

- 📧 Email: [seu-email@exemplo.com]
- 💼 LinkedIn: [seu-linkedin]
- 🐱 GitHub: [@Ftarganski](https://github.com/Ftarganski)

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🙏 Agradecimentos

- 🏢 **RD Station** pela oportunidade de desenvolvimento
- ⚛️ **React Team** pelo framework excepcional
- 🎨 **Tailwind CSS** pelo sistema de design
- 🌐 **Open Source Community** pelas ferramentas incríveis

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

Made with ❤️ and ☕ by **Ftarganski**

</div>
