import { describe, expect, it } from 'vitest'
import { createPluralRule } from './plural'

describe('plural rules', () => {
  it('English: 1 is singular, 0 and 2 are plural', () => {
    const rule = createPluralRule('en')
    expect([0, 1, 2, 5].map((n) => rule(n, 2))).toEqual([1, 0, 1, 1])
  })

  it('French: 0 and 1 are singular', () => {
    const rule = createPluralRule('fr')
    expect([0, 1, 2].map((n) => rule(n, 2))).toEqual([0, 0, 1])
  })

  it('Serbian: one / few / other', () => {
    const rule = createPluralRule('sr')
    // 1 поен, 2 поена, 5 поена, 11 поена, 21 поен, 22 поена
    expect([1, 2, 5, 11, 21, 22].map((n) => rule(n, 3))).toEqual([0, 1, 2, 2, 0, 1])
  })
})
