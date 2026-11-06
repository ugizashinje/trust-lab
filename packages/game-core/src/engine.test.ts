import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PAYOFFS,
  InteractiveMatch,
  countPopulation,
  createPopulation,
  createRng,
  isDilemma,
  playMatch,
  runGeneration,
} from './index'

describe('payoffs', () => {
  it('defaults form a dilemma', () => {
    expect(isDilemma(DEFAULT_PAYOFFS)).toBe(true)
  })
})

describe('strategies', () => {
  it('tit for tat mirrors the previous move', () => {
    const r = playMatch('titForTat', 'alwaysDefect', { rounds: 4 })
    expect(r.movesA.join('')).toBe('CDDD')
    expect(r.scoreA).toBe(0 + 1 + 1 + 1)
    expect(r.scoreB).toBe(5 + 1 + 1 + 1)
  })

  it('two reciprocators earn the reward every round', () => {
    const r = playMatch('titForTat', 'grimTrigger', { rounds: 10 })
    expect(r.scoreA).toBe(30)
    expect(r.scoreB).toBe(30)
  })

  it('prober exploits unconditional cooperators', () => {
    const r = playMatch('prober', 'alwaysCooperate', { rounds: 5 })
    expect(r.movesA.join('')).toBe('DCCDD')
  })

  it('prober backs off against retaliators', () => {
    const r = playMatch('prober', 'titForTat', { rounds: 5 })
    expect(r.movesA.join('')).toBe('DCCCC')
    expect(r.movesB.join('')).toBe('CDCCC')
  })

  it('pavlov is win-stay, lose-shift', () => {
    const r = playMatch('pavlov', 'alwaysDefect', { rounds: 4 })
    expect(r.movesA.join('')).toBe('CDCD')
  })

  it('noise of 1 flips every move', () => {
    const r = playMatch('alwaysCooperate', 'alwaysCooperate', { rounds: 50, noise: 1 })
    expect(r.movesA.every((m) => m === 'D')).toBe(true)
  })
})

describe('interactive match', () => {
  it('bot reacts to the human and scores accumulate', () => {
    const m = new InteractiveMatch('titForTat')
    m.play('D') // bot opens with C
    const r = m.play('C') // bot copies the earlier D
    expect(r.bot).toBe('D')
    expect(m.humanScore).toBe(5 + 0)
    expect(m.botScore).toBe(0 + 5)
  })
})

describe('evolution', () => {
  it('keeps population size constant', () => {
    const pop = createPopulation({ titForTat: 5, alwaysDefect: 5, alwaysCooperate: 15 })
    const { next } = runGeneration(pop, { rounds: 10, replace: 5, rng: createRng(1) })
    expect(next).toHaveLength(25)
  })

  it('reciprocators drive out defectors when games are long enough', () => {
    let pop = createPopulation({ titForTat: 5, alwaysDefect: 5, alwaysCooperate: 15 })
    const rng = createRng(42)
    for (let g = 0; g < 40; g++) pop = runGeneration(pop, { rounds: 10, replace: 5, rng }).next
    const counts = countPopulation(pop)
    expect(counts.alwaysDefect ?? 0).toBe(0)
    expect(counts.titForTat ?? 0).toBeGreaterThan(counts.alwaysCooperate ?? 0)
  })

  it('defectors win when games are a single round', () => {
    let pop = createPopulation({ titForTat: 10, alwaysDefect: 5, alwaysCooperate: 10 })
    const rng = createRng(7)
    for (let g = 0; g < 40; g++) pop = runGeneration(pop, { rounds: 1, replace: 5, rng }).next
    expect(countPopulation(pop).alwaysDefect).toBe(25)
  })
})
