using PlanningPoker.Services.Models;

namespace PlanningPoker.Services.Interfaces;

public interface IGameGroupCacheService
{
    UserInfoModel AddOrUpdateUserToGame(Guid gameId, GamerConnectionModel gamerConnection);

    Guid? RemoveUserFromGame(string connectionId);

    UserInfoModel[] GetAllUsersInGame(Guid gameId, string connectionId);

    UserInfoModel GetMyInfo(Guid gameId, string connectionId);

    UserInfoModel ChangeUserVote(string connectionId, double? score, string scoreText);

    void ChangeUserStatus(string connectionId, Guid gameId, bool isPlayer);

    bool IsUserIsPlayer(Guid gameId, string connectionId);

    UserScoreModel[] CheckAllVotedAndGetScores(Guid gameId);

    UserScoreModel[] FlushPlayerScores(Guid gameId);
}
