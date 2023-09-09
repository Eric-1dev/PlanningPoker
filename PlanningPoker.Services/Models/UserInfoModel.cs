using PlanningPoker.DataModel;

namespace PlanningPoker.Services.Models;

public class UserInfoModel : UserScoreModel
{
    public string ConnectionId { get; set; }

    public string Name { get; set; }

    public bool HasVoted { get; set; }

    public bool IsPlayer { get; set; }

    public bool IsActive { get; set; }

    public UserInfoModel(string connectionId, Guid userId, string userName, bool isPlayer) : base(userId, null)
    {
        ConnectionId = connectionId;
        UserId = userId;
        Name = userName;
        IsPlayer = isPlayer;
    }

    public UserInfoModel(GamerConnection gamerConnection) : base(gamerConnection.UserId, gamerConnection.Score)
    {
        ConnectionId = gamerConnection.ConnectionId;
        Name = gamerConnection.Name;
        HasVoted = gamerConnection.Score != null;
        IsPlayer = gamerConnection.IsPlayer;
        IsActive = gamerConnection.IsActive;
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
    }
}
