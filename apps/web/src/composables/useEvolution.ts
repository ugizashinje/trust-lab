import {
  countPopulation,
  createPopulation,
  createRng,
  isSettled,
  runGeneration,
  type Agent,
  type Payoffs,
  type Population,
} from '@trust-lab/game-core'
import { onBeforeUnmount, ref, shallowRef, watch, type Ref } from 'vue'

export interface SimConfig {
  population: Population
  rounds: number
  /** 0..1 */
  noise: number
  replace: number
  payoffs: Payoffs
}

export const cloneConfig = (c: SimConfig): SimConfig => ({
  population: { ...c.population },
  rounds: c.rounds,
  noise: c.noise,
  replace: c.replace,
  payoffs: { ...c.payoffs },
})

const MAX_HISTORY = 150

/**
 * Drives an evolving population. Any change to `config` resets the run.
 */
export function useEvolution(config: Ref<SimConfig>, intervalMs = 650) {
  const agents = shallowRef<Agent[]>([])
  const history = shallowRef<Population[]>([])
  const generation = ref(0)
  const running = ref(false)
  const settled = ref(false)
  const rng = createRng(Math.floor(Math.random() * 2 ** 32))
  let timer: ReturnType<typeof setInterval> | undefined

  const canRun = () => agents.value.length >= 2 && !settled.value

  function stop() {
    running.value = false
    if (timer !== undefined) clearInterval(timer)
    timer = undefined
  }

  function reset() {
    stop()
    agents.value = createPopulation(config.value.population)
    generation.value = 0
    history.value = [countPopulation(agents.value)]
    settled.value = isSettled(agents.value)
  }

  function step() {
    if (!canRun()) return stop()
    const c = config.value
    const { next } = runGeneration(agents.value, {
      rounds: c.rounds,
      noise: c.noise,
      replace: c.replace,
      payoffs: c.payoffs,
      rng,
    })
    agents.value = next
    generation.value++
    history.value = [...history.value, countPopulation(next)].slice(-MAX_HISTORY)
    settled.value = isSettled(next)
    if (settled.value) stop()
  }

  function start() {
    if (running.value || !canRun()) return
    running.value = true
    step()
    timer = setInterval(step, intervalMs)
  }

  function toggle() {
    if (running.value) stop()
    else start()
  }

  watch(config, reset, { deep: true, immediate: true })
  onBeforeUnmount(stop)

  return { agents, history, generation, running, settled, step, start, stop, toggle, reset }
}
