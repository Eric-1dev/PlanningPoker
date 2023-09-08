using PlanningPoker.DataModel;

namespace PlanningPoker.Services.Models;

public class UserInfoModel
{
    public string ConnectionId { get; set; }

    public Guid Id { get; set; }

    public string Name { get; set; }

    public bool HasVoted { get; set; }

    public bool IsPlayer { get; set; }

    public UserInfoModel()
    { }

    public UserInfoModel(GamerConnection gamerConnection)
    {
        ConnectionId = gamerConnection.ConnectionId;
        Id = gamerConnection.Id;
        Name = gamerConnection.Name;
        HasVoted = gamerConnection.Score != null;
        IsPlayer = gamerConnection.IsPlayer;
    }
}
