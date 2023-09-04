using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;

namespace PlanningPoker.Services.Interfaces;

public interface IGameControlService
{
    Guid CreateNewGame(string taskName, string[] subTasks, Guid adminId, CardSetTypeEnum cardSetType);

    Game GetGameById(Guid id);

    bool CanUserVote(Guid gameId);
}
