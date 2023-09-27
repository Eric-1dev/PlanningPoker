import { createApp } from 'vue';
import App from '@/App';
import router from '@/router/router';
import store from '@/store';
import uiComponents from '@/components/UI';
import vuetify from '@/vuetify';
import '@mdi/font/css/materialdesignicons.min.css';

const app = createApp(App);

app.config.globalProperties.APPLICATION_BASE_URL = process.env.VUE_APP_BASE_URL;

app.config.globalProperties.HUB_CONNECT_URL = app.config.globalProperties.APPLICATION_BASE_URL + process.env.VUE_APP_HUB_CONNECT_URL;
app.config.globalProperties.API_BASE_URL = app.config.globalProperties.APPLICATION_BASE_URL + process.env.VUE_APP_API_BASE_URL;
app.config.globalProperties.API_CREATE_GAME_URL = app.config.globalProperties.API_BASE_URL + process.env.VUE_APP_API_CREATE_GAME_URL;

uiComponents.forEach(component => {
    app.component(component.name, component);
});

app.use(router);
app.use(store);
app.use(vuetify);

app.mount('#app');