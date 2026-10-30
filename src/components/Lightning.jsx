import { useEffect, useRef } from 'react'

// ---- Tweakables ------------------------------------------------------------
const BRIGHTNESS = 0.55        // global dimming for everything drawn (0–1); keep low, it's decoration
const STEP_LENGTH = 13         // px the leader advances per step
const STEP_MS_MIN = 60         // fastest step interval in ms (lower = faster bolt)
const STEP_MS_MAX = 150        // slowest step interval in ms
const ANGLE_JITTER = 0.45      // max random turn per step, in radians
const STRAIGHTEN = 0.18        // how strongly each step is pulled back toward straight down (0–1)
const BRANCH_CHANCE = 0.1      // chance per step that the main channel forks
const SUB_BRANCH_FACTOR = 0.35 // branch chance multiplier for every level deeper
const MAX_DEPTH = 3            // deepest branch level (main channel is 0)
const BRANCH_STEPS_MIN = 5     // shortest a branch probes, in steps
const BRANCH_STEPS_MAX = 22    // longest a first-level branch probes; deeper ones are shorter
const FRESH_MS = 160           // segments younger than this are drawn brighter
const FIRST_BOLT_MS = 300      // delay before the first bolt
const SPAWN_MIN_MS = 3500      // shortest gap between new bolts
const SPAWN_MAX_MS = 7000      // longest gap between new bolts
const MAX_BOLTS = 2            // bolts on screen at once
const PULSES = [[0, 1], [95, 0.65], [230, 0.4]] // return-stroke flickers: [offset ms, strength]
const PULSE_DECAY_MS = 55      // how fast each flicker dies down
const FADE_MS = 2000           // afterglow fade-out after the return stroke
const MAX_DPR = 1.5            // devicePixelRatio cap, for performance
// ----------------------------------------------------------------------------

const DOWN = Math.PI / 2
const LEADER_ALPHA = [0.42, 0.26, 0.18, 0.12] // per depth, while the leader grows
const FRESH_BONUS = 0.3
const CORE_RGB = '232, 240, 255'
const GLOW_RGB = '110, 150, 255'
const GLOW_STRENGTH = 0.3      // glow alpha relative to the core

const rand = (min, max) => min + Math.random() * (max - min)
const stepDelay = () => rand(STEP_MS_MIN, STEP_MS_MAX)

function createLeader(x, y, angle, depth, now) {
  const maxSteps = depth === 0
    ? Infinity
    : Math.round(rand(BRANCH_STEPS_MIN, BRANCH_STEPS_MAX * (1 - 0.3 * (depth - 1))))
  return { x, y, angle, depth, stepsLeft: maxSteps, nextStepAt: now + stepDelay(), alive: true }
}

function createBolt(width, now) {
  const x = rand(width * 0.1, width * 0.9)
  // Pick 2 or 3 flickers with a little timing jitter.
  const pulses = PULSES
    .slice(0, Math.random() < 0.5 ? 2 : 3)
    .map(([offset, strength], i) => [i === 0 ? 0 : offset + rand(-15, 15), strength])
  return {
    segments: [],
    leaders: [createLeader(x, 0, DOWN + rand(-0.2, 0.2), 0, now)],
    pulses,
    phase: 'leader',
    strokeAt: 0,
    mainSteps: 0,
    cx: x,
  }
}

function stepLeader(bolt, leader, now, width, height) {
  const pull = leader.depth === 0 ? STRAIGHTEN : STRAIGHTEN * 0.5
  leader.angle += rand(-ANGLE_JITTER, ANGLE_JITTER)
  leader.angle += (DOWN - leader.angle) * pull

  const x2 = leader.x + Math.cos(leader.angle) * STEP_LENGTH
  const y2 = leader.y + Math.sin(leader.angle) * STEP_LENGTH
  bolt.segments.push({ x1: leader.x, y1: leader.y, x2, y2, born: now, depth: leader.depth })
  leader.x = x2
  leader.y = y2

  if (leader.depth < MAX_DEPTH) {
    const chance = BRANCH_CHANCE * SUB_BRANCH_FACTOR ** leader.depth
    if (Math.random() < chance) {
      const side = Math.random() < 0.5 ? -1 : 1
      bolt.leaders.push(createLeader(x2, y2, leader.angle + side * rand(0.35, 0.9), leader.depth + 1, now))
    }
  }

  if (leader.depth === 0) {
    bolt.mainSteps++
    // Main channel hit the ground (or wandered absurdly long): return stroke.
    if (y2 >= height || bolt.mainSteps > 600) {
      bolt.phase = 'stroke'
      bolt.strokeAt = now
      bolt.leaders = []
      const main = bolt.segments.filter((s) => s.depth === 0)
      bolt.cx = main.reduce((sum, s) => sum + s.x2, 0) / main.length
    }
    return
  }

  leader.stepsLeft--
  if (leader.stepsLeft <= 0 || y2 > height || x2 < -STEP_LENGTH || x2 > width + STEP_LENGTH) {
    leader.alive = false
  }
}

function updateBolt(bolt, now, width, height) {
  if (bolt.phase !== 'leader') return
  // Index loop on purpose: branches spawned during this pass join it.
  for (let i = 0; i < bolt.leaders.length && bolt.phase === 'leader'; i++) {
    const leader = bolt.leaders[i]
    // After a hidden tab or a long frame, resume instead of fast-forwarding.
    if (now - leader.nextStepAt > 500) leader.nextStepAt = now
    let guard = 0
    while (leader.alive && bolt.phase === 'leader' && now >= leader.nextStepAt && guard++ < 4) {
      stepLeader(bolt, leader, now, width, height)
      leader.nextStepAt += stepDelay()
    }
  }
  bolt.leaders = bolt.leaders.filter((l) => l.alive)
}

function pulseAt(bolt, t) {
  let p = 0
  for (const [offset, strength] of bolt.pulses) {
    if (t >= offset) p = Math.max(p, strength * Math.exp(-(t - offset) / PULSE_DECAY_MS))
  }
  return p
}

function strokeGroup(ctx, segments, alpha, coreWidth, glowWidth) {
  if (!segments.length || alpha <= 0.002) return
  ctx.beginPath()
  for (const s of segments) {
    ctx.moveTo(s.x1, s.y1)
    ctx.lineTo(s.x2, s.y2)
  }
  const a = Math.min(alpha, 1) * BRIGHTNESS
  ctx.strokeStyle = `rgba(${GLOW_RGB}, ${a * GLOW_STRENGTH})`
  ctx.lineWidth = glowWidth
  ctx.stroke()
  ctx.strokeStyle = `rgba(${CORE_RGB}, ${a})`
  ctx.lineWidth = coreWidth
  ctx.stroke()
}

// Draws one bolt. Segments are bucketed by brightness so each bucket is a single path.
function drawBolt(ctx, bolt, now, width, height, isStatic = false) {
  const buckets = Array.from({ length: (MAX_DEPTH + 1) * 2 }, () => [])
  for (const s of bolt.segments) {
    const fresh = !isStatic && bolt.phase === 'leader' && now - s.born < FRESH_MS ? 1 : 0
    buckets[s.depth * 2 + fresh].push(s)
  }

  if (isStatic) {
    for (let d = 0; d <= MAX_DEPTH; d++) {
      strokeGroup(ctx, buckets[d * 2], LEADER_ALPHA[d] * 0.7, 1, d === 0 ? 6 : 4)
    }
    return true
  }

  if (bolt.phase === 'leader') {
    for (let d = 0; d <= MAX_DEPTH; d++) {
      const glow = d === 0 ? 6 : 4
      strokeGroup(ctx, buckets[d * 2], LEADER_ALPHA[d], 1, glow)
      strokeGroup(ctx, buckets[d * 2 + 1], LEADER_ALPHA[d] + FRESH_BONUS, 1, glow)
    }
    return true
  }

  // Return stroke: main channel flashes and flickers, branches brighten a little.
  const t = now - bolt.strokeAt
  if (t > FADE_MS) return false
  const pulse = pulseAt(bolt, t)
  const fade = 1 - t / FADE_MS

  if (pulse > 0.01) {
    const radius = Math.max(width, height) * 0.7
    const glow = ctx.createRadialGradient(bolt.cx, height * 0.5, 0, bolt.cx, height * 0.5, radius)
    glow.addColorStop(0, `rgba(${GLOW_RGB}, ${0.07 * pulse * BRIGHTNESS})`)
    glow.addColorStop(1, `rgba(${GLOW_RGB}, 0)`)
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, height)
  }

  const mainAlpha = pulse + 0.45 * fade ** 1.5
  strokeGroup(ctx, buckets[0], mainAlpha, 1.5, 6 + 3 * Math.min(pulse, 1))
  for (let d = 1; d <= MAX_DEPTH; d++) {
    strokeGroup(ctx, buckets[d * 2], LEADER_ALPHA[d] * fade + 0.3 * pulse, 1, 4)
  }
  return true
}

// Grows a whole bolt instantly (for reduced motion).
function buildStaticBolt(width, height) {
  const bolt = createBolt(width, 0)
  let guard = 0
  while (bolt.phase === 'leader' && bolt.leaders.length && guard++ < 5000) {
    for (let i = 0; i < bolt.leaders.length && bolt.phase === 'leader'; i++) {
      if (bolt.leaders[i].alive) stepLeader(bolt, bolt.leaders[i], 0, width, height)
    }
    bolt.leaders = bolt.leaders.filter((l) => l.alive)
  }
  return bolt
}

export default function Lightning() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let frame = 0
    let bolts = []
    let nextSpawnAt = 0
    let hasDrawn = false
    let staticBolt = null

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      // Mobile URL bars change only the height; keep the static bolt in that case.
      const widthChanged = window.innerWidth !== width
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      hasDrawn = true // resizing clears the canvas
      if (staticBolt) drawStatic(widthChanged)
    }

    function drawStatic(rebuild = true) {
      if (rebuild || !staticBolt) staticBolt = buildStaticBolt(width, height)
      ctx.clearRect(0, 0, width, height)
      drawBolt(ctx, staticBolt, 0, width, height, true)
    }

    function tick(now) {
      if (now >= nextSpawnAt) {
        if (bolts.length < MAX_BOLTS) {
          bolts.push(createBolt(width, now))
          nextSpawnAt = now + rand(SPAWN_MIN_MS, SPAWN_MAX_MS)
        } else {
          nextSpawnAt = now + 500
        }
      }

      if (bolts.length || hasDrawn) {
        ctx.clearRect(0, 0, width, height)
        bolts = bolts.filter((bolt) => {
          updateBolt(bolt, now, width, height)
          return drawBolt(ctx, bolt, now, width, height)
        })
        hasDrawn = bolts.length > 0
      }

      frame = requestAnimationFrame(tick)
    }

    function start() {
      cancelAnimationFrame(frame)
      bolts = []
      staticBolt = null
      resize()
      if (motionQuery.matches) {
        drawStatic()
      } else {
        ctx.clearRect(0, 0, width, height)
        nextSpawnAt = performance.now() + FIRST_BOLT_MS
        frame = requestAnimationFrame(tick)
      }
    }

    start()
    window.addEventListener('resize', resize)
    motionQuery.addEventListener('change', start)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      motionQuery.removeEventListener('change', start)
    }
  }, [])

  return <canvas ref={canvasRef} className="lightning" aria-hidden="true" />
}
