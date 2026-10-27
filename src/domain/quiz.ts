import { ROLE_GROUPS, type RoleGroup } from "./roles"

export type Points = Partial<Record<RoleGroup, number>>

export type Scores = Record<RoleGroup, number>

// Adds up the points of every picked answer.
export function totalScores(picks: Points[]): Scores {
    const scores: Scores = { setter: 0, outside: 0, middle: 0, opposite: 0, libero: 0 }
    for (const pick of picks) {
        for (const role of ROLE_GROUPS) {
            scores[role] += pick[role] ?? 0;
        }
    }
    return scores;
}

// The role with the most points. A tie goes to the role listed first in ROLE_GROUPS.
export function topRole(scores: Scores): RoleGroup {
    let best = ROLE_GROUPS[0]!
    for (const role of ROLE_GROUPS) {
        if (scores[role] > scores[best]) {
            best = role
        }
    }
    return best
}