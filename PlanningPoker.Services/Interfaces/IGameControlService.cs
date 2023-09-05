using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Services.Dto;

namespace PlanningPoker.Services.Interfaces;

public interface IGameControlService
{
    Guid CreateNewGame(string taskName, string[] subTasks, Guid adminId, CardSetTypeEnum cardSetType);

    Game GetGameById(Guid id);

    bool CanUserVote(Guid gameId);

    ChangeSubTaskScoreDto TryChangeSubTaskScore(Guid userId, Guid gameId, Guid subTaskId, double? score);
}
