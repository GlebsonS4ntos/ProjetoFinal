import { Curso } from './../../Models/Curso';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'content-Type' : 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  url = "https://localhost:44328/api/Cursos";
  constructor(private http: HttpClient) { }

  PegarTodos(): Observable<Curso[]>{
    return this.http.get<Curso[]>(this.url);
  }

  Salvar(curso : Curso): Observable<any>{
    return this.http.post<Curso>(this.url, curso, httpOptions);
  }

  Delete(id: number): Observable<any>{
    const a = `${this.url}/${id}`
    return this.http.put<number>(a,httpOptions);
  }

  AtualizarCurso(curso: Curso): Observable<any> {
    return this.http.put<Curso>(this.url, curso, httpOptions);
  }

  PegarPeloId(id: number): Observable<Curso>{
    const apiUrl  = `${this.url}/${id}`;
    return this.http.get<Curso>(apiUrl)
  }
}
