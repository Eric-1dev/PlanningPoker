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

            const existingUser = state.gameInfo.otherUsers.find(item => item.userId === user.userId);
            if (existingUser) {
                existingUser = user;
            } else {
                state.gameInfo.otherUsers.push(user);
            }
        },

        removeUser(state, userId) {
            state.gameInfo.otherUsers = state.gameInfo.otherUsers.filter(user => user.userId !== userId);
        }
    },

    actions: {

    }
};

export default gameStore;