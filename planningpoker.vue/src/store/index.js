import { createStore } from "vuex";

export default createStore({
    state: {
        userId: null,
        userName: null
    },

    getters: {

    },

    mutations: {
        setUserId (state, userId) {
            state.userId = userId;
        },
        
        setUserName (state, userName) {
            state.userName = userName;
        }
    },

    actions: {

    }
});