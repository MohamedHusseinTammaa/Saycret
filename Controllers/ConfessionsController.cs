using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Saycret.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfessionsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllConfession(long id)
        {
            return Ok();
        }
        [HttpPost]
        public IActionResult PostConfession()
        {
            return Ok();    
        }
    }
}
