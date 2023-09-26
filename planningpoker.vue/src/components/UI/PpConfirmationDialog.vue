<template>
    <v-row justify="center">
        <v-dialog v-model="_show" width="auto">
            <v-card>
                <v-card-title class="text-h5">{{ title ?? 'Подтверждение' }}</v-card-title>
                <v-card-text>{{ text }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green-darken-1" variant="text" @click="confirm">Подтвердить</v-btn>
                    <v-btn color="green-darken-1" variant="text" @click="_show = false">Отмена</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { VRow, VBtn, VCard, VCardTitle, VCardText, VSpacer, VCardActions, VDialog } from 'vuetify/lib/components/index.mjs';

export default {
    name: 'ppConfirmationDialog',

    props: {
        title: String,
        text: String,
        show: {
            type: Boolean,
            default: false
        },
        confirmAction: Function
    },

    methods: {
        confirm() {
            this.$emit('update:show', false);
            this.confirmAction();
        }
    },

    computed: {
        _show: {
            get() {
                return this.show;
            },
            set() {
                this.$emit('update:show', false);
            }
        }
    }
};
</script>

<style scoped></style>