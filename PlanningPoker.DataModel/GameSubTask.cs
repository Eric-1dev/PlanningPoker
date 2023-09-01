using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlanningPoker.DataModel;

public class GameSubTask : BaseEntity
{
    [Required]
    public Guid GameId { get; set; }

    [ForeignKey(nameof(GameId))]
    public Game Game { get; set; }

    [StringLength(512)]
    [Required]
    public string Text { get; set; }
}
