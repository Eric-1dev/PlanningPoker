using Microsoft.AspNetCore.SignalR;
using PlanningPoker.Entities.Enums;

namespace PlanningPoker.Services.Hubs;

public class GameConnectHub : Hub
{
    public Task UserJoin(Guid gameId, string userName, UserRoleEnum userRole)
    {
        return Task.CompletedTask;
    }
}
