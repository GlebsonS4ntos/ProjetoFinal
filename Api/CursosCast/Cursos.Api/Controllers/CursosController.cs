using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cursos.Api.Data;
using Cursos.Api.Models;

namespace Cursos.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CursosController : ControllerBase
    {
        private readonly DataContext _context;

        public CursosController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Cursos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Curso>>> GetCurso()
        {
            return await _context.Curso.Include(x => x.Categoria).Where(x => x.IsActive == true).ToListAsync();
        }

        // GET: api/Cursos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Curso>> GetCurso(int id)
        {
            var curso = await _context.Curso.FindAsync(id);

            if (curso == null)
            {
                return NotFound();
            }

            return curso;
        }

        // PUT: api/Cursos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutCurso(Curso curso)
        {
            if (ModelState.IsValid)
            {
                var notActive = _context.Curso.Where(x => x.IsActive == true && x.CursoId != curso.CursoId).ToListAsync();
                bool notA = notActive.Result.Where(x => x.Descricao.ToLower() == curso.Descricao.ToLower()).Any();
                if (notA)
                {
                    return BadRequest(error: "Descrição é a mesma usada em Outro Curso !");
                }
                bool dataAntesApos = notActive.Result.Where(x => curso.DataInicio <= x.DataInicio && curso.DataFinal >= x.DataFinal).Any();
                bool dataAntesEntre = notActive.Result.Where(x => curso.DataInicio <= x.DataInicio &&
                                                    (curso.DataFinal <= x.DataFinal && curso.DataFinal >= x.DataInicio)).Any();
                bool dataEntre = notActive.Result.Where(x => (curso.DataInicio >= x.DataInicio && curso.DataInicio <= x.DataFinal) &&
                                                    (curso.DataFinal <= x.DataFinal && curso.DataFinal >= x.DataInicio)).Any();
                bool dataEntreApos = notActive.Result.Where(x => (curso.DataInicio >= x.DataInicio && curso.DataInicio <= x.DataFinal) &&
                                                    curso.DataFinal > x.DataFinal).Any();
                if (dataAntesApos || dataAntesEntre || dataEntre || dataEntreApos)
                {
                    return BadRequest(error: "Ja existe um curso no periodo informado ! ");
                }
                if (curso.DataFinal.Date < curso.DataInicio.Date)
                {
                    return BadRequest(error: "Não é possivel Inserir um curso com a Data Final menor que a Inicial");
                }
                _context.Curso.Update(curso);
                await _context.SaveChangesAsync();
                var log =_context.Log.FirstOrDefault(x => x.CursoId == curso.CursoId);
                log.DataAtualizacao = DateTime.Now;
                _context.Log.Update(log);
                await _context.SaveChangesAsync();
                return Ok();
            }

            return BadRequest();
        }

        // POST: api/Cursos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Curso>> PostCurso(Curso curso)
        {
            if (ModelState.IsValid)
            {
                var notActive = _context.Curso.Where(x => x.IsActive == true).ToListAsync();
                bool notA = notActive.Result.Where(x => x.Descricao.ToLower() == curso.Descricao.ToLower()).Any();
                if (notA)
                {
                    return BadRequest(error: "Descrição é a mesma usada em Outro Curso !");
                }
                bool dataAntesApos = notActive.Result.Where(x => curso.DataInicio <= x.DataInicio && curso.DataFinal >= x.DataFinal).Any();
                bool dataAntesEntre = notActive.Result.Where(x => curso.DataInicio <= x.DataInicio && 
                                                    (curso.DataFinal <= x.DataFinal && curso.DataFinal >= x.DataInicio)).Any();
                bool dataEntre = notActive.Result.Where(x => (curso.DataInicio >= x.DataInicio && curso.DataInicio <= x.DataFinal) && 
                                                    (curso.DataFinal <= x.DataFinal && curso.DataFinal >= x.DataInicio)).Any();
                bool dataEntreApos = notActive.Result.Where(x => (curso.DataInicio >= x.DataInicio && curso.DataInicio <= x.DataFinal) && 
                                                    curso.DataFinal > x.DataFinal).Any();
                if (dataAntesApos || dataAntesEntre || dataEntre || dataEntreApos)
                {
                    return BadRequest(error: "Ja existe um curso no periodo informado ! ");
                }
                if (curso.DataFinal.Date < curso.DataInicio.Date)
                {
                    return BadRequest(error: "Não é possivel Inserir um curso com a Data Final menor que a Inicial");
                }
                _context.Curso.Add(curso);
                await _context.SaveChangesAsync();
                CreatedAtAction("GetCurso", new { id = curso.CursoId }, curso);
                Log log = new()
                {
                    CursoId = curso.CursoId,
                    DataInclusao = DateTime.Now
                };
                _context.Log.Add(log);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetCurso", new { id = curso.CursoId }, curso);
            }

            return BadRequest();
        }

        // DELETE: api/Cursos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> DeleteLogicoCurso(int id)
        {
            var curso = await _context.Curso.FindAsync(id);
            if (curso == null)
            {
                return NotFound();
            }
            if (DateTime.Now > curso.DataInicio && DateTime.Now < curso.DataFinal)
            {
                return BadRequest("Não é possivel excluir um Curso que está em Andamento !");
            }
            if (DateTime.Now > curso.DataFinal)
            {
                return BadRequest("Não é possivel deletar um curso que já foi Concluido !");
            }
                curso.IsActive = false;
            _context.Curso.Update(curso);
            await _context.SaveChangesAsync();
            return Ok();
        }

        private bool CursoExists(int id)
        {
            return _context.Curso.Any(e => e.CursoId == id);
        }
    }
}
