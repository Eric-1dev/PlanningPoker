using PlanningPoker.DataLayer;
using PlanningPoker.DataModel;
using PlanningPoker.Entities.Exceptions;
using PlanningPoker.Services.Interfaces;
using PlanningPoker.Services.Models;

namespace PlanningPoker.Services.Implementation;

public class GameGroupCacheInDataBaseService : IGameGroupCacheService
{
    public GameGroupCacheInDataBaseService()
    {
        using var dbContext = new ApplicationContext();

        dbContext.GamerConnectionsCache.RemoveRange(dbContext.GamerConnectionsCache);

        dbContext.SaveChanges();
    }

    public void AddUserToGame(Guid gameId, UserInfoModel gamerConnection)
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

        dbContext.Database.BeginTransaction();

        var existingUser = dbContext.GamerConnectionsCache.FirstOrDefault(x => x.Id == gamerConnection.Id);

        if (existingUser != null)
            dbContext.GamerConnectionsCache.Remove(existingUser);

        dbContext.GamerConnectionsCache.Add(gamerConnectionEntity);

        dbContext.SaveChanges();

        dbContext.Database.CommitTransaction();
    }

    public Guid? RemoveUserFromGame(string connectionId)
    {
        using var dbContext = new ApplicationContext();

        var gamerConnection = dbContext.GamerConnectionsCache.FirstOrDefault(x => x.ConnectionId == connectionId);

        if (gamerConnection == null)
            return null;

        var gameId = gamerConnection?.GameId;

        dbContext.GamerConnectionsCache.Remove(gamerConnection);

        dbContext.SaveChanges();

        return gameId;
    }

    public UserInfoModel[] GetAllUsersInGame(Guid gameId, string connectionId)
    {
        using var dbContext = new ApplicationContext();

        var gameConnections = dbContext.GamerConnectionsCache.Where(x => x.GameId == gameId);

        return gameConnections.Select(x => new UserInfoModel(x)).ToArray();
    }

    public UserInfoModel GetMyInfo(Guid gameId, string connectionId)
    {
        using var dbContext = new ApplicationContext();

        var myConnection = dbContext.GamerConnectionsCache.First(x => x.GameId == gameId && x.ConnectionId == connectionId);

        return new UserInfoModel(myConnection);
    }

    public UserInfoModel ChangeUserVote(string connectionId, double? score)
    {
        using var dbContext = new ApplicationContext();

        var user = dbContext.GamerConnectionsCache.FirstOrDefault(x => x.ConnectionId == connectionId);

        if (!user.IsPlayer)
            throw new WorkflowException("Наблюдатель не может голосовать");

        user.Score = score;

        dbContext.SaveChanges();

        return new UserInfoModel(user);
    }

    public void ChangeUserStatus(string connectionId, Guid gameId, bool isPlayer)
    {
        using var dbContext = new ApplicationContext();

        var user = dbContext.GamerConnectionsCache.FirstOrDefault(x => x.ConnectionId == connectionId);

        user.IsPlayer = isPlayer;

        if (!isPlayer)
            user.Score = null;

        dbContext.SaveChanges();
    }

    public bool IsUserIsPlayer(Guid gameId, string connectionId)
    {
        using var dbContext = new ApplicationContext();

        var isPlayer = dbContext.GamerConnectionsCache.FirstOrDefault(x => x.ConnectionId == connectionId).IsPlayer;

        return isPlayer;
    }
}
