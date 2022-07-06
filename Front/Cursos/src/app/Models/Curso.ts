import { Categoria } from './Categoria';
export class Curso{
  cursoId !: number;
  descricao !: string;
  dataInicio !: Date;
  dataFinal !: Date;
  quantidadeAlunos !: number;
  categoriaId !: number;
  categoria !: Categoria;
}
