using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Entities.Enums;
using PlanningPoker.FrontOffice.Models;
using PlanningPoker.Services.Interfaces;

namespace PlanningPoker.FrontOffice.Controllers;

public class HomeController : BaseController
{
    public IGameControlService GameControlService { get; set; }

    public IActionResult Index()
    {
        return View();
    }

    [Route("/Game/{gameId:Guid}")]
    public IActionResult Game(Guid gameId)
    {
        var tasks = GameControlService.GetTasksByGameById(gameId);

        var model = new GameProgressViewModel
        {
            GameId = gameId,

            Tasks = tasks.Select(x => new GameTaskViewModel
            {
                Id = x.Id,
                Text = x.Text
            }).ToArray(),

            Cards = new[]
            {
                new CardViewModel(0,    CardColorEnum.Green),
                new CardViewModel(0.5,  CardColorEnum.Green),
                new CardViewModel(1,    CardColorEnum.Green),
                new CardViewModel(2,    CardColorEnum.Green),
                new CardViewModel(3,    CardColorEnum.Green),
                new CardViewModel(5,    CardColorEnum.Yellow),
                new CardViewModel(8,    CardColorEnum.Yellow),
                new CardViewModel(13,   CardColorEnum.Yellow),
                new CardViewModel(21,   CardColorEnum.Red),
                new CardViewModel(34,   CardColorEnum.Red),
                new CardViewModel(55,   CardColorEnum.Red),
            },
            NeedAddPassCard = true
        };

        return View(model);
    }

    [HttpPost]
    public JsonResult CreateGame(string[] tasks)
    {
        if (tasks.Length == 0)
            return Fail("Не заполнена ни одна задача");

        var gameId = GameControlService.CreateNewGame(tasks);

        return Success(gameId);
    }
}
