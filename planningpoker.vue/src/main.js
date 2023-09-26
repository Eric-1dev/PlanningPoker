import { createApp } from 'vue';
import App from '@/App';
import router from '@/router/router';
import store from '@/store';
import uiComponents from '@/components/UI';
import vuetify from '@/vuetify';
import '@mdi/font/css/materialdesignicons.min.css';

const app = createApp(App);

app.config.globalProperties.APPLICATION_BASE_URL = "https://localhost:44353";

app.config.globalProperties.HUB_CONNECT_URL = app.config.globalProperties.APPLICATION_BASE_URL + "/GameConnect";
app.config.globalProperties.API_BASE_URL = app.config.globalProperties.APPLICATION_BASE_URL + "/api";
app.config.globalProperties.API_CREATE_GAME_URL = app.config.globalProperties.API_BASE_URL + "/Game/Create";

uiComponents.forEach(component => {
    app.component(component.name, component);
});

app.use(router);
app.use(store);
app.use(vuetify);

app.mount('#app');