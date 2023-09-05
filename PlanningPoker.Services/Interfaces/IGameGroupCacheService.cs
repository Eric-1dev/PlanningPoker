using PlanningPoker.Services.Models.GameInfoModel;

namespace PlanningPoker.Services.Interfaces;

public interface IGameGroupCacheService
{
    void AddUserToGame(Guid gameId, GamerConnectionModel gamerConnection);

    Guid? RemoveUserFromGame(string connectionId);

    GamerConnectionModel[] GetOtherUsersInGame(Guid gameId, string connectionId);

    GamerConnectionModel ChangeUserVote(string connectionId, double? score);
}
