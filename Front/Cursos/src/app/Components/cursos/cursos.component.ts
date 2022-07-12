import { Categoria } from './../../Models/Categoria';
import { CategoriaService } from './../../Services/categoria/categoria.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CursosService } from './../../Services/cursos/cursos.service';
import { Curso } from './../../Models/Curso';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  cursos !: Curso[];
  tituloModal!: string;
  form: any ;
  categorias!: Categoria[];

  constructor(private cursosService:CursosService, private toastr:ToastrService, private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.cursosService.PegarTodos().subscribe(
      (resultado : any) =>
        this.cursos = resultado
    );
    this.categoriaService.PegarTodos().subscribe( (resultado) =>
      this.categorias = resultado
    );
    this.form = new FormGroup({
      cursoId: new FormControl(0),
      descricao: new FormControl('', [Validators.required]),
      dataInicio: new FormControl('', [Validators.required]),
      dataFinal: new FormControl('', [Validators.required]),
      quantidadeAlunos: new FormControl(0),
      categoriaId: new FormControl(0, [Validators.required]),
      isActive: new FormControl(true),
      categoria: new FormControl(null)
    })
  }

  abrirModalAdicionar(){
    this.tituloModal = 'Adicionar Curso';
    this.form = new FormGroup({
      cursoId: new FormControl(0),
      descricao: new FormControl(null, [Validators.required]),
      dataInicio: new FormControl(null, [Validators.required]),
      dataFinal: new FormControl(null, [Validators.required]),
      quantidadeAlunos: new FormControl(null),
      categoriaId: new FormControl(0, [Validators.required]),
      isActive: new FormControl(true),
      categoria: new FormControl(null)
    })
  }

  enviarFormulario(){
    const curso: Curso = this.form.value;
    console.log(curso);
    this.cursosService.Salvar(curso).subscribe((resultado) => {
      this.toastr.success('Inserido com Sucesso!');
      this.cursosService.PegarTodos().subscribe((registros) => {
      this.cursos = registros;
      });
    },
    (error) => {
      this.toastr.error(error);
    }
    );
  }
}
