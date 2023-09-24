<template>
    <div class="app">
        <div class="pp-backgroud-cell">
            <header>
                <div class="pp-username-area">
                    <div v-if="userName">
                        <span>{{ userName }}</span>
                        <v-btn color="grey" class="pp-exit-button" @click="logOut" size="small">
                            Выход
                        </v-btn>
                    </div>

                    <div v-else>
                        <span>Гость</span>
                    </div>
                </div>
            </header>

            <div class="pp-body-wrapper">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import signalr from '@/signalr/signalr'

export default {
    async beforeMount() {
        this.$store.commit('mainStore/initUserData');

        this.$router.beforeEach(
            (to, from, next) => {
                if (!this.$store.state.mainStore.userName && to.name != 'Login') {
                    next({ name: 'Login', query: { redirectUrl: to.path } });
                } else {
                    next();
                }
            });
    },

    methods: {
        logOut() {
            this.$store.commit('mainStore/clearUserName');
            this.redirectToLogin();
        },

        redirectToLogin() {
            this.$router.go();
        }
    },

    computed: {
        userName() {
            return this.$store.state.mainStore.userName;
        }
    },

    watch: {
        userName() {
            signalr.generateAndSetToken(this.$store.state.mainStore.userId, this.$store.state.mainStore.userName);
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
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

@media (min-width: 768px) {
    html {
        font-size: 16px;
    }
}

header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
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
    padding: 10px 20px;
    position: absolute;
    top: 50px;
    right: 0;
    left: 0;
    bottom: 0;
}

.pp-backgroud-cell {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(#eee, transparent 1px), linear-gradient(90deg, #eee, transparent 1px);
    background-size: 15px 15px;
    background-position: top center;
}

.pp-exit-button {
    margin-left: 10px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .4s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

@font-face {
    font-family: "bootstrap-icons";
    src: local("bootstrap-icons"), url("./fonts/bootstrap-icons.woff2") format("woff2"), url("./fonts/bootstrap-icons.woff") format("woff");
}
</style>