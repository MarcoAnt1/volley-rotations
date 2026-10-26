// The words of the Rotations lesson. Rules live in src/domain;
// this file only turns them into sentences. To translate the app,
// you'd add another file shaped like this one.
import { isFrontRow } from '@/domain/court'
import type { Phase } from '@/domain/formations'
import { backRowMiddle, liberoReplaces } from '@/domain/libero'
import type { Violation } from '@/domain/overlap'
import { positionOf } from '@/domain/rotation'
import { activeSetter, type SystemName, type VolleySystem } from '@/domain/systems'

export const systemBlurbs: Record<SystemName, string> = {
  '4-2': 'Two setters; the front-row one sets from near the net.',
  '5-1': 'One setter who sets in all six rotations.',
  '6-2': 'Two setters; the back-row one sets, so all three front-row players can attack.',
}

export const phaseLabels: Record<Phase, string> = {
  base: 'Default',
  serve: 'Serving',
  receive: 'Reception',
}

export const phaseTips: Record<Phase, string> = {
  base: 'The rotational order: who stands in which zone. Every other situation starts from here.',
  serve:
    'We serve. The player in zone 1 serves from behind the end line; the front row waits at the net to block. The overlap rule applies to everyone except the server.',
  receive:
    'They serve. The two outside hitters and the libero (or the back-row middle, without one) form the passing line. The setter, the opposite and the front-row middle stay out of the way so the setter can reach the target. Every layout is legal under the overlap rule.',
}

export function setterTip(system: VolleySystem, rotation: number): string {
  const setter = activeSetter(system, rotation)
  const zone = positionOf(setter, rotation)
  const front = isFrontRow(zone)
  const where = front ? 'sets from near the net' : 'penetrates from the back row to the net to set'
  return `${systemBlurbs[system.name]} This rotation the setter (${system.roles[setter]}) is in zone ${zone} (${front ? 'front' : 'back'} row) — ${where}.`
}

export function liberoTip(system: VolleySystem, rotation: number, phase: Phase): string {
  const name = system.roles[backRowMiddle(system, rotation)]
  if (liberoReplaces(system, rotation, phase) === null) {
    return `${name} is serving from zone 1. The libero can't serve, so they wait on the bench and come back in for ${name} once the rally is over.`
  }
  return `The libero (L) is in for ${name}, the back-row middle. When ${name} rotates to the front row, they swap back.`
}

export function violationText(v: Violation): string {
  return v.kind === 'front-behind'
    ? `${v.a} must stay in front of ${v.b}`
    : `${v.a} must stay left of ${v.b}`
}
