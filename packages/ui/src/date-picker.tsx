import { createSignal, createEffect } from 'solid-js'
import { DigitSelect } from './digit-select'

interface Props {
  value: string
  onChange: (v: string) => void
}

function range(start: number, end: number): number[] {
  const arr: number[] = []
  for (let i = start; i <= end; i++) arr.push(i)
  return arr
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function parseValue(v: string) {
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/)
  if (!m) return null
  return { y: +m[1], mo: +m[2], d: +m[3], h: +m[4], mi: +m[5] }
}

export function DatePicker(props: Props) {
  const now = new Date()
  const p = parseValue(props.value)
  const initY = p?.y ?? now.getFullYear()
  const initMo = p?.mo ?? (now.getMonth() + 1)
  const initD = p?.d ?? now.getDate()
  const initH = p?.h ?? 23
  const initMi = p?.mi ?? 59

  const [yT, setYT] = createSignal(Math.floor(initY / 1000))
  const [yH, setYH] = createSignal(Math.floor((initY % 1000) / 100))
  const [yD, setYD] = createSignal(Math.floor((initY % 100) / 10))
  const [yU, setYU] = createSignal(initY % 10)

  const [moT, setMoT] = createSignal(Math.floor(initMo / 10))
  const [moU, setMoU] = createSignal(initMo % 10)

  const [dT, setDT] = createSignal(Math.floor(initD / 10))
  const [dU, setDU] = createSignal(initD % 10)

  const [hT, setHT] = createSignal(Math.floor(initH / 10))
  const [hU, setHU] = createSignal(initH % 10)

  const [miT, setMiT] = createSignal(Math.floor(initMi / 10))
  const [miU, setMiU] = createSignal(initMi % 10)

  const year = () => yT() * 1000 + yH() * 100 + yD() * 10 + yU()
  const month = () => moT() * 10 + moU()
  const day = () => dT() * 10 + dU()
  const hour = () => hT() * 10 + hU()
  const minute = () => miT() * 10 + miU()

  const moUOptions = () => moT() === 0 ? range(1, 9) : range(0, 2)
  const maxDay = () => daysInMonth(year(), month())
  const dTOptions = () => range(0, Math.floor(maxDay() / 10))
  const dUOptions = () => {
    if (dT() < Math.floor(maxDay() / 10)) return range(0, 9)
    return range(0, maxDay() % 10)
  }
  const hUOptions = () => hT() === 2 ? range(0, 3) : range(0, 9)

  function clampMonth() {
    const m = month()
    if (m < 1) setMoU(1)
    if (m > 12) setMoU(2)
  }

  function clampDay() {
    const d = day()
    const max = maxDay()
    if (d < 1) { setDT(0); setDU(1) }
    if (d > max) { setDT(Math.floor(max / 10)); setDU(max % 10) }
  }

  function clampHour() {
    if (hour() > 23) setHU(3)
  }

  createEffect(() => {
    moT(); clampMonth()
  })

  createEffect(() => {
    year(); month(); clampDay()
  })

  createEffect(() => {
    hT(); clampHour()
  })

  createEffect(() => {
    const y = String(year())
    const mo = String(month()).padStart(2, '0')
    const d = String(day()).padStart(2, '0')
    const h = String(hour()).padStart(2, '0')
    const mi = String(minute()).padStart(2, '0')
    props.onChange(`${y}-${mo}-${d}T${h}:${mi}`)
  })

  return (
    <div class="flex items-center font-mono text-sm">
      <DigitSelect value={yT()} options={range(0, 9)} onChange={setYT} />
      <DigitSelect value={yH()} options={range(0, 9)} onChange={setYH} />
      <DigitSelect value={yD()} options={range(0, 9)} onChange={setYD} />
      <DigitSelect value={yU()} options={range(0, 9)} onChange={setYU} />
      <span class="text-text-tertiary mx-px">-</span>
      <DigitSelect value={moT()} options={range(0, 1)} onChange={setMoT} />
      <DigitSelect value={moU()} options={moUOptions()} onChange={setMoU} />
      <span class="text-text-tertiary mx-px">-</span>
      <DigitSelect value={dT()} options={dTOptions()} onChange={setDT} />
      <DigitSelect value={dU()} options={dUOptions()} onChange={setDU} />
      <span class="text-text-secondary mx-1"> </span>
      <DigitSelect value={hT()} options={range(0, 2)} onChange={setHT} />
      <DigitSelect value={hU()} options={hUOptions()} onChange={setHU} />
      <span class="text-text-tertiary mx-px">:</span>
      <DigitSelect value={miT()} options={range(0, 5)} onChange={setMiT} />
      <DigitSelect value={miU()} options={range(0, 9)} onChange={setMiU} />
    </div>
  )
}
