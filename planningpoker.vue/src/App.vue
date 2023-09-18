<template>
    <div class="app">

        <header>
            <div class="pp-username-area">
                <div v-if="userName">
                    <span>{{ userName }}</span>
                    <pp-button class="pp-exit-button" v-if="userName" @click="logOut">
                        Выход
                    </pp-button>
                </div>
                <div v-else>
                    <span>Гость</span>
                </div>
            </div>
        </header>

        <div class="pp-body-wrapper pp-backgroud-cell">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import signalr from '@/signalr/signalr'

export default {
    async beforeMount() {
        this.$router.beforeEach(
            (to, from, next) => {
                if (!this.$store.getters.getUserName && to.name != 'Login') {
                    console.log(to);
                    next({ name: 'Login', query: { redirectUrl: to.path } });
                } else {
                    next();
                }
            });

        let userId = this.$store.state.userId
        if (!userId) {
            this.$store.commit('setupUserId');
        }

        const encodedToken = btoa(encodeURIComponent(`${this.$store.state.userId}:${this.$store.getters.getUserName}`));

        signalr.start(this.HUB_CONNECT_URL, encodedToken);
    },

    mounted() {

    },

    computed: {
        userName() {
            return this.$store.state.userName;
        }
    },

    methods: {
        logOut() {
            this.$store.commit('clearUserName');
            this.redirectToLogin();
        },

        redirectToLogin() {
            console.log(this.$route.fullPath);
            this.$router.go();
        }
    }
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 14px;
    position: relative;
    min-height: 100%;
}

@media (min-width: 768px) {
    html {
        font-size: 16px;
    }
}

body {
    margin-top: 40px;
    margin-bottom: 200px;
}

header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    padding: 5px 20px;
}

.pp-username-area {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: flex-end;
    align-items: center;
}

.pp-body-wrapper {
    position: absolute;
    top: 40px;
    right: 0;
    left: 0;
    bottom: 0;
}

.pp-backgroud-cell {
    background: linear-gradient(#ccc, transparent 1px), linear-gradient(90deg, #ccc, transparent 1px);
    background-size: 15px 15px;
    background-position: center center;
}

.pp-exit-button {
    margin-left: 10px;
}
</style>