import { createApp } from 'vue'
import App from '@/App'
import router from '@/router/router';
import store from '@/store';
import components from '@/components/UI';

const app = createApp(App);

app.config.globalProperties.APPLICATION_BASE_URL = "https://localhost:44353";

app.config.globalProperties.HUB_CONNECT_URL = app.config.globalProperties.APPLICATION_BASE_URL + "/GameConnect";
app.config.globalProperties.API_BASE_URL = app.config.globalProperties.APPLICATION_BASE_URL + "/api";
app.config.globalProperties.API_AUTHORIZATION_URL = app.config.globalProperties.API_BASE_URL + "/ApiLogin/Authorization";

components.forEach(component => {
    app.component(component.name, component);
});

app.use(router)
app.use(store)

app.mount('#app')