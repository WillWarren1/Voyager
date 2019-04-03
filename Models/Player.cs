using System;

namespace Voyager.Models
{
  public class Player
  {
    public int Id { get; set; }

    public string Name { get; set; }

    public int? AmountOfTreasure { get; set; }

    public int Renown { get; set; }
  }
}