import { describe, expect, it } from 'vitest'
import { lessons } from './index'

describe('lessons', () => {
  it('has unique slugs', () => {
    const slugs = lessons.map((l) => l.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('uses URL-friendly slugs', () => {
    for (const { slug } of lessons) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })
})