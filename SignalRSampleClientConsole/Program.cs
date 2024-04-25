// See https://aka.ms/new-console-template for more information
using Microsoft.AspNetCore.SignalR.Client;
using SignalRSampleClientConsole;

Console.WriteLine("SignalR Console Client");


var connection = new HubConnectionBuilder().WithUrl("https://localhost:7253/exampleTypeSafeHub").Build();

connection.StartAsync().ContinueWith((result) =>
{
    Console.WriteLine(result.IsCompletedSuccessfully ? "console client connected" : "console client can not connected");
});

connection.On<Product>("ReceiveTypedMessageForAllClient", product =>
{
    Console.WriteLine($"Received message {product.Id}-{product.Name}-{product.Price}");
});


while (true)
{
    var key = Console.ReadLine();
    if (key == "exit") break;

    var newProduct = new Product(3, "Book", 50);

    await connection.InvokeAsync("BroadcastTypedMessageToAllClient", newProduct);
}


Console.ReadKey();