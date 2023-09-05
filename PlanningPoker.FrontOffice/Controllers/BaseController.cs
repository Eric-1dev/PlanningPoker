using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Entities.Models;

namespace PlanningPoker.FrontOffice.Controllers;

public abstract class BaseController : Controller
{
    protected JsonResult Fail(string message)
    {
        return Json(OperationResult.Fail(message));
    }

    protected JsonResult Success(string message = null)
    {
        return Json(OperationResult.Success(message));
    }

    protected JsonResult Success<T>(T entity)
    {
        return Json(OperationResult<T>.Success(entity));
    }
}
