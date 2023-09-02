/*jshint esversion: 6 */

let hubConnectorHelper = {
    init: () => {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("/GameConnect")
            .build();

        hubConnection.on('UserJoin', (userName, userId) => {
            gameProcessHelper.addUser(userName, userId);
        });

        hubConnection.on('UserQuit', (userId) => {
            gameProcessHelper.removeUser(userId);
        });

        hubConnection.on('Start', () => {
            hubConnection.invoke('UserJoin', gameProcessHelper.gameId);
        });

        hubConnection.start();
    }
};
