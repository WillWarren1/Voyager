using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voyager.Models;
using content;
using Microsoft.AspNetCore.Authorization;

namespace content.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class TreasuresController : ControllerBase
  {
    private readonly DatabaseContext _context;

    public TreasuresController()
    {
      this._context = new DatabaseContext();
    }

    // GET: api/Treasures
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Treasure>>> GetTreasures()
    {
      return await _context.Treasures.ToListAsync();
    }

    // GET: api/Treasures/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Treasure>> GetTreasure(int id)
    {
      var treasure = await _context.Treasures.FindAsync(id);

      if (treasure == null)
      {
        return NotFound();
      }

      return treasure;
    }

    // PUT: api/Treasures/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTreasure(int id, Treasure treasure)
    {
      if (id != treasure.Id)
      {
        return BadRequest();
      }

      _context.Entry(treasure).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
        return Ok();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!TreasureExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      //   return NoContent();
    }

    // POST: api/Treasures
    [HttpPost]
    public async Task<ActionResult<Treasure>> PostTreasure(Treasure treasure)
    {
      Console.WriteLine(treasure.Value);
      _context.Treasures.Add(treasure);
      var treasureId = treasure.Id;
      await _context.SaveChangesAsync();
      // go to player table
      var currentUser = User;
      var currentUserId = User.Claims.First(f => f.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;

      var currentPlayer = await _context
            .Players
            .FirstOrDefaultAsync(f => f.userId == currentUserId);

      // var player = _context.Players.FirstOrDefault(f => f.Id == 1);
      currentPlayer.CapturedTreasure.Add(treasure);
      currentPlayer.AmountOfTreasure = currentPlayer.AmountOfTreasure + treasure.Value;
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetTreasure", new { id = treasure.Id }, treasure);
    }

    // DELETE: api/Treasures/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<Treasure>> DeleteTreasure(int id)
    {
      var treasure = await _context.Treasures.FindAsync(id);
      if (treasure == null)
      {
        return NotFound();
      }

      _context.Treasures.Remove(treasure);
      await _context.SaveChangesAsync();

      return treasure;
    }

    private bool TreasureExists(int id)
    {
      return _context.Treasures.Any(e => e.Id == id);
    }
  }
}
