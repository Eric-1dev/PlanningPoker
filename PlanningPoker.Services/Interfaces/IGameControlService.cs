using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;

namespace PlanningPoker.Services.Interfaces;

public interface IGameControlService
{
    bool IsGameExists(Guid gameId);

    Guid CreateNewGame(string taskName, string[] subTasks, Guid adminId, CardSetTypeEnum cardSetType);

    Game GetGameById(Guid id);

    bool IsGameRunning(Guid gameId);

    GameSubTask TryChangeSubTaskScore(Guid userId, Guid gameId, Guid subTaskId, double? score);

    Game StartGame(Guid gameId, Guid userId);

    Game OpenCards(Guid gameId, Guid userId);

    CardSetTypeEnum GetCardSetType(Guid gameId);

    GameSubTask RescoreCurrentSubTask(Guid gameId, Guid userId);

    GameSubTask ScoreNextSubTask(Guid gameId, Guid userId);
}
