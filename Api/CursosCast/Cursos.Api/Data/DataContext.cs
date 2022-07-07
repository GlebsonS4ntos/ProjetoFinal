using Cursos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Cursos.Api.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Curso> Curso { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Log> Log { get; set; }
    }
}
