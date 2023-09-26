<template>
    <div class="pp-alerts-container">
        <transition-group name="list">
            <div v-for="alert in alerts" :key="alert.uniqueId" class="pp-alert">
                <v-alert
                    border="start"
                    border-color="error"
                    elevation="2"
                    closable
                >{{ alert.message }}</v-alert>
            </div>
        </transition-group>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            alerts: state => state.mainStore.alerts
        })
    }
};
</script>

<style scoped>
.pp-alerts-container {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 400px;
}

.pp-alert {
    margin-bottom: 30px;
    margin-right: 30px;
}
</style>