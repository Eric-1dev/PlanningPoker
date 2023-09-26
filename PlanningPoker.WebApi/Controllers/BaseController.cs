using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Entities.Models;

namespace PlanningPoker.FrontOffice.Controllers;

public abstract class BaseController : ControllerBase
{
    protected IActionResult Fail(string message)
    {
        return Ok(OperationResult.Fail(message));
    }

    protected IActionResult Success(string message = null)
    {
        return Ok(OperationResult.Success(message));
    }

    protected IActionResult Success<T>(T entity)
    {
        return Ok(OperationResult<T>.Success(entity));
    }
}
