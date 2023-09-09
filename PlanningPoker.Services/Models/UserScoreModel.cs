namespace PlanningPoker.Services.Models;

public class UserScoreModel
{
    public Guid UserId { get; set; }

    public double? Score { get; set; }

    public UserScoreModel(Guid userId, double? score)
    {
        UserId = userId;
        Score = score;
    }
}
