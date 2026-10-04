import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProdutosService } from './services/produtos.service';
import { Produto } from './models/produto.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly produtosService = inject(ProdutosService);

  produtos: Produto[] = [];
  mensagemSucesso: string = '';
  mensagemErro: string = '';
  salvando: boolean = false;
  buscando: boolean = false;
  criando: boolean = false;

  // 1. Busca por ID
  idBusca: number | null = null;
  produtoEncontrado: Produto | null = null;
  buscaRealizada: boolean = false;

  // 2. Novo Produto
  novoNome: string = '';
  novoPreco: string = '';

  // 4. Edição Inline
  idEditando: number | null = null;
  nomeEditando: string = '';
  precoEditando: string = '';

  ngOnInit(): void {
    this.carregarProdutos();
  }

  // Formata o preço de maneira direta e segura sem dependência de locale externo
  formatarPreco(valor: any): string {
    if (valor === null || valor === undefined || valor === '') return 'R$ 0.00';
    const num = Number(valor);
    if (isNaN(num)) return 'R$ 0.00';
    return 'R$ ' + num.toFixed(2);
  }

  // Converte texto numérico para número válido
  private parsePreco(valor: any): number | null {
    if (valor === null || valor === undefined || valor === '') return null;
    const limpo = String(valor).trim().replace(/\s/g, '').replace(',', '.');
    const num = parseFloat(limpo);
    if (isNaN(num)) return null;
    return Math.round(num * 100) / 100;
  }

  // Notificações visuais
  exibirSucesso(msg: string): void {
    this.mensagemSucesso = msg;
    this.mensagemErro = '';
    setTimeout(() => {
      if (this.mensagemSucesso === msg) this.mensagemSucesso = '';
    }, 4000);
  }

  exibirErro(msg: string): void {
    this.mensagemErro = msg;
    this.mensagemSucesso = '';
    setTimeout(() => {
      if (this.mensagemErro === msg) this.mensagemErro = '';
    }, 5000);
  }

  // Operação 1: Listar Todos
  carregarProdutos(): void {
    this.produtosService.listarTodos().subscribe({
      next: (dados) => {
        this.produtos = dados || [];
      },
      error: (erro) => {
        console.error('Erro ao listar produtos:', erro);
        this.exibirErro('Não foi possível conectar à API. Verifique se o comando "dotnet run" está ativo.');
      }
    });
  }

  // Operação 2: Buscar por ID
  buscarPorId(): void {
    if (!this.idBusca || this.idBusca <= 0) {
      this.exibirErro('Digite um número de ID válido para buscar.');
      return;
    }

    this.buscando = true;
    this.buscaRealizada = true;
    this.produtoEncontrado = null;

    this.produtosService.buscarPorId(this.idBusca).pipe(
      finalize(() => { this.buscando = false; })
    ).subscribe({
      next: (produto) => {
        this.produtoEncontrado = produto;
        // Atualiza a listagem para devolver SOMENTE o produto selecionado pelo ID
        this.produtos = [produto];
        this.exibirSucesso(`Produto #${produto.id} (${produto.nome}) localizado! Exibindo somente este item na tela.`);
      },
      error: (erro) => {
        this.produtoEncontrado = null;
        this.produtos = [];
        if (erro.status === 404) {
          this.exibirErro(`Nenhum produto cadastrado com o ID ${this.idBusca}.`);
        } else {
          this.exibirErro('Falha ao buscar o produto. Verifique a conexão com o servidor.');
        }
      }
    });
  }

  limparBusca(): void {
    this.idBusca = null;
    this.produtoEncontrado = null;
    this.buscaRealizada = false;
    this.carregarProdutos();
  }

  onIdBuscaChange(): void {
    if ((this.idBusca === null || this.idBusca === undefined || (this.idBusca as any) === '') && this.buscaRealizada) {
      this.limparBusca();
    }
  }

  // Operação 3: Criar Novo Produto
  adicionarProduto(): void {
    const nomeLimpo = (this.novoNome || '').trim();
    if (!nomeLimpo) {
      this.exibirErro('Por favor, informe o nome do produto.');
      return;
    }

    const precoNum = this.parsePreco(this.novoPreco);
    if (precoNum === null || precoNum < 0.01 || precoNum > 1000) {
      this.exibirErro('O preço deve estar entre 0.01 e 1.000.');
      return;
    }

    const payload = {
      nome: nomeLimpo,
      preco: precoNum
    };

    this.criando = true;
    this.produtosService.criar(payload).pipe(
      finalize(() => { this.criando = false; })
    ).subscribe({
      next: (criado) => {
        this.exibirSucesso(`Produto "${criado.nome}" (ID ${criado.id}) adicionado com sucesso!`);
        this.novoNome = '';
        this.novoPreco = '';
        // Atualização instantânea na lista
        this.produtos = [...this.produtos, criado];
        this.carregarProdutos();
      },
      error: (erro) => {
        console.error('Erro ao criar produto:', erro);
        let msg = 'Erro ao cadastrar produto.';
        if (erro.error) {
          if (typeof erro.error === 'string') msg = erro.error;
          else if (erro.error.title) msg = erro.error.title;
          else if (erro.error.errors) {
            msg = Object.values(erro.error.errors).flat().join(', ');
          }
        }
        this.exibirErro(msg);
      }
    });
  }

  // Operação 4: Iniciar e Salvar Edição
  iniciarEdicao(produto: Produto): void {
    this.idEditando = produto.id;
    this.nomeEditando = produto.nome;
    this.precoEditando = produto.preco != null ? String(produto.preco) : '';
  }

  cancelarEdicao(): void {
    this.idEditando = null;
    this.nomeEditando = '';
    this.precoEditando = '';
  }

  salvarEdicao(id: number): void {
    const nomeLimpo = (this.nomeEditando || '').trim();
    if (!nomeLimpo) {
      this.exibirErro('O nome do produto não pode ficar vazio.');
      return;
    }

    const precoNum = this.parsePreco(this.precoEditando);
    if (precoNum === null || precoNum < 0.01 || precoNum > 1000) {
      this.exibirErro('O preço deve estar entre 0.01 e 1.000.');
      return;
    }

    const payload = {
      id: id,
      nome: nomeLimpo,
      preco: precoNum
    };

    this.salvando = true;

    this.produtosService.atualizar(id, payload).pipe(
      finalize(() => { this.salvando = false; })
    ).subscribe({
      next: (produtoAtualizado) => {
        this.exibirSucesso(`Produto #${id} atualizado com sucesso!`);

        // Fecha o modo de edição imediatamente
        this.idEditando = null;
        this.nomeEditando = '';
        this.precoEditando = '';

        // Atualização instantânea na lista local com nova referência para renderizar na hora
        this.produtos = this.produtos.map(p => {
          if (p.id === id) {
            return {
              id: id,
              nome: nomeLimpo,
              preco: precoNum
            };
          }
          return p;
        });

        // Se o produto estava aberto no card de busca, atualiza também
        if (this.produtoEncontrado && this.produtoEncontrado.id === id) {
          this.produtoEncontrado = {
            id: id,
            nome: nomeLimpo,
            preco: precoNum
          };
        }

        if (!this.buscaRealizada) {
          this.carregarProdutos();
        }
      },
      error: (erro) => {
        console.error('Erro ao atualizar produto:', erro);
        let msg = 'Falha ao salvar produto.';
        if (erro.error) {
          if (typeof erro.error === 'string') msg = erro.error;
          else if (erro.error.title) msg = erro.error.title;
          else if (erro.error.errors) {
            msg = Object.values(erro.error.errors).flat().join(', ');
          }
        }
        this.exibirErro(msg);
      }
    });
  }

  // Operação 5: Remover Produto
  removerProduto(produto: Produto): void {
    const confirmou = window.confirm(`Deseja realmente excluir o produto "${produto.nome}" (ID ${produto.id})?`);
    if (!confirmou) return;

    this.produtosService.remover(produto.id).subscribe({
      next: () => {
        this.exibirSucesso(`Produto #${produto.id} removido do banco com sucesso!`);
        this.produtos = this.produtos.filter(p => p.id !== produto.id);

        if (this.produtoEncontrado && this.produtoEncontrado.id === produto.id) {
          this.limparBusca();
        } else if (!this.buscaRealizada) {
          this.carregarProdutos();
        }
      },
      error: (erro) => {
        console.error('Erro ao remover produto:', erro);
        this.exibirErro(`Falha ao remover o produto #${produto.id}.`);
      }
    });
  }
}
