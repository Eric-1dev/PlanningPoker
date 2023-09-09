using PlanningPoker.Entities.Enums;
using PlanningPoker.Services.Models;

namespace PlanningPoker.FrontOffice.HubModels;

public class RescoreCurrentSubTaskModel
{
    public UserScoreModel[] PlayerScores { get; set; }
    public GameStateEnum GameState { get; set; }
    public SubTaskModel SubTask { get; set; }
    public double? Score { get; set; }

    public RescoreCurrentSubTaskModel(UserScoreModel[] playerScores, SubTaskModel subTask)
    {
        PlayerScores = playerScores;
        GameState = GameStateEnum.Scoring;
        SubTask = subTask;
        Score = null;
    }
}
