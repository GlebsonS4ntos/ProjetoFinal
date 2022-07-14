import { validacoes } from './../../Models/Validacoes';
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
  cursosFiltrados !: Curso[];
  tituloModal!: string;
  form: any ;
  categorias!: Categoria[];
  idDeletar!:number;
  dataAtual = new Date();
  private _buscar!: string;
  private _dataInicio!: any;
  private _dataFinal!: any;

  get buscar():string{
    return this._buscar;
  }

  set buscar(s: string){
    this._buscar = s;
    this.cursosFiltrados = this.buscar
      ? this.filtrarCuros(this.buscar)
      : this.cursos;
  }

  get dataInicio():Date{
    return this._dataInicio;
  }

  set dataInicio(s: Date){
    this._dataInicio = s;
  }

  get dataFinal():Date{
    return this._dataFinal;
  }

  set dataFinal(s: Date){
    this._dataFinal = s;
  }

  filtrarCuros(s:string):any{
    this._dataFinal = null;
    this._dataInicio = null;
    return this.cursos.filter(
      (curso: { descricao: string }) =>
        curso.descricao.toLocaleLowerCase().indexOf(s.toLocaleLowerCase()) !== -1
    );
  }

  buscarData():void{
    if(this.dataFinal != null && this.dataFinal != null){
      this._buscar = "";
      this.cursosFiltrados = this.cursos.filter(
        (result) =>
        (this.dataInicio <= result.dataInicio && this.dataFinal >= result.dataFinal) ||
        ((this.dataInicio >= result.dataInicio && this.dataInicio <= result.dataFinal) && this.dataFinal <= result.dataFinal) ||
        ((this.dataInicio >= result.dataInicio && this.dataInicio <= result.dataFinal) && this.dataFinal > result.dataFinal) ||
        (this.dataInicio <= result.dataInicio && (this.dataFinal >= result.dataInicio && this.dataFinal <= result.dataFinal))
      );
    }
    else{
      this.toastr.error("Ops, Parece que você n digitou um dos campos !")
    }
  }

  alterarIdDeletar(id:number){
    this.idDeletar = id;
  }

  constructor(private cursosService:CursosService, private toastr: ToastrService, private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.cursosService.PegarTodos().subscribe(
      (resultado) => {
        this.cursos = resultado,
        this.cursosFiltrados = this.cursos
      }
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
      dataInicio: new FormControl(null, [Validators.required, validacoes.dataMenorQueAtual()]),
      dataFinal: new FormControl(null, [Validators.required]),
      quantidadeAlunos: new FormControl(0),
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
      this.cursosService.AtualizarCurso(curso).subscribe( (resultado) =>{
        this.toastr.success('Atualizado com Sucesso!');
        this.cursosService.PegarTodos().subscribe((registros) => {
          this.cursosFiltrados = registros;
        });
      },
      (error) => {
        this.toastr.error(error.error);
      }
      );
    }
    else{ //inserir
      this.cursosService.Salvar(curso).subscribe((resultado) => {
        this.toastr.success('Inserido com Sucesso!');
        this.cursosService.PegarTodos().subscribe((registros) => {
        this.cursosFiltrados = registros;
        });
      },
      (error) => {
        this.toastr.error(error.error);
      }
      );
    }
  }

  ExcluirCurso(id:number):void{
    this.cursosService.Delete(id).subscribe(  (resultado) => {
      this.toastr.error('Deletado com Sucesso!');
        this.cursosService.PegarTodos().subscribe((registros) => {
        this.cursosFiltrados = registros;
        });
      },
      (error) => {
        this.toastr.error(error.error);
      }
      );
  }

  formatarData(n: any): Date{
    return n.split('T')[0];
  }

  reload(): void{
    this.cursosFiltrados = this.cursos;
    this._buscar = "";
    this._dataFinal = null;
    this._dataInicio = null;
  }

}
