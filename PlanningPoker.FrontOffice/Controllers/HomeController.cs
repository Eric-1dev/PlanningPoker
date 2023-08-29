using Microsoft.AspNetCore.Mvc;
using PlanningPoker.FrontOffice.Models;

namespace PlanningPoker.FrontOffice.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [Route("/Game/{gameId:Guid}")]
        public IActionResult Game(Guid gameId)
        {
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
    }
}
