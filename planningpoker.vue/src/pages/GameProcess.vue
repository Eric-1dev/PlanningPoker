<template>
    <div class="pp-buttons-zone-wrapper">
        <div class="pp-buttons-zone">
            <div class="pp-button-group">
                <pp-button v-if="isPlayer">Стать набдюдателем</pp-button>
                <pp-button v-else>Вступить в игру</pp-button>
            </div>
            <div class="pp-button-group">
                <user-list></user-list>
            </div>
            <div class="pp-button-group pp-justify-content-end">
                <h5 v-if="!hasPlayers"><span class="pp-badge-warning">Ожидание других игроков...</span></h5>
                <div class="pp-admin-buttons-group" v-if="isAdmin">
                    <pp-button v-if="needShowFinishButton">Завершить оценку</pp-button>
                    <pp-button v-if="needShowStartButton">Начать оценку</pp-button>
                    <pp-button v-if="needShowShowCardsButton" :disabled="!canShowCards">Показать карты</pp-button>
                    <pp-button v-if="needShowNextSubtaskButton">Перейти к следующей</pp-button>
                    <pp-button v-if="needShowRescoreButton">Оценить заново</pp-button>
                </div>
            </div>
        </div>
    </div>

    <div class="pp-gamers-zone-wrapper">
        <div class="pp-gamers-zone">

            <!-- Карта текущего игрока -->
            <div class="pp-gamer-score" v-if="isPlayer">
                <pp-card v-if="isPlayer" state="openned"></pp-card>
                <div class="pp-gamer-name">{{ gameInfo.myInfo?.name }}</div>
            </div>

            <!-- Карты других игроков -->
            <div v-for="otherUser in otherPlayers" class="pp-gamer-score">
                <pp-card state="openned"></pp-card>
                <div class="pp-gamer-name">{{ otherUser.name }}</div>
            </div>
        </div>
    </div>

    <div class="pp-tasks-zone-wrapper">
        <div class="pp-tasks-zone-task-header">
            <span>{{ gameInfo.taskName }}</span>
        </div>

        <sub-task-list></sub-task-list>
    </div>

    <div class="pp-gamer-card-zone" :active="isPlayer">
        <pp-card v-for="card in gameInfo.cards" :key="card.text" :text="card.text" :score="card.score" :color="card.color"
            state="default" :isSelected="gameInfo.myInfo.score === card.score && isPlayer"
            :isSelectable="gameInfo.gameState === 'Scoring'" @selectCard="selectCard">
        </pp-card>
    </div>

    <transition name="fade">
        <div v-if="!isHubConnected" class="pp-locker" id="planning-poker-connection-lost-locker">
            <div class="pp-connection-lost-banner-wrapper">
                <div class="pp-connection-lost-banner">
                    <span class="pp-connection-lost-banner-text">Устанавливаю соединение с сервером...</span>
                    <img src="@/assets/loader.svg" />
                </div>
            </div>
        </div>
    </transition>
</template>

<script>

import signalr from '@/signalr/signalr';
import { mapState } from 'vuex';
import SubTaskList from '@/components/SubTaskList.vue';
import UserList from '@/components/UserList.vue';

export default {
    async beforeMount() {
        this.$store.commit('gameStore/setIsPlayer');

        signalr.setUrl(this.HUB_CONNECT_URL);
        signalr.onStart = () => this.$store.commit('mainStore/setHubConnectionState', true);
        signalr.onStop = () => this.$store.commit('mainStore/setHubConnectionState', false);

        signalr.onReceiveGameInfo = (gameInfo) => this.$store.commit('gameStore/setGameInfo', gameInfo);

        signalr.onUserJoin = (user) => this.$store.commit('gameStore/addUser', user);

        signalr.onUserQuit = (userId) => this.$store.commit('gameStore/removeUser', userId);

        await this.reconnect();
    },

    computed: {
        ...mapState({
            isHubConnected: state => state.mainStore.isHubConnected,
            isPlayer: state => state.gameStore.isPlayer,
            isAdmin: state => state.gameStore.gameInfo.myInfo?.userId === state.gameStore.gameInfo.adminId,
            gameInfo: state => state.gameStore.gameInfo
        }),

        otherPlayers() {
            if (!this.gameInfo.otherUsers) {
                return false;
            }

            return this.gameInfo.otherUsers.filter(user => user.isActive && user.isPlayer);
        },

        canShowCards() {
            if (!this.gameInfo.otherUsers) {
                return false;
            }

            return this.gameInfo.otherUsers.filter(user => !user.HasVoted)?.length === 0;
        },

        hasPlayers() {
            return this.otherPlayers?.length !== 0 || this.isPlayer;
        },

        needShowStartButton() {
            return this.hasPlayers && (this.gameInfo.gameState === 'Created' || this.gameInfo.gameState === 'Finished');
        },

        needShowShowCardsButton() {
            return this.hasPlayers && this.gameInfo.gameState === 'Scoring';
        },

        needShowNextSubtaskButton() {
            if (!this.gameInfo.subTasks) {
                return false;
            }

            const orders = this.gameInfo.subTasks.map(task => task.order);
            const maxOrder = Math.max(...orders);

            return this.hasPlayers && this.gameInfo.gameState === 'CardsOpenned' && this.gameInfo.subTasks.find(task => task.isSelected).order !== maxOrder;
        },

        needShowRescoreButton() {
            return this.gameInfo.gameState === 'CardsOpenned';
        },

        needShowFinishButton() {
            return this.gameInfo.gameState === 'CardsOpenned';
        }
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
    },

    components: {
        SubTaskList,
        UserList
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

.pp-gamers-zone-wrapper {
    position: absolute;
    top: 40px;
    left: 0px;
    right: 570px;
    bottom: 210px;
    overflow-y: auto;
    padding: 10px;
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

.pp-gamer-card-zone[active="true"] {
    animation-duration: 0.5s;
    animation-name: slidein;
}

.pp-gamer-card-zone[active="false"] {
    padding-top: 200px;
    animation-duration: 0.5s;
    animation-name: slideout;
}

.pp-gamers-zone {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-content: center;
    border: 1px groove lightgray;
}

.pp-gamer-score {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.pp-gamer-name {
    width: 150px;
    word-wrap: break-word;
    text-align: center;
}

.pp-buttons-zone-wrapper {
    position: absolute;
    top: 3px;
    left: 0;
    right: 0;
    height: 40px;
    padding: 2px 10px;
}

.pp-buttons-zone {
    display: flex;
    flex-direction: row;
    gap: 30px;
    align-items: center;
    height: 100%;
    justify-content: space-between
}

.pp-button-group {
    display: flex;
    flex-direction: row;
    width: 30%;
    align-items: baseline;
}

.pp-justify-content-end {
    justify-content: end;
}

.pp-admin-buttons-group {
    display: flex;
    gap: 10px;
}

.pp-badge-warning {
    padding: 5px 10px;
    background-color: rgb(255, 183, 88);
    color: white;
    border: 1px solid rgb(255, 165, 47);
    border-radius: 10px;
}

.pp-tasks-zone-wrapper {
    position: absolute;
    width: 550px;
    top: 40px;
    right: 0;
    bottom: 200px;
    overflow-y: auto;
    padding: 10px;
}

.pp-tasks-zone-task-header {
    margin-bottom: 20px;
    font-size: 24px;
}

@keyframes slidein {
    from {
        padding-top: 200px;
    }

    to {
        padding-top: 10px;
    }
}

@keyframes slideout {
    from {
        padding-top: 10px;
    }

    to {
        padding-top: 200px;
    }
}
</style>