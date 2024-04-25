using SignalRSample.Web.Models;

namespace SignalRSample.Web.Hubs
{
    public interface IExampleTypeSafeHub
    {
        Task ReceiveMessageForAllClient(string message);
        Task ReceiveConnectedClientCountAllClient(int clientCount);
        Task ReceiveMessageForCallerClient(string message);
        Task ReceiveMessageForOtherClient(string message);
        Task ReceiveMessageForIndividualClient(string message);
        Task ReceiveMessageForGroupClients(string message);
        Task ReceiveTypedMessageForAllClient(Product product);
        Task ReceiveMessageAsStreamForAllClient(string name);
        Task ReceiveProductAsStreamForAllClient(Product product);
    }
}
