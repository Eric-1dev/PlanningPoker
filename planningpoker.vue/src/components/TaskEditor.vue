<template>
    <div v-if="editMode">
        <pp-input-text :value="taskText"></pp-input-text>
    </div>
    <div v-else>
        <span :class="isSelected ? 'pp-tesk-selected' : ''">{{ taskText }}</span>
    </div>
</template>

<script>
    export default {
        props: {
            editMode: Boolean,
            taskText: String,
            isSelected: Boolean
        }
    }
</script>

<style scoped>
.pp-tesk-selected {
    font-weight: bold;
}
</style>