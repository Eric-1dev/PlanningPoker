<template>
    <div class="pp-create-game-container">
        <div class="pp-create-game-form-wrapper">
            <v-form v-model="formValid" ref="form" @submit.prevent>
                <div class="pp-create-game-form-container">
                    <v-text-field label="Название задачи" v-model="taskName" hide-details="auto" density="compact"
                        :rules="rules.required"></v-text-field>

                    <pp-sub-tasks-editor v-model:subTasks="subTasks" :canRemoveLast="true"></pp-sub-tasks-editor>

                    <v-btn size="small" color="primary" @click="createGame">Создать игру</v-btn>
                </div>
            </v-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            taskName: '',
            subTasks: [],
            formValid: false,
            rules: {
                required: [value => !!value || "Обязательно для заполнения"]
            },
        };
    },

    methods: {
        async createGame() {
            if (!this.$refs.form.validate()) {
                return;
            }

            await axios.post(this.API_CREATE_GAME_URL, {
                taskName: this.taskName,
                subTasks: this.subTasks.map(task => task.text.trim()).filter(text => !!text)
            }).then((response) => {
                if (response.data.isSuccess) {
                    this.$router.push({ name: 'Game', params: { id: response.data.entity } });
                }
            }, (error) => {
                console.log(error);
            });
        }
    }
}
</script>

<style scoped>
.pp-create-game-container {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    z-index: 20000;
    width: 500px;
    top: 50px;
    left: calc(50% - 250px);
}

.pp-create-game-form-wrapper {
    width: fit-content;
    border: 1px dotted lightgray;
    border-radius: 20px;
    padding: 40px;
    background-color: whitesmoke;
}

.pp-create-game-form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 600px;
}
</style>