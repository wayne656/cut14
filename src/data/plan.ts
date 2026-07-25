export type Meal = {
  time: string
  title: string
  items: string[]
  calories: number
  protein?: number
}

export type Exercise = {
  name: string
  detail: string
}

export type WorkoutBlock = {
  title: string
  focus: string
  exercises: Exercise[]
  note?: string
}

export type DayTemplate = {
  weekday: number // 0 = Sunday
  label: string
  shortLabel: string
  tag: string
  calories: number
  protein: number
  isRest: boolean
  nutritionNote?: string
  meals: Meal[]
  workouts: WorkoutBlock[]
}

export type PlanDay = DayTemplate & {
  date: Date
  dateKey: string
  dayNumber: number
  week: 1 | 2
}

export const PLAN_START = new Date(2026, 6, 26) // Sun Jul 26, 2026
export const PLAN_DAYS = 14

export const supplements = [
  {
    name: 'Creatine Monohydrate',
    dose: '5g daily (including Sunday)',
    timing:
      'Post-workout on training days with water or mixed into protein powder.',
    notes: [
      'Increases intracellular water retention — keeps muscle cells hydrated and primed while cutting.',
      'Expect a temporary 0.5–1.0 kg scale jump from cell hydration. Ignore it; it is not fat.',
    ],
  },
  {
    name: 'Protein Water',
    dose: '1 serve as needed',
    timing:
      'During or immediately after your morning workout, or mid-afternoon on weekdays when hunger hits.',
    notes: [
      'Fast-digesting protein with zero added fat and almost no carbs — frees food calories for meals.',
    ],
  },
  {
    name: 'Protein Powder (Whey/Plant)',
    dose: '1 scoop in snacks/meals',
    timing: 'Blend into high-volume meals — not as a thin drink.',
    notes: [
      'Mix with ice and water, or stir into oats/yogurt for satiety.',
    ],
  },
]

export const survivalRules = [
  {
    title: 'Hydration & Electrolytes',
    body: 'Drink 3.5–4 liters of water daily. Add a pinch of salt to your pre-workout meal to prevent mid-workout lightheadedness as glycogen (and water) drops.',
  },
  {
    title: 'Prioritize Sleep',
    body: 'On a deficit with 6 training days, your nervous system recovers almost exclusively while sleeping. Aim for 7.5–9 hours nightly.',
  },
  {
    title: 'Scale vs. Performance',
    body: 'If main-lift strength drops more than 10–15% in week two, add 150–200 weekday calories as complex carbs before training to protect muscle.',
  },
]

const weekdayMeals: Meal[] = [
  {
    time: '6:30 AM',
    title: 'Pre-Workout',
    items: [
      '1/2 banana or 1 rice cake with a thin smear of honey',
      '~15–20g quick carbs to spike glycogen',
    ],
    calories: 70,
  },
  {
    time: '8:30 AM',
    title: 'Post / Intra-Workout',
    items: ['1 serve Protein Water', '5g Creatine'],
    calories: 80,
    protein: 20,
  },
  {
    time: '12:00 PM',
    title: 'Meal 1 / Lunch',
    items: [
      '200g lean chicken mince (cooked) — or grilled chicken breast / white fish',
      '100g cooked white rice (preferred carb refuel)',
      'Large green salad (spinach, cucumber, zucchini) with lemon or ACV — no oil',
    ],
    calories: 380,
    protein: 50,
  },
  {
    time: '3:30 PM',
    title: 'Mid-Afternoon Snack',
    items: [
      '200g non-fat Greek yogurt (0% fat)',
      '1 scoop protein powder mixed in',
    ],
    calories: 220,
    protein: 45,
  },
  {
    time: '7:00 PM',
    title: 'Meal 2 / Dinner',
    items: [
      '180g lean chicken mince (or extra-lean turkey / 95/5 beef)',
      '2 cups broccoli/asparagus cooked in non-stick spray',
      'Optional: small scoop of white rice if hunger is high — keep dinner near ~450 kcal',
    ],
    calories: 450,
    protein: 40,
  },
]

const weekendMeals: Meal[] = [
  {
    time: 'Morning',
    title: 'Training Fuel',
    items: [
      'Keep protein target (~150g) intact',
      'Use extra calories around your long run / active day',
    ],
    calories: 400,
    protein: 40,
  },
  {
    time: 'Midday',
    title: 'Refeed Lunch',
    items: [
      'Lean chicken mince or chicken breast / fish / eggs',
      'Larger serve of white rice (main weekend carb), plus oats or sweet potato if needed',
      'Healthy fats: avocado, olive oil, or whole eggs',
    ],
    calories: 650,
    protein: 50,
  },
  {
    time: 'Afternoon',
    title: 'Snack',
    items: [
      'Greek yogurt + protein powder, or protein water if hunger spikes',
      'Optional fruit or rice cakes',
    ],
    calories: 250,
    protein: 35,
  },
  {
    time: 'Evening',
    title: 'Refeed Dinner',
    items: [
      'Lean chicken mince with large vegetables',
      'Extra white rice and healthy fats to finish ~1,800 kcal',
      'Hit your water target — refeed works better hydrated',
    ],
    calories: 500,
    protein: 25,
  },
]

const templates: DayTemplate[] = [
  {
    weekday: 0,
    label: 'Complete Active Rest',
    shortLabel: 'Rest',
    tag: 'Recovery',
    calories: 1800,
    protein: 150,
    isRest: true,
    nutritionNote:
      'Hit the 1,800-calorie refeed with healthy fats and complex carbs. Plenty of water.',
    meals: weekendMeals,
    workouts: [
      {
        title: 'Active Recovery',
        focus: 'Zero lifting, zero running',
        exercises: [
          { name: 'Walking', detail: '8,000–10,000 light steps' },
          { name: 'Stretching & mobility', detail: 'Full-body, unhurried' },
          { name: 'Creatine', detail: 'Still take 5g today' },
        ],
        note: 'Nervous system recovery is the session.',
      },
    ],
  },
  {
    weekday: 1,
    label: 'Upper Body Power + Short Run',
    shortLabel: 'Upper Power',
    tag: 'Push / Pull',
    calories: 1200,
    protein: 150,
    isRest: false,
    meals: weekdayMeals,
    workouts: [
      {
        title: 'Morning Gym',
        focus: 'Heavy upper body push/pull',
        exercises: [
          { name: 'Barbell Bench Press', detail: '4 × 6–8' },
          { name: 'Bent-Over Barbell Rows', detail: '4 × 8–10' },
          { name: 'Dumbbell Overhead Press', detail: '3 × 8–10' },
          { name: 'Lat Pulldowns', detail: '3 × 10–12' },
          {
            name: 'Tricep Pushdowns + Bicep Curls',
            detail: '3 × 12 supersets',
          },
        ],
      },
      {
        title: 'Run',
        focus: 'Post-lift zone 2',
        exercises: [
          {
            name: 'Zone 2 jog or 3km run',
            detail: '20 minutes conversational pace',
          },
        ],
      },
    ],
  },
  {
    weekday: 2,
    label: 'Lower Body Strength',
    shortLabel: 'Lower Strength',
    tag: 'No Run',
    calories: 1200,
    protein: 150,
    isRest: false,
    meals: weekdayMeals,
    workouts: [
      {
        title: 'Morning Gym',
        focus: 'Quads & hamstrings — keep running off this day',
        exercises: [
          { name: 'Barbell Back Squats or Leg Press', detail: '4 × 6–8' },
          { name: 'Romanian Deadlifts (RDLs)', detail: '4 × 8–10' },
          { name: 'Walking Lunges', detail: '3 × 12 steps/leg' },
          { name: 'Lying Hamstring Curls', detail: '3 × 12–15' },
          { name: 'Standing Calf Raises', detail: '4 × 15' },
        ],
        note: 'Legs stay fresh — no run today.',
      },
    ],
  },
  {
    weekday: 3,
    label: 'Dedicated Running + Core',
    shortLabel: 'Run + Core',
    tag: 'Intervals',
    calories: 1200,
    protein: 150,
    isRest: false,
    meals: weekdayMeals,
    workouts: [
      {
        title: 'Run Focus',
        focus: 'Interval or tempo',
        exercises: [
          { name: 'Warm-up', detail: '5 min walk / dynamic stretch' },
          {
            name: 'Main set',
            detail:
              '25–30 min — 1 min fast / 1 min jog, or continuous tempo 5km',
          },
        ],
      },
      {
        title: 'Core',
        focus: 'Gym finishers',
        exercises: [
          { name: 'Hanging Leg Raises', detail: '3 × 12–15' },
          { name: 'Cable Woodchoppers', detail: '3 × 15/side' },
          {
            name: 'Ab Wheel Rollouts or Planks',
            detail: '3 sets to near failure',
          },
        ],
      },
    ],
  },
  {
    weekday: 4,
    label: 'Upper Body Hypertrophy',
    shortLabel: 'Upper Volume',
    tag: 'High Volume',
    calories: 1200,
    protein: 150,
    isRest: false,
    meals: weekdayMeals,
    workouts: [
      {
        title: 'Morning Gym',
        focus: 'High-volume upper body',
        exercises: [
          { name: 'Incline Dumbbell Bench Press', detail: '4 × 10–12' },
          { name: 'Seated Cable Rows (Wide Grip)', detail: '4 × 10–12' },
          { name: 'Dumbbell Lateral Raises', detail: '4 × 15' },
          { name: 'Face Pulls (Rear Delts)', detail: '4 × 15' },
          {
            name: 'Hammer Curls & Overhead Tricep Extensions',
            detail: '3 × 12–15',
          },
        ],
      },
      {
        title: 'Optional Run',
        focus: 'Recovery pace only',
        exercises: [
          {
            name: 'Incline walk or light jog',
            detail: '15 min treadmill or 2km recovery',
          },
        ],
      },
    ],
  },
  {
    weekday: 5,
    label: 'Lower Body & Glute Focus',
    shortLabel: 'Lower / Glutes',
    tag: 'Posterior Chain',
    calories: 1200,
    protein: 150,
    isRest: false,
    meals: weekdayMeals,
    workouts: [
      {
        title: 'Morning Gym',
        focus: 'Hips & posterior chain',
        exercises: [
          { name: 'Conventional or Trap Bar Deadlifts', detail: '3 × 5' },
          { name: 'Bulgarian Split Squats', detail: '3 × 10/leg' },
          { name: 'Hip Thrusts (Barbell or Machine)', detail: '4 × 10–12' },
          { name: 'Leg Extensions', detail: '3 × 15 burnout' },
        ],
      },
    ],
  },
  {
    weekday: 6,
    label: 'Endurance Run + Full Body Pump',
    shortLabel: 'LSD + Pump',
    tag: 'Weekend Fuel',
    calories: 1800,
    protein: 150,
    isRest: false,
    nutritionNote:
      'Use the 1,800-calorie weekend allotment — extra fats and complex carbs around the long run.',
    meals: weekendMeals,
    workouts: [
      {
        title: 'Long Slow Distance',
        focus: 'Zone 2 outdoor run',
        exercises: [
          {
            name: 'Steady-state run',
            detail: '45–60 minutes conversational pace',
          },
        ],
      },
      {
        title: 'Light Gym Pump',
        focus: 'Blood flow, not max weight',
        exercises: [
          { name: 'Face Pulls', detail: '3 sets' },
          { name: 'Pushups', detail: '3 sets' },
          { name: 'Pull-ups or Lat Pulldowns', detail: '3 sets' },
          { name: 'Lateral Raises', detail: '3 sets' },
        ],
      },
    ],
  },
]

function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function buildPlanDays(): PlanDay[] {
  return Array.from({ length: PLAN_DAYS }, (_, i) => {
    const date = addDays(PLAN_START, i)
    const template = templates.find((t) => t.weekday === date.getDay())!
    return {
      ...template,
      date,
      dateKey: formatDateKey(date),
      dayNumber: i + 1,
      week: (i < 7 ? 1 : 2) as 1 | 2,
    }
  })
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function todayKey(now = new Date()): string {
  return formatDateKey(now)
}
