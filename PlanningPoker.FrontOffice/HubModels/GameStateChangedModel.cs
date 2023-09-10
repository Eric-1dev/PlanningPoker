using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Services.Models;

namespace PlanningPoker.FrontOffice.HubModels;

public class GameStateChangedModel
{
    public GameStateEnum GameState { get; set; }

    public SubTaskModel[] SubTasks { get; set; }

    public UserScoreModel[] PlayerScores { get; set; }

    public GameStateChangedModel(Game game, UserScoreModel[] playerScores)
    {
        GameState = game.GameState;
        SubTasks = game.SubTasks.Select(x => new SubTaskModel(x)).ToArray();
        PlayerScores = playerScores;
    }
}
