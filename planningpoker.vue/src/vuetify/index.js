import 'vuetify/styles';
import { createVuetify } from "vuetify/lib/framework.mjs";
import * as components from 'vuetify/lib/components/index.mjs';
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
    },
});

export default vuetify;