import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const gameStore = {
    namespaced: true,

    state: {
        isPlayer: false,
        gameInfo: {}
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
        }
    },

    actions: {

    }
};

export default gameStore;