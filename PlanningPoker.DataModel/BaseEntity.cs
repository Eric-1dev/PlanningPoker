using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PlanningPoker.DataModel;

public abstract class BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public DateTime Created { get; set; }

    public BaseEntity()
    {
        Created = DateTime.Now;
    }
}
