using PlanningPoker.DataModel;

namespace PlanningPoker.Services.Interfaces;

public interface IGameControlService
{
    Guid CreateNewGame(string[] tasks);

    GameTask[] GetTasksByGameById(Guid id);
}
