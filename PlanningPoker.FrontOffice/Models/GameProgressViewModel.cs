using PlanningPoker.Entities.Models;

namespace PlanningPoker.FrontOffice.Models;

public class GameProgressViewModel
{
    public Guid GameId { get; set; }

    public Guid UserId { get; set; }

    public bool IsPlayerCookieValue { get; set; }
}
