using PlanningPoker.DataModel;
using PlanningPoker.Services.Models;

namespace PlanningPoker.FrontOffice.HubModels;

public class GameStateChangedModel : ShowPlayerScoresModel
{
    public SubTaskModel[] SubTasks { get; set; }

    public GameStateChangedModel(Game game, UserScoreModel[] playerScores) : base(playerScores, game.GameState)
    {
        SubTasks = game.SubTasks.Select(x => new SubTaskModel(x)).ToArray();
    }
}
