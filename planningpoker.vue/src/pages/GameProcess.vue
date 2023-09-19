<template>
    <div>
        GameProcess Page, Id = {{ $route.params.id }}
    </div>

    <div class="pp-gamer-card-zone">
        <pp-card v-for="card in cards" :key="card.text" :text="card.text" :score="card.score" :color="card.color" @selectCard="selectCard"
            :isSelectable="true"></pp-card>
    </div>

    <transition name="fade">
        <div v-if="!isHubConnected" class="pp-locker" id="planning-poker-connection-lost-locker">
            <div class="pp-connection-lost-banner-wrapper">
                <div class="pp-connection-lost-banner">
                    <span class="pp-connection-lost-banner-text">Потеряно соединение с сервером. Восстанавливаю...</span>
                    <img src="@/assets/loader.svg" />
                </div>
            </div>
        </div>
    </transition>
</template>

<script>

import signalr from '@/signalr/signalr';
import { mapState } from 'vuex';

export default {
    async beforeMount() {
        this.$store.commit('gameStore/setIsPlayer');

        signalr.onReceiveGameInfo = (gameInfo) => this.$store.commit('gameStore/setGameInfo', gameInfo);

        await this.reconnect();
    },

    computed: {
        ...mapState({
            isHubConnected: state => state.mainStore.isHubConnected,
            isPlayer: state => state.gameStore.isPlayer,
            cards: state => state.gameStore.gameInfo.cards
        })
    },

    beforeUnmount() {
        signalr.stop();
    },

    watch: {
        async isHubConnected(newValue) {
            if (newValue) {
                return;
            }

            this.reconnect();
        }
    },

    methods: {
        async reconnect() {
            try {
                console.log("SignalR Connecting...");
                await signalr.start()
                    .then(() => {
                        signalr.invokeUserConnected(this.$route.params.id, this.$store.state.gameStore.isPlayer);
                        console.log("SignalR Connected.");
                    });

            } catch (e) {
                console.log("SignalR Connection error. " + e);
                setTimeout(async () => await this.reconnect(), 3000);
            }
        },

        selectCard(score) {
            console.log(score);
        }
    }
}
</script>

<style scoped>
.pp-locker {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    z-index: 20000;
}

.pp-connection-lost-banner-wrapper {
    position: fixed;
    width: 400px;
    height: 300px;
    background-color: whitesmoke;
    top: calc(50% - 150px);
    left: calc(50% - 200px);
    border-radius: 30px;
    padding: 30px;
}

.pp-connection-lost-banner {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 20px;
}

.pp-connection-lost-banner-text {
    margin-bottom: 50px;
}

.pp-gamer-card-zone {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    display: flex;
    gap: 20px;
    padding: 10px;
}
</style>