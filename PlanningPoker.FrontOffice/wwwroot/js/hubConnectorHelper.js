/*jshint esversion: 6 */

class HubConnector {
    #hubConnection;

    init() {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/GameConnect")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        hubConnection.onclose(async () => {
            gameProcessHelper.onDisconnected();

            await this.#startConnection();
        });

        hubConnection.on('OnSystemMessageReceived', (messageInfo) => {
            gameProcessHelper.handleNewMessage(messageInfo);
        });

        hubConnection.on('UserJoin', (user) => {
            gameProcessHelper.handleUserInfo(user);
        });

        hubConnection.on('UserQuit', (userId) => {
            gameProcessHelper.removeUser(userId);
        });

        hubConnection.on('ReceiveGameInfo', (gameInfo) => {
            gameProcessHelper.handleGameInfoMessage(gameInfo);
        });

        hubConnection.on("UserVoted", (user) => {
            gameProcessHelper.updateUserVote(user);
        });

        hubConnection.on("ReceiveChangeSubTaskScore", (subTask) => {
            gameProcessHelper.handleSubTaskInfo(subTask);
        });

        hubConnection.on("ChangeUserInfo", (user) => {
            gameProcessHelper.handleUserInfo(user);
            gameProcessHelper.actualizeButtons();
        });

        hubConnection.on("GameStateChanged", (model) => {
            gameProcessHelper.handleFlushPlayerScores(model.playerScores);
            gameProcessHelper.gameStateChanged(model.gameState);
            gameProcessHelper.handleSubTasksInfo(model.subTasks);
            gameProcessHelper.actualizeButtons();
        });

        hubConnection.on("ShowPlayerScores", (model) => {
            gameProcessHelper.gameStateChanged(model.gameState);
            gameProcessHelper.handleShowPlayerScores(model.playerScores);
            gameProcessHelper.actualizeButtons();
        });

        hubConnection.on("ReceiveScoreNextSubTask", (model) => {
            gameProcessHelper.handleFlushPlayerScores(model.playerScores);
            gameProcessHelper.gameStateChanged(model.gameState);
            gameProcessHelper.handleSubTaskInfo(model.subTask);
            gameProcessHelper.actualizeButtons();
        });

        hubConnection.on("SubTasksUpdated", (subTasks) => {
            gameProcessHelper.handleSubTasksInfo(subTasks);
            gameProcessHelper.actualizeButtons();
        });

        this.#hubConnection = hubConnection;

        this.#startConnection();
    }

    invokeTryChangeVote(score) {
        this.#hubConnection.invoke('TryChangeVote', score);
    }

    invokeChangeSubTaskScore(subTaskId, score) {
        this.#hubConnection.invoke('SendChangeSubTaskScore', subTaskId, score);
    }

    invokeSpectate() {
        this.#hubConnection
            .invoke('MakeMeSpectator')
            .then(gameProcessHelper.changeMyStatus(false));
    }

    invokeJoinGame() {
        this.#hubConnection
            .invoke('MakeMePlayer')
            .then(gameProcessHelper.changeMyStatus(true));
    }

    invokeStartGame() {
        this.#hubConnection.invoke('StartGame');
    }

    invokeTryOpenCards() {
        this.#hubConnection.invoke('TryOpenCards');
    }

    invokeRescoreSubTask() {
        this.#hubConnection.invoke('RescoreSubTask');
    }

    invokeScoreNextSubTask() {
        this.#hubConnection.invoke('ScoreNextSubTask');
    }

    invokeFinishGame() {
        this.#hubConnection.invoke('FinishGame');
    }

    invokeUpdateSubTasks(subTasks) {
        this.#hubConnection.invoke('UpdateSubTasks', subTasks);
    }

    invokeScoreSubTaskById(subTaskId) {
        this.#hubConnection.invoke('ScoreSubTaskById', subTaskId);
    }

    async #startConnection() {
        try {
            await this.#hubConnection.start()
                .then(() => {
                    gameProcessHelper.onConnected();

                    this.#hubConnection.invoke('UserConnected', gameProcessHelper.gameId, gameProcessHelper.isPlayerCookieValue);
                });
            console.log("SignalR Connected.");
        } catch (e) {
            console.log("SignalR Connection error. " + e);
            setTimeout(async () => await this.#startConnection(), 3000);
        }
    }
}
