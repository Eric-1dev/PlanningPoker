<template>
    <div class="app">

        <header>
            <div class="pp-username-area">
                <!-- @{
                var userName = User.Identity.Name;

                if (userName != null)
                {
                    <div>@userName</div>
                    <a asp-action="Logout" asp-controller="Authorization" asp-route-redirectUrl="@HttpContextAccessor.HttpContext.Request.Path" id="planning-poker-logout-button" class="btn btn-sm btn-secondary shadow-none">Выход</a>
                }
                } -->
                <div v-if="$store.state.userName">
                    <span>{{ $store.state.userName }}</span>
                    <pp-button
                        class="pp-exit-button" 
                        v-if="$store.state.userName"
                        @click="logOut"
                     >
                        Выход
                    </pp-button>
                </div>
                <div v-else>
                    <span>Гость</span>
                </div>
            </div>
        </header>

        <div class="pp-body-wrapper pp-backgroud-cell">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    beforeMount() {
        //this.$store.commit('setUserId', '123');
        this.$store.commit('setUserName', 'fg');
    },

    methods: {
        logOut() {
            this.$store.commit('setUserName', null);
        }
    }
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 14px;
    position: relative;
    min-height: 100%;
}

@media (min-width: 768px) {
    html {
        font-size: 16px;
    }
}

body {
    margin-top: 40px;
    margin-bottom: 200px;
}

header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    padding: 5px 20px;
}

.pp-username-area {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: flex-end;
    align-items: center;
}

.pp-body-wrapper {
    position: absolute;
    top: 40px;
    right: 0;
    left: 0;
    bottom: 0;
}

.pp-backgroud-cell {
    background: linear-gradient( #ccc, transparent 1px), linear-gradient( 90deg, #ccc, transparent 1px);
    background-size: 15px 15px;
    background-position: center center;
}

.pp-exit-button {
    margin-left: 10px;
}
</style>