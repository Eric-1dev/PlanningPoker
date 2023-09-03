using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Entities.Enums;
using PlanningPoker.FrontOffice.Models;
using PlanningPoker.FrontOffice.Security;
using PlanningPoker.Services.Interfaces;
using PlanningPoker.Utils.Extensions;

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
        var game = GameControlService.GetGameById(gameId);

        var model = new GameProgressViewModel
        {
            GameId = gameId,
            TaskName = game.TaskName,

            SubTasks = game.SubTasks?.Select(x => new GameTaskViewModel
            {
                Id = x.Id,
                Text = x.Text,
                Score = x.Score
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

            NeedAddPassCard = true,
            AdminId = game.AdminId,
            TotalScore = game.TotalScore,
        };

        return View(model);
    }

    [HttpPost]
    public JsonResult CreateGame(string taskName, string[] subTasks)
    {
        if (string.IsNullOrEmpty(taskName))
            return Fail("Не заполнено название задачи");

        var userId = User.GetUserId();

        if (userId == null)
            return Fail("Не удалось определить ваш Id. Попробуйте обновить страницу.");

        if (!subTasks.Any())
            subTasks = new[] { "Задача целиком" };

        var gameId = GameControlService.CreateNewGame(taskName, subTasks, userId.Value);

        return Success(gameId);
    }
}
