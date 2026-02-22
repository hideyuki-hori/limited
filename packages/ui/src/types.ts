export interface Countdown {
  id: string
  title: string
  deadline: number
}

export interface TimeRemaining {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
  urgent: boolean
}
