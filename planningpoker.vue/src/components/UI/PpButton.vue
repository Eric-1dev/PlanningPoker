<template>
    <button
        class="btn"
    >
        <slot></slot>
    </button>
</template>

<script>
    export default {
       name: 'ppButton' 
    }
</script>

<style scoped>
.btn {
    padding: 5px;
    margin: 5px;;
}
</style>