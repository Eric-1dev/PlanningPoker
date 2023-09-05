/*jshint esversion: 6 */

let hubConnectorHelper = {
    init: () => {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/GameConnect")
            .build();

        hubConnection.on('UserJoin', (user) => {
            gameProcessHelper.addPlayer(user);
        });

        hubConnection.on('UserQuit', (userId) => {
            gameProcessHelper.removeUser(userId);
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

        hubConnection.start();

        hubConnectorHelper._hubConnection = hubConnection;
    },

    invokeTryChangeVote: (score) => {
        hubConnectorHelper._hubConnection.invoke('TryChangeVote', gameProcessHelper.gameId, score);
    },

    invokeChangeSubTaskScore: (subTaskId, score) => {
        hubConnectorHelper._hubConnection.invoke('SendChangeSubTaskScore', gameProcessHelper.gameId, subTaskId, score);
    },

    _hubConnection: {}
};
