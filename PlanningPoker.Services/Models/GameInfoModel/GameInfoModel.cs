using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;

namespace PlanningPoker.Services.Models.GameInfoModel;

public class GameInfoModel
{
    public GamerConnectionModel[] OtherUsers { get; set; }

    public string TaskName { get; set; }

    public SubTaskModel[] SubTasks { get; set; }

    public GameStateEnum GameState { get; set; }

    public GameInfoModel(Game game, GamerConnectionModel[] otherUsers)
    {
        OtherUsers = otherUsers;
        TaskName = game.TaskName;
        GameState = game.GameState;
        SubTasks = game.SubTasks.Select(x => new SubTaskModel
        {
            Score = x.Score,
            Text = x.Text,
            IsSelected = x.IsSelected
        }).ToArray();
    }
}
