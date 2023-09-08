using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using PlanningPoker.FrontOffice.HubModels;
using PlanningPoker.Services.Interfaces;
using PlanningPoker.Services.Models;
using PlanningPoker.Utils.Extensions;

namespace PlanningPoker.Services.Hubs;

[Authorize]
public class GameConnectHub : Hub
{
    public IGameGroupCacheService GameGroupCacheService { get; set; }
    public IGameControlService GameControlService { get; set; }

    private Guid GameId
    {
        get
        {
            var result = Context.Items.TryGetValue("GameId", out var gameId);

            if (result)
            {
                return (Guid)gameId;
            }

            throw new Exception($"Не найден {nameof(GameId)} в контексте соединения");
        }
    }

    private string GroupName => GameId.ToString();

    public async Task UserConnected(Guid gameId)
    {
        Context.Items.TryAdd("GameId", gameId);

        var userName = Context.User.Identity.Name;
        var userId = Context.User.GetUserId();

        await Groups.AddToGroupAsync(Context.ConnectionId, GroupName);

        var isPlayer = true;

        var gamerConnection = new UserInfoModel
        {
            ConnectionId = Context.ConnectionId,
            Name = userName,
            Id = userId,
            IsPlayer = isPlayer,
        };

        GameGroupCacheService.AddUserToGame(gameId, gamerConnection);

        var otherUsers = GameGroupCacheService.GetAllUsersInGame(gameId, Context.ConnectionId).Where(x => x.Id != userId).ToArray();

        var game = GameControlService.GetGameById(gameId);

        if (otherUsers.Length > 0)
        {
            await Clients.OthersInGroup(GroupName).SendAsync("UserJoin", gamerConnection);
        }

        var gameInfo = new GameInfoModel(game, userId, otherUsers, isPlayer);

        await Clients.Caller.SendAsync("ReceiveGameInfo", gameInfo);
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
        var isGameRunning = GameControlService.IsGameRunning(GameId);

        var isUserIsPlayer = GameGroupCacheService.IsUserIsPlayer(GameId, Context.ConnectionId);

        if (!isGameRunning || !isUserIsPlayer)
            return;

        var user = GameGroupCacheService.ChangeUserVote(Context.ConnectionId, score);

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
        await Clients.Group(GroupName).SendAsync("");
    }

    private async Task ChangeUserStatus(bool isPlayer)
    {
        GameGroupCacheService.ChangeUserStatus(Context.ConnectionId, GameId, isPlayer);

        var myInfo = GameGroupCacheService.GetMyInfo(GameId, Context.ConnectionId);

        await Clients.OthersInGroup(GroupName).SendAsync("ChangeUserInfo", myInfo);
    }
}
