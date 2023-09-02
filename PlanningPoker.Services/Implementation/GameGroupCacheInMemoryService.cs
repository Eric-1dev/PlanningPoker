using System.Collections.Concurrent;
using PlanningPoker.Services.Interfaces;

namespace PlanningPoker.Services.Implementation;

public class GameGroupCacheInMemoryService : IGameGroupCacheService
{
    private static ConcurrentDictionary<string, Guid> _concurrentDictionary = new();

    public void AddConnectionToGroup(Guid groupId, string connectionId)
    {
        _concurrentDictionary.TryAdd(connectionId, groupId);
    }

    public Guid RemoveConnectionFromGroup(string connectionId)
    {
        _concurrentDictionary.Remove(connectionId, out Guid groupId);

        return groupId;
    }
}
