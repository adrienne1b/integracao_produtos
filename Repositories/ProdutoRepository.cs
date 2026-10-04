using Microsoft.EntityFrameworkCore;
using MinhaPrimeiraApi.Data;
using MinhaPrimeiraApi.Models;
using SQLitePCL;

namespace MinhaPrimeiraApi.Repositories;

public class ProdutoRepository : IProdutoRepository
{
    private readonly AppDbContext _context;

    public ProdutoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Produto>> ListarTodosAsync()
    {
        return await _context.Produtos.ToListAsync();
        
    }

    public async Task<Produto?> BuscarPorIdAsync(int id)
    {
        return await _context.Produtos.FindAsync(id);
    }

    public async Task<Produto> CriarAsync(Produto produto)
    {
        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();
        return produto;
    }

    public async Task<Produto?> AtualizarAsync(int id, Produto produtoAtualizado)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if(produto == null) return null;

        produto.Nome = produtoAtualizado.Nome;
        produto.Preco = produtoAtualizado.Preco;
        _context.Produtos.Update(produto);
        await _context.SaveChangesAsync();
        return produto;
    }

    public async Task<bool> RemoverAsync(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if(produto == null) return false;

        _context.Produtos.Remove(produto);
        await _context.SaveChangesAsync();
        return true;        
    }

    public async Task<bool> ExisteNomeDuplicadoAsync(string nome)
    {
        return await _context.Produtos.AnyAsync(p => p.Nome == nome);
    }
}
