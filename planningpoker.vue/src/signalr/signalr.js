import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const signalr = {
    start(url, token) {
        const connection = new HubConnectionBuilder()
            .withUrl(url, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
                accessTokenFactory: () => token
            })
            .configureLogging(LogLevel.Information)
            .build();
        
        connection.start();
    }
}

export default signalr;