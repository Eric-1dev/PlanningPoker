<template>
    <div class="pp-login-container">
        <div class="pp-login-form-wrapper">
            <v-form @submit.prevent="login">
                <div class="pp-login-header">Представьтесь, пожалуйста</div>
                <v-text-field v-model="userName" :clearable="true" placeholder="Имя пользователя" />
                <v-btn color="success" size="small" type="submit">Войти</v-btn>
            </v-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userName: ''
        }
    },

    methods: {
        login() {
            if (!this.userName) {
                return;
            }

            this.$store.commit('mainStore/setUserName', this.userName);

            const redirectPath = this.$route.query.redirectUrl ?? '/';

            this.$router.push(redirectPath);
        }
    }
}

</script>

<style scoped>
.pp-login-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pp-login-form-wrapper {
    padding: 30px 50px;
    border-radius: 20px;
    border: 1px solid;
    border-color: lightgray;
    text-align: center;
    background-color: whitesmoke;
}

.pp-login-header {
    margin: 20px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 20px;
}
</style>