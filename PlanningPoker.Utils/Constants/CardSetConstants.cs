using PlanningPoker.Entities.Enums;
using PlanningPoker.Entities.Models;

namespace PlanningPoker.Utils.Constants;

public static class CardSetConstants
{
    private static CardSet[] _cardSets;

    static CardSetConstants()
    {
        _cardSets = new CardSet[]
        {
            new CardSet {
                CardSetType = CardSetTypeEnum.Classic,
                Cards = new Card[]
                {
                    new Card(0,     CardColorEnum.Green),
                    new Card(0.5,   CardColorEnum.Green, "½"),
                    new Card(1,     CardColorEnum.Green),
                    new Card(2,     CardColorEnum.Green),
                    new Card(3,     CardColorEnum.Green),
                    new Card(5,     CardColorEnum.Yellow),
                    new Card(8,     CardColorEnum.Yellow),
                    new Card(13,    CardColorEnum.Yellow),
                    new Card(21,    CardColorEnum.Red),
                    new Card(34,    CardColorEnum.Red),
                    new Card(55,    CardColorEnum.Red),
                    new Card(-1,  CardColorEnum.Gray, "Pass")
                }
            }
        };
    }

    public static Card[] Cards(CardSetTypeEnum cardSetType)
    {
        return _cardSets.First(x => x.CardSetType == cardSetType).Cards;
    }

    public static bool HasCardInSet(CardSetTypeEnum cardSetType, double score)
    {
        return Cards(cardSetType).FirstOrDefault(x => x.Score == score) != null;
    }
}
