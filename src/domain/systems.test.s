import { describe, expect, it } from 'vitest'
import { isFrontRow } from './court'
import { ROTATIONS, positionOf } from './rotation'
import { activeSetter, systems } from './systems'

describe('activeSetter', () => {
  it('6-2: the setting setter is always in the back row', () => {
    for (const r of ROTATIONS) {
      expect(isFrontRow(positionOf(activeSetter(systems['6-2'], r), r))).toBe(false)
    }
  })

  it('4-2: the setting setter is always in the front row', () => {
    for (const r of ROTATIONS) {
      expect(isFrontRow(positionOf(activeSetter(systems['4-2'], r), r))).toBe(true)
    }
  })
})