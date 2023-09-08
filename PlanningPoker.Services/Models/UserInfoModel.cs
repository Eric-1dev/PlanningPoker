using PlanningPoker.DataModel;

namespace PlanningPoker.Services.Models;

public class UserInfoModel
{
    public string ConnectionId { get; set; }

    public Guid Id { get; set; }

    public string Name { get; set; }

    public bool HasVoted { get; set; }

    public double? Score { get; set; }

    public string ScoreText { get; set; }

    public bool IsPlayer { get; set; }

    public UserInfoModel()
    { }

    public UserInfoModel(GamerConnection gamerConnection)
    {
        ConnectionId = gamerConnection.ConnectionId;
        Id = gamerConnection.UserId;
        Name = gamerConnection.Name;
        HasVoted = gamerConnection.Score != null;
        Score = gamerConnection.Score;
        ScoreText = gamerConnection.ScoreText;
        IsPlayer = gamerConnection.IsPlayer;
    }

    public static void ClearScores(UserInfoModel[] userInfos)
    {
        foreach (var userInfo in userInfos)
        {
            ClearScore(userInfo);
        }
    }

    public static void ClearScore(UserInfoModel userInfo)
    {
        userInfo.Score = null;
        userInfo.ScoreText = null;
    }
}
