using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using PlanningPoker.Utils.Extensions;

namespace PlanningPoker.Services.Hubs;

[Authorize]
public class GameConnectHub : Hub
{
    public async Task UserJoin(Guid gameId)
    {
        var groupName = gameId.ToString();
        var userName = Context.User.Identity.Name;
        var userId = Context.User.GetUserId();

        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        await Clients.Group(groupName).SendAsync("UserJoin", userName, userId);
    }

    public override async Task OnConnectedAsync()
    {
        await Clients.Caller.SendAsync("Start");
        await base.OnConnectedAsync();
    }
}
