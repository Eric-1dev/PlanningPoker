using PlanningPoker.Entities.Enums;

namespace PlanningPoker.Entities.Models;

public class CardSet
{
    public CardSetTypeEnum CardSetType { get; set; }

    public Card[] Cards { get; set; }
}
