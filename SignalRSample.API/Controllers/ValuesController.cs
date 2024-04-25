using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.API.Hubs;

namespace SignalRSample.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController(IHubContext<MyHub> myHub) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> Get(string message)
        {
            await myHub.Clients.All.SendAsync("ReceiveMessageForAllClient", message);

            return Ok();
        }
    }
}
