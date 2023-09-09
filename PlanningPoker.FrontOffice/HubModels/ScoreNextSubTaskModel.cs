using PlanningPoker.Entities.Enums;
using PlanningPoker.Services.Models;

namespace PlanningPoker.FrontOffice.HubModels;

public class ScoreNextSubTaskModel : ShowPlayerScoresModel
{
    public SubTaskModel SubTask { get; set; }

    public ScoreNextSubTaskModel(UserScoreModel[] playerScores, SubTaskModel subTask) : base(playerScores, GameStateEnum.Scoring)
    {
        SubTask = subTask;
    }
}
