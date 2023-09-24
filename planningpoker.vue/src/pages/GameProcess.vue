<template>
    <div class="v-btns-zone-wrapper">
        <div class="v-btns-zone">
            <div class="v-btn-group">
                <v-btn v-if="isPlayer" @click="spectate" color="primary" size="small">Стать набдюдателем</v-btn>
                <v-btn v-else @click="joinGame" color="primary" size="small">Вступить в игру</v-btn>
            </div>
            <div class="v-btn-group">
                <user-list></user-list>
            </div>
            <div class="v-btn-group pp-justify-content-end">
                <h5 v-if="!hasPlayers"><span class="pp-badge-warning">Ожидание других игроков...</span></h5>
                <div class="pp-admin-buttons-group" v-if="isAdmin">
                    <v-btn v-if="needShowFinishButton" @click="finishGame" size="small" color="success">Завершить оценку</v-btn>
                    <v-btn v-if="needShowStartButton" @click="startGame" size="small" color="success">Начать оценку</v-btn>
                    <v-btn v-if="needShowShowCardsButton" @click="tryOpenCards" :disabled="!canShowCards" size="small" color="success">Показать карты</v-btn>
                    <v-btn v-if="needShowNextSubtaskButton" @click="scoreNextSubTask" :disabled="!canGoNextTask" color="success" size="small">Перейти к следующей</v-btn>
                    <v-btn v-if="needShowRescoreButton" @click="rescoreSubTask" color="warning" size="small">Оценить заново</v-btn>
                </div>
            </div>
        </div>
    </div>

    <div class="pp-gamers-zone-wrapper">
        <div class="pp-gamers-zone">

            <!-- Карта текущего игрока -->
            <div class="pp-gamer-score" v-if="isPlayer">
                <pp-card v-if="isPlayer" :text="getCardTextByScore(gameInfo.myInfo?.score)" :state="cardState(gameInfo.myInfo)"></pp-card>
                <div class="pp-gamer-name">{{ gameInfo.myInfo?.name }}</div>
            </div>

            <!-- Карты других игроков -->
            <div v-for="otherUser in otherPlayers" class="pp-gamer-score">
                <pp-card :text="getCardTextByScore(otherUser.score)" :state="cardState(otherUser)"></pp-card>
                <div class="pp-gamer-name">{{ otherUser.name }}</div>
            </div>

        </div>
    </div>

    <div class="pp-tasks-zone-wrapper">
        <div class="pp-tasks-zone-task-header">
            <span>{{ gameInfo.taskName }}</span>
        </div>

        <sub-task-list @scoreChanged="updateSubTaskScore" @scoreSubTaskById="scoreSubTaskById"></sub-task-list>
    </div>

    <div class="pp-gamer-card-zone" :active="isPlayer && gameInfo.gameState === 'Scoring'">
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

        signalr.onUpdateUser = (user) => this.$store.commit('gameStore/updateUser', user);

        signalr.onReceiveChangeSubTaskScore = (subTask) => this.$store.commit('gameStore/updateSubTask', subTask);

        signalr.onGameStateChanged = (model) => this.$store.commit('gameStore/updateGameState', model);

        signalr.onShowPlayerScores = (model) => this.$store.commit('gameStore/updatePlayersScore', model);

        signalr.onReceiveScoreNextSubTask = (model) => this.$store.commit('gameStore/updateGameState', model);

        signalr.onSubTasksUpdated = (subTasks) => this.$store.commit('gameStore/updateSubTasks', subTasks);
        
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
            const otherPlayerVoted = this.gameInfo.otherUsers
                ? this.gameInfo.otherUsers.filter(user => !user.hasVoted)?.length === 0
                : true;

            const currentPlayerIsVoted = this.isPlayer
                ? this.gameInfo.myInfo.hasVoted
                : true;

            return otherPlayerVoted && currentPlayerIsVoted;
        },

        canGoNextTask() {
            const selectedSubTask = this.gameInfo.subTasks.find(task => task.isSelected === true);

            return selectedSubTask.score;
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
            if (this.gameInfo.gameState !== 'CardsOpenned') {
                return false;
            }

            const unvotedTask = this.gameInfo.subTasks.find(subTask => subTask.score === null);

            return !unvotedTask;
        }
    },

    unmounted() {
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
            signalr.invokeTryChangeVote(score);
        },

        cardState(user) {
            if (this.gameInfo.gameState === 'CardsOpenned' && user?.hasVoted) {
                return 'openned';
            }

            return user?.hasVoted ? 'voted' : 'unvoted';
        },

        getCardTextByScore(score) {
            return this.gameInfo.cards?.find(card => card.score === score)?.text;
        },

        updateSubTaskScore(subTaskId, score) {
            signalr.invokeChangeSubTaskScore(subTaskId, score);
        },

        spectate() {
            signalr.invokeSpectate();
        },

        joinGame() {
            signalr.invokeJoinGame();
        },

        startGame() {
            signalr.invokeStartGame();
        },

        finishGame() {
            signalr.invokeFinishGame();
        },

        rescoreSubTask() {
            signalr.invokeRescoreSubTask();
        },

        tryOpenCards() {
            signalr.invokeTryOpenCards();
        },

        scoreNextSubTask() {
            signalr.invokeScoreNextSubTask();
        },

        scoreSubTaskById(subTaskId) {
            signalr.invokeScoreSubTaskById(subTaskId);
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

.v-btns-zone-wrapper {
    position: absolute;
    top: 3px;
    left: 0;
    right: 0;
    height: 40px;
    padding: 2px 10px;
}

.v-btns-zone {
    display: flex;
    flex-direction: row;
    gap: 30px;
    align-items: center;
    height: 100%;
    justify-content: space-between
}

.v-btn-group {
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