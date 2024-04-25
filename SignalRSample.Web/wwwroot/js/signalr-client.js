$(document).ready(function () {

    const connection = new signalR.HubConnectionBuilder().withUrl("/exampleTypeSafeHub").configureLogging(signalR.LogLevel.Information).build();

    const broadcastMessageToAllClientHubMethodCall = "BroadcastMessageToAllClient";
    const receiveMessageForAllClientClientMethodCall = "ReceiveMessageForAllClient";

    const broadcastMessageToCallerClient = "BroadcastMessageToCallerClient";
    const receiveMessageForCallerClient = "ReceiveMessageForCallerClient";

    const broadcastMessageToOtherClient = "BroadcastMessageToOtherClient";
    const receiveMessageForOtherClient = "ReceiveMessageForOtherClient";

    const broadcastMessageToIndividualClient = "BroadcastMessageToIndividualClient";
    const receiveMessageForIndividualClient = "ReceiveMessageForIndividualClient";

    const broadcastMessageToGroupClient = "BroadcastMessageToGroupClient";
    const receiveMessageForGroupClients = "ReceiveMessageForGroupClients";

    const broadcastTypedMessageToAllClient = "BroadcastTypedMessageToAllClient";
    const receiveTypedMessageForAllClient = "ReceiveTypedMessageForAllClient";

    const receiveConnectedClientCountAllClient = "ReceiveConnectedClientCountAllClient";


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
    })

    start();

    $("#btn-send-message-all-client").click(function () {
        const message = "hello world";
        connection.invoke(broadcastMessageToAllClientHubMethodCall, message).catch(err => console.error("error:", err));
    });

    connection.on(receiveMessageForAllClientClientMethodCall, (message) => {
        console.log("Received message:", message);
    });


    $("#btn-send-message-caller-client").click(function () {
        const message = "hello world caller";
        connection.invoke(broadcastMessageToCallerClient, message).catch(err => console.error("error:", err));
    });

    connection.on(receiveMessageForCallerClient, (message) => {
        console.log("Received caller message:", message);
    });


    $("#btn-send-message-other-client").click(function () {
        const message = "hello world others";
        connection.invoke(broadcastMessageToOtherClient, message).catch(err => console.error("error:", err));
    });

    connection.on(receiveMessageForOtherClient, (message) => {
        console.log("Received others message:", message);
    });


    $("#btn-send-message-individual-client").click(function () {
        const connectionId = $("#input-connection-id").val();
        const message = "hello world individual client";
        connection.invoke(broadcastMessageToIndividualClient, connectionId, message).catch(err => console.error("error:", err));
    });

    connection.on(receiveMessageForIndividualClient, (message) => {
        console.log("Received individual client message:", message);
    });


    const span_client_count = $("#span-connected-count");
    connection.on(receiveConnectedClientCountAllClient, (count) => {
        span_client_count.html(count);
        console.log("Connected client count:", count);
    });



    //Grup
    const groupA = "GroupA";
    const groupB = "GroupB";
    let currentGroupList = [];

    function refreshGroupList() {
        $("#div-group-list").empty();
        currentGroupList.forEach(x => {
            $("#div-group-list").append(`<p>${x}</p>`);
        });
    }

    $("#btn-groupA-add").click(function () {

        if (currentGroupList.includes(groupA)) return;

        connection.invoke("AddGroup", groupA).then(() => {
            currentGroupList.push(groupA);
            refreshGroupList();
        });
    });

    $("#btn-groupA-remove").click(function () {

        if (!currentGroupList.includes(groupA)) return;

        connection.invoke("RemoveFromGroup", groupA).then(() => {
            currentGroupList = currentGroupList.filter(x => x !== groupA);
            refreshGroupList();
        });
    });

    $("#btn-groupB-add").click(function () {

        if (currentGroupList.includes(groupB)) return;

        connection.invoke("AddGroup", groupB).then(() => {
            currentGroupList.push(groupB);
            refreshGroupList();
        });
    });

    $("#btn-groupB-remove").click(function () {

        if (!currentGroupList.includes(groupB)) return;

        connection.invoke("RemoveFromGroup", groupB).then(() => {
            currentGroupList = currentGroupList.filter(x => x !== groupB);
            refreshGroupList();
        });
    });

    $("#btn-groupA-send-message").click(function () {

        if (!currentGroupList.includes(groupA)) return;

        const message = "hello world group a";
        connection.invoke(broadcastMessageToGroupClient, groupA, message).catch(err => console.error("error:", err));
    });

    $("#btn-groupB-send-message").click(function () {

        if (!currentGroupList.includes(groupB)) return;

        const message = "hello world group b";
        connection.invoke(broadcastMessageToGroupClient, groupB, message).catch(err => console.error("error:", err));
    });

    connection.on(receiveMessageForGroupClients, (message) => {
        console.log("Received group message:", message);
    });

    //grup end


    //typed message
    $("#btn-send-typed-message-all-client").click(function () {
        const product = { id: 1, name: "pencil", price: 20 };
        connection.invoke(broadcastTypedMessageToAllClient, product).catch(err => console.error("error:", err));
    });

    connection.on(receiveTypedMessageForAllClient, (product) => {
        console.log("Received product:", product);
    });
});