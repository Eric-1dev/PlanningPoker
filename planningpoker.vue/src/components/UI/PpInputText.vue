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
    border: 0;
    outline: 0;
    color: rgb(60, 66, 87);
    background-color: rgb(255, 255, 255);
    box-shadow: rgb(60 66 87 / 16%) 0px 0px 0px 1px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    padding: 4px 8px;
    min-height: 32px;
    vertical-align: middle;
    transition: background-color .24s, box-shadow .24s;
    transition-property: background-color, box-shadow;
    transition-duration: 0.24s, 0.24s;
    transition-timing-function: ease, ease;
    transition-delay: 0s, 0s;
}

.text-input:focus {
    box-shadow: rgb(58 151 212 / 36%) 0px 0px 0px 4px;

}
</style>