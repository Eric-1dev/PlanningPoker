<template>
    <div class="pp-tasks-zone">
        <div v-if="isAdmin">
            <div v-if="!editMode" class="pp-edit-sub-tasks-button">
                <v-btn size="small" color="teal" @click="editSubTasks">Редактировать подзадачи</v-btn>
            </div>

            <div v-else class="pp-editor-buttons">
                <v-btn size="small" color="teal" @click="saveSubTasks">Сохранить изменения</v-btn>
                <v-btn size="small" color="warning" @click="editMode = false">Отмена</v-btn>    
            </div>
        </div>

        <v-scale-transition>
            <pp-sub-tasks-editor v-if="editMode" v-model:subTasks="subTasksToEdit" :canRemoveLast="false"></pp-sub-tasks-editor>
            
            <div v-else class="pp-tasks-wrapper">
                <transition-group name="list">
                    <div v-for="subTask in subTasks" :key="subTask.id">
                        <div class="pp-task">
                            <span class="pp-cursor-pointer" :class="subTask.isSelected ? 'pp-task-selected' : ''" @click="scoreSubTask(subTask)">{{ subTask.text }}</span>
                            <div class="pp-task-score-select-container">
                                <v-select
                                    v-if="isAdmin"
                                    @update:modelValue="scoreChanged($event, subTask.id)"
                                    :disabled="!subTask.isSelected || gameState !== 'CardsOpenned'"
                                    :items="availableScores"
                                    hide-details="auto"
                                    v-model="subTask.score"
                                    density="compact"
                                    variant="outlined"
                                ></v-select>
                                <span v-else>{{ subTask.score ?? '-' }}</span>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>
        </v-scale-transition>
    </div>
    <pp-confirmation-dialog
        title="Вы уверены?"
        text="Вы действительно хотите перейти к оценке этой части? Текущие оценки игроков буду сброшены."
        v-model:show="showRescoreConfirm"
        :confirmAction="confirmRescore"
    ></pp-confirmation-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            editMode: false,
            showRescoreConfirm: false,
            subTaskIdToRescore: null,
            subTasksToEdit: []
        };
    },

    emits: ['scoreChanged', 'scoreSubTaskById', 'updateSubTasks'],

    computed: {
        ...mapState({
            isAdmin: state => state.gameStore.gameInfo.myInfo?.userId === state.gameStore.gameInfo.adminId,
            gameState: state => state.gameStore.gameInfo.gameState,
            availableScores: state => state.gameStore.availableScores,
            subTasks: state => state.gameStore.gameInfo.subTasks
        }),
    },

    methods: {
        scoreChanged(item, subTaskId) {
            const score = parseFloat(item);
            this.$emit('scoreChanged', subTaskId, score);
        },

        scoreSubTask(subTask) {
            if (subTask.isSelected) {
                return;
            }

            this.subTaskIdToRescore = subTask.id;
            this.showRescoreConfirm = true;
        },

        confirmRescore() {
            this.$emit('scoreSubTaskById', this.subTaskIdToRescore);
            this.subTaskIdToRescore = null;
        },

        editSubTasks() {
            this.subTasksToEdit = this.subTasks.map(task => {
                return {
                    id: task.id,
                    text: task.text,
                    uniqueId: task.id
                }
            });

            this.editMode = true;
        },

        saveSubTasks() {
            const subTasks = this.subTasksToEdit.filter(task => task.text);

            subTasks.forEach(task => task.text = task.text.trim());

            for (let i = 0; i < subTasks.length; i++) {
                subTasks[i].order = i;
            }

            this.$emit('updateSubTasks', subTasks);
            this.editMode = false;
        },
    }
};
</script>

<style scoped>
.pp-tasks-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.pp-cursor-pointer {
    cursor: pointer;
}

.pp-task-selected {
    font-weight: bold;
    cursor: default;
    color: blue;
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

.pp-tasks-zone {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.pp-task-score-select-container {
    min-width: fit-content;
}

.pp-edit-sub-tasks-button {
    display: flex;
    justify-content: end;
}

.pp-editor-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
</style>