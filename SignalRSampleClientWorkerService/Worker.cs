using Microsoft.AspNetCore.SignalR.Client;

namespace SignalRSampleClientWorkerService
{
    public class Worker(ILogger<Worker> logger, IConfiguration configuration) : BackgroundService
    {
        //private readonly ILogger<Worker> _logger;
        //private readonly IConfiguration _configuration;

        //public Worker(ILogger<Worker> logger, IConfiguration configuration)
        //{
        //    _logger = logger;
        //    _configuration = configuration;
        //}

        private HubConnection? connection;


        //uygulama ayaða kalkýnca 1 kere çalýþýr
        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            connection.On<Product>("ReceiveTypedMessageForAllClient", product =>
            {
                logger.LogInformation($"Received message {product.Id}-{product.Name}-{product.Price}");
            });

            return Task.CompletedTask;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            connection = new HubConnectionBuilder().WithUrl(configuration.GetSection("SignalR")["Hub"]).Build();

            connection.StartAsync().ContinueWith((result) =>
            {
                logger.LogInformation(result.IsCompletedSuccessfully ? "worker client connected" : "worker client can not connected");
            });
            return base.StartAsync(cancellationToken);
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            await connection.StopAsync(cancellationToken);
            await connection.DisposeAsync();

            base.StopAsync(cancellationToken);
        }
    }
}
