import { Categoria } from './../../Models/Categoria';
import { Curso } from './../../Models/Curso';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  url = "https://localhost:44328/api/Categorias"
  constructor(private http: HttpClient) { }

  PegarTodos(): Observable<Categoria[]>{
      return this.http.get<Categoria[]>(this.url);
  }
}
