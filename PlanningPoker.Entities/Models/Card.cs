using PlanningPoker.Entities.Enums;

namespace PlanningPoker.Entities.Models;

public class Card
{
    public double Score { get; set; }
    public string Text { get; set; }
    public CardColorEnum Color { get; set; }

    public Card(double score, CardColorEnum color, string text)
    {
        Score = score;
        Text = text;
        Color = color;
    }

    public Card(double score, CardColorEnum color) : this(score, color, score.ToString())
    { }
}
