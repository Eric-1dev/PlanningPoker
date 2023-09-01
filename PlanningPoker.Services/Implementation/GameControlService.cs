using PlanningPoker.DataLayer;
using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Services.Interfaces;

namespace PlanningPoker.Services.Implementation;

public class GameControlService : IGameControlService
{
    public Guid CreateNewGame(string taskName, string[] subTasks)
    {
        using var dbContext = new ApplicationContext();

        var game = new Game
        {
            GameState = GameStateEnum.Paused,
            TaskName = taskName,
            SubTasks = subTasks.Select(x => new GameSubTask { Text = x}).ToList(),
        };

        dbContext.Games.Add(game);

        dbContext.SaveChanges();

        return game.Id;
    }

    public GameSubTask[] GetTasksByGameById(Guid gameId)
    {
        using var dbContext = new ApplicationContext();

        var game = dbContext.Games.FirstOrDefault(x => x.Id == gameId);

        if (game == null)
            throw new Exception($"Игра с ID {gameId} не найдена");

        return game.SubTasks.ToArray();
    }
}
