import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import { ticketRoutes } from './ticketroutes'
import { clientRoutes } from './clientroutes'
import { techRoutes } from './techroutes'

const router = createRouter({
	history: createWebHistory('/agenda'),
	routes: [
		{
			path: '/',
			component: Login,
		},
		{
			path: '/home',
			component: Home,
		},

		...ticketRoutes,
		...clientRoutes,
		...techRoutes,
	],
})

export default router
