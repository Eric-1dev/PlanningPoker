/*jshint esversion: 6 */

let hubConnectorHelper = {
    init: () => {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/GameConnect")
            .build();

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

        hubConnection.start();

        hubConnectorHelper._hubConnection = hubConnection;
    },

    invokeTryChangeVote: (score) => {
        hubConnectorHelper._hubConnection.invoke('TryChangeVote', gameProcessHelper.gameId, score);
    },

    invokeChangeSubTaskScore: (subTaskId, score) => {
        hubConnectorHelper._hubConnection.invoke('SendChangeSubTaskScore', gameProcessHelper.gameId, subTaskId, score);
    },

    invokeSpectate: () => {
        hubConnectorHelper._hubConnection
            .invoke('MakeMeSpectator', gameProcessHelper.gameId)
            .then(gameProcessHelper.changeMyStatus(false));
    },

    invokeJoinGame: () => {
        hubConnectorHelper._hubConnection
            .invoke('MakeMePlayer', gameProcessHelper.gameId)
            .then(gameProcessHelper.changeMyStatus(true));
    },

    _hubConnection: {}
};
