using PlanningPoker.DataModel;

namespace PlanningPoker.FrontOffice.HubModels;

public class SubTaskModel
{
    public Guid Id { get; set; }

    public string Text { get; set; }

    public double? Score { get; set; }

    public int Order { get; set; }

    public bool IsSelected { get; set; }

    public SubTaskModel(GameSubTask gameSubTask)
    {
        Id = gameSubTask.Id;
        Score = gameSubTask.Score;
        Text = gameSubTask.Text;
        IsSelected = gameSubTask.IsSelected;
        Order = gameSubTask.Order;
    }
}
