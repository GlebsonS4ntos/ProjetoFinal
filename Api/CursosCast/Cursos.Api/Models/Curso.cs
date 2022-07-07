using System;

namespace Cursos.Api.Models
{
    public class Curso
    {
        public int CursoId { get; set; }
        public string Descricao { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFinal { get; set; }
        public int QuantidadeAlunos { get; set; }
        public int CategoriaId { get; set; }
        public Categoria Categoria { get; set; }
        public bool IsActive { get; set; }
    }
}
