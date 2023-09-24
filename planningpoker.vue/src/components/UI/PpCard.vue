<template>
    <div class="pp-card" :class="this.classes" @click="this.cardClick">
        {{ this.cardText }}
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
        isSelected: Boolean,
        state: String
    },

    computed: {
        classes() {
            let classes = [];

            if (this.state === 'openned' || this.state === 'voted') {
                classes.push(this.mapColorToClass('Blue'))
            } else if (this.state === 'unvoted') {
                classes.push(this.mapColorToClass('White'))
            } else{
                classes.push(this.mapColorToClass(this.color));
            }

            if (this.isSelectable) {
                classes.push('pp-card-clickable');

                if (this.isSelected) {
                    classes.push('pp-card-selected');
                }
            }

            return classes.join(' ');
        },

        cardText() {
            if (this.state === 'default' || this.state === 'openned') {
                return this.text;
            }

            return '';
        }
    },

    methods: {
        mapColorToClass(color) {
            switch (color) {
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
                case 'White':
                    return 'pp-card-color-white';
                default:
                    return '';
            }
        },

        cardClick() {
            if (!this.isSelectable) {
                return;
            }

            if (this.isSelected) {
                this.$emit('selectCard', null);
            } else {
                this.$emit('selectCard', this.score);
            }
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

.pp-card-color-blue {
    background-color: cadetblue;
    color: white;
}

.pp-card-color-white {
    background-color: white;
    color: black;
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