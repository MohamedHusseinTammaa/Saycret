using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Saycret.DTOs.Confession;
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
        public IActionResult GetAllConfession()
        {
            List<ConfessionDTO> list =_confession.GetAllConfessions(0, 10);
            return Ok(list);
        }
        [HttpGet]
        [Route("{id:long}")]
        public IActionResult GetConfessionById([FromRoute]long id) 
        {
            ConfessionDTO c = _confession.GetConfession(id);
            return Ok(c);
        }
        [HttpPost]
        public IActionResult PostConfession([FromBody]CreateConfessionDTO confession)
        {
            _confession.CreatConfession(confession);
            return Ok();    
        }
    }
}
