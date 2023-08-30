using PlanningPoker.DataLayer;
using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Services.Interfaces;

namespace PlanningPoker.Services.Implementation;

public class GameControlService : IGameControlService
{
    public Guid CreateNewGame(string[] tasks)
    {
        using var dbContext = new ApplicationContext();

        var game = new Game
        {
            GameState = GameStateEnum.Paused,
            Tasks = tasks.Select(x => new GameTask { Text = x}).ToList(),
        };

        dbContext.Games.Add(game);

        dbContext.SaveChanges();

        return game.Id;
    }

    public GameTask[] GetTasksByGameById(Guid gameId)
    {
        using var dbContext = new ApplicationContext();

        var game = dbContext.Games.FirstOrDefault(x => x.Id == gameId);

        if (game == null)
            throw new Exception($"Игра с ID {gameId} не найдена");

        return game.Tasks.ToArray();
    }
}
