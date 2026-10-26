import { describe, expect, it } from 'vitest'
import { positionCoords } from './court'
import { legalize, overlapViolations } from './overlap'

describe('overlapViolations', () => {
  it('accepts the default formation', () => {
    expect(overlapViolations(positionCoords)).toEqual([])
  })

  it('flags zone 4 standing right of zone 3', () => {
    const at = { ...positionCoords, 4: { x: 200, y: 100 } }
    expect(overlapViolations(at)).toEqual([{ a: 4, b: 3, kind: 'left-of' }])
  })

  it('ignores the exempt zone (the server)', () => {
    const at = { ...positionCoords, 1: { x: 0, y: 0 } }
    expect(overlapViolations(at, 1)).toEqual([])
  })
})

describe('legalize', () => {
  // Front row fully reversed: zone 4 wants the right, zone 2 wants the left.
  const reversed = () => ({ ...positionCoords, 4: { x: 270, y: 100 }, 2: { x: 90, y: 100 } })

  it('turns an illegal layout into a legal one', () => {
    expect(overlapViolations(legalize(reversed()))).toEqual([])
  })

  it('does not modify the layout it is given', () => {
    const input = reversed()
    const before = structuredClone(input)
    legalize(input)
    expect(input).toEqual(before)
  })
})