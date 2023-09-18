const gameStore = {
    namespaced: true,

    state: {
        gameId: null
    },

    mutations: {
        setGameId(state, gameId) {
            state.gameId = gameId;
        }
    },

    actions: {

    }
};

export default gameStore;