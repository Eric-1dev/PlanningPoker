import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const signalr = {
    _config: {
        url: null,
        token: null
    },

    _connection: {},

    setUrl(url) {
        this._config.url = url;
    },

    setToken(token) {
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

        connection.on('SystemMessageReceived', (messageInfo) => {
            this.onSystemMessageReceived(messageInfo);
        });

        connection.on('ReceiveGameInfo', (gameInfo) => {
            this.onReceiveGameInfo(gameInfo);
        });

        connection.on('UserJoin', (user) => {
            this.onUserJoin(user);
        });
        
        connection.on('UserQuit', (userId) => {
            this.onUserQuit(userId);
        });

        connection.on("UserVoted", (user) => {
            this.onUpdateUser(user);
        });

        connection.on("ReceiveChangeSubTaskScore", (subTask) => {
            this.onReceiveChangeSubTaskScore(subTask);
        });

        connection.on("ChangeUserInfo", (user) => {
            this.onUpdateUser(user);
        });

        connection.on("GameStateChanged", (model) => {
            this.onGameStateChanged(model);
        });

        connection.on("ShowPlayerScores", (model) => {
            this.onShowPlayerScores(model);
        });

        connection.on("ReceiveScoreNextSubTask", (model) => {
            this.onReceiveScoreNextSubTask(model);
        });

        connection.on("SubTasksUpdated", (subTasks) => {
            this.onSubTasksUpdated(subTasks);
        });

        await connection.start();
        await this.onStart();
    },

    async stop() {
        await this._connection.stop();
        await this.onStop();
    },

    onStart: async () => { },
    onStop: async () => { },

    onReceiveGameInfo: () => { },
    onUserJoin: () => { },
    onUserQuit: () => { },
    onUpdateUser: () => { },
    onReceiveChangeSubTaskScore: () => { },
    onGameStateChanged: () => { },
    onShowPlayerScores: () => { },
    onReceiveScoreNextSubTask: () => { },
    onSubTasksUpdated: () => { },
    onSystemMessageReceived: () => { },

    invokeUserConnected(gameId, isPlayer) {
        this._connection.invoke('UserConnected', gameId, isPlayer);
    },

    invokeTryChangeVote(score) {
        this._connection.invoke('TryChangeVote', score);
    },

    invokeChangeSubTaskScore(subTaskId, score) {
        this._connection.invoke('SendChangeSubTaskScore', subTaskId, score);
    },

    invokeSpectate() {
        this._connection.invoke('MakeMeSpectator');
    },

    invokeJoinGame() {
        this._connection.invoke('MakeMePlayer');
    },

    invokeStartGame() {
        this._connection.invoke('StartGame');
    },

    invokeFinishGame() {
        this._connection.invoke('FinishGame');
    },

    invokeRescoreSubTask() {
        this._connection.invoke('RescoreSubTask');
    },

    invokeTryOpenCards() {
        this._connection.invoke('TryOpenCards');
    },

    invokeScoreNextSubTask() {
        this._connection.invoke('ScoreNextSubTask');
    },

    invokeScoreSubTaskById(subTaskId) {
        this._connection.invoke('ScoreSubTaskById', subTaskId);
    },

    invokeUpdateSubTasks(subTasks) {
        this._connection.invoke('UpdateSubTasks', subTasks);
    }
}

export default signalr;