/*jshint esversion: 6 */

let hubConnectorHelper = {
    init: () => {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/GameConnect")
            .build();

        hubConnection.on('UserJoin', (user) => {
            gameProcessHelper.addUser(user);
        });

        hubConnection.on('UserQuit', (userId) => {
            gameProcessHelper.removeUser(userId);
        });

        hubConnection.on('ConnectionEstablished', () => {
            hubConnection.invoke('UserConnected', gameProcessHelper.gameId);
        });

        hubConnection.on('ReceiveGameInfo', (gameInfo) => {
            gameInfo.otherUsers.forEach((user) => {
                gameProcessHelper.addUser(user);
            });
        });

        hubConnection.on("UserVoted", (user) => {
            gameProcessHelper.updateUserVote(user);
        });

        hubConnection.start();

        hubConnectorHelper._hubConnection = hubConnection;
    },

    invokeTryChangeVote: (hasVote) => {
        hubConnectorHelper._hubConnection.invoke('TryChangeVote', gameProcessHelper.gameId, hasVote);
    },

    _hubConnection: {}
};
