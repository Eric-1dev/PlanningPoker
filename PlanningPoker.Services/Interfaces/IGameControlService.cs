using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Services.Models;

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

    Game RescoreCurrentSubTask(Guid gameId, Guid userId);

    Game ScoreNextSubTask(Guid gameId, Guid userId);

    Game FinishGame(Guid gameId, Guid userId);

    GameSubTask[] UpdateSubTasks(Guid gameId, Guid userId, List<UpdateSubTaskModel> subTasks);

    Game ChangeSelectedSubTask(Guid gameId, Guid userId, Guid subTaskId);
}
