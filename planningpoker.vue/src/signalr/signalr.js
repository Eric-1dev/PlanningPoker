import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const signalr = {
    setUrl(url) {
        this._config.url = url;
    },

    generateAndSetToken(userId, userName) {
        if (!userName || !userId) {
            this._config.token = null;
        }

        const token = btoa(encodeURIComponent(`${userId}:${userName}`));
        this._config.token = token;
    },

    async start() {
        if (!this._config.url) {
            throw "Не указан URL";
        }

        if (!this._config.token) {
            throw "Не указан токен";
        }

        const connection = new HubConnectionBuilder()
            .withUrl(this._config.url, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
                accessTokenFactory: () => this._config.token
            })
            .configureLogging(LogLevel.Information)
            .build();

        this._connection = connection;

        connection.onclose(async () => {
            await this.onStop();

        });

        await connection.start();
        await this.onStart();
    },

    async stop() {
        debugger;
        await this._connection.stop();
        await this.onStop();
    },

    onStart: async () => { },
    onStop: async () => { },

    _config: {
        url: null,
        token: null
    },

    _connection: {}

    // async _startConnection() {
    //     try {
    //         await this.connection.start()
    //             .then(() => {
    //                 this.isConnected = true;

    //                 this.connection.invoke('UserConnected', gameProcessHelper.gameId, gameProcessHelper.isPlayerCookieValue);
    //             });
    //         console.log("SignalR Connected.");
    //     } catch (e) {
    //         console.log("SignalR Connection error. " + e);
    //         setTimeout(async () => await this._startConnection(), 3000);
    //     }
    // }
}

export default signalr;