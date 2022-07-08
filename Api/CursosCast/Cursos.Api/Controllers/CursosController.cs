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
                var resultado = _context.Curso.Where(x => x.Descricao.ToLower() == curso.Descricao.ToLower()).FirstOrDefault();
                if (resultado != null)
                {
                    return BadRequest("Descrição é a mesma usada em Outro Curso !");
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
                var resultado = _context.Curso.Where(x => x.Descricao.ToLower() == curso.Descricao.ToLower()).FirstOrDefault();
                if (resultado != null)
                {
                    return BadRequest("Descrição é a mesma usada em Outro Curso !");
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
            if (DateTime.Now > curso.DataInicio && DateTime.Now < curso.DataFinal || DateTime.Now > curso.DataFinal)
            {
                return BadRequest();
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
