import { createStore } from "vuex";
import mainStore from "./modules/mainStore";
import gameStore from "./modules/gameStore";

export default createStore({
    modules: {
        mainStore: mainStore,
        gameStore: gameStore
    }
});