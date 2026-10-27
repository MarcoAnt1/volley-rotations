import { describe, expect, it } from 'vitest'
import { topRole, totalScores } from '@/domain/quiz'
import { ROLE_GROUPS } from '@/domain/roles'
import { questions } from './quiz'

describe('quiz', () => {
  it('gives every question at least two answers', () => {
    for (const q of questions) expect(q.answers.length).toBeGreaterThanOrEqual(2)
  })

  // A role nobody can get would make the quiz unfair. For each role,
  // pick the answer that favors it most in every question: it must win.
  it.each(ROLE_GROUPS)('can make %s win', (role) => {
    const picks = questions.map((q) => {
      let best = q.answers[0]!
      for (const a of q.answers) {
        if ((a.points[role] ?? 0) > (best.points[role] ?? 0)) best = a
      }
      return best.points
    })
    expect(topRole(totalScores(picks))).toBe(role)
  })
})