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
  public class PlayersController : ControllerBase
  {

    private string _getUserId(System.Security.Claims.ClaimsPrincipal user)
    {
      var userId = user.Claims.First(f => f.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;
      return userId;
    }

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

    [HttpGet("check")]
    public async Task<ActionResult> CheckIfPlayerExist()
    {

      var currentUser = User;
      var currentUserId = User.Claims.First(f => f.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;

      var rv = await _context.Players.AnyAsync(a => a.userId == currentUserId);

      return Ok(new { PlayerExists = rv });
    }

    [HttpGet("playerTreasure")]
    public async Task<ActionResult> GetPlayerTreasure()
    {
      var currentUser = User;
      var currentUserId = User.Claims.First(f => f.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;

      var currentPlayer = await _context
            .Players
            .Include(i => i.CapturedTreasure)
            .FirstOrDefaultAsync(f => f.userId == currentUserId);

      if (currentPlayer == null)
      {
        return NotFound();
      }
      return Ok(new { currentPlayer });
    }


    [HttpGet("current")]
    public async Task<ActionResult> GetCurrentPlayer()
    {
      var currentUser = User;
      var currentUserId = User.Claims.First(f => f.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value;

      var currentPlayer = await _context
            .Players
            .FirstOrDefaultAsync(f => f.userId == currentUserId);

      if (currentPlayer == null)
      {
        return NotFound();
      }
      return Ok(new { currentPlayer });
    }

    // GET: api/Players/5
    [HttpGet("{userId}")]
    public async Task<ActionResult<Player>> GetPlayer(string userId)
    {
      var player = await _context
        .Players
        .Include(i => i.CapturedTreasure)
        .FirstOrDefaultAsync(f => f.userId == userId);
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
      var _userId = _getUserId(User);
      player.userId = _userId;
      _context.Players.Add(player);
      await _context.SaveChangesAsync();

      return player;
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
