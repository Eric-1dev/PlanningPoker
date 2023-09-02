using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace PlanningPoker.FrontOffice.Security;

public class PokerAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>, IAuthenticationHandler
{
    public const string AuthSchemeName = "Basic";

    public const string AuthCookieName = "UserName";
    public const string AuthCookieId = "UserId";

    public PokerAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock) : base(options, logger, encoder, clock)
    { }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var userId = Context.Request.Cookies[AuthCookieId];

        if (string.IsNullOrEmpty(userId))
        {
            userId = Guid.NewGuid().ToString();
            Context.Response.Cookies.Append(AuthCookieId, userId, new CookieOptions { Expires = DateTime.MaxValue });
        }

        var userName = Context.Request.Cookies[AuthCookieName];

        if (string.IsNullOrEmpty(userName))
            return Task.FromResult(AuthenticateResult.Fail("Unauthorized"));

        var claims = new Claim[]
        {
            new Claim(ClaimTypes.Role, "User"),
            new Claim(ClaimTypes.Name, userName),
            new Claim(ClaimTypes.NameIdentifier, userId)
        };

        var identity = new ClaimsIdentity(claims, AuthSchemeName);

        var claimsPrincipal = new ClaimsPrincipal(identity);

        var tiket = new AuthenticationTicket(claimsPrincipal, AuthSchemeName);

        return Task.FromResult(AuthenticateResult.Success(tiket));
    }

    protected override Task HandleChallengeAsync(AuthenticationProperties properties)
    {
        var redirectUrl = Request.Path;
        Response.Redirect($"/login?redirectUrl={HttpUtility.UrlEncode(redirectUrl)}");

        return Task.CompletedTask;
    }
}
