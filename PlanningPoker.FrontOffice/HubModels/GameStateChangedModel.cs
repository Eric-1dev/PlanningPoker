using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;

namespace PlanningPoker.FrontOffice.HubModels;

public class GameStateChangedModel
{
    public GameStateEnum GameState { get; set; }

    public SubTaskModel[] SubTasks { get; set; }

    public GameStateChangedModel(Game game)
    {
        GameState = game.GameState;
        SubTasks = game.SubTasks.Select(x => new SubTaskModel(x)).ToArray();
    }
}
