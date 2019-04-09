using System;
using System.Collections.Generic;

namespace Voyager.Models
{
  public class Player
  {
    public int Id { get; set; }

    public string Name { get; set; }

    public int? AmountOfTreasure { get; set; }

    public int Renown { get; set; }

    public List<Treasure> CapturedTreasure { get; set; }
  }
}