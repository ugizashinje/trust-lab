/**
 * Thin client for the optional backend (apps/api). While VITE_API_URL is
 * empty, which is the case for the static Vercel deploy, every call is a no-op.
 */
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export const apiEnabled = API_URL.length > 0

export interface PlayResultPayload {
  locale: string
  totalScore: number
  /** One entry per stranger, in the order they were met. */
  matches: { opponent: string; moves: string; score: number; opponentScore: number }[]
}

export async function submitPlayResult(payload: PlayResultPayload): Promise<void> {
  if (!apiEnabled) return
  try {
    await fetch(`${API_URL}/api/play-results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // Stats are best-effort; the game never depends on the backend.
  }
}
