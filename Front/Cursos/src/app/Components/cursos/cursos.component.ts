import { CursosService } from './../../Services/cursos/cursos.service';
import { Curso } from './../../Models/Curso';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  cursos !: Curso[];
  constructor(private cursosService:CursosService) { }

  ngOnInit(): void {
    this.cursosService.PegarTodos().subscribe(
      (resultado : any) =>
        this.cursos = resultado
    )
    console.log(this.cursos)
  }

}
