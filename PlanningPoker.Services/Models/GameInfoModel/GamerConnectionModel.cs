using PlanningPoker.DataModel;

namespace PlanningPoker.Services.Models.GameInfoModel;

public class GamerConnectionModel
{
    public string ConnectionId { get; set; }

    public Guid Id { get; set; }

    public string Name { get; set; }

    public bool HasVoted { get; set; }

    public bool IsPlayer { get; set; }

    public GamerConnectionModel()
    { }

    public GamerConnectionModel(GamerConnection gamerConnection)
    {
        ConnectionId = gamerConnection.ConnectionId;
        Id = gamerConnection.Id;
        Name = gamerConnection.Name;
        HasVoted = gamerConnection.HasVoted;
        IsPlayer = gamerConnection.IsPlayer;
    }
}
