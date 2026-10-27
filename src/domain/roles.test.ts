import { describe, expect, it } from 'vitest'
import { playersIn } from './roles'
import { systems } from './systems'

describe('playersIn', () => {
  const fiveOne = systems['5-1']

  it('finds one setter, two outsides, two middles and one opposite in a 5-1', () => {
    expect(playersIn('setter', fiveOne)).toEqual([1])
    expect(playersIn('outside', fiveOne)).toEqual([2, 5])
    expect(playersIn('middle', fiveOne)).toEqual([3, 6])
    expect(playersIn('opposite', fiveOne)).toEqual([4])
  })

  it('always has the libero as their own group', () => {
    expect(playersIn('libero', fiveOne)).toEqual(['L'])
  })

  it('finds two setters and no opposite in a 6-2', () => {
    expect(playersIn('setter', systems['6-2'])).toEqual([1, 4])
    expect(playersIn('opposite', systems['6-2'])).toEqual([])
  })
})
