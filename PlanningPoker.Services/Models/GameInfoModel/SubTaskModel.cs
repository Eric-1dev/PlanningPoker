namespace PlanningPoker.Services.Models.GameInfoModel;

public class SubTaskModel
{
    public Guid Id { get; set; }

    public string Text { get; set; }

    public double? Score { get; set; }

    public int Order { get; set; }

    public bool IsSelected { get; set; }
}
