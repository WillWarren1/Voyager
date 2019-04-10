using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Voyager.Models;
using content;

namespace content.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class PlayersController : ControllerBase
  {
    private readonly DatabaseContext _context;

    public PlayersController()
    {
      this._context = new DatabaseContext();
    }

    // GET: api/Players
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Player>>> GetPlayers()
    {
      return await _context.Players.ToListAsync();
    }

    // GET: api/Players/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Player>> GetPlayer(int id)
    {
      var player = await _context
        .Players
        .Include(i => i.CapturedTreasure)
        .FirstOrDefaultAsync(f => f.Id == id);
      // .OrderByDescending(o => o.Id)
      if (player == null)
      {
        return NotFound();
      }

      player.CapturedTreasure = player.CapturedTreasure.OrderByDescending(o => o.Id).ToList();
      return player;
    }

    // PUT: api/Players/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPlayer(int id, Player player)
    {
      if (id != player.Id)
      {
        return BadRequest();
      }

      _context.Entry(player).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
        return Ok();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!PlayerExists(id))
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

    // POST: api/Players
    [HttpPost]
    public async Task<ActionResult<Player>> PostPlayer(Player player)
    {
      _context.Players.Add(player);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetPlayer", new { id = player.Id }, player);
    }

    // DELETE: api/Players/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<Player>> DeletePlayer(int id)
    {
      var player = await _context.Players.FindAsync(id);
      if (player == null)
      {
        return NotFound();
      }

      _context.Players.Remove(player);
      await _context.SaveChangesAsync();

      return player;
    }

    private bool PlayerExists(int id)
    {
      return _context.Players.Any(e => e.Id == id);
    }
  }
}