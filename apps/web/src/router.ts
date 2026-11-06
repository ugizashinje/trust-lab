import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from './views/HomeView.vue'

/** Chapter order drives the header progress and the back/next buttons. */
export const CHAPTERS = [
  'home',
  'rules',
  'play',
  'tournament',
  'evolution',
  'mistakes',
  'sandbox',
  'end',
] as const

export type ChapterId = (typeof CHAPTERS)[number]

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/rules', name: 'rules', component: () => import('./views/RulesView.vue') },
  { path: '/play', name: 'play', component: () => import('./views/PlayView.vue') },
  { path: '/tournament', name: 'tournament', component: () => import('./views/TournamentView.vue') },
  { path: '/evolution', name: 'evolution', component: () => import('./views/EvolutionView.vue') },
  { path: '/mistakes', name: 'mistakes', component: () => import('./views/MistakesView.vue') },
  { path: '/sandbox', name: 'sandbox', component: () => import('./views/SandboxView.vue') },
  { path: '/end', name: 'end', component: () => import('./views/EndView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
