import { createStore } from "vuex";
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies();

export default createStore({
    state: {
        userId: null,
        userName: null
    },

    getters: {
        getUserId(state, commit) {
            if (!state.userId) {
                console.log(commit)
                commit('setupUserId');
            }

            return state.userId;
        },

        getUserName(state) {
            if (state.userName){
                return state.userName;
            }

            state.userName = cookies.get('UserName');

            return state.userName;
        }
    },

    mutations: {
        setupUserId(state) {
            const userId = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
            cookies.set('UserId', userId, new Date(9999, 12, 31));

            state.userId = userId;
        },
        
        setUserName (state, userName) {
            cookies.set('UserName', userName, new Date(9999, 12, 31));

            state.userName = userName;
        },

        clearUserName(state) {
            cookies.set('UserName', '', new Date());

            state.userName = null;
        }
    },

    actions: {

    }
});