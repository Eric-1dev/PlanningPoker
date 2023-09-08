using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using PlanningPoker.Entities.Exceptions;
using PlanningPoker.FrontOffice.HubModels;
using PlanningPoker.Services.Interfaces;
using PlanningPoker.Services.Models;
using PlanningPoker.Utils.Constants;
using PlanningPoker.Utils.Extensions;

namespace PlanningPoker.Services.Hubs;

[Authorize]
public class GameConnectHub : Hub
{
    private Guid GameId
    {
        get
        {
            var result = Context.Items.TryGetValue("GameId", out var gameId);

            if (result)
                return (Guid)gameId;

            throw new Exception($"Не найден {nameof(GameId)} в контексте соединения");
        }
    }

    private string GroupName => GameId.ToString();

    public IGameGroupCacheService GameGroupCacheService { get; set; }
    public IGameControlService GameControlService { get; set; }

    public async Task UserConnected(Guid gameId)
    {
        Context.Items.TryAdd("GameId", gameId);

        var userName = Context.User.Identity.Name;
        var userId = Context.User.GetUserId();

        await Groups.AddToGroupAsync(Context.ConnectionId, GroupName);

        var isPlayer = true;

        var gamerInfoModel = new UserInfoModel
        {
            ConnectionId = Context.ConnectionId,
            Name = userName,
            Id = userId,
            IsPlayer = isPlayer
        };

        var myUserInfoModel = GameGroupCacheService.AddOrUpdateUserToGame(gameId, gamerInfoModel);

        var otherUsers = GameGroupCacheService.GetAllUsersInGame(gameId, Context.ConnectionId).Where(x => x.Id != userId).ToArray();

        var game = GameControlService.GetGameById(gameId);

        var gameInfo = new GameInfoModel(game, myUserInfoModel, otherUsers);

        await Clients.Caller.SendAsync("ReceiveGameInfo", gameInfo);

        UserInfoModel.ClearScore(myUserInfoModel);

        if (otherUsers.Length > 0)
        {
            await Clients.OthersInGroup(GroupName).SendAsync("UserJoin", myUserInfoModel);
        }
    }

    public override async Task OnConnectedAsync()
    {
        await Clients.Caller.SendAsync("ConnectionEstablished");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var userId = Context.User.GetUserId();

        var gameId = GameGroupCacheService.RemoveUserFromGame(Context.ConnectionId);

        if (gameId.HasValue)
            await Clients.OthersInGroup(GroupName).SendAsync("UserQuit", userId);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task TryChangeVote(double? score)
    {
        var cardSetType = GameControlService.GetCardSetType(GameId);

        string scoreText = null;

        if (score.HasValue)
        {
            scoreText = CardSetConstants.GetScoreText(cardSetType, score.Value);

            if (scoreText == null)
            {
                throw new WorkflowException("Выбранная карта не найдена в используемом наборе");
            }
        }

        var isGameRunning = GameControlService.IsGameRunning(GameId);

        var isUserIsPlayer = GameGroupCacheService.IsUserIsPlayer(GameId, Context.ConnectionId);

        if (!isGameRunning || !isUserIsPlayer)
            return;

        var user = GameGroupCacheService.ChangeUserVote(Context.ConnectionId, score, scoreText);

        UserInfoModel.ClearScore(user);

        await Clients.Group(GroupName).SendAsync("UserVoted", user);
    }

    public async Task SendChangeSubTaskScore(Guid subTaskId, double? score)
    {
        var userId = Context.User.GetUserId();

        var result = GameControlService.TryChangeSubTaskScore(userId, GameId, subTaskId, score);

        await Clients.OthersInGroup(GroupName).SendAsync("ReceiveChangeSubTaskScore", result);
    }

    public async Task MakeMeSpectator()
    {
        await ChangeUserStatus(isPlayer: false);
    }

    public async Task MakeMePlayer()
    {
        await ChangeUserStatus(isPlayer: true);
    }

    public async Task StartGame()
    {
        var userId = Context.User.GetUserId();

        var game = GameControlService.StartGame(GameId, userId);

        var gameState = new GameStateChangedModel(game);

        await Clients.Group(GroupName).SendAsync("GameStateChanged", gameState);
    }

    public async Task TryOpenCards()
    {
        var userId = Context.User.GetUserId();

        var playerScores = GameGroupCacheService.CheckAllVotedAndGetScores(GameId);

        if (playerScores == null)
            throw new WorkflowException("Открыть карты можно только когда все участники проголосовали");

        var game = GameControlService.OpenCards(GameId, userId);

        var playerScoresModel = new ShowPlayerScoresModel(playerScores, game.GameState);

        await Clients.Group(GroupName).SendAsync("ShowPlayerScores", playerScoresModel);
    }

    private async Task ChangeUserStatus(bool isPlayer)
    {
        GameGroupCacheService.ChangeUserStatus(Context.ConnectionId, GameId, isPlayer);

        var myInfo = GameGroupCacheService.GetMyInfo(GameId, Context.ConnectionId);

        await Clients.OthersInGroup(GroupName).SendAsync("ChangeUserInfo", myInfo);
    }
}
