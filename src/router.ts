import { createRouter, createWebHashHistory } from 'vue-router'
import { lessons } from '@/lessons'
import HomePage from '@/pages/HomePage.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomePage },
    ...lessons.map((lesson) => ({
      path: `/lessons/${lesson.slug}`,
      component: lesson.component,
    })),
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
