using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MinhaPrimeiraApi.Models;
using MinhaPrimeiraApi.Services;

namespace MinhaPrimeiraApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly IProdutoService _service;
    public ProdutosController(IProdutoService service)
    {
        _service = service ;
    }

    [HttpGet]
    public async Task<IActionResult> ListarTodos()
    {
        var Produtos = await _service.ListarTodosAsync();
        return Ok(Produtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> BuscarPorID(int id)
    {
        if(id <= 0)
        {
            return BadRequest("O ID deve ser maior que zero.");
        };

        var produto = await _service.BuscarPorIdAsync(id);

        if(produto == null)
        {
            return NotFound($"Produto com ID {id} não encontrado");
        }

        return Ok(produto);
    }

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] Produto prod)
    {
        if(!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        try
        {
            var criado = await _service.CriarAsync(prod);
            return CreatedAtAction(nameof(BuscarPorID), new {id = criado.Id}, criado);
        }
        catch(ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] Produto produtoAtualizado)
    {
        if(!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var produto = await _service.AtualizarAsync(id, produtoAtualizado);

            if(produto == null)
                return NotFound($"Produto com ID {id} não encontrado.");

            return Ok(produto);
        }
        catch(ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var removido = await _service.RemoverAsync(id);

        if(!removido)
            return NotFound($"Produto com ID {id} não encontrado.");

        return NoContent();    
    }
}