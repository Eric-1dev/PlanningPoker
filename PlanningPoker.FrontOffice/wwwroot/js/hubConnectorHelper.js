/*jshint esversion: 6 */

let hubConnectorHelper = {
    _hubConnection: {},

    init: () => {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/GameConnect")
            .build();

        hubConnection.onclose(async () => {
            gameProcessHelper.onDisconnected();

            await hubConnectorHelper._start();
        });

        hubConnection.on('OnSystemMessageReceived', (messageInfo) => {
            gameProcessHelper.handleNewMessage(messageInfo);
        });

        hubConnection.on('UserJoin', (user) => {
            gameProcessHelper.handleUserInfo(user);
        });

        hubConnection.on('UserQuit', (userId) => {
            gameProcessHelper.removeUserCard(userId);
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
        });

        hubConnection.on("GameStateChanged", (gameState) => {
            gameProcessHelper.gameStateChanged(gameState.gameState);
            gameProcessHelper.handleSubTasksInfo(gameState.subTasks, gameState.availableScores);
        });

        hubConnection.on("ShowPlayerScores", (showPlayerScoresModel) => {
            gameProcessHelper.handleShowPlayerScores(showPlayerScoresModel);
        });

        hubConnection.on("FlushPlayerScores", (model) => {
            gameProcessHelper.handleFlushPlayerScores(model.playerScores);
            gameProcessHelper.gameStateChanged(model.gameState);
            gameProcessHelper.handleSubTaskInfo(model.subTask);
        });

        hubConnectorHelper._hubConnection = hubConnection;

        hubConnectorHelper._start();
    },

    invokeTryChangeVote: (score) => {
        hubConnectorHelper._hubConnection.invoke('TryChangeVote', score);
    },

    invokeChangeSubTaskScore: (subTaskId, score) => {
        hubConnectorHelper._hubConnection.invoke('SendChangeSubTaskScore', subTaskId, score);
    },

    invokeSpectate: () => {
        hubConnectorHelper._hubConnection
            .invoke('MakeMeSpectator')
            .then(gameProcessHelper.changeMyStatus(false));
    },

    invokeJoinGame: () => {
        hubConnectorHelper._hubConnection
            .invoke('MakeMePlayer')
            .then(gameProcessHelper.changeMyStatus(true));
    },

    invokeStartGame: () => {
        hubConnectorHelper._hubConnection.invoke('StartGame');
    },

    invokeTryOpenCards: () => {
        hubConnectorHelper._hubConnection.invoke('TryOpenCards');
    },

    invokeRescoreSubTask: () => {
        hubConnectorHelper._hubConnection.invoke('RescoreSubTask');
    },

    invokeScoreNextSubTask: () => {
        hubConnectorHelper._hubConnection.invoke('ScoreNextSubTask');
    },

    _start: async () => {
        try {
            await hubConnectorHelper._hubConnection.start()
                .then(() => {
                    gameProcessHelper.onConnected();
                    hubConnectorHelper._hubConnection.invoke('UserConnected', gameProcessHelper.gameId);
                });
            console.log("SignalR Connected.");
        } catch {
            console.log("SignalR Connection error.");
            setTimeout(async () => await hubConnectorHelper._start(), 3000);
        }
    }
};
