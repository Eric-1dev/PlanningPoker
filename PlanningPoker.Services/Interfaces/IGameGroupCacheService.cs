namespace PlanningPoker.Services.Interfaces;

public interface IGameGroupCacheService
{
    void AddConnectionToGroup(Guid groupId, string connectionId);

    Guid RemoveConnectionFromGroup(string connectionId);
}
