using System.ComponentModel.DataAnnotations;

namespace PlanningPoker.DataModel;

public class GamerConnection : BaseEntity
{
    public string ConnectionId { get; set; }

    public Guid GameId { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; }

    public double? Score { get; set; }

    public bool IsPlayer { get; set; }

    public bool IsActive { get; set; }
}
