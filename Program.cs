using MinhaPrimeiraApi.Data;
using Microsoft.EntityFrameworkCore;
using MinhaPrimeiraApi.Repositories;
using MinhaPrimeiraApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=minhaapi.db;Cache=Shared;"));
builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
builder.Services.AddScoped<IProdutoService, ProdutoService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirAngular", policy =>
{
        policy.WithOrigins("http://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.ExecuteSqlRaw("PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("PermitirAngular");

app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
