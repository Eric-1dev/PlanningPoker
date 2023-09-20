<template>
    <div class="pp-tasks-zone">
        <div v-for="subTask in subTasks">
            <div v-if="editMode">
                <pp-input-text :value="subTask.text"></pp-input-text>
            </div>
            <div v-else class="pp-task">
                <span :class="subTask.isSelected ? 'pp-task-selected' : ''">{{ subTask.text }}</span>
                <select v-if="isAdmin" class="pp-tasks-zone-task-score" :disabled="!subTask.isSelected || gameState !== 'CardsOpenned'">
                    <option value="">-</option>
                    <option v-for="item in availableScores" :value="item" :selected="subTask.score === item">{{ item }}</option>
                </select>
                <span v-else>{{ subTask.score }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            editMode: false
        };
    },

    computed: {
        ...mapState({
            isAdmin: state => state.gameStore.gameInfo.myInfo?.userId === state.gameStore.gameInfo.adminId,
            gameState: state => state.gameStore.gameInfo.gameState,
            availableScores: state => state.gameStore.availableScores,
            subTasks: state => state.gameStore.gameInfo.subTasks
        }),
    }
}
</script>

<style scoped>
.pp-task-selected {
    font-weight: bold;
}

.pp-task {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    border-bottom: 1px solid lightgray;
    padding: 5px;
}

.pp-task-name {
    word-wrap: anywhere;
    margin-right: 10px;
}

.pp-tasks-zone-task-score {
    width: auto;

}

.pp-tasks-zone {
    display: flex;
    flex-direction: column;
    gap: 30px;
}
</style>