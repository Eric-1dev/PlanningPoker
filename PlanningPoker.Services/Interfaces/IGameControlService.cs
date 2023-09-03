using PlanningPoker.DataModel;

namespace PlanningPoker.Services.Interfaces;

public interface IGameControlService
{
    Guid CreateNewGame(string taskName, string[] subTasks, Guid adminId);

    Game GetGameById(Guid id);

    bool CanUserVote(Guid gameId);
}
