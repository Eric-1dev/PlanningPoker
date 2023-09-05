using PlanningPoker.Entities.Models;

namespace PlanningPoker.FrontOffice.Models;

public class GameProgressViewModel
{
    public Guid GameId { get; set; }

    public string TaskName { get; set; }

    public Card[] Cards { get; set; }
}
