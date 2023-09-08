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

    public UserInfoModel AddOrUpdateUserToGame(Guid gameId, UserInfoModel gamerConnection)
    {
        using var dbContext = new ApplicationContext();

        dbContext.Database.BeginTransaction();

        var userConnection = dbContext.GamerConnectionsCache.FirstOrDefault(x => x.UserId == gamerConnection.Id);

        if (userConnection != null)
        {
            userConnection.ConnectionId = gamerConnection.ConnectionId;
            userConnection.IsActive = true;
        }
        else
        {
            userConnection = new GamerConnection
            {
                GameId = gameId,
                ConnectionId = gamerConnection.ConnectionId,
                UserId = gamerConnection.Id,
                Name = gamerConnection.Name,
                Score = null,
                IsPlayer = gamerConnection.IsPlayer,
                IsActive = true,
            };

            dbContext.GamerConnectionsCache.Add(userConnection);
        }

        dbContext.SaveChanges();

        dbContext.Database.CommitTransaction();

        return new UserInfoModel(userConnection);
    }

    public Guid? RemoveUserFromGame(string connectionId)
    {
        using var dbContext = new ApplicationContext();

        var gamerConnection = dbContext.GamerConnectionsCache.FirstOrDefault(x => x.ConnectionId == connectionId);

        if (gamerConnection == null)
            return null;

        var gameId = gamerConnection?.GameId;

        gamerConnection.IsActive = false;

        dbContext.SaveChanges();

        return gameId;
    }

    public UserInfoModel[] GetAllUsersInGame(Guid gameId, string connectionId)
    {
        using var dbContext = new ApplicationContext();

        var gameConnections = dbContext.GamerConnectionsCache.Where(x => x.GameId == gameId && x.IsActive);

        return gameConnections.Select(x => new UserInfoModel(x)).ToArray();
    }

    public UserInfoModel GetMyInfo(Guid gameId, string connectionId)
    {
        using var dbContext = new ApplicationContext();

        var myConnection = dbContext.GamerConnectionsCache.First(x => x.GameId == gameId && x.ConnectionId == connectionId);

        return new UserInfoModel(myConnection);
    }

    public UserInfoModel ChangeUserVote(string connectionId, double? score, string scoreText)
    {
        using var dbContext = new ApplicationContext();

        var user = dbContext.GamerConnectionsCache.FirstOrDefault(x => x.ConnectionId == connectionId);

        if (!user.IsPlayer)
            throw new WorkflowException("Наблюдатель не может голосовать");

        user.Score = score;
        user.ScoreText = scoreText;

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

    public UserScoreModel[] CheckAllVotedAndGetScores(Guid gameId)
    {
        using var dbContext = new ApplicationContext();

        var allScores = dbContext.GamerConnectionsCache
            .Where(x => x.GameId == gameId && x.IsPlayer)
            .Select(x => new
            {
                UserId = x.UserId,
                Score = x.Score,
                ScoreText = x.ScoreText
            }).ToArray();

        if (allScores.Any(x => x.Score == null))
            return null;

        return allScores
            .Select(x => new UserScoreModel(x.UserId, x.Score.Value, x.ScoreText))
            .ToArray();
    }
}
