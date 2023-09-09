using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Entities.Enums;
using PlanningPoker.FrontOffice.Models;
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
        var isGameExists = GameControlService.IsGameExists(gameId);

        if (!isGameExists)
            return RedirectToAction("Index");

        var model = new GameProgressViewModel
        {
            GameId = gameId,
            UserId = User.GetUserId()
        };

        return View(model);
    }

    [HttpPost]
    public JsonResult CreateGame(string taskName, string[] subTasks)
    {
        if (string.IsNullOrEmpty(taskName))
            return Fail("Не заполнено название задачи");

        var userId = User.GetUserId();

        if (!subTasks.Any())
            subTasks = new[] { "Задача целиком" };

        var gameId = GameControlService.CreateNewGame(taskName, subTasks, userId, CardSetTypeEnum.Classic);

        return Success(gameId);
    }
}
