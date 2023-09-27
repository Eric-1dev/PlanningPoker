import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const mainStore = {
    namespaced: true,

    state: {
        userId: null,
        userName: '',
        isHubConnected: false
    },

    mutations: {
        initUserData(state) {
            let userId = cookies.get('UserId');

            if (!userId) {
                userId = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
                cookies.set('UserId', userId, new Date(9999, 12, 31));
            }

            state.userId = userId;

            state.userName = cookies.get('UserName');
        },

        setUserName(state, userName) {
            cookies.set('UserName', userName, new Date(9999, 12, 31));

            state.userName = userName;
        },

        clearUserName(state) {
            cookies.set('UserName', '', new Date());

            state.userName = '';
        },

        setHubConnectionState(state, isConnected) {
            state.isHubConnected = isConnected;
        }
    },

    actions: {
        
    }
};

export default mainStore;