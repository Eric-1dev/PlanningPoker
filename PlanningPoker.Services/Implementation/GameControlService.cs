using Microsoft.EntityFrameworkCore;
using PlanningPoker.DataLayer;
using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Services.Dto;
using PlanningPoker.Services.Interfaces;

namespace PlanningPoker.Services.Implementation;

public class GameControlService : IGameControlService
{
    public bool IsGameRunning(Guid gameId)
    {
        using var dbContext = new ApplicationContext();

        var game = dbContext.Games.FirstOrDefault(x => x.Id == gameId);

        return game?.GameState == GameStateEnum.Running;
    }

    public Guid CreateNewGame(string taskName, string[] subTasks, Guid adminId, CardSetTypeEnum cardSetType)
    {
        var subTaskList = new List<GameSubTask>();

        for (int i = 0; i < subTasks.Length; i++)
        {
            subTaskList.Add(new GameSubTask
            {
                Order = i,
                IsSelected = false,
                Text = subTasks[i],
                Score = null
            });
        }

        using var dbContext = new ApplicationContext();

        var game = new Game
        {
            GameState = GameStateEnum.Paused,
            TaskName = taskName,
            SubTasks = subTaskList,
            AdminId = adminId,
            CardSetType = cardSetType
        };

        dbContext.Games.Add(game);

        dbContext.SaveChanges();

        return game.Id;
    }

    public Game GetGameById(Guid gameId)
    {
        using var dbContext = new ApplicationContext();

        var game = dbContext.Games
            .Where(x => x.Id == gameId)
            .Include(x => x.SubTasks)
            .FirstOrDefault();

        return game ?? throw new Exception($"Игра с ID {gameId} не найдена");
    }

    public ChangeSubTaskScoreDto TryChangeSubTaskScore(Guid userId, Guid gameId, Guid subTaskId, double? score)
    {
        using var dbContext = new ApplicationContext();

        var subTask = dbContext.GameSubTasks.FirstOrDefault(x => x.Id == subTaskId && x.Game.Id == gameId && x.Game.AdminId == userId);

        if (subTask == null)
            return null;

        subTask.Score = score;

        dbContext.SaveChanges();

        return new ChangeSubTaskScoreDto { SubTaskId = subTask.Id, Score = score };
    }
}
