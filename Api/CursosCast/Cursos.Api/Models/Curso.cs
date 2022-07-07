using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Cursos.Api.Models
{
    public class Curso
    {
        public int CursoId { get; set; }
        [Required(ErrorMessage = "Descrição é Obrigatória !")]
        public string Descricao { get; set; }
        [Required(ErrorMessage = "Data Inicial é Obrigatória !")]
        public DateTime DataInicio { get; set; }
        [Required(ErrorMessage = "Data Final é Obrigatória !")]
        [DataFinalMaiorQueInicial("DataInicio")]
        public DateTime DataFinal { get; set; }
        public int QuantidadeAlunos { get; set; }
        [Required(ErrorMessage = "Categoria é Obrigatória !")]
        public int CategoriaId { get; set; }
        public Categoria Categoria { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class DataFinalMaiorQueInicial : ValidationAttribute
    {
        public string NameCompare { get; set; }
        public DataFinalMaiorQueInicial(string nameCompare) => NameCompare = nameCompare;
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (validationContext.ObjectInstance != null)
            {
                Type t = validationContext.ObjectInstance.GetType();
                PropertyInfo d = t.GetProperty(NameCompare);
                if (d != null)
                {
                    DateTime dataFinal = (DateTime)value;
                    DateTime dataInicio = (DateTime)d.GetValue(validationContext.ObjectInstance, null);
                    if (dataFinal >= dataInicio)
                    {
                        return ValidationResult.Success;
                    }
                }
            }

            return new ValidationResult(errorMessage: "Data Final menor que a data inicial !");
        }
    }

}
