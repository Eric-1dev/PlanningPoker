const app = Vue.createApp({
    data() {
        return {
            users: [],
            gameInfo: {
                myInfo: {}
            }
        }
    },

    methods: {
        setUsers(newUsers) {
            this.users = newUsers.slice();
        },

        setGameInfo(gameInfo) {
            this.gameInfo = gameInfo;
        },

        updateSubTasks(subTasks) {
            this.gameInfo.subTasks = subTasks;
        }
    }
})

app.component('vue-user-list', {
    data() {
        return {
            showList: false
        }
    },

    props: {
        userList: Array,
    },

    computed: {
        sortedUserList() {
            const sortedUserList = this.userList.slice();
            return sortedUserList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        }
    },

    template: `
        <div id="vue_user-list-element">
            <button class= "btn btn-sm btn-outline-success shadow-none" v-on:click="this.showList=!this.showList">Список пользователей</button>
            <div class="vue_user-list_wrapper" v-bind:class="{'vue_d-none':!this.showList}">
                <div class="d-table">
                    <div class="d-table-row" v-for="user in sortedUserList">
                        <div class="d-table-cell w-100">{{user.name}}</div>
                        <div class="d-table-cell">
                            <div v-if="!user.isPlayer"><i class="bi-eye-fill"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
})

app.component('vue-edit-sub-tasks', {
    data() {
        return {
            showElement: false,
            subTasks: []
        }
    },

    props: {
        subTasksProp: Array,
        isAdmin: Boolean
    },

    methods: {
        initEditor() {
            this.subTasks = this.subTasksProp.slice();
            this.showElement = true;
        },

        addSubTask(afterOrder) {
            this.subTasks.push({
                text: '',
                order: afterOrder + 1
            });

            this._recalcOrders();
        },

        removeSubTask(order) {
            if (this.subTasks.length < 2) {
                return;
            }

            this.subTasks = this.subTasks.filter((item) => item.order != order);

        },

        moveUp(currentOrder) {
            var index = this.subTasks.map(task => task.order).indexOf(currentOrder);

            if (index == 0) {
                return;
            }

            let temp = this.subTasks[index];
            this.subTasks[index] = this.subTasks[index - 1]
            this.subTasks[index - 1] = temp;

            this._recalcOrders();
        },

        moveDown(currentOrder) {
            var index = this.subTasks.map(task => task.order).indexOf(currentOrder);

            if (index == this.subTasks.length - 1) {
                return;
            }

            let temp = this.subTasks[index];
            this.subTasks[index] = this.subTasks[index + 1]
            this.subTasks[index + 1] = temp;

            this._recalcOrders();
        },

        saveChanges() {
            gameProcessHelper.updateSubTasks(this.subTasks);
            this.showElement = false;
        },

        _recalcOrders() {
            let i = 0;

            this.subTasks.forEach((item) => {
                item.order = i++;
            });
        }
    },

    template: `
        <span id="vue-edit-sub-tasks-element" v-if="this.isAdmin">
            <button class= "btn btn-sm btn-outline-success shadow-none planning-poker-edit-task-button" v-on:click="this.initEditor()">Редактировать задачи</button>
        </span>

        <transition name="fade">
            <div class="planning-poker-locker" v-if="this.isAdmin && this.showElement">
                <div class="planning-poker-create-game-container">
                    <div class="planning-poker-create-game-form-wrapper">
                        <div class="planning-poker-create-game-form-container">
                            <div class="planning-poker-subtask-container-wrapper">
                                <div v-for="subTask in this.subTasks" class="mb-3 planning-poker-task-name-container">
                                    <div class="planning-poker-task-block">
                                        <div>
                                            <button type="button" class="btn btn-sm btn-primary mt-1 shadow-none bi-arrow-up" v-on:click="this.moveUp(subTask.order)"></button>
                                            <button type="button" class="btn btn-sm btn-primary mt-1 shadow-none bi-arrow-down" v-on:click="this.moveDown(subTask.order)"></button>
                                        </div>

                                        <textarea class="form-control shadow-none planning-poker-subtask-name" v-model="subTask.text" name="tasks" cols="60" rows="2" placeholder="Название подзадачи"></textarea>

                                        <button type="button" class="btn btn-sm btn-warning mt-1 shadow-none planning-poker-delete-subtask-button" v-on:click="this.removeSubTask(subTask.order)">-</button>
                                        <button type="button" class="btn btn-sm btn-success mt-1 shadow-none planning-poker-add-subtask-button" v-on:click="this.addSubTask(subTask.order)">+</button>
                                    </div>
                                </div>

                            </div>

                            <div>
                                <button type="button" class="btn btn-primary shadow-none m-3" id="planning-poker-create-game-button" v-on:click="this.saveChanges()">Сохранить</button>
                                <button type="button" class="btn btn-outline-primary shadow-none m-3" id="planning-poker-create-game-button" v-on:click="this.showElement=false">Отмена</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    `
})

const vueApp = app.mount('#planning-poker-body-wrapper')
