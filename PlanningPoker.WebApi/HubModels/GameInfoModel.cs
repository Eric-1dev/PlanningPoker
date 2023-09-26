using PlanningPoker.DataModel;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Entities.Models;
using PlanningPoker.Services.Models;
using PlanningPoker.Utils.Constants;

namespace PlanningPoker.FrontOffice.HubModels;

public class GameInfoModel
{
    public UserInfoModel MyInfo { get; }

    public UserInfoModel[] OtherUsers { get; }

    public string TaskName { get; }

    public SubTaskModel[] SubTasks { get; }

    public GameStateEnum GameState { get; }

    public Card[] Cards { get; }

    public Guid AdminId { get; }

    public GameInfoModel()
    { }

    public GameInfoModel(Game game, UserInfoModel myInfo, UserInfoModel[] otherUsers)
    {
        if (game.GameState != GameStateEnum.CardsOpenned)
            UserInfoModel.ClearScores(otherUsers);

        OtherUsers = otherUsers;
        TaskName = game.TaskName;
        GameState = game.GameState;
        Cards = CardSetConstants.Cards(game.CardSetType);
        MyInfo = myInfo;
        AdminId = game.AdminId;
        SubTasks = game.SubTasks.Select(x => new SubTaskModel(x)).ToArray();
    }
}
