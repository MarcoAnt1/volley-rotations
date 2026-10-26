// formations.test.ts
import { describe, expect, it } from 'vitest'
import { formation, type Phase } from './formations'
import { overlapViolations } from './overlap'
import { ROTATIONS, SERVER_ZONE } from './rotation'
import { SYSTEM_NAMES, systems } from './systems'

const PHASES: Phase[] = ['base', 'serve', 'receive']

describe('every formation obeys the overlap rule', () => {
  for (const name of SYSTEM_NAMES) {
    for (const phase of PHASES) {
      for (const r of ROTATIONS) {
        it(`${name} · ${phase} · rotation ${r + 1}`, () => {
          const exempt = phase === 'serve' ? SERVER_ZONE : undefined
          expect(overlapViolations(formation(phase, systems[name], r), exempt)).toEqual([])
        })
      }
    }
  }
})