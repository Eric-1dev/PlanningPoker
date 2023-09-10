let vueUserList = new Vue({
    el: "#vue_user-list-element",
    data: {
        users: [],
        showList: false
    },
    computed: {
        sortedUserList: function () {
            const sortedUserList = this.users.slice();

            return sortedUserList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        }
    }
})
