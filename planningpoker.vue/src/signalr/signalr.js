import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";

const connection = new HubConnectionBuilder()
    .withUrl('https://localhost:44353/GameConnect', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
    .build();

    connection.on

    connection.start();

const signalr = {
    connection
};

export default signalr;