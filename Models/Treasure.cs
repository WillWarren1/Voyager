using System;

namespace Voyager.Models
{
  public class Treasure
  {
    public int Id { get; set; }

    public int Value { get; set; }

    public bool IsCaptured { get; set; } = true;

    public string BelongsToPlayer { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }
  }
}