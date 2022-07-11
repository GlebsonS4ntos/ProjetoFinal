import { Curso } from './../../Models/Curso';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  Headers: new HttpHeaders({
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
}
