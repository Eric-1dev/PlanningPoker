<template>
    <div class="pp-tasks-zone">
        <div v-for="subTask in subTasks">
            <div v-if="editMode">
                <v-text-field :value="subTask.text" :rules="[required]"></v-text-field>
            </div>
            <div v-else class="pp-task">
                <span class="pp-cursor-pointer" :class="subTask.isSelected ? 'pp-task-selected' : ''" @click="scoreSubTask(subTask.id)">{{ subTask.text }}</span>
                <v-select
                    v-if="isAdmin"
                    @change="scoreChanged($event, subTask.id)"
                    class="pp-tasks-zone-task-score"
                    :disabled="!subTask.isSelected || gameState !== 'CardsOpenned'"
                    :items="availableScores"
                    clearable
                    density="compact"
                    variant="outlined"
                ></v-select>
                <span v-else>{{ subTask.score ?? '-' }}</span>
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
    },

    methods: {
        scoreChanged(event, subTaskId) {
            const score = parseFloat(event.target.value);
            this.$emit('scoreChanged', subTaskId, score);
        },

        scoreSubTask(subTaskId) {
            this.$emit('scoreSubTaskById', subTaskId);
        }
    }
}
</script>

<style scoped>
.pp-cursor-pointer {
    cursor: pointer;
}

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
    width: 3em;
}

.pp-tasks-zone {
    display: flex;
    flex-direction: column;
    gap: 30px;
}
</style>