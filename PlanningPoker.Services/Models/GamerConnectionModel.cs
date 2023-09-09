namespace PlanningPoker.Services.Models;

public class GamerConnectionModel
{
    public string ConnectionId { get; set; }

    public string Name { get; set; }

    public bool IsPlayer { get; set; }

    public Guid UserId { get; set; }

    public GamerConnectionModel(string connectionId, Guid userId, string userName, bool isPlayer)
    {
        ConnectionId = connectionId;
        UserId = userId;
        Name = userName;
        IsPlayer = isPlayer;
    }
}
