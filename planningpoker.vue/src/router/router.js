import CreateGame from "@/pages/CreateGame";
import GameProcess from "@/pages/GameProcess";
import Login from "@/pages/Login";

import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        name: "CreateGame",
        path: "/",
        component: CreateGame
    },
    {
        name: "Game",
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

export default router;