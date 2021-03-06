using Cursos.Api.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace Cursos.Api.Models
{
    public class Curso
    {
        public int CursoId { get; set; }
        [Required(ErrorMessage = "Descrição é Obrigatória !")]
        public string Descricao { get; set; }
        [Required(ErrorMessage = "Data Inicial é Obrigatória !")]
        [DataInicioMenorQueAtual]
        public DateTime DataInicio { get; set; }
        [Required(ErrorMessage = "Data Final é Obrigatória !")]
        public DateTime DataFinal { get; set; }
        public int QuantidadeAlunos { get; set; }
        [Required(ErrorMessage = "Categoria é Obrigatória !")]
        public int CategoriaId { get; set; }
        public Categoria Categoria { get; set; }
        public bool IsActive { get; set; } = true;
        public Log Log { get; set; }
    }

    public class DataInicioMenorQueAtual : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (validationContext.ObjectInstance != null)
            {
               DateTime dataInicial = (DateTime)value; 
               if (dataInicial >= DateTime.Now)
               {
                    return ValidationResult.Success;
               }
            }

            return new ValidationResult(errorMessage: "Data Inicial menor que a data Atual !");
        }
    }
}
