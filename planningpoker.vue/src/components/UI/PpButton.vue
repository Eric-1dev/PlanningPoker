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
                case 'green':
                    return 'btn-green'
                default:
                    return '';
            }
        }
    }
}
</script>

<style scoped>
.btn {
    margin: 5px;
    outline: 0;
    border: 0;
    cursor: pointer;
    will-change: box-shadow, transform;
    background: radial-gradient(100% 100% at 100% 0%, #2dd2ff 0%, #5468FF 100%);
    box-shadow: 0px 2px 4px rgb(45 35 66 / 40%), 0px 7px 13px -3px rgb(45 35 66 / 30%), inset 0px -3px 0px rgb(58 65 111 / 50%);
    padding: 0 20px;
    border-radius: 6px;
    color: #fff;
    height: 32px;
    font-size: 16px;
    text-shadow: 0 1px 0 rgb(0 0 0 / 40%);
    transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.btn:hover {
    box-shadow: 0px 4px 8px rgb(45 35 66 / 40%), 0px 7px 13px -3px rgb(45 35 66 / 30%), inset 0px -3px 0px #3c4fe0;
    transform: translateY(-2px);
}

.btn:active {
    box-shadow: inset 0px 3px 7px #3c4fe0;
    transform: translateY(2px);
}

.btn-green {
    background: radial-gradient(100% 100% at 100% 0%, #3cf38f 0%, #006115 100%);
    color: white;
}

.btn-green:hover {
    box-shadow: 0px 4px 8px rgb(45 35 66 / 40%), 0px 7px 13px -3px rgb(45 35 66 / 30%), inset 0px -3px 0px #158624;
    transform: translateY(-2px);
}

.btn-green:active {
    box-shadow: inset 0px 3px 7px #158624;
    transform: translateY(2px);
}

</style>