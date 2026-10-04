# 📦 MinhaPrimeiraApi - Integração Fullstack (.NET 10 + Angular + SQLite)

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-Standalone-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-success)](https://github.com)

Projeto prático desenvolvido para demonstrar a **integração completa ponta a ponta (Fullstack)** entre uma Web API RESTful construída em **.NET 10 (C#)** e uma aplicação frontend moderna em **Angular (Standalone Components)**, persistindo dados em banco relacional **SQLite**.

A interface visual foi especialmente customizada em uma paleta elegante em **tons de roxo e lilás**, com feedback visual dinâmico, edição inline e tratamento resiliente de erros.

---

## 🎯 Funcionalidades (CRUD Completo)

A aplicação contempla todas as 5 operações essenciais do CRUD:

1. **📋 Listar Todos os Produtos (`GET /api/Produtos`)**
   - Catálogo com tabela responsiva exibindo ID, Nome, Preço formatado em Reais (`R$`) e ações.
   - Indicador de contagem total de produtos cadastrados.

2. **🔍 Buscar por ID (`GET /api/Produtos/{id}`)**
   - Campo de busca dedicado com execução por botão ou tecla `Enter`.
   - Exibição de card de destaque com os dados do produto localizado.
   - Filtragem na listagem para devolver **exclusivamente o produto selecionado**.
   - Botão para limpar a busca e retornar a visualização completa do catálogo.

3. **➕ Cadastrar Novo Produto (`POST /api/Produtos`)**
   - Formulário com validações de campos obrigatórios.
   - Regra de negócio: Preço aceito no intervalo estrito de **0.01 a 1.000**, utilizando notação decimal direta com ponto.
   - Validação de unicidade no banco (impede nomes duplicados).

4. **✏️ Atualizar Produto Inline (`PUT /api/Produtos/{id}`)**
   - Edição diretamente na linha da tabela, permitindo alterar Nome e Preço sem trocar de tela.
   - Botões de "Salvar" e "Cancelar" com atualização imediata no banco e na tela.

5. **🗑️ Remover Produto (`DELETE /api/Produtos/{id}`)**
   - Confirmação de segurança antes da exclusão.
   - Remoção em tempo real da tabela e do banco de dados SQLite.

---

## 🛠️ Tecnologias Utilizadas

### **Backend (.NET 10)**
- **Linguagem:** C# 13 / .NET 10 SDK
- **Framework:** ASP.NET Core Web API
- **ORM:** Entity Framework Core (EF Core)
- **Banco de Dados:** SQLite (`minhaapi.db`) com suporte a modo WAL (`journal_mode=WAL`)
- **Documentação Interativa:** Swagger / OpenAPI
- **Servidor de Arquivos Estáticos:** Hospedagem direta do build do Angular integrado no Kestrel (`UseDefaultFiles`, `UseStaticFiles`, `MapFallbackToFile`)

### **Frontend (Angular)**
- **Framework:** Angular (Arquitetura Standalone Components)
- **Linguagem:** TypeScript
- **Reatividade:** RxJS com operadores `finalize` para controle de estado dos botões
- **Estilização:** CSS3 puro e moderno, tipografia *Plus Jakarta Sans*, gradientes e componentes em tons de roxo (`#4c1d95`, `#6d28d9`, `#7c3aed`) e lilás (`#ede9fe`, `#f5f3ff`)

---

## 📂 Estrutura do Projeto

```text
ProjetoIntegracaoProdutos/
├── Controllers/
│   └── ProdutosController.cs       # Endpoints REST (GET, POST, PUT, DELETE)
├── Models/
│   └── Produto.cs                  # Entidade Produto com Data Annotations
├── Data/
│   └── AppDbContext.cs             # Contexto do Entity Framework Core
├── Repositories/
│   ├── IProdutoRepository.cs       # Contrato de persistência
│   └── ProdutoRepository.cs        # Implementação de acesso a dados
├── Services/
│   ├── IProdutoService.cs          # Contrato de regras de negócio
│   └── ProdutoService.cs           # Validações de negócio
├── produtos-front/                  # Código-fonte do frontend Angular
│   ├── src/app/
│   │   ├── models/produto.model.ts # Interface TypeScript do Produto
│   │   ├── services/produtos.service.ts # Consumo HTTP da API
│   │   ├── app.ts                  # Lógica do componente principal
│   │   ├── app.html                # Template visual do CRUD
│   │   └── app.css                 # Estilos em tons de roxo e lilás
│   └── package.json
├── wwwroot/                        # Bundle estático gerado do Angular
├── Program.cs                      # Configuração do pipeline, CORS e SQLite
├── MinhaPrimeiraApi.csproj         # Arquivo de configuração do projeto .NET
├── minhaapi.db                     # Arquivo de banco de dados SQLite
└── README.md                       # Documentação do projeto
```

---

## 🚀 Como Executar o Projeto Localmente

### **Pré-requisitos**
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) instalado
- [Visual Studio Code](https://code.visualstudio.com/) ou IDE de sua preferência
- (Opcional para desenvolvimento frontend) [Node.js](https://nodejs.org/) v20+

### **Execução Simples (Tudo em 1 Comando)**
Como o frontend já se encontra compilado dentro da pasta `wwwroot`, basta iniciar o backend para executar a aplicação completa:

1. Abra o terminal na raiz do projeto (`ProjetoIntegracaoProdutos`):
   ```powershell
   dotnet run
   ```

2. Acesse no navegador:
   ```text
   http://localhost:5027
   ```

3. Para visualizar a documentação interativa da API via Swagger:
   ```text
   http://localhost:5027/swagger
   ```

---

## 📡 Endpoints da API

| Método | Endpoint | Descrição | Status Sucesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/Produtos` | Lista todos os produtos cadastrados | `200 OK` |
| `GET` | `/api/Produtos/{id}` | Busca um produto específico pelo ID | `200 OK` |
| `POST` | `/api/Produtos` | Cadastra um novo produto | `201 Created` |
| `PUT` | `/api/Produtos/{id}` | Atualiza o nome e preço do produto | `200 OK` |
| `DELETE` | `/api/Produtos/{id}` | Remove um produto pelo ID | `204 NoContent` |

---

## 🗄️ Validação no DBeaver (SQLite)

Para auditar e verificar as modificações no banco de dados em tempo real:

1. Abra o **DBeaver** e clique em **Nova Conexão** > **SQLite**.
2. No campo **Path**, aponte para o arquivo `minhaapi.db` localizado na raiz do projeto.
3. Abra o editor SQL e execute consultas:
   ```sql
   SELECT * FROM Produtos;
   ```
4. Ao cadastrar, editar ou deletar produtos pela tela do navegador, clique em **Atualizar (F5)** no DBeaver para confirmar que as operações refletem diretamente na base de dados.

---

## 👤 Autora

Desenvolvido por **Adrienne Barbosa**  
- GitHub: [@adrienne1b](https://github.com/adrienne1b)
