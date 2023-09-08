using PlanningPoker.Utils.Constants;

namespace PlanningPoker.Services.Models;

public class UserScoreModel
{
    public Guid UserId { get; set; }

    public double Score { get; set; }

    public string ScoreText { get; set; }

    public UserScoreModel(Guid userId, double score, string scoreText)
    {
        UserId = userId;
        Score = score;
        ScoreText = scoreText;
    }
}
