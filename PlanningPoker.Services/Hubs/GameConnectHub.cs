using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using PlanningPoker.Services.Interfaces;
using PlanningPoker.Utils.Extensions;

namespace PlanningPoker.Services.Hubs;

[Authorize]
public class GameConnectHub : Hub
{
    public IGameGroupCacheService GameGroupCacheService { get; set; }

    public async Task UserJoin(Guid gameId)
    {
        var groupName = gameId.ToString();
        var userName = Context.User.Identity.Name;
        var userId = Context.User.GetUserId();

        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        GameGroupCacheService.AddConnectionToGroup(gameId, Context.ConnectionId);

        await Clients.Group(groupName).SendAsync("UserJoin", userName, userId);
    }

    public override async Task OnConnectedAsync()
    {
        await Clients.Caller.SendAsync("Start");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var userId = Context.User.GetUserId();

        var groupId = GameGroupCacheService.RemoveConnectionFromGroup(Context.ConnectionId);
        var groupName = groupId.ToString();

        await Clients.Group(groupName).SendAsync("UserQuit", userId);

        await base.OnDisconnectedAsync(exception);
    }
}
