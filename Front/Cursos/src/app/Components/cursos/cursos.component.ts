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
  idDeletar!:number;

  alterarIdDeletar(id:number){
    this.idDeletar = id;
  }

  constructor(private cursosService:CursosService, private toastr: ToastrService, private categoriaService: CategoriaService) { }

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
    });
  }

  abrirModalAdicionar():void{
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

  abrirModalAtualizacao(cursoId:number): void{
    this.tituloModal = 'Atualizar Curso';
    this.cursosService.PegarPeloId(cursoId).subscribe(resultado => {
      this.form = new FormGroup({
        cursoId: new FormControl(resultado.cursoId),
        descricao: new FormControl(resultado.descricao, [Validators.required]),
        dataInicio: new FormControl(this.formatarData(resultado.dataInicio), [Validators.required]),
        dataFinal: new FormControl(this.formatarData(resultado.dataFinal), [Validators.required]),
        quantidadeAlunos: new FormControl(resultado.quantidadeAlunos),
        categoriaId: new FormControl(resultado.categoriaId, [Validators.required]),
        isActive: new FormControl(true),
        categoria: new FormControl(null)
      });
    })
  }

  enviarFormulario(){
    const curso: Curso = this.form.value;
    if(curso.quantidadeAlunos < 0){
      curso.quantidadeAlunos = 0;
    }
    if(curso.cursoId > 0){ //atualização
      this.cursosService.AtualizarCurso(curso).subscribe((resultado) => {
        this.toastr.success('Atualizado com Sucesso!');
        this.cursosService.PegarTodos().subscribe((registros) => {
          this.cursos = registros;
        });
      },
      (error) => {
        this.toastr.error("Error ao Atualizar o Curso! Verifique o Periodo Informado ou a Descrição");
        console.log(error);
      }
      );
    }
    else{ //inserir
      this.cursosService.Salvar(curso).subscribe((resultado) => {
        this.toastr.success('Inserido com Sucesso!');
        this.cursosService.PegarTodos().subscribe((registros) => {
        this.cursos = registros;
        });
      },
      (error) => {
        this.toastr.error("Error ao Inserir o Curso! Verifique o Periodo Informado ou a Descrição");
      }
      );
    }
  }

  ExcluirCurso(id:number):void{
    this.cursosService.Delete(id).subscribe( resultado => {
      this.toastr.error("Registro Deletado");
      this.cursosService.PegarTodos().subscribe(resultado =>
          this.cursos = resultado
        );
    })
  }

  formatarData(n: any): Date{
    return n.split('T')[0];
  }

}
