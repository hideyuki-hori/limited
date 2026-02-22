export const STORAGE_KEY = 'limited-countdowns'
export const MAX_ITEMS = 10

export function generateId(): string {
  return crypto.randomUUID()
}
