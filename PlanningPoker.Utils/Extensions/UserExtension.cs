using System.Security.Claims;

namespace PlanningPoker.Utils.Extensions;

public static class UserExtension
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var userId = user.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

        var parseSuccess = Guid.TryParse(userId, out Guid id);

        return parseSuccess ? id : throw new Exception("Не удалось определить ID пользователя");
    }
}
