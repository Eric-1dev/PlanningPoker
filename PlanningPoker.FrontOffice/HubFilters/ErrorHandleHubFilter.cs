using Microsoft.AspNetCore.SignalR;
using PlanningPoker.Entities.Enums;
using PlanningPoker.Entities.Exceptions;
using PlanningPoker.FrontOffice.HubModels;

namespace PlanningPoker.Services.HubFilters;

public class ErrorHandleHubFilter : IHubFilter
{
    public async ValueTask<object> InvokeMethodAsync(HubInvocationContext invocationContext, Func<HubInvocationContext, ValueTask<object>> next)
    {
        try
        {
            return await next(invocationContext);
        }
        catch (WorkflowException ex)
        {
            await invocationContext.Hub.Clients.Caller.SendAsync("OnSystemMessageReceived", new MessageInfoModel
            {
                MessageType = MessageTypeEnum.Error,
                Message = ex.Message
            });

            return ValueTask.CompletedTask;
        }
        catch
        {
            throw;
        }
    }
}
