<template>
    <div class="pp-login-container">
        <div class="pp-login-form-wrapper">
            <form @submit.prevent="login">
                <div>Представьтесь, пожалуйста</div>
                <pp-input-text v-model="userName" placeholder="Имя пользователя" />
                <pp-button type="submit">Войти</pp-button>
            </form>
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
            this.$store.commit('setUserName', this.userName);
            this.$router.push(this.$route.query.redirectUrl);
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
</style>