using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saycret.Interfaces;
using Saycret.Models;

namespace Saycret.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfessionsController : ControllerBase
    {
        IConfession _confession;
        public ConfessionsController(IConfession confession)
        {
            _confession = confession;
        }

        [HttpGet]
        public IActionResult GetAllConfession(long id)
        {
            List<Confession> list =_confession.GetAllConfessions(0, 10);
            return Ok(list);
        }
        [HttpPost]
        public IActionResult PostConfession()
        {
            return Ok();    
        }
    }
}
