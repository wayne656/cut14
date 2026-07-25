import { useEffect, useMemo, useState } from 'react'
import type { PlanDay } from '../data/plan'
import { formatShortDate } from '../data/plan'

const WEIGHT_KEY = 'cut14-weights-v1'

export type WeightMap = Record<string, number>

function loadWeights(): WeightMap {
  try {
    const raw = localStorage.getItem(WEIGHT_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as WeightMap
  } catch {
    return {}
  }
}

type Props = {
  days: PlanDay[]
  selectedKey: string
  todayKey: string
}

export function WeightTracker({ days, selectedKey, todayKey }: Props) {
  const [weights, setWeights] = useState<WeightMap>(() => loadWeights())
  const [draft, setDraft] = useState('')
  const selectedWeight = weights[selectedKey]
  const selectedDay = days.find((d) => d.dateKey === selectedKey) ?? days[0]

  useEffect(() => {
    localStorage.setItem(WEIGHT_KEY, JSON.stringify(weights))
  }, [weights])

  useEffect(() => {
    setDraft(selectedWeight !== undefined ? String(selectedWeight) : '')
  }, [selectedKey, selectedWeight])

  const series = useMemo(
    () =>
      days
        .map((day) => ({
          day,
          weight: weights[day.dateKey],
        }))
        .filter((entry): entry is { day: PlanDay; weight: number } =>
          typeof entry.weight === 'number',
        ),
    [days, weights],
  )

  const first = series[0]
  const latest = series[series.length - 1]
  const delta =
    first && latest ? Number((latest.weight - first.weight).toFixed(1)) : null

  const chart = useMemo(() => {
    if (series.length === 0) return null
    const values = series.map((s) => s.weight)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = Math.max(max - min, 0.4)
    const pad = 12
    const width = 320
    const height = 120
    const innerW = width - pad * 2
    const innerH = height - pad * 2
    const points = series.map((entry, index) => {
      const x =
        series.length === 1
          ? width / 2
          : pad + (index / (series.length - 1)) * innerW
      const y = pad + ((max - entry.weight) / span) * innerH
      return { x, y, ...entry }
    })
    const path = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ')
    return { width, height, points, path, min, max }
  }, [series])

  function saveWeight() {
    const value = Number.parseFloat(draft)
    if (!Number.isFinite(value) || value <= 0 || value > 400) return
    const rounded = Math.round(value * 10) / 10
    setWeights((prev) => ({ ...prev, [selectedKey]: rounded }))
  }

  function clearWeight() {
    setWeights((prev) => {
      const next = { ...prev }
      delete next[selectedKey]
      return next
    })
    setDraft('')
  }

  return (
    <section className="section" id="weight">
      <div className="shell">
        <div className="section__head">
          <p className="eyebrow">Scale log</p>
          <h2>Track the trend, not the bounce.</h2>
          <p>
            Morning weigh-ins only. Creatine can add 0.5–1.0 kg of cell water —
            ignore short spikes and watch the 14-day line.
          </p>
        </div>

        <div className="weight-layout">
          <div className="weight-form">
            <div className="weight-form__meta">
              <span className="eyebrow">
                {selectedKey === todayKey ? 'Today' : 'Selected day'}
              </span>
              <strong>{formatShortDate(selectedDay.date)}</strong>
            </div>
            <label className="weight-label" htmlFor="weight-input">
              Body weight (kg)
            </label>
            <div className="weight-input-row">
              <input
                id="weight-input"
                className="weight-input"
                type="number"
                inputMode="decimal"
                step="0.1"
                min="30"
                max="400"
                placeholder="e.g. 82.4"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveWeight()
                }}
              />
              <button type="button" className="weight-save" onClick={saveWeight}>
                Save
              </button>
            </div>
            {selectedWeight !== undefined ? (
              <button type="button" className="weight-clear" onClick={clearWeight}>
                Clear this day
              </button>
            ) : (
              <p className="weight-hint">Logs save in this browser only.</p>
            )}

            <div className="weight-stats">
              <div>
                <span>Logged</span>
                <strong>
                  {latest ? `${latest.weight.toFixed(1)} kg` : '—'}
                </strong>
              </div>
              <div>
                <span>Change</span>
                <strong
                  className={
                    delta === null
                      ? ''
                      : delta < 0
                        ? 'is-down'
                        : delta > 0
                          ? 'is-up'
                          : ''
                  }
                >
                  {delta === null
                    ? '—'
                    : `${delta > 0 ? '+' : ''}${delta.toFixed(1)} kg`}
                </strong>
              </div>
              <div>
                <span>Entries</span>
                <strong>
                  {series.length}/{days.length}
                </strong>
              </div>
            </div>
          </div>

          <div className="weight-chart-panel">
            {chart ? (
              <>
                <svg
                  className="weight-chart"
                  viewBox={`0 0 ${chart.width} ${chart.height}`}
                  role="img"
                  aria-label="Weight trend across logged days"
                >
                  <path d={chart.path} className="weight-chart__line" />
                  {chart.points.map((point) => (
                    <circle
                      key={point.day.dateKey}
                      cx={point.x}
                      cy={point.y}
                      r={point.day.dateKey === selectedKey ? 5 : 3.5}
                      className={
                        point.day.dateKey === selectedKey
                          ? 'weight-chart__dot is-active'
                          : 'weight-chart__dot'
                      }
                    />
                  ))}
                </svg>
                <div className="weight-chart__range">
                  <span>{chart.max.toFixed(1)} kg</span>
                  <span>{chart.min.toFixed(1)} kg</span>
                </div>
              </>
            ) : (
              <div className="weight-empty">
                Save your first morning weigh-in to start the trend line.
              </div>
            )}

            <ul className="weight-log">
              {[...series].reverse().slice(0, 6).map((entry) => (
                <li key={entry.day.dateKey}>
                  <span>{formatShortDate(entry.day.date)}</span>
                  <strong>{entry.weight.toFixed(1)} kg</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
