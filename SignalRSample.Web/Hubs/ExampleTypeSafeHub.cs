using Microsoft.AspNetCore.SignalR;
using SignalRSample.Web.Models;

namespace SignalRSample.Web.Hubs
{
    public class ExampleTypeSafeHub : Hub<IExampleTypeSafeHub>
    {
        private static int ConnectedClientCount = 0;

        //tüm client'lara yayın yapıyor
        public async Task BroadcastMessageToAllClient(string message)
        {
            await Clients.All.ReceiveMessageForAllClient(message);
        }

        //sadece kendi client'ına yayın yapıyor
        public async Task BroadcastMessageToCallerClient(string message)
        {
            await Clients.Caller.ReceiveMessageForCallerClient(message);
        }

        //kendisi hariç diğer client'lara yayın yapıyor
        public async Task BroadcastMessageToOtherClient(string message)
        {
            await Clients.Others.ReceiveMessageForOtherClient(message);
        }

        //özel bir client'a yayın yapıyor
        public async Task BroadcastMessageToIndividualClient(string connectionId, string message)
        {
            await Clients.Client(connectionId).ReceiveMessageForIndividualClient(message);
        }

        #region Grup
        public async Task BroadcastMessageToGroupClient(string groupName, string message)
        {
            await Clients.Group(groupName).ReceiveMessageForGroupClients(message);
        }

        public async Task AddGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Caller.ReceiveMessageForCallerClient($"You joined to {groupName}");

            await Clients.Group(groupName).ReceiveMessageForGroupClients($"{Context.ConnectionId} user joined to {groupName}");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Caller.ReceiveMessageForCallerClient($"You removed from {groupName}");

            await Clients.Group(groupName).ReceiveMessageForGroupClients($"{Context.ConnectionId} user remover from {groupName}");
        }
        #endregion

        public async Task BroadcastTypedMessageToAllClient(Product product)
        {
            await Clients.All.ReceiveTypedMessageForAllClient(product);
        }

        public override async Task OnConnectedAsync()
        {
            ConnectedClientCount++;
            await Clients.All.ReceiveConnectedClientCountAllClient(ConnectedClientCount);
            base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            ConnectedClientCount--;
            await Clients.All.ReceiveConnectedClientCountAllClient(ConnectedClientCount);
            base.OnDisconnectedAsync(exception);
        }

        #region Stream
        public async Task BroadcastStreamDataToAllClient(IAsyncEnumerable<string> nameAsChunks)
        {
            await foreach (var name in nameAsChunks)
            {
                await Task.Delay(1000);
                await Clients.All.ReceiveMessageAsStreamForAllClient(name);
            }
        }

        public async Task BroadcastStreamProductToAllClient(IAsyncEnumerable<Product> productsAsChunks)
        {
            await foreach (var product in productsAsChunks)
            {
                await Task.Delay(1000);
                await Clients.All.ReceiveProductAsStreamForAllClient(product);
            }
        }

        public async IAsyncEnumerable<string> BroadcastFromHubToClient(int count)
        {
            foreach (var item in Enumerable.Range(1, count).ToList())
            {
                await Task.Delay(1000);
                yield return $"{item}. data";
            }
        }
        #endregion
    }
}
