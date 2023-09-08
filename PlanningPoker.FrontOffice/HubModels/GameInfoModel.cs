using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Entities.Models;
using PlanningPoker.Services.Models;
using PlanningPoker.Utils.Constants;

namespace PlanningPoker.FrontOffice.HubModels;

public class GameInfoModel
{
    public UserInfoModel[] OtherUsers { get; }

    public string TaskName { get; }

    public SubTaskModel[] SubTasks { get; }

    public GameStateEnum? GameState { get; }

    public double[] AvailableScores { get; }

    public Card[] Cards { get; }

    public bool IsAdmin { get; }

    public bool IsPlayer { get; }

    public GameInfoModel()
    { }

    public GameInfoModel(Game game, Guid userId, UserInfoModel[] otherUsers, bool isPlayer)
    {
        OtherUsers = otherUsers;
        TaskName = game.TaskName;
        GameState = game.GameState;
        AvailableScores = CardSetConstants.GetAvailableScores(game.CardSetType);
        //Cards = CardSetConstants.Cards(game.CardSetType);
        IsAdmin = game.AdminId == userId;
        IsPlayer = isPlayer;
        SubTasks = game.SubTasks.Select(x => new SubTaskModel(x)).ToArray();
    }
}
