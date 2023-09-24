import 'vuetify/styles';
import { createVuetify } from "vuetify/lib/framework.mjs";
import { VBtn, VTextField, VForm, VSelect } from 'vuetify/lib/components/index.mjs';
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components: {
        VBtn,
        VTextField,
        VForm,
        VSelect
    },
    directives,
    theme: {
        defaultTheme: 'light',
    },
});

export default vuetify;