using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using PlanningPoker.Services.Interfaces;
using PlanningPoker.Services.Models.GameInfoModel;
using PlanningPoker.Utils.Extensions;

namespace PlanningPoker.Services.Hubs;

[Authorize]
public class GameConnectHub : Hub
{
    public IGameGroupCacheService GameGroupCacheService { get; set; }
    public IGameControlService GameControlService { get; set; }

    public async Task UserConnected(Guid gameId)
    {
        var groupName = GetGroupName(gameId);
        var userName = Context.User.Identity.Name;
        var userId = Context.User.GetUserId();

        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        var isPlayer = true;

        var gamerConnection = new UserInfoModel
        {
            ConnectionId = Context.ConnectionId,
            Name = userName,
            Id = userId.Value,
            IsPlayer = isPlayer,
        };

        GameGroupCacheService.AddUserToGame(gameId, gamerConnection);

        var otherUsers = GameGroupCacheService.GetAllUsersInGame(gameId, Context.ConnectionId).Where(x => x.Id != userId).ToArray();

        var game = GameControlService.GetGameById(gameId);

        if (otherUsers.Length > 0)
        {
            await Clients.OthersInGroup(groupName).SendAsync("UserJoin", gamerConnection);
        }

        var gameInfo = new GameInfoModel(game, userId.Value, otherUsers, isPlayer);

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
        {
            var groupName = GetGroupName(gameId);

            await Clients.OthersInGroup(groupName).SendAsync("UserQuit", userId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task TryChangeVote(Guid gameId, double? score)
    {
        var isGameRunning = GameControlService.IsGameRunning(gameId);

        var isUserIsPlayer = GameGroupCacheService.IsUserIsPlayer(gameId, Context.ConnectionId);

        if (!isGameRunning || !isUserIsPlayer)
            return;

        var user = GameGroupCacheService.ChangeUserVote(Context.ConnectionId, score);

        var groupName = GetGroupName(gameId);

        await Clients.Group(groupName).SendAsync("UserVoted", user);
    }

    public async Task SendChangeSubTaskScore(Guid gameId, Guid subTaskId, double? score)
    {
        var userId = Context.User.GetUserId();

        var result = GameControlService.TryChangeSubTaskScore(userId.Value, gameId, subTaskId, score);

        var groupName = GetGroupName(gameId);

        await Clients.OthersInGroup(groupName).SendAsync("ReceiveChangeSubTaskScore", result);
    }

    public async Task MakeMeSpectator(Guid gameId)
    {
        await ChangeUserStatus(gameId, isPlayer: false);
    }

    public async Task MakeMePlayer(Guid gameId)
    {
        await ChangeUserStatus(gameId, isPlayer: true);
    }

    private async Task ChangeUserStatus(Guid gameId, bool isPlayer)
    {
        GameGroupCacheService.ChangeUserStatus(Context.ConnectionId, gameId, isPlayer);

        var groupName = GetGroupName(gameId);

        var myInfo = GameGroupCacheService.GetMyInfo(gameId, Context.ConnectionId);

        await Clients.OthersInGroup(groupName).SendAsync("ChangeUserInfo", myInfo);
    }

    private static string GetGroupName(Guid? gameId)
    {
        return gameId?.ToString() ?? throw new Exception("GameId должен иметь значение");
    }
}
