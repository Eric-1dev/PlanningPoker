using Microsoft.EntityFrameworkCore;
using PlanningPoker.DataLayer;
using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Services.Interfaces;

namespace PlanningPoker.Services.Implementation;

public class GameControlService : IGameControlService
{
    public bool CanUserVote(Guid gameId)
    {
        using var dbContext = new ApplicationContext();

        var game = dbContext.Games.FirstOrDefault(x => x.Id == gameId);

        return game?.GameState == GameStateEnum.Running;
    }

    public Guid CreateNewGame(string taskName, string[] subTasks, Guid adminId)
    {
        using var dbContext = new ApplicationContext();

        var game = new Game
        {
            GameState = GameStateEnum.Paused,
            TaskName = taskName,
            SubTasks = subTasks.Select(x => new GameSubTask { Text = x}).ToList(),
            AdminId = adminId
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

        if (game == null)
            throw new Exception($"Игра с ID {gameId} не найдена");

        return game;
    }
}
