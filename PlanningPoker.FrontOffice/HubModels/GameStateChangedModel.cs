using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Utils.Constants;

namespace PlanningPoker.FrontOffice.HubModels;

public class GameStateChangedModel
{
    public GameStateEnum GameState { get; set; }
    public SubTaskModel[] SubTasks { get; set; }
    public double[] AvailableScores { get; set; }

    public GameStateChangedModel(Game game)
    {
        GameState = game.GameState;
        SubTasks = game.SubTasks.Select(x => new SubTaskModel(x)).ToArray();
        //AvailableScores = CardSetConstants.GetAvailableScores(game.CardSetType);
    }
}
