using Microsoft.AspNetCore.SignalR;

namespace SignalRSample.API.Hubs
{
    public class MyHub : Hub<IMyHub>
    {
        public async Task BroadcastMessageToAllClient(string message)
        {
            await Clients.All.ReceiveMessageForAllClient(message);
        }
    }
}
