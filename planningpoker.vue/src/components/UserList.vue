<template>
    <div>
        <v-btn v-on:click="showList = !showList" color="success" size="small">Список пользователей</v-btn>
        <div class="user-list_wrapper" v-if="showList">
            <div class="pp-d-table">
                <div class="pp-d-table-row" v-for="user in sortedUserList">
                    <div class="pp-d-table-cell pp-w-100">{{ user.name }}</div>
                    <div class="pp-d-table-cell">
                        <div v-if="!user.isPlayer"><span class="mdi mdi-eye-outline"></span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            showList: false
        };
    },

    computed: {
        ...mapState({
            myInfo: state => state.gameStore.gameInfo.myInfo,
            otherUsers: state => state.gameStore.gameInfo.otherUsers
        }),

        sortedUserList() {
            const sortedList = this.otherUsers.slice();
            sortedList.push(this.myInfo);
            return sortedList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        }
    }
}
</script>

<style scoped>
.user-list_wrapper {
    position: absolute;
    background-color: whitesmoke;
    padding: 10px;
    border-radius: 10px;
    z-index: 1000;
    width: 300px;
    user-select: none;
}

.pp-d-table {
    display: table;
}

.pp-d-table-row {
    display: table-row;
}

.pp-d-table-cell {
    display: table-cell;
}

.pp-w-100 {
    width: 100%;
}
</style>