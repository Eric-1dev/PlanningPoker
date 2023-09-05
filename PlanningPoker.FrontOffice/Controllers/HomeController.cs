using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Entities.Enums;
using PlanningPoker.FrontOffice.Models;
using PlanningPoker.Services.Interfaces;
using PlanningPoker.Utils.Constants;
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
            Cards = CardSetConstants.Cards(game.CardSetType)
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

        var gameId = GameControlService.CreateNewGame(taskName, subTasks, userId.Value, CardSetTypeEnum.Classic);

        return Success(gameId);
    }
}
