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

        hubConnection.on('ConnectionEstablished', () => {
            hubConnection.invoke('UserConnected', gameProcessHelper.gameId);
        });

        hubConnection.on('ReceiveGameInfo', (gameInfo) => {
            gameProcessHelper.handleGameInfoMessage(gameInfo);
        });

        hubConnection.on("UserVoted", (user) => {
            gameProcessHelper.updateUserVote(user);
        });

        hubConnection.on("ReceiveChangeSubTaskScore", (result) => {
            gameProcessHelper.handleSubTaskChangeScore(result.subTaskId, result.score);
        });

        hubConnection.on("ChangeUserInfo", (user) => {
            gameProcessHelper.handleUserInfo(user);
        });

        hubConnection.on("GameStateChanged", (gameState) => {
            gameProcessHelper.handleGameState(gameState.gameState);
            gameProcessHelper.handleSubTasksInfo(gameState.subTasks, gameInfo.availableScores);
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

    _start: async () => {
        try {
            await hubConnectorHelper._hubConnection.start()
                .then(() => {
                    gameProcessHelper.onConnected();
                });
            console.log("SignalR Connected.");
        } catch {
            console.log("SignalR Connection error.");
            setTimeout(async () => await hubConnectorHelper._start(), 3000);
        }
    }
};
