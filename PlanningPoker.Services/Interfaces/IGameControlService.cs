using PlanningPoker.DataModel;

namespace PlanningPoker.Services.Interfaces;

public interface IGameControlService
{
    Guid CreateNewGame(string taskName, string[] subTasks);

    GameSubTask[] GetTasksByGameById(Guid id);
}
