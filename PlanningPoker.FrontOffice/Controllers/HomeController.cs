using Microsoft.AspNetCore.Mvc;

namespace PlanningPoker.FrontOffice.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
