using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlanningPoker.DataModel;

public class GamerConnection
{
    [Key]
    public string ConnectionId { get; set; }

    public Guid GameId { get; set; }

    [ForeignKey(nameof(GameId))]
    public Game Game { get; set; }

    public Guid Id { get; set; }

    public string Name { get; set; }

    public double? Score { get; set; }

    public bool IsPlayer { get; set; }
}
