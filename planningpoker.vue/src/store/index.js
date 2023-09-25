import { createStore } from "vuex";
import mainStore from "./modules/mainStore";
import gameStore from "./modules/gameStore";

const store = createStore({
    modules: {
        mainStore: mainStore,
        gameStore: gameStore
    }
});

export default store;