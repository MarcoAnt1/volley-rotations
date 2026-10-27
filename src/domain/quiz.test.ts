import { describe, expect, it } from 'vitest'
import { topRole, totalScores } from './quiz'

describe('totalScores', () => {
  it('adds up the points of every pick', () => {
    expect(totalScores([{ setter: 2 }, { setter: 1, libero: 2 }])).toEqual({
      setter: 3,
      outside: 0,
      middle: 0,
      opposite: 0,
      libero: 2,
    })
  })
})

describe('topRole', () => {
  it('picks the highest score', () => {
    expect(topRole({ setter: 1, outside: 0, middle: 4, opposite: 2, libero: 3 })).toBe('middle')
  })

  it('breaks ties by the order of ROLE_GROUPS', () => {
    expect(topRole({ setter: 0, outside: 3, middle: 0, opposite: 3, libero: 0 })).toBe('outside')
  })
})
