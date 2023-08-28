using PlanningPoker.Entities.Enums;

namespace PlanningPoker.FrontOffice.Models;

public class CardViewModel
{
    public double Score { get; set; }

    public CardColorEnum Color { get; set; }

    public CardViewModel()
    { }

    public CardViewModel(double score, CardColorEnum color)
    {
        Score = score;
        Color = color;
    }
}
