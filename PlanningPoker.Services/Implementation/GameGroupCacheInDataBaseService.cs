using PlanningPoker.DataLayer;
using PlanningPoker.DataModel;
using PlanningPoker.Services.Interfaces;
using PlanningPoker.Services.Models.GameInfoModel;

namespace PlanningPoker.Services.Implementation;

public class GameGroupCacheInDataBaseService : IGameGroupCacheService
{
    public GameGroupCacheInDataBaseService()
    {
        using var dbContext = new ApplicationContext();

        dbContext.GamerConnectionsCache.RemoveRange(dbContext.GamerConnectionsCache);

        dbContext.SaveChanges();
    }

    public void AddUserToGame(Guid gameId, GamerConnectionModel gamerConnection)
    {
        var gamerConnectionEntity = new GamerConnection
        {
            GameId = gameId,
            ConnectionId = gamerConnection.ConnectionId,
            Id = gamerConnection.Id,
            Name = gamerConnection.Name,
            Score = null,
            IsPlayer = true,
        };

        using var dbContext = new ApplicationContext();

        var existingUser = dbContext.GamerConnectionsCache.FirstOrDefault(x => x.Id == gamerConnection.Id);

        if (existingUser != null)
            dbContext.GamerConnectionsCache.Remove(existingUser);

        dbContext.GamerConnectionsCache.Add(gamerConnectionEntity);

        dbContext.SaveChanges();
    }

    public Guid? RemoveUserFromGame(string connectionId)
    {
        using var dbContext = new ApplicationContext();

        var gamerConnection = dbContext.GamerConnectionsCache.FirstOrDefault(x => x.ConnectionId == connectionId);

        var gameId = gamerConnection?.GameId;

        dbContext.GamerConnectionsCache.Remove(gamerConnection);

        dbContext.SaveChanges();

        return gameId;
    }

    public GamerConnectionModel[] GetOtherUsersInGame(Guid gameId, string connectionId)
    {
        using var dbContext = new ApplicationContext();

        var gameConnections = dbContext.GamerConnectionsCache.Where(x => x.GameId == gameId && x.IsPlayer && x.ConnectionId != connectionId);

        return gameConnections.Select(x => new GamerConnectionModel(x)).ToArray();
    }

    public GamerConnectionModel ChangeUserVote(string connectionId, double? score)
    {
        using var dbContext = new ApplicationContext();

        var user = dbContext.GamerConnectionsCache.FirstOrDefault(x => x.ConnectionId == connectionId);

        user.Score = score;

        dbContext.SaveChanges();

        return new GamerConnectionModel(user);
    }
}
