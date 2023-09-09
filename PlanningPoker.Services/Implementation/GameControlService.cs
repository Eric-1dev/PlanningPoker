using Microsoft.EntityFrameworkCore;
using PlanningPoker.DataLayer;
using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Entities.Exceptions;
using PlanningPoker.Services.Interfaces;

namespace PlanningPoker.Services.Implementation;

public class GameControlService : IGameControlService
{
    public bool IsGameExists(Guid gameId)
    {
        using var dbContext = new ApplicationContext();

        var isExists = dbContext.Games.Any(x => x.Id == gameId);

        return isExists;
    }

    public bool IsGameRunning(Guid gameId)
    {
        using var dbContext = new ApplicationContext();

        var game = dbContext.Games.FirstOrDefault(x => x.Id == gameId);

        return game?.GameState == GameStateEnum.Scoring;
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
            GameState = GameStateEnum.Created,
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

        return game ?? throw new WorkflowException($"Игра с ID {gameId} не найдена");
    }

    public GameSubTask TryChangeSubTaskScore(Guid userId, Guid gameId, Guid subTaskId, double? score)
    {
        using var dbContext = new ApplicationContext();

        var subTask = dbContext.GameSubTasks.FirstOrDefault(x => x.Id == subTaskId && x.Game.Id == gameId && x.Game.AdminId == userId);

        if (subTask == null)
            throw new WorkflowException("Подзадача с указанным ID не найдена");

        if (!subTask.IsSelected)
            throw new WorkflowException("Можно изменить оценку только выбранной задачи");

        subTask.Score = score;

        dbContext.SaveChanges();

        return subTask;
    }

    public Game StartGame(Guid gameId, Guid userId)
    {
        using var dbContext = new ApplicationContext();

        var game = GetGameById(gameId);

        ThrowIfNotAdmin(game.AdminId, userId);

        ThrowIfIncorrectState(game.GameState, GameStateEnum.Created, GameStateEnum.Finished);

        dbContext.Attach(game);

        game.GameState = GameStateEnum.Scoring;

        foreach (var subTask in game.SubTasks)
        {
            subTask.IsSelected = false;
        }

        var firstSubTask = game.SubTasks.OrderBy(x => x.Order).First();
        firstSubTask.IsSelected = true;

        dbContext.SaveChanges();

        return game;
    }

    public Game OpenCards(Guid gameId, Guid userId)
    {
        using var dbContext = new ApplicationContext();

        var game = GetGameById(gameId);

        ThrowIfNotAdmin(game.AdminId, userId);

        ThrowIfIncorrectState(game.GameState, GameStateEnum.Scoring);

        dbContext.Attach(game);

        game.GameState = GameStateEnum.CardsOpenned;

        dbContext.SaveChanges();

        return game;
    }

    public CardSetTypeEnum GetCardSetType(Guid gameId)
    {
        using var dbContext = new ApplicationContext();

        var game = GetGameById(gameId);

        return game.CardSetType;
    }

    public GameSubTask RescoreCurrentSubTask(Guid gameId, Guid userId)
    {
        using var dbContext = new ApplicationContext();

        var game = GetGameById(gameId);

        ThrowIfNotAdmin(game.AdminId, userId);

        ThrowIfIncorrectState(game.GameState, GameStateEnum.CardsOpenned);

        dbContext.Attach(game);

        game.GameState = GameStateEnum.Scoring;

        var selectedSubTask = game.SubTasks.FirstOrDefault(x => x.IsSelected);

        if (selectedSubTask == null)
            throw new WorkflowException("Не выбрана подзадача для переоценки");

        selectedSubTask.Score = null;

        dbContext.SaveChanges();

        return selectedSubTask;
    }

    public GameSubTask ScoreNextSubTask(Guid gameId, Guid userId)
    {
        using var dbContext = new ApplicationContext();

        var game = GetGameById(gameId);

        ThrowIfNotAdmin(game.AdminId, userId);

        ThrowIfIncorrectState(game.GameState, GameStateEnum.CardsOpenned);

        dbContext.Attach(game);

        var selectedSubTask = game.SubTasks.FirstOrDefault(x => x.IsSelected);

        if (selectedSubTask == null)
            throw new WorkflowException("Некорректное состояние. Должна быть выбрана предыдущая задача");

        if (selectedSubTask.Score == null)
            throw new WorkflowException("Укажите оценку");

        var nextSubTask = game.SubTasks.OrderBy(x => x.Order).Where(x => x.Order > selectedSubTask.Order).FirstOrDefault();

        if (nextSubTask == null)
            throw new WorkflowException("Не найдена следующая неоцененная задача");

        selectedSubTask.IsSelected = false;
        nextSubTask.IsSelected = true;

        game.GameState = GameStateEnum.Scoring;

        dbContext.SaveChanges();

        return nextSubTask;
    }

    private static void ThrowIfNotAdmin(Guid adminId, Guid userId)
    {
        if (adminId != userId)
            throw new WorkflowException("Только администратор может управлять игрой");
    }

    private static void ThrowIfIncorrectState(GameStateEnum currentGameState, params GameStateEnum[] requiredGameStates)
    {
        if (!requiredGameStates.Contains(currentGameState))
            throw new WorkflowException($"Недоспустимое действие. Игра находится в статусе {currentGameState}");
    }
}
