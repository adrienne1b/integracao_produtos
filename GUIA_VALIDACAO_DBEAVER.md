# 🦫 Guia Prático: Validação no DBeaver (Parte 5 do PDF)

Este guia orienta como conectar o DBeaver ao banco de dados SQLite do projeto e verificar cada uma das operações do CRUD funcionando de ponta a ponta.

---

## 1. Conectar o DBeaver ao Banco SQLite

1. Abra o **DBeaver**.
2. Clique no menu superior: **Banco de Dados &gt; Nova Conexão**.
3. Selecione o driver **SQLite** e clique em **Avançar**.
4. No campo **Caminho**, clique em **Navegar...** e selecione o arquivo do banco:
   ```text
   C:\Users\Adriene\Documents\ProjetoIntegracaoProdutos\minhaapi.db
   ```
5. Clique em **Testar Conexão** (se o DBeaver solicitar o download do driver SQLite, clique em Sim/Download).
6. Clique em **Concluir**.

---

## 2. Roteiro de Teste Passo a Passo

Abra um editor de SQL no DBeaver (botão **SQL** ou `Ctrl + ]`) e mantenha a consulta:
```sql
SELECT * FROM Produtos;
```

Execute a consulta pressionando `Ctrl + Enter` para inspecionar os dados.

---

### Teste 1: Buscar por ID (GET)
- **No Navegador (`http://localhost:4200`)**:
  - No campo "ID do Produto", digite `2` e clique em **Buscar**.
  - O produto com ID 2 aparecerá destacado com nome e preço formatado.
- **No DBeaver**:
  - Execute `SELECT * FROM Produtos;`.
  - **Resultado esperado**: O banco não sofre alteração (operação de leitura).

---

### Teste 2: Criar um Novo Produto (POST)
- **No Navegador**:
  - No card "Novo Produto", preencha:
    - **Nome**: `Headset Gamer 7.1`
    - **Preço**: `349.90`
  - Clique em **Adicionar Produto**.
  - A mensagem de sucesso aparecerá e o produto entrará na tabela.
- **No DBeaver**:
  - Execute `SELECT * FROM Produtos;`.
  - **Resultado esperado**: Uma nova linha aparecerá no final da tabela com o `Headset Gamer 7.1` e preço `349.90`.

---

### Teste 3: Editar um Produto Existente (PUT)
- **No Navegador**:
  - Na tabela, localize a linha do produto que acabou de criar.
  - Clique no botão **✏️ Editar**.
  - Os campos daquela linha se transformarão em caixas de texto editáveis.
  - Altere o nome para: `Headset Gamer 7.1 Surround Wireless`
  - Altere o preço para: `399.00`
  - Clique no botão verde **💾 Salvar**.
- **No DBeaver**:
  - Execute `SELECT * FROM Produtos;`.
  - **Resultado esperado**: Os campos `Nome` e `Preco` da linha existente foram atualizados no banco de dados.

---

### Teste 4: Remover um Produto (DELETE)
- **No Navegador**:
  - Na linha do produto recém-editado, clique em **🗑️ Remover**.
  - Uma janela de confirmação do navegador será exibida; clique em **OK**.
  - A linha desaparecerá da tabela do Angular.
- **No DBeaver**:
  - Execute `SELECT * FROM Produtos;`.
  - **Resultado esperado**: O registro foi excluído permanentemente da tabela do SQLite.

---

## 💡 Dicas de Suporte
- Caso o DBeaver mostre dados antigos ou em cache, clique com o botão direito na tabela `Produtos` e selecione **Atualizar (F5)** ou reexecute o script `SELECT * FROM Produtos;`.
- Os arquivos temporários `minhaapi.db-wal` e `minhaapi.db-shm` são criados pelo SQLite em modo Write-Ahead Logging (WAL) para melhor desempenho e consistência concorrente.
