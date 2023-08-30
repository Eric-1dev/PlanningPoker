using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PlanningPoker.Entities.Enums;

namespace PlanningPoker.DataModel;

public class Game
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public virtual List<GameTask> Tasks { get; set; }

    [Column("GameStateId")]
    [Required]
    public GameStateEnum GameState { get; set; }
}
