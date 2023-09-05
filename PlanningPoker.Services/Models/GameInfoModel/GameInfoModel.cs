using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Entities.Models;
using PlanningPoker.Utils.Constants;

namespace PlanningPoker.Services.Models.GameInfoModel;

public class GameInfoModel
{
    public GamerConnectionModel[] OtherUsers { get; }

    public string TaskName { get; }

    public SubTaskModel[] SubTasks { get; }

    public GameStateEnum GameState { get; }

    public double[] AvailableScores { get; }

    public Card[] Cards { get; }

    public bool IsAdmin { get; }

    public GameInfoModel(Game game, Guid userId, GamerConnectionModel[] otherUsers)
    {
        OtherUsers = otherUsers;
        TaskName = game.TaskName;
        GameState = game.GameState;
        AvailableScores = CardSetConstants.Cards(game.CardSetType).Where(x => x.Score >= 0).Select(x => x.Score).ToArray();
        //Cards = CardSetConstants.Cards(game.CardSetType);
        IsAdmin = game.AdminId == userId;
        SubTasks = game.SubTasks.Select(x => new SubTaskModel
        {
            Score = x.Score,
            Text = x.Text,
            IsSelected = x.IsSelected,
            Id = x.Id,
            Order = x.Order
        }).ToArray();
    }
}
