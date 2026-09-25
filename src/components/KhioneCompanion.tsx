import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const MODEL_URL = '/models/khione.glb'
const SIZE = 180

const lines = [
  'Meow! Thanks for visiting.',
  'Mrrp! Have you tried the riddles yet?',
  'Purr... come find me on the islands.',
  'Oreo says hi too!',
]

/** Tail wave: a yaw swing that fades in and out over WAVE_S seconds */
const WAVE_S = 1.8
const WAVE_AMP = 0.7
const WAVE_FREQ = 9

/**
 * Khione, rendered from the same CC0 Quaternius cat model the game uses.
 * Idles on her own; clicking her waves her tail and she says something.
 */
export default function KhioneCompanion() {
  const mountRef = useRef<HTMLDivElement>(null)
  const waveStart = useRef<number | null>(null)
  const [lineIndex, setLineIndex] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const bubbleTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(SIZE, SIZE)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100)
    scene.add(new THREE.HemisphereLight(0xfff4e6, 0x3a3346, 2.2))
    const sun = new THREE.DirectionalLight(0xffffff, 2.4)
    sun.position.set(2, 4, 3)
    scene.add(sun)

    let mixer: THREE.AnimationMixer | null = null
    let model: THREE.Object3D | null = null
    let tail: THREE.Bone | null = null
    let tailEnd: THREE.Bone | null = null
    let head: THREE.Bone | null = null
    let baseY = 0
    let hopHeight = 0
    let disposed = false

    new GLTFLoader().load(MODEL_URL, (gltf) => {
      if (disposed) return
      model = gltf.scene
      // Three-quarter view so both her face and tail read at a glance
      model.rotation.y = 0.6
      scene.add(model)

      // Frame her regardless of the rig's export scale
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      const radius = Math.max(size.x, size.y, size.z) * 0.5
      const dist = radius / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      camera.position.set(center.x, center.y + size.y * 0.25, center.z + dist)
      camera.near = dist / 100
      camera.far = dist * 10
      camera.updateProjectionMatrix()
      camera.lookAt(center)
      baseY = model.position.y
      hopHeight = size.y * 0.08

      model.traverse((o) => {
        if ((o as THREE.Bone).isBone) {
          if (o.name === 'Tail') tail = o as THREE.Bone
          if (o.name === 'Tail_end') tailEnd = o as THREE.Bone
          if (o.name === 'Head') head = o as THREE.Bone
        }
      })

      mixer = new THREE.AnimationMixer(model)
      const idle = gltf.animations.find((a) => a.name.endsWith('|Idle'))
      if (idle) mixer.clipAction(idle).play()
      setLoaded(true)
    })

    // Her tail stands upright, so a side-to-side wave swings it about her
    // body's tail-to-head axis. That axis is measured from the bones (not
    // assumed) and re-expressed in each bone's parent frame, so the wave is
    // right whatever axes the rig was exported with.
    const q = new THREE.Quaternion()
    const parentQ = new THREE.Quaternion()
    const bodyAxis = new THREE.Vector3()
    const headPos = new THREE.Vector3()
    const axis = new THREE.Vector3()
    const measureBodyAxis = () => {
      if (!head || !tail) return false
      head.getWorldPosition(headPos)
      tail.getWorldPosition(bodyAxis)
      bodyAxis.subVectors(headPos, bodyAxis).setY(0)
      return bodyAxis.lengthSq() > 1e-8 && !!bodyAxis.normalize()
    }
    const wag = (bone: THREE.Bone, angle: number) => {
      bone.parent?.getWorldQuaternion(parentQ)
      axis.copy(bodyAxis).applyQuaternion(parentQ.invert())
      bone.quaternion.premultiply(q.setFromAxisAngle(axis, angle))
    }

    const clock = new THREE.Clock()
    let raf = 0
    let visible = true
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      const dt = Math.min(clock.getDelta(), 0.05)
      mixer?.update(dt)

      if (model && waveStart.current !== null) {
        const t = (performance.now() - waveStart.current) / 1000
        if (t >= WAVE_S) {
          waveStart.current = null
          model.position.y = baseY
        } else {
          const envelope = Math.sin((t / WAVE_S) * Math.PI)
          model.updateMatrixWorld(true)
          if (measureBodyAxis()) {
            if (tail) wag(tail, WAVE_AMP * envelope * Math.sin(t * WAVE_FREQ))
            if (tailEnd) {
              tail?.updateMatrixWorld(true)
              wag(tailEnd, WAVE_AMP * 0.8 * envelope * Math.sin(t * WAVE_FREQ - 1.1))
            }
          }
          // Little happy hop at the start of the wave
          model.position.y = baseY + Math.sin(Math.min(t / 0.35, 1) * Math.PI) * hopHeight
        }
      }
      renderer.render(scene, camera)
    }
    tick()

    // Don't burn GPU while she's scrolled out of view
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) clock.getDelta()
    })
    io.observe(mount)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io.disconnect()
      renderer.dispose()
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (mesh.isMesh) {
          mesh.geometry.dispose()
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach((m) => {
            ;(m as THREE.MeshStandardMaterial).map?.dispose()
            m.dispose()
          })
        }
      })
      mount.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => () => clearTimeout(bubbleTimer.current), [])

  const onClick = () => {
    waveStart.current = performance.now()
    setLineIndex((i) => (i === null ? 0 : (i + 1) % lines.length))
    clearTimeout(bubbleTimer.current)
    bubbleTimer.current = setTimeout(() => setLineIndex(null), 2600)
  }

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {lineIndex !== null && (
          <motion.div
            key={lineIndex}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute -top-3 z-10 -translate-y-full whitespace-nowrap rounded-2xl bg-parchment px-4 py-2 text-sm text-ink shadow-lg shadow-black/30"
            role="status"
          >
            {lines[lineIndex]}
            <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-parchment" />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onClick}
        aria-label="Say hi to Khione"
        className="group relative cursor-pointer rounded-full transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gilt"
        style={{ width: SIZE, height: SIZE }}
      >
        <span className="absolute inset-x-6 bottom-5 h-4 rounded-[50%] bg-black/40 blur-md" aria-hidden="true" />
        <div ref={mountRef} className="relative" style={{ width: SIZE, height: SIZE }} />
      </button>

      <span
        className={`mt-1 text-[10px] uppercase tracking-[0.25em] text-parchment/50 transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Khione · click to say hi
      </span>
    </div>
  )
}
