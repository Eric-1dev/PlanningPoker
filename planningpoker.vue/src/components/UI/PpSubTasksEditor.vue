<template>
    <div>
        <v-btn block v-if="subTaskList.length === 0" size="small" color="success" @click="addNewTask">Добавить
            подзадачу</v-btn>

        <div class="pp-task-edit-wrapper">
            <transition-group name="list">
                <div v-for="subTask in subTaskList" :key="subTask.uniqueId" class="pp-task-edit-container">
                    <div class="pp-subtask-controlls">
                        <span class="mdi mdi-arrow-up-thick" @click="moveUp(subTask.uniqueId)"></span>
                        <span class="mdi mdi-arrow-down-thick" @click="moveDown(subTask.uniqueId)"></span>
                    </div>

                    <v-textarea rows="2" v-model="subTask.text" :hide-details="true" density="compact"
                        :no-resize="true"></v-textarea>

                    <div class="pp-subtask-controlls">
                        <span class="mdi mdi-trash-can-outline" @click="removeTask(subTask.uniqueId)"></span>
                        <span class="mdi mdi-plus" @click="addNewTask(subTask.uniqueId)"></span>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ppSubTasksEditor',

    data() {
        return {
            subTaskList: this.subTasks
        };
    },

    props: {
        subTasks: Array,
        canRemoveLast: {
            type: Boolean,
            default: true
        }
    },

    methods: {
        moveUp(id) {
            const index = this.subTaskList.map(x => x.uniqueId).indexOf(id);

            if (index < 1) {
                return;
            }

            const swap = this.subTaskList[index];
            this.subTaskList[index] = this.subTaskList[index - 1];
            this.subTaskList[index - 1] = swap;

            this.$emit('update:subTasks', this.subTaskList);
        },

        moveDown(id) {
            const index = this.subTaskList.map(x => x.uniqueId).indexOf(id);

            if (index >= this.subTaskList.length - 1) {
                return;
            }

            const swap = this.subTaskList[index];
            this.subTaskList[index] = this.subTaskList[index + 1];
            this.subTaskList[index + 1] = swap;

            this.$emit('update:subTasks', this.subTaskList);
        },

        removeTask(id) {
            if (!this.canRemoveLast && this.subTaskList.length === 1) {
                return;
            }

            this.subTaskList = this.subTaskList.filter(task => task.uniqueId !== id)

            this.$emit('update:subTasks', this.subTaskList);
        },

        addNewTask(id) {
            if (!id) {
                this.subTaskList.push({
                    uniqueId: new Date().valueOf(),
                    text: null
                });
            }

            const index = this.subTaskList.map(x => x.uniqueId).indexOf(id);

            const newTask = {
                uniqueId: new Date().valueOf(),
                text: null
            };

            this.subTaskList = [...this.subTaskList.slice(0, index + 1), newTask, ...this.subTaskList.slice(index + 1)];

            this.$emit('update:subTasks', this.subTaskList);
        }
    }
}
</script>

<style scoped>
.pp-task-edit-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
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

.list-item {
    display: inline-block;
    margin-right: 10px;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.list-move {
    transition: transform 0.4s ease;
}
</style>