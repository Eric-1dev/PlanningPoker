using PlanningPoker.Entities.Enums;

namespace PlanningPoker.FrontOffice.HubModels;

public class MessageInfoModel
{
    public MessageTypeEnum MessageType { get; set; }

    public string Message { get; set; }
}
