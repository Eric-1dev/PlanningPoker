using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanningPoker.FrontOffice.Security;

namespace PlanningPoker.FrontOffice.Controllers;

public class AuthorizationController : Controller
{
    [Route("/Login")]
    [AllowAnonymous]
    public IActionResult Login(string redirectUrl = null, string userName = null)
    {
        if (string.IsNullOrEmpty(userName))
            return View(model: redirectUrl);

        Response.Cookies.Append(PokerAuthenticationHandler.AuthCookieName, userName, new CookieOptions { Expires = DateTime.MaxValue });

        return redirectUrl == null
            ? RedirectToAction("Index", "Home")
            : Redirect(redirectUrl);
    }

    [Route("/Logout")]
    [AllowAnonymous]
    public IActionResult Logout(string redirectUrl)
    {
        if (Request.Cookies[PokerAuthenticationHandler.AuthCookieName] != null)
        {
            Response.Cookies.Append(PokerAuthenticationHandler.AuthCookieName, string.Empty, new CookieOptions { Expires = DateTime.Now.AddDays(-1) });
        }

        return Redirect(redirectUrl);
    }
}
