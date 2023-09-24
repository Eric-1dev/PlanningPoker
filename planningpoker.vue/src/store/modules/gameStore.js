import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const gameStore = {
    namespaced: true,

    state: {
        isPlayer: false,
        gameInfo: {},
        availableScores: []
    },

    mutations: {
        setIsPlayer(state) {
            const isPlayerCookieValue = cookies.get('IsPlayer');
            if (!isPlayerCookieValue) {
                cookies.set('IsPlayer', true, new Date(9999, 12, 31));
            }

            state.isPlayer = isPlayerCookieValue === 'true';
        },

        setGameInfo(state, gameInfo) {
            state.gameInfo = gameInfo;
            state.gameInfo.subTasks.sort((a, b) => a.order - b.order);
            state.availableScores = gameInfo.cards.map(card => card.score).filter(score => score >= 0);
        },

        addUser(state, user) {
            if (user.userId === state.gameInfo.myInfo.userId) {
                return;
            }

            state.gameInfo.otherUsers = state.gameInfo.otherUsers.filter(item => item.userId !== user.userId);

            state.gameInfo.otherUsers.push(user);
        },

        removeUser(state, userId) {
            state.gameInfo.otherUsers = state.gameInfo.otherUsers.filter(user => user.userId !== userId);
        },

        updateUser(state, user) {
            if (user.userId === state.gameInfo.myInfo.userId) {
                state.gameInfo.myInfo = user;
                state.isPlayer = user.isPlayer;
                return;
            }

            state.gameInfo.otherUsers = state.gameInfo.otherUsers.filter(item => item.userId !== user.userId);

            state.gameInfo.otherUsers.push(user);
        },

        updateSubTask(state, subTask) {
            state.gameInfo.subTasks = state.gameInfo.subTasks.filter(task => task.id !== subTask.id);
            state.gameInfo.subTasks.push(subTask);
            state.gameInfo.subTasks.sort((a, b) => a.order - b.order);
        },

        updateGameState(state, model) {
            this.commit('gameStore/updatePlayersScore', model)

            this.commit('gameStore/updateSubTasks', model.subTasks)
        },

        updatePlayersScore(state, model) {
            state.gameInfo.gameState = model.gameState;

            model.playerScores.forEach(playerScore => {
                if (playerScore.userId === state.gameInfo.myInfo.userId) {
                    state.gameInfo.myInfo.score = playerScore.score;
                    state.gameInfo.myInfo.hasVoted = playerScore.score != null;
                } else {
                    const player = state.gameInfo.otherUsers.find(user => user.userId === playerScore.userId);

                    if (player) {
                        player.score = playerScore.score;
                        player.hasVoted = playerScore.score != null;
                    }
                }
            });
        },

        updateSubTasks(state, subTasks) {
            state.gameInfo.subTasks = subTasks;
            state.gameInfo.subTasks.sort((a, b) => a.order - b.order);
        }
    },

    actions: {

    }
};

export default gameStore;