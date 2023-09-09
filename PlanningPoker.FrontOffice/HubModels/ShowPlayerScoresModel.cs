using PlanningPoker.Entities.Enums;
using PlanningPoker.Services.Models;

namespace PlanningPoker.FrontOffice.HubModels;

public class ShowPlayerScoresModel
{
    public UserScoreModel[] PlayerScores { get; set; }

    public GameStateEnum GameState { get; set; }

    public bool IsFinalTask { get; set; }

    public ShowPlayerScoresModel(UserScoreModel[] playerScores, GameStateEnum gameState)
    {
        PlayerScores = playerScores;
        GameState = gameState;
    }
}
