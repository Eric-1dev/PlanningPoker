<template>
    <div class="pp-tasks-zone">
        <v-btn v-if="!editMode" size="small" color="teal" @click="editSubTasks">Редактировать подзадачи</v-btn>
        <v-btn v-else size="small" color="teal" @click="saveSubTasks">Сохранить изменения</v-btn>
        <div v-if="editMode" v-for="subTaskToEdit in subTasksToEdit" :key="subTaskToEdit.uniqueId" class="pp-task-edit-container">
            <div class="pp-subtask-controlls">
                <span class="mdi mdi-arrow-up-thick" @click="moveUp(subTaskToEdit.uniqueId)"></span>
                <span class="mdi mdi-arrow-down-thick" @click="moveDown(subTaskToEdit.uniqueId)"></span>
            </div>
            <v-textarea
                rows="2"
                v-model="subTaskToEdit.text"
                :hide-details="true"
                density="compact"
                :no-resize="true"
            ></v-textarea>
            <div class="pp-subtask-controlls">
                <span class="mdi mdi-trash-can-outline" @click="removeTask(subTaskToEdit.uniqueId)"></span>
                <span class="mdi mdi-plus" @click="addNewTask(subTaskToEdit.uniqueId)"></span>
            </div>
        </div>
        <div v-else v-for="subTask in subTasks">
            <div class="pp-task">
                <span class="pp-cursor-pointer" :class="subTask.isSelected ? 'pp-task-selected' : ''" @click="scoreSubTask(subTask)">{{ subTask.text }}</span>
                <div>
                    <v-select
                        v-if="isAdmin"
                        @update:modelValue="scoreChanged($event, subTask.id)"
                        :disabled="!subTask.isSelected || gameState !== 'CardsOpenned'"
                        :items="availableScores"
                        :hide-details="true"
                        v-model="subTask.score"
                        density="compact"
                        variant="outlined"
                    ></v-select>
                    <span v-else>{{ subTask.score ?? '-' }}</span>
                </div>
            </div>
        </div>
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
import PpConfirmationDialog from './UI/PpConfirmationDialog.vue';

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

            for (let i = 0; i < subTasks.length; i++) {
                subTasks[i].order = i;
            }

            this.$emit('updateSubTasks', subTasks);
            this.editMode = false;
        },

        moveUp(id) {
            const index = this.subTasksToEdit.map(x => x.uniqueId).indexOf(id);

            if (index < 1) {
                return;
            }

            const swap = this.subTasksToEdit[index];
            this.subTasksToEdit[index] = this.subTasksToEdit[index - 1];
            this.subTasksToEdit[index - 1] = swap;
        },

        moveDown(id) {
            const index = this.subTasksToEdit.map(x => x.uniqueId).indexOf(id);

            if (index >= this.subTasksToEdit.length - 1) {
                return;
            }

            const swap = this.subTasksToEdit[index];
            this.subTasksToEdit[index] = this.subTasksToEdit[index + 1];
            this.subTasksToEdit[index + 1] = swap;
        },

        removeTask(id) {
            this.subTasksToEdit = this.subTasksToEdit.filter(task => task.uniqueId !== id)
        },

        addNewTask(id) {
            const index = this.subTasksToEdit.map(x => x.uniqueId).indexOf(id);

            const newTask = {
                uniqueId: new Date().valueOf(),
                text: null
            };

            this.subTasksToEdit = [...this.subTasksToEdit.slice(0, index + 1), newTask, ...this.subTasksToEdit.slice(index + 1)];
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

.pp-task-edit-container {
    display: flex;
    flex-direction: row;
}

.pp-subtask-controlls {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 1.2em;
}

.pp-subtask-controlls span {
    cursor: pointer;
}
</style>