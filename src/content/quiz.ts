// The "Which role are you?" quiz: questions, answers and results.
// Each answer gives points to one or more roles; the most points wins.
import type { Points } from '@/domain/quiz'
import type { RoleGroup } from '@/domain/roles'

export interface QuizAnswer {
  text: string
  points: Points
}

export interface QuizQuestion {
  text: string
  answers: QuizAnswer[]
}

export const questions: QuizQuestion[] = [
  {
    text: 'The rally is on. Where do you want the ball?',
    answers: [
      { text: 'In my hands. I decide who scores.', points: { setter: 2 } },
      { text: 'High and outside, so I can swing hard.', points: { outside: 2, opposite: 1 } },
      { text: 'Fast and low in the middle, before the block is ready.', points: { middle: 2 } },
      { text: 'Anywhere. I’ll get it up.', points: { libero: 2 } },
    ],
  },
  {
    text: 'Your favorite highlight is…',
    answers: [
      { text: 'A no-look set that fools the whole block.', points: { setter: 2 } },
      { text: 'A monster block, straight down.', points: { middle: 2 } },
      { text: 'A kill that bounces into the stands.', points: { opposite: 2 } },
      { text: 'A full-stretch dig that keeps the rally alive.', points: { libero: 2, outside: 1 } },
    ],
  },
  {
    text: 'Honestly, how tall are you?',
    answers: [
      { text: 'Tallest in the group.', points: { middle: 2, opposite: 1 } },
      { text: 'Tall enough to hit over most blocks.', points: { outside: 2, opposite: 1 } },
      { text: 'Average, but with quick hands.', points: { setter: 2 } },
      { text: 'Built low to the ground. Perfect for digging.', points: { libero: 2 } },
    ],
  },
  {
    text: 'Diving on the floor is…',
    answers: [
      { text: 'My favorite part of the game.', points: { libero: 2 } },
      { text: 'Part of the job. I pass and I defend.', points: { outside: 2 } },
      { text: 'Fine, if it saves a set.', points: { setter: 1 } },
      { text: 'Why would I? I live at the net.', points: { middle: 2, opposite: 1 } },
    ],
  },
  {
    text: 'Your team is losing. What do you do?',
    answers: [
      { text: 'Stay calm and change the plan.', points: { setter: 2 } },
      { text: 'Ask for the ball. Give it to me.', points: { opposite: 2 } },
      { text: 'Block everything that comes over.', points: { middle: 2 } },
      { text: 'Pass better and lift everyone’s mood.', points: { outside: 2, libero: 1 } },
    ],
  },
  {
    text: 'Pick your superpower.',
    answers: [
      { text: 'Reading the game before it happens.', points: { setter: 2, libero: 1 } },
      { text: 'Being good at a bit of everything.', points: { outside: 2 } },
      { text: 'A huge jump.', points: { middle: 2 } },
      { text: 'Raw power.', points: { opposite: 2 } },
    ],
  },
]

export interface QuizResult {
  title: string
  text: string
}

export const results: Record<RoleGroup, QuizResult> = {
  setter: {
    title: 'The Brain',
    text: 'You see the whole court and make everyone around you better. You’re a setter.',
  },
  outside: {
    title: 'The All-rounder',
    text: 'Pass, attack, defend: you do it all, and the team leans on you. You’re an outside hitter.',
  },
  middle: {
    title: 'The Wall',
    text: 'Nothing gets past you at the net, and your quick attacks come out of nowhere. You’re a middle blocker.',
  },
  opposite: {
    title: 'The Cannon',
    text: 'When the team needs a point, the ball goes to you. You’re an opposite.',
  },
  libero: {
    title: 'The Shield',
    text: 'No ball hits the floor while you’re around. You’re a libero.',
  },
}