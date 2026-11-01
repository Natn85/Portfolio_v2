// Spinning 3D coin logo (nav brand + big one under the contact card). Ported from reference/coin-reference.html (three r128)
// to current three. Lazy-loaded through Coin.jsx, so three.js lives in its own chunk.
//
// API changes vs. the r128 reference, kept visually identical:
// - renderer.outputColorSpace / texture.colorSpace replace outputEncoding / texture.encoding.
// - Color management is on by default now: hex colors are treated as sRGB and converted.
//   r128 used them raw (linear), so the edge and rim colors are set as linear explicitly.
//   setRGB() still takes linear values by default, so the studio strips are unchanged.
// - An sRGB texture is decoded by the GPU now. r128 fed the raw canvas to the bump map,
//   so the face's bump map gets its own texture on the same canvas with no color space.
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// [glyph, Google Font family]. Sancreek N first, then ና, then the rest in order.
const GLYPHS = [
  ['N', 'Sancreek'],
  ['ና', 'Noto Sans Ethiopic'],
  ['ن', 'Noto Sans Arabic'],
  ['न', 'Noto Sans Devanagari'],
  ['ন', 'Noto Sans Bengali'],
  ['ਨ', 'Noto Sans Gurmukhi'],
  ['ન', 'Noto Sans Gujarati'],
  ['ந', 'Noto Sans Tamil'],
  ['న', 'Noto Sans Telugu'],
  ['ನ', 'Noto Sans Kannada'],
  ['න', 'Noto Sans Sinhala'],
  ['น', 'Noto Sans Thai'],
  ['ណ', 'Noto Sans Khmer'],
  ['န', 'Noto Sans Myanmar'],
  ['ན', 'Noto Serif Tibetan'],
  ['ნ', 'Noto Sans Georgian'],
  ['Ն', 'Noto Sans Armenian'],
  ['ㄴ', 'Noto Sans KR'],
  ['ン', 'Noto Sans JP'],
]

// ---- Look (values from the reference) --------------------------------------
const R = 1.6                  // coin radius
const T = 0.24                 // coin thickness
const SEGMENTS = 160
const SPIN = 0.0011            // rad per ms around y
const WOBBLE_BASE = 0.16       // x tilt
const WOBBLE_AMP = 0.07
const WOBBLE_SPEED = 0.0008
const BOB_AMP = 0.05           // vertical float
const BOB_SPEED = 0.0013
const STILL_ROTATION = { x: 0.15, y: 0.4 } // prefers-reduced-motion: Latin N, slightly angled
const MAX_DPR = 2
// Face textures. The reference paints at 1024; the coin is at most 112 device px here,
// so 512 is plenty. All drawing below uses the reference's 1024-space numbers.
const TEX = 512
const REF = 1024
const K = TEX / REF
const H = REF / 2
// ----------------------------------------------------------------------------

const fontWeight = (family) => (family === 'Sancreek' ? '' : '700 ')

// Font status per glyph: 'loading' | 'ok' | 'failed'. Shared across mounts.
const fontStatus = GLYPHS.map(() => 'loading')
let fontPromises = null

// Each font is subset to its single glyph via Google Fonts' text= parameter.
function loadFonts() {
  if (fontPromises) return fontPromises
  fontPromises = GLYPHS.map(([glyph, family], i) => new Promise((resolve) => {
    const done = (ok) => {
      fontStatus[i] = ok ? 'ok' : 'failed'
      resolve(ok)
    }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}&text=${encodeURIComponent(glyph)}&display=block`
    // load() resolves with the faces it loaded; none means the font isn't there.
    link.onload = () => {
      document.fonts.load(`${fontWeight(family)}100px "${family}"`, glyph)
        .then((faces) => done(faces.length > 0), () => done(false))
    }
    link.onerror = () => done(false)
    document.head.appendChild(link)
  }))
  return fontPromises
}

// Next glyph after `from` whose font loaded, cycling. -1 if none.
function nextLoaded(from) {
  for (let step = 1; step <= GLYPHS.length; step++) {
    const i = (from + step + GLYPHS.length) % GLYPHS.length
    if (fontStatus[i] === 'ok') return i
  }
  return -1
}

function makeCanvas(w, h = w) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

// Brushed-metal background, painted once.
function paintBrushed() {
  const canvas = makeCanvas(TEX)
  const b = canvas.getContext('2d')
  b.setTransform(K, 0, 0, K, 0, 0)
  b.fillStyle = '#5d636c'
  b.fillRect(0, 0, REF, REF)
  for (let i = 0; i < 320; i++) {
    const r = 40 + Math.random() * 456
    b.strokeStyle = `rgba(255,255,255,${0.015 + Math.random() * 0.04})`
    b.lineWidth = 1 + Math.random() * 2.2
    b.beginPath()
    b.arc(H, H, r, 0, Math.PI * 2)
    b.stroke()
  }
  return canvas
}

// Inner ring + glyph, auto-fitted and centered by its real bounding box.
function paintGlyph(ctx, ink, [glyph, family]) {
  ctx.setTransform(K, 0, 0, K, 0, 0)
  ctx.strokeStyle = ink
  ctx.lineWidth = 18
  ctx.beginPath()
  ctx.arc(H, H, 452, 0, Math.PI * 2)
  ctx.stroke()
  if (!glyph) return

  ctx.fillStyle = ink
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  const w8 = fontWeight(family)
  const fam = `"${family}", serif`
  let size = 600
  ctx.font = `${w8}${size}px ${fam}`
  let m = ctx.measureText(glyph)
  const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
  const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight
  if (h > 0 && w > 0) size *= Math.min(540 / h, 580 / w)
  ctx.font = `${w8}${size}px ${fam}`
  m = ctx.measureText(glyph)
  ctx.fillText(
    glyph,
    H + (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2,
    H + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
  )
}

export default function CoinLogo() {
  const hostRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return undefined // no WebGL: the favicon stays
    }

    let disposed = false
    const textures = []
    const track = (t) => (textures.push(t), t)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0, 6.6)

    // Studio environment: hard, narrow emissive strips on black = "bright but dark" chrome.
    const envScene = new THREE.Scene()
    const panel = (w, h, r, g, b, x, y, z) => {
      const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
      mat.color.setRGB(r, g, b) // linear working space, like r128
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat)
      mesh.position.set(x, y, z)
      mesh.lookAt(0, 0, 0)
      envScene.add(mesh)
    }
    panel(9, 0.35, 4, 4, 4, 0, 4.5, 2.5)
    panel(0.3, 9, 3.5, 3.5, 3.5, -5, 0, 1.5)
    panel(0.25, 9, 0.8, 1.3, 4, 5, 0, -1)
    panel(7, 0.2, 2.5, 2.5, 2.5, 0, -4.5, -2.5)
    panel(0.2, 6, 2, 2, 2, 2, 0, 5)
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTarget = pmrem.fromScene(envScene, 0.02)
    scene.environment = envTarget.texture

    const brushed = paintBrushed()
    const anisotropy = renderer.capabilities.getMaxAnisotropy()

    // One face = color canvas (brushed field, white glyph; also the bump source)
    // + roughness canvas (glyph polished).
    function makeFace() {
      const cc = makeCanvas(TEX)
      const cr = makeCanvas(TEX)
      const colorTex = track(new THREE.CanvasTexture(cc))
      colorTex.colorSpace = THREE.SRGBColorSpace
      const bumpTex = track(new THREE.CanvasTexture(cc)) // raw values, as in r128
      const roughTex = track(new THREE.CanvasTexture(cr))
      for (const t of [colorTex, bumpTex, roughTex]) t.anisotropy = anisotropy
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        map: colorTex,
        metalness: 1,
        roughness: 1,
        roughnessMap: roughTex,
        bumpMap: bumpTex,
        bumpScale: 2,
        clearcoat: 0.5,
        clearcoatRoughness: 0.15,
      })
      const face = { mat, glyph: -1 }
      // i = -1 paints the blank face (brushed field + ring).
      face.set = (i) => {
        const entry = i >= 0 ? GLYPHS[i] : ['', '']
        const a = cc.getContext('2d')
        a.setTransform(1, 0, 0, 1, 0, 0)
        a.drawImage(brushed, 0, 0)
        paintGlyph(a, '#ffffff', entry)
        const b = cr.getContext('2d')
        b.setTransform(1, 0, 0, 1, 0, 0)
        b.fillStyle = '#5c5c5c'
        b.fillRect(0, 0, TEX, TEX)
        paintGlyph(b, '#141414', entry)
        colorTex.needsUpdate = true
        bumpTex.needsUpdate = true
        roughTex.needsUpdate = true
        face.glyph = i
      }
      face.set(-1)
      return face
    }
    const front = makeFace()
    const back = makeFace()

    // Reeded edge.
    const reed = makeCanvas(1024, 4)
    const sc = reed.getContext('2d')
    for (let i = 0; i < 1024; i++) {
      const v = i % 8 < 4 ? 200 : 90
      sc.fillStyle = `rgb(${v},${v},${v})`
      sc.fillRect(i, 0, 1, 4)
    }
    const linear = (hex) => new THREE.Color().setHex(hex, THREE.LinearSRGBColorSpace)
    const sideMat = new THREE.MeshPhysicalMaterial({
      color: linear(0xc4cad3),
      metalness: 1,
      roughness: 0.22,
      bumpMap: track(new THREE.CanvasTexture(reed)),
      bumpScale: 1.5,
    })
    const rimMat = new THREE.MeshPhysicalMaterial({ color: linear(0xe6eaf0), metalness: 1, roughness: 0.1 })

    const coin = new THREE.Group()
    const side = new THREE.Mesh(new THREE.CylinderGeometry(R, R, T, SEGMENTS, 1, true), sideMat)
    side.rotation.x = Math.PI / 2
    coin.add(side)
    const frontMesh = new THREE.Mesh(new THREE.CircleGeometry(R - 0.02, SEGMENTS), front.mat)
    frontMesh.position.z = T / 2
    coin.add(frontMesh)
    const backMesh = new THREE.Mesh(new THREE.CircleGeometry(R - 0.02, SEGMENTS), back.mat)
    backMesh.position.z = -T / 2
    backMesh.rotation.y = Math.PI
    coin.add(backMesh)
    for (const z of [T / 2, -T / 2]) {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(R - 0.07, 0.075, 20, SEGMENTS), rimMat)
      rim.position.z = z
      coin.add(rim)
    }
    scene.add(coin)

    // ---- Sizing: CSS size × devicePixelRatio (capped) ----
    function resize() {
      const size = host.clientWidth
      if (!size) return
      renderer.setSize(size, size, false)
      if (reduce) render()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    resize()

    // ---- Glyph swap: when a face turns away, paint the next glyph onto it while hidden ----
    let frontVisible = true
    const nrm = new THREE.Vector3()
    const toCam = new THREE.Vector3()

    function render() {
      renderer.render(scene, camera)
    }

    function pose(elapsed) {
      if (reduce) {
        coin.rotation.set(STILL_ROTATION.x, STILL_ROTATION.y, 0)
      } else {
        coin.rotation.y = elapsed * SPIN
        coin.rotation.x = WOBBLE_BASE + Math.sin(elapsed * WOBBLE_SPEED) * WOBBLE_AMP
        coin.position.y = Math.sin(elapsed * BOB_SPEED) * BOB_AMP
      }
      coin.updateMatrixWorld()
      nrm.set(0, 0, 1).applyQuaternion(coin.quaternion)
      toCam.copy(camera.position).sub(coin.position)
      const fv = nrm.dot(toCam) > 0
      if (fv !== frontVisible) {
        frontVisible = fv
        const shown = fv ? front : back
        const hidden = fv ? back : front
        if (shown.glyph >= 0) {
          const next = nextLoaded(shown.glyph)
          if (next >= 0) hidden.set(next)
        }
      }
    }

    // First paint: Latin N on the visible face, ና on the hidden one. A glyph whose font
    // failed is skipped. Until then the favicon stays on top.
    const fonts = loadFonts()
    Promise.allSettled([fonts[0], fonts[1]]).then(() => {
      if (disposed) return
      const first = nextLoaded(-1)
      if (first < 0) return // nothing loaded: keep the favicon
      const shown = frontVisible ? front : back
      const hidden = frontVisible ? back : front
      shown.set(first)
      const second = nextLoaded(first)
      if (second >= 0) hidden.set(second)
      if (reduce) render()
      setReady(true)
    })

    // ---- Loop: runs only while the tab is visible and the coin is on screen.
    // Time resumes where it stopped, so the coin never jumps. ----
    let frame = 0
    let running = false
    let onScreen = true
    let elapsed = 0
    let last = null
    function tick(now) {
      if (last !== null) elapsed += Math.min(now - last, 100)
      last = now
      pose(elapsed)
      render()
      frame = requestAnimationFrame(tick)
    }
    function updateLoop() {
      const shouldRun = !reduce && onScreen && !document.hidden
      if (shouldRun && !running) {
        last = null
        frame = requestAnimationFrame(tick)
      } else if (!shouldRun && running) {
        cancelAnimationFrame(frame)
      }
      running = shouldRun
    }
    const screenObserver = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1].isIntersecting
      updateLoop()
    })

    if (reduce) {
      pose(0)
      render()
    } else {
      screenObserver.observe(host)
      document.addEventListener('visibilitychange', updateLoop)
      updateLoop()
    }

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', updateLoop)
      screenObserver.disconnect()
      resizeObserver.disconnect()
      for (const root of [scene, envScene]) {
        root.traverse((obj) => {
          if (!obj.isMesh) return
          obj.geometry.dispose()
          obj.material.dispose()
        })
      }
      textures.forEach((t) => t.dispose())
      envTarget.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <span ref={hostRef} className={ready ? 'coin coin--ready' : 'coin'}>
      {!ready && <img className="coin__fallback" src="/favicon.svg" alt="" />}
    </span>
  )
}
