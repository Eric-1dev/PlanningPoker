<template>
    <button class="btn" v-bind:class="colorClass">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'ppButton',

    props: {
        color: [String]
    },

    computed: {
        colorClass() {
            switch (this.color) {
                case 'blue':
                    return 'btn-blue'
                default:
                    return '';
            }
        }
    }
}
</script>

<style scoped>
.btn {
    padding: 6px 12px;
    margin: 5px;
    border: 1px solid gray;
    border-radius: 5px;
}

.btn-blue {
    background-color: rgb(0, 119, 255);
    color: white;
}
</style>