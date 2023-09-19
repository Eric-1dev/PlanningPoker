<template>
    <div class="pp-card" :class="this.classes" @click="this.cardClick">
        {{ this.text }}
    </div>
</template>

<script>

export default {
    name: 'ppCard',

    props: {
        text: String,
        score: Number,
        color: String,
        isSelectable: Boolean,
        isSelected: Boolean
    },

    computed: {
        classes() {
            let classes = [];

            classes.push(this.mapColorToClass(this.color));

            if (this.isSelectable) {
                classes.push('pp-card-clickable');
            }

            if (this.isSelected) {
                classes.push('pp-card-selected');
            }

            return classes.join(' ');
        }
    },

    methods: {
        mapColorToClass() {
            switch (this.color) {
                case 'Green':
                    return 'pp-card-color-green';
                case 'Yellow':
                    return 'pp-card-color-yellow';
                case 'Red':
                    return 'pp-card-color-red';
                case 'Gray':
                    return 'pp-card-color-gray';
                case 'Blue':
                    return 'pp-card-color-blue';
                default:
                    return '';
            }
        },

        cardClick() {
            this.$emit('selectCard', this.score);
        }
    }
}
</script>

<style scoped>
.pp-card {
    display: flex;
    width: 120px;
    height: 150px;
    border: 1px solid lightgray;
    border-radius: 7px;
    font-size: 60px;
    align-items: center;
    justify-content: center;
    user-select: none;
}

.pp-card-color-green {
    background-color: forestgreen;
    color: white;
}

.pp-card-color-yellow {
    background-color: #a8ae26;
    color: white;
}

.pp-card-color-red {
    background-color: #c35b5b;
    color: white;
}

.pp-card-color-gray {
    background-color: gray;
    color: white;
}

.pp-gamer-card-zone {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    display: flex;
    gap: 20px;
    padding: 10px;
}

.pp-card-clickable {
    cursor: pointer;
    transform: translateY(0) rotate(0);
    transition-duration: 300ms;
}

.pp-card-selected {
    transform: translateY(-80px) rotate(-5deg);
    transition-duration: 500ms;
}
</style>