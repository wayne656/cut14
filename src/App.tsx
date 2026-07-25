import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  buildPlanDays,
  formatLongDate,
  formatShortDate,
  supplements,
  survivalRules,
  todayKey,
  type PlanDay,
} from './data/plan'
import { WeightTracker } from './components/WeightTracker'

const STORAGE_KEY = 'cut14-progress-v1'

type ProgressMap = Record<string, string[]>

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ProgressMap
  } catch {
    return {}
  }
}

function itemId(kind: string, index: number, sub?: number): string {
  return sub === undefined ? `${kind}-${index}` : `${kind}-${index}-${sub}`
}

export default function App() {
  const days = useMemo(() => buildPlanDays(), [])
  const reduceMotion = useReducedMotion()
  const today = todayKey()
  const initial =
    days.find((d) => d.dateKey === today) ??
    days.find((d) => d.dateKey >= today) ??
    days[0]

  const [selectedKey, setSelectedKey] = useState(initial.dateKey)
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress())
  const stripRef = useRef<HTMLDivElement>(null)
  const selected = days.find((d) => d.dateKey === selectedKey) ?? days[0]

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    const active = stripRef.current?.querySelector<HTMLButtonElement>(
      '[data-active="true"]',
    )
    active?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [selectedKey, reduceMotion])

  const doneSet = new Set(progress[selected.dateKey] ?? [])
  const fade = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }

  function toggle(id: string) {
    setProgress((prev) => {
      const current = new Set(prev[selected.dateKey] ?? [])
      if (current.has(id)) current.delete(id)
      else current.add(id)
      return { ...prev, [selected.dateKey]: [...current] }
    })
  }

  function selectDay(day: PlanDay) {
    setSelectedKey(day.dateKey)
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__media" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />
        <div className="hero__inner">
          <motion.div
            className="hero__brand"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fade, delay: 0.05 }}
          >
            CUT<span>14</span>
          </motion.div>
          <motion.h1
            className="hero__headline"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fade, delay: 0.18 }}
          >
            Two weeks. Precise fuel. Six days training.
          </motion.h1>
          <motion.p
            className="hero__support"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fade, delay: 0.28 }}
          >
            Carbohydrates locked around training windows. Protein first. Starting
            Sunday 26 July.
          </motion.p>
          <motion.a
            className="hero__cta"
            href="#today"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...fade, delay: 0.38 }}
          >
            Open today&apos;s plan
            <small>→</small>
          </motion.a>
        </div>
      </header>

      <nav className="day-strip" aria-label="14-day schedule">
        <div className="day-strip__inner">
          <div className="day-strip__meta">
            <span>
              Week {selected.week} · Day {selected.dayNumber} of 14
            </span>
            <strong>{formatLongDate(selected.date)}</strong>
          </div>
          <div className="day-strip__scroller" ref={stripRef}>
            {days.map((day) => {
              const active = day.dateKey === selected.dateKey
              const isToday = day.dateKey === today
              return (
                <button
                  key={day.dateKey}
                  type="button"
                  className={`day-chip${active ? ' is-active' : ''}${isToday ? ' is-today' : ''}`}
                  data-active={active ? 'true' : 'false'}
                  onClick={() => selectDay(day)}
                  aria-pressed={active}
                >
                  <span className="day-chip__week">
                    W{day.week}
                    {isToday ? ' · Today' : ''}
                  </span>
                  <span className="day-chip__date">
                    {formatShortDate(day.date)}
                  </span>
                  <span className="day-chip__label">{day.shortLabel}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main>
        <section className="section" id="today">
          <div className="shell">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.dateKey}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={fade}
              >
                <div className="today-banner">
                  <div>
                    <p className="eyebrow">{selected.tag}</p>
                    <h2>{selected.label}</h2>
                  </div>
                  <div className="today-banner__stats">
                    <div>
                      <strong>
                        {selected.calories.toLocaleString()}
                      </strong>
                      kcal
                    </div>
                    <div>
                      <strong>~{selected.protein}g</strong>
                      protein
                    </div>
                  </div>
                </div>

                <div className="split">
                  <div className="panel">
                    <div className="panel__title">
                      <h3>Nutrition</h3>
                      <span>
                        {selected.calories === 1200 ? 'Weekday base' : 'Weekend refeed'}
                      </span>
                    </div>
                    {selected.nutritionNote ? (
                      <p className="note">{selected.nutritionNote}</p>
                    ) : (
                      <p className="note">
                        Place carbs around training. Lean on protein to protect
                        lean mass at 1,200 kcal.
                      </p>
                    )}
                    <div className="stack">
                      {selected.meals.map((meal, index) => {
                        const id = itemId('meal', index)
                        const done = doneSet.has(id)
                        return (
                          <button
                            key={id}
                            type="button"
                            className={`check-row meal${done ? ' is-done' : ''}`}
                            onClick={() => toggle(id)}
                          >
                            <span
                              className={`check${done ? ' is-on' : ''}`}
                              aria-hidden="true"
                            />
                            <span style={{ display: 'grid', gap: '0.35rem', flex: 1 }}>
                              <span className="meal__top">
                                <h4>{meal.title}</h4>
                                <span className="meta">
                                  {meal.time}
                                  {meal.protein
                                    ? ` · ${meal.calories} kcal · ${meal.protein}g P`
                                    : ` · ${meal.calories} kcal`}
                                </span>
                              </span>
                              <ul>
                                {meal.items.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel__title">
                      <h3>{selected.isRest ? 'Recovery' : 'Training'}</h3>
                      <span>{selected.isRest ? 'Active rest' : 'Morning session'}</span>
                    </div>
                    <div className="stack">
                      {selected.workouts.map((block, blockIndex) => (
                        <div className="block" key={`${block.title}-${blockIndex}`}>
                          <div className="block__top">
                            <h4>{block.title}</h4>
                            <span className="meta">{block.focus}</span>
                          </div>
                          <ul>
                            {block.exercises.map((ex, exIndex) => {
                              const id = itemId('ex', blockIndex, exIndex)
                              const done = doneSet.has(id)
                              return (
                                <li key={id} style={{ paddingLeft: 0, listStyle: 'none' }}>
                                  <button
                                    type="button"
                                    className={`check-row${done ? ' is-done' : ''}`}
                                    onClick={() => toggle(id)}
                                  >
                                    <span
                                      className={`check${done ? ' is-on' : ''}`}
                                      aria-hidden="true"
                                    />
                                    <span className="exercise-row" style={{ flex: 1 }}>
                                      <strong>{ex.name}</strong>
                                      <span>{ex.detail}</span>
                                    </span>
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                          {block.note ? <p className="note">{block.note}</p> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <WeightTracker
          days={days}
          selectedKey={selected.dateKey}
          todayKey={today}
        />

        <section className="section" id="supplements">
          <div className="shell">
            <div className="section__head">
              <p className="eyebrow">Supplement strategy</p>
              <h2>Keep cells primed while calories drop.</h2>
              <p>
                Creatine every day. Protein water for fast amino acids without
                spending meal calories. Powder for volume, not thin shakes.
              </p>
            </div>
            <div className="strategy-grid">
              {supplements.map((item) => (
                <article className="strategy-item" key={item.name}>
                  <h3>{item.name}</h3>
                  <p>
                    <strong style={{ color: 'var(--ink)' }}>{item.dose}</strong>
                    <br />
                    {item.timing}
                  </p>
                  <ul>
                    {item.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="fuel">
          <div className="shell">
            <div className="section__head">
              <p className="eyebrow">Fuel template</p>
              <h2>Weekdays cut. Weekends refeed.</h2>
              <p>
                1,200 kcal and ~150g protein Mon–Fri. Saturday and Sunday open to
                1,800 kcal to refill glycogen and blunt metabolic adaptation.
              </p>
            </div>
            <div className="fuel-callout">
              <div>
                <h3>Why the split exists</h3>
                <p>
                  Running on heavy leg days fries your CNS. This plan pairs runs
                  with upper-body or dedicated cardio windows so squat and
                  deadlift days stay sharp.
                </p>
              </div>
              <div className="pill-row" aria-label="Weekly training map">
                <span className="pill">Mon · Upper + short run</span>
                <span className="pill">Tue · Lower strength</span>
                <span className="pill">Wed · Intervals + core</span>
                <span className="pill">Thu · Upper hypertrophy</span>
                <span className="pill">Fri · Deadlift / glutes</span>
                <span className="pill">Sat · LSD + pump</span>
                <span className="pill">Sun · Active rest</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="rules">
          <div className="shell">
            <div className="section__head">
              <p className="eyebrow">Non-negotiables</p>
              <h2>Three survival rules for 14 days.</h2>
            </div>
            <div className="rules">
              {survivalRules.map((rule, index) => (
                <article className="rule" key={rule.title}>
                  <div className="rule__num">0{index + 1}</div>
                  <div>
                    <h3>{rule.title}</h3>
                    <p>{rule.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <span>
            <strong>CUT14</strong> · 26 Jul – 8 Aug 2026
          </span>
          <span>Progress saves in this browser.</span>
        </div>
      </footer>
    </div>
  )
}
