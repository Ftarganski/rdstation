# Deploy na Vercel - Monorepo Unificado

## 🚀 Configuração Concluída

Este projeto foi configurado para deploy unificado na Vercel com as seguintes características:

### 📁 Estrutura do Deploy

```
Projeto na Vercel
├── Frontend (React + Vite) → Site estático
└── Backend (API Routes) → Serverless Functions
```

### 🔧 Arquivos de Configuração Criados

#### 1. `vercel.json` (Configuração principal)

- Define builds e rotas
- Configura Serverless Functions
- Especifica diretório de output

#### 2. `api/` (Serverless Functions)

- `api/products.js` - CRUD de produtos
- `api/recommendations.js` - Sistema de recomendações

#### 3. Configuração de Ambiente

- `frontend/.env.production` - Variáveis para produção
- `frontend/.env.example` - Exemplo de configuração

### 🌐 URLs da API em Produção

```
GET    /api/products           - Lista todos os produtos
GET    /api/products?id=1      - Busca produto específico
POST   /api/products           - Cria novo produto
PUT    /api/products?id=1      - Atualiza produto
DELETE /api/products?id=1      - Remove produto
POST   /api/recommendations    - Gera recomendações
```

### 📋 Passos para Deploy

#### 1. Conectar ao GitHub

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "Add New Project"
4. Selecione o repositório `rdstation`

#### 2. Configurar o Projeto

1. **Framework Preset**: Vite
2. **Root Directory**: `.` (raiz do projeto)
3. **Build Command**: `npm run vercel-build`
4. **Output Directory**: `frontend/build`
5. **Install Command**: `npm install`

#### 3. Variáveis de Ambiente (Opcional)

Se necessário, adicione variáveis no painel da Vercel:

```
REACT_APP_API_URL=/api
```

#### 4. Deploy

- O deploy será automático após a configuração
- Cada push para `main` fará um novo deploy
- Branches criarão preview deployments

### 🔄 URLs Finais

Após o deploy, você terá:

```
Frontend: https://seu-projeto.vercel.app
API: https://seu-projeto.vercel.app/api/products
```

### 🛠️ Desenvolvimento Local

Para testar localmente com a nova configuração:

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Simular API (opcional, para testes)
npx vercel dev
```

### 📝 Notas Importantes

#### ✅ Vantagens desta Configuração

- **Deploy único**: Frontend e backend no mesmo projeto
- **Domínio unificado**: Sem problemas de CORS
- **Serverless**: Escalabilidade automática
- **Deploy automático**: Integração com Git

#### ⚠️ Considerações

- **Dados temporários**: API usa array em memória (redefine a cada deploy)
- **Para persistência**: Considere integrar com banco de dados (PostgreSQL, MongoDB)
- **Cache**: Functions são "cold start" - primeira execução pode ser mais lenta

### 🎯 Próximos Passos (Opcional)

1. **Banco de Dados**: Integrar com Vercel Postgres ou MongoDB Atlas
2. **Autenticação**: Adicionar login com NextAuth.js
3. **Monitoramento**: Configurar analytics da Vercel
4. **Domínio**: Configurar domínio personalizado

---

**🚀 Pronto para deploy!** Siga os passos acima e seu monorepo estará rodando na Vercel.
