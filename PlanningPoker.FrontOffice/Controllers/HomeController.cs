using Microsoft.AspNetCore.Mvc;
using PlanningPoker.FrontOffice.Models;

namespace PlanningPoker.FrontOffice.Controllers
{
    public class HomeController : Controller
    {
        private const string _userNameCookieName = "UserName";

        public IActionResult Index()
        {
            return View();
        }

        [Route("/Game/{gameId:Guid}")]
        public IActionResult Game(Guid gameId)
        {
            var userName = Request.Cookies[_userNameCookieName];

            if (userName == null)
                return RedirectToAction("Login", new { redirectUrl = Request.Path.Value });

            var model = new GameProgressViewModel
            {
                Cards = new[]
                {
                    new CardViewModel(0, Entities.Enums.CardColorEnum.Green),
                    new CardViewModel(0.5, Entities.Enums.CardColorEnum.Green),
                    new CardViewModel(1, Entities.Enums.CardColorEnum.Green),
                    new CardViewModel(2, Entities.Enums.CardColorEnum.Green),
                    new CardViewModel(3, Entities.Enums.CardColorEnum.Green),
                    new CardViewModel(5, Entities.Enums.CardColorEnum.Yellow),
                    new CardViewModel(8, Entities.Enums.CardColorEnum.Yellow),
                    new CardViewModel(13, Entities.Enums.CardColorEnum.Yellow),
                    new CardViewModel(21, Entities.Enums.CardColorEnum.Red),
                    new CardViewModel(34, Entities.Enums.CardColorEnum.Red),
                    new CardViewModel(55, Entities.Enums.CardColorEnum.Red),
                },
                NeedAddPassCard = true
            };

            return View(model);
        }

        [Route("/Login")]
        public IActionResult Login(string userName = null, string redirectUrl = null)
        {
            if (string.IsNullOrEmpty(userName))
                return View("~/Views/Home/Login.cshtml", redirectUrl);

            Response.Cookies.Append(_userNameCookieName, userName, new CookieOptions { Expires = DateTime.MaxValue });

            if (redirectUrl != null)
                return Redirect(redirectUrl);

            return RedirectToAction("Index", "Home");
        }

        [Route("/Logout")]
        public IActionResult Logout(string redirectUrl)
        {
            if (Request.Cookies[_userNameCookieName] != null)
            {
                Response.Cookies.Append(_userNameCookieName, string.Empty, new CookieOptions { Expires = DateTime.Now.AddDays(-1) });
            }

            return Redirect(redirectUrl);
        }
    }
}
