import CreateGame from "@/pages/CreateGame";
import GameProcess from "@/pages/GameProcess";
import Login from "@/pages/Login";

import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        component: CreateGame
    },
    {
        path: "/Game/:id",
        component: GameProcess
    },
    {
        name: "Login",
        path: "/Login",
        component: Login
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: routes
});

router.beforeEach(
    (to, from, next) => {
        if (to.name === 'Login') {
            next({
                query: {redirectUrl: from.path}
            });
            return;
        }

        next();
    }
);

export default router;