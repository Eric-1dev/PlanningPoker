using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PlanningPoker.Entities.Enums;

namespace PlanningPoker.DataModel;

public class Game
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [StringLength(512)]
    [Required]
    public string TaskName { get; set; }

    public Guid AdminId { get; set; }

    [Column("GameStateId")]
    [Required]
    public GameStateEnum GameState { get; set; }

    public double TotalScore { get; set; }

    [Column("CardSetTypeId")]
    public CardSetTypeEnum CardSetType { get; set; }

    public virtual List<GameSubTask> SubTasks { get; set; }

    public virtual List<GamerConnection> Gamers { get; set; }
}
