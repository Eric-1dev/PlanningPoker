using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Entities.Enums;
using PlanningPoker.FrontOffice.Models;
using PlanningPoker.Services.Interfaces;
using PlanningPoker.Utils.Extensions;

namespace PlanningPoker.FrontOffice.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class GameController : BaseController
{
    public IGameControlService GameControlService { get; set; }

    [HttpPost]
    public IActionResult Create([FromBody] CreateGameModel model)
    {
        if (string.IsNullOrEmpty(model.TaskName))
            return Fail("Не заполнено название задачи");

        var userId = User.GetUserId();

        if (!model.SubTasks.Any())
            model.SubTasks = new[] { "Задача целиком" };

        var gameId = GameControlService.CreateNewGame(model.TaskName, model.SubTasks, userId, CardSetTypeEnum.Classic);

        return Success(gameId);
    }
}
