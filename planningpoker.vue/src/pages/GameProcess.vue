<template>
    <div class="pp-connection-indicator"
                    :class="isHubConnected ? 'pp-connection-indicator-connected' : 'pp-connection-indicator-disconnected'"
                    :title="isHubConnected ? 'Соединение установлено' : 'Соединение прервано'">
                </div>
    <div>
        GameProcess Page, Id = {{$route.params.id}}
    </div>
</template>

<script>
import signalr from '@/signalr/signalr';
import { mapState } from 'vuex';

export default {
    beforeMount() {
        signalr.start();
    },

    mounted() {
        //signalr.invoke('UserConnected', gameProcessHelper.gameId, gameProcessHelper.isPlayerCookieValue);
    },

    computed: {
        ...mapState({
            isHubConnected: state => state.mainStore.isHubConnected
        })
    },

    beforeUnmount() {
        signalr.stop();
    }
}
</script>

<style scoped>
.pp-connection-indicator {
    width: 18px;
    height: 18px;
    border-radius: 50%;
}

.pp-connection-indicator-connected {
    background-color: green;
}

.pp-connection-indicator-disconnected {
    background-color: rgb(180, 0, 0);
}
</style>