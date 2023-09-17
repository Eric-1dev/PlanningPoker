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
    padding: 5px;
}
</style>