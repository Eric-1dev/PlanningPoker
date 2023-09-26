using System.Security.Claims;
using System.Text;
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
        var userData = GetUserDataFromQuery();

        userData ??= GetUserDataFromHeader();

        if (string.IsNullOrEmpty(userData?.UserName))
            return Task.FromResult(AuthenticateResult.Fail("Unauthorized"));

        var claims = new Claim[]
        {
            new Claim(ClaimTypes.Role, "User"),
            new Claim(ClaimTypes.Name, userData.UserName),
            new Claim(ClaimTypes.NameIdentifier, userData.UserId)
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

    private UserData GetUserDataFromQuery()
    {
        string token = Request.Query["access_token"];

        return ParseToken(token);
    }

    private UserData GetUserDataFromHeader()
    {
        var token = Request.Headers["Authorization"];

        return ParseToken(token);
    }

    private UserData ParseToken(string token)
    {
        if (token == null)
            return null;

        var dataString = Encoding.UTF8.GetString(Convert.FromBase64String(token));

        var decodedData = HttpUtility.UrlDecode(dataString).Split(':');

        if (decodedData.Length != 2)
            return null;

        return new UserData
        {
            UserId = decodedData[0],
            UserName = decodedData[1],
        };
    }

    private class UserData
    {
        public string UserId { get; set; }

        public string UserName { get; set; }
    }
}
