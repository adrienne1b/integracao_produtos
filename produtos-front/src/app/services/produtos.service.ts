import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  // Retorna caminho relativo /api/Produtos quando servido pelo backend (ultra rápido, sem atraso de DNS/IPv6)
  // ou URL absoluta quando rodando no servidor de desenvolvimento do Angular (porta 4200)
  private get apiUrl(): string {
    if (typeof window !== 'undefined' && window.location.port === '4200') {
      return 'http://localhost:5027/api/Produtos';
    }
    return '/api/Produtos';
  }

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}?_t=${Date.now()}`);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  criar(produto: { nome: string; preco: number }): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  atualizar(id: number, produto: { nome: string; preco: number }): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
