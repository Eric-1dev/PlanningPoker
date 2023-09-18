<template>
    <input class="text-input" :value="modelValue" @input="updateInput" type="text" />
</template>

<script>
export default {
    name: 'ppInputText',

    props: {
        modelValue: [String, Number]
    },

    methods: {
        updateInput(event) {
            this.$emit('update:modelValue', event.target.value);
        }
    }
}
</script>

<style scoped>
.text-input {
    height: max-content;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid gray;
}

.text-input:focus {
    outline: none;
    border-color: blue;
}
</style>