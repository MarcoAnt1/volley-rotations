// libero.test.ts
import { describe, expect, it } from 'vitest'
import { isFrontRow } from './court'
import { backRowMiddle, liberoReplaces } from './libero'
import { ROTATIONS, SERVER_ZONE, positionOf } from './rotation'
import { SYSTEM_NAMES, systems } from './systems'

describe('liberoReplaces', () => {
  for (const name of SYSTEM_NAMES) {
    it(`${name}: in reception, always replaces a back-row middle`, () => {
      const system = systems[name]
      for (const r of ROTATIONS) {
        const replaced = liberoReplaces(system, r, 'receive')
        expect(replaced).not.toBeNull()
        expect(system.roles[replaced!]).toMatch(/^MB/)
        expect(isFrontRow(positionOf(replaced!, r))).toBe(false)
      }
    })
  }

  it('sits on the bench exactly when the middle is serving', () => {
    const system = systems['5-1']
    for (const r of ROTATIONS) {
      const middleServes = positionOf(backRowMiddle(system, r), r) === SERVER_ZONE
      expect(liberoReplaces(system, r, 'serve') === null).toBe(middleServes)
    }
  })
})
