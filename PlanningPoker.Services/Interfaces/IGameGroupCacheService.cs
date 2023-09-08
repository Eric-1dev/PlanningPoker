using PlanningPoker.Services.Models;

namespace PlanningPoker.Services.Interfaces;

public interface IGameGroupCacheService
{
    void AddUserToGame(Guid gameId, UserInfoModel gamerConnection);

    Guid? RemoveUserFromGame(string connectionId);

    UserInfoModel[] GetAllUsersInGame(Guid gameId, string connectionId);

    UserInfoModel GetMyInfo(Guid gameId, string connectionId);

    UserInfoModel ChangeUserVote(string connectionId, double? score);

    void ChangeUserStatus(string connectionId, Guid gameId, bool isPlayer);

    bool IsUserIsPlayer(Guid gameId, string connectionId);
}
