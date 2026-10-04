using MinhaPrimeiraApi.Models;
using MinhaPrimeiraApi.Repositories;

namespace MinhaPrimeiraApi.Services;

public class ProdutoService : IProdutoService
{
    private readonly IProdutoRepository _repository;

    public ProdutoService(IProdutoRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Produto>> ListarTodosAsync()
    {
        return await _repository.ListarTodosAsync();
        
    }
    public async Task<Produto?> BuscarPorIdAsync(int id)
    {
    return await _repository.BuscarPorIdAsync(id);
    }

    public async Task<Produto> CriarAsync(Produto produto)
    {
        if(produto.Preco < 0.01m)
            throw new ArgumentException ("O preço deve ser maior que zero.");

        if(await _repository.ExisteNomeDuplicadoAsync(produto.Nome))
            throw new ArgumentException ("Já existe um produto com o mesmo nome.");

        return await _repository.CriarAsync(produto);
        
    }

    public async Task<Produto?> AtualizarAsync(int id, Produto produtoAtualizado)
    {
        return await _repository.AtualizarAsync(id, produtoAtualizado);

    }

    public async Task<bool> RemoverAsync(int id)
    {
        return await _repository.RemoverAsync( id);      
    }
}