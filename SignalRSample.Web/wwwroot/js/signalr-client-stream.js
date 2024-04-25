$(document).ready(function () {
    const connection = new signalR.HubConnectionBuilder().withUrl("/exampleTypeSafeHub").configureLogging(signalR.LogLevel.Information).build();

    const broadcastStreamDataToAllClient = "BroadcastStreamDataToAllClient";
    const receiveMessageAsStreamForAllClient = "ReceiveMessageAsStreamForAllClient";

    const broadcastStreamProductToAllClient = "BroadcastStreamProductToAllClient";
    const receiveProductAsStreamForAllClient = "ReceiveProductAsStreamForAllClient";

    const broadcastFromHubToClient = "BroadcastFromHubToClient";

    async function start() {
        try {
            await connection.start().then(() => {
                console.log("Hub connected");
                $("#div-connection-id").html(`Connection Id : ${connection.connectionId}`);
            });
        } catch (e) {
            setTimeout(() => start(), 5000);
        }
    }

    connection.onclose(async () => {
        await start();
    });

    connection.on(receiveMessageAsStreamForAllClient, (name) => {
        $("#div-stream-box").append(`<p>${name}</p>`)
    });

    $("#btn-from-client-to-hub").click(function () {

        const names = $("#input-stream").val();

        const namesAsChunk = names.split(";");

        const subject = new signalR.Subject();

        connection.send(broadcastStreamDataToAllClient, subject).catch(err => console.error(err));

        namesAsChunk.forEach(name => {
            subject.next(name);
        });

        subject.complete();
    });

    connection.on(receiveProductAsStreamForAllClient, (product) => {
        $("#div-stream-box").append(`<p>id:${product.id} - name:${product.name} - price:${product.price}</p>`)
    });

    $("#btn-from-client-to-hub-product-stream").click(function () {

        const products = [
            { id: 1, name: "pencil1", price: 100 },
            { id: 2, name: "pencil2", price: 200 },
            { id: 3, name: "pencil3", price: 300 },
            { id: 4, name: "pencil4", price: 400 },
            { id: 5, name: "pencil5", price: 500 }
        ];


        const subject = new signalR.Subject();

        connection.send(broadcastStreamProductToAllClient, subject).catch(err => console.error(err));

        products.forEach(product => {
            subject.next(product);
        });

        subject.complete();
    });

    $("#btn-from-hub-to-client").click(function () {
        connection.stream(broadcastFromHubToClient, 5).subscribe({
            next: (message) => {
                $("#div-stream-box").append(`<p>${message}</p>`);
            }
        });
    });

    start();


});