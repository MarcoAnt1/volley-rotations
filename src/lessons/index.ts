import type { RouteComponent } from 'vue-router'

export interface Lesson {
  slug: string // URL part: /lessons/<slug>
  title: string
  summary: string
  component: () => Promise<RouteComponent>
}

export const lessons: Lesson[] = [
  {
    slug: 'roles',
    title: 'Positions & roles',
    summary: 'Meet the five roles and see where each one plays.',
    component: () => import('./roles/RolesLesson.vue'),
  },
  {
    slug: 'which-role',
    title: 'Which role are you?',
    summary: 'Six quick questions to find your spot on the court.',
    component: () => import('./quiz/QuizLesson.vue'),
  },
  {
    slug: 'rotations',
    title: 'Rotations',
    summary: 'Step through the six rotations and see where everyone stands.',
    component: () => import('./rotations/RotationsLesson.vue'),
  },
]
