using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Cursos.Api.Models
{
    public class Categoria
    {
        public int CategoriaId { get; set; }
        [StringLength(50)]
        public string CategoriaName { get; set; }
        public ICollection<Curso> Cursos { get; set; }
    }
}
