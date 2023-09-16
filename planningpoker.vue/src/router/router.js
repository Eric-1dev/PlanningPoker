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
        path: "/Login",
        component: Login
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: routes
});

export default router;