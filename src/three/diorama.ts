import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

/**
 * The hero diorama: a white board with the old home, a storage vault and the new home, joined by a
 * road. As the visitor scrolls, a branded van loads six boxes, drives to the vault (two go into
 * storage), then delivers the other four. Loaded lazily by `Journey`.
 */

export type DioramaLayout = 'side' | 'stacked'

export interface Diorama {
  /** Scroll progress through the journey section, 0–1. */
  setProgress(progress: number): void
  /** Pointer position over the stage in -1…1 on both axes (mouse parallax). */
  setPointer(x: number, y: number): void
  /** 'side' leaves room for copy on the left; 'stacked' for copy below (phones). */
  setLayout(layout: DioramaLayout): void
  resize(width: number, height: number): void
  /** Pause rendering while the stage is off screen. */
  setActive(active: boolean): void
  /** Hover test: updates the cursor and returns true over the van. */
  pick(clientX: number, clientY: number): boolean
  /** Click/tap test: makes the van hop and flash its lights. Returns true when it was hit. */
  tap(clientX: number, clientY: number): boolean
  dispose(): void
}

export interface DioramaOptions {
  canvas: HTMLCanvasElement
  /** Few CPU cores or little memory: no shadows, no antialiasing, lower pixel ratio. */
  lowTier: boolean
  /** Touch device: smaller shadow maps and an idle camera sway instead of mouse parallax. */
  coarsePointer: boolean
}

const COLORS = {
  navy: 0x0a1c2e,
  blue: 0x1f6fb2,
  glow: 0x6fb1e8,
  white: 0xffffff,
  wall: 0xf4f7fb,
  road: 0xe2e9f2,
  kraft: 0xd9b48a,
  tape: 0xb88a58,
  steel: 0xcfd8e2,
  glass: 0x1a3450,
  tyre: 0x17212c,
  hedge: 0xbfdcc8,
  trunk: 0xc9b9a6,
  tail: 0xe0533d,
}

const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
/** Linear 0–1 position of `x` within [from, to]. */
const remap01 = (x: number, from: number, to: number) => clamp01((x - from) / (to - from))
const smoothstep = (x: number) => x * x * (3 - 2 * x)
/** Smoothstepped 0–1 position of `x` within [from, to]. */
const smooth = (x: number, from: number, to: number) => smoothstep(remap01(x, from, to))
const easeOutBack = (x: number) => {
  const s = 1.4
  return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2
}
/** Frame-rate independent exponential approach towards `target`. */
const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt))

function quadraticBezier(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, t: number, out: THREE.Vector3) {
  const u = 1 - t
  return out.set(
    u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
    u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z,
  )
}

interface LabelLine {
  text: string
  size: number
  weight: number
  color: string
}

/** Draws lines of text on a canvas, left-aligned and vertically centred, as a texture. */
function makeLabelTexture(lines: LabelLine[], width: number, height: number, background: string) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = background
  ctx.fillRect(0, 0, width, height)
  let y = (height - lines.reduce((sum, line) => sum + line.size * 1.1, 0)) / 2
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  for (const line of lines) {
    ctx.fillStyle = line.color
    ctx.font = `${line.weight} ${line.size}px "Archivo Variable", Archivo, "Helvetica Neue", Arial, sans-serif`
    ctx.fillText(line.text, width * 0.07, y)
    y += line.size * 1.1
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

type CameraKey = { p: number } & (
  | { pos: THREE.Vector3; look: THREE.Vector3 }
  | { follow: { off: THREE.Vector3; look: THREE.Vector3 } }
)

export async function createDiorama({ canvas, lowTier, coarsePointer }: DioramaOptions): Promise<Diorama> {
  // Give the display font a moment to load so the van livery and the vault sign use Archivo.
  try {
    await Promise.race([
      document.fonts.load('800 64px "Archivo Variable"').then(() => document.fonts.load('800 64px Archivo')),
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ])
  } catch {
    // Font loading API unavailable: the canvas falls back to system fonts.
  }

  // Renderer, environment, camera and lights
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowTier, alpha: true, powerPreference: 'high-performance' })
  const maxPixelRatio = lowTier ? 1.25 : coarsePointer ? 1.5 : 1.75
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.enabled = !lowTier
  // PCF with a shadow radius for soft edges (three r186 has no separate PCFSoftShadowMap).
  renderer.shadowMap.type = THREE.PCFShadowMap

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const envMap = pmrem.fromScene(room, 0.04).texture
  room.dispose()
  scene.environment = envMap
  scene.environmentIntensity = 0.55

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 140)
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9e3ef, 1.35))

  const sun = new THREE.DirectionalLight(0xffffff, 2.1)
  sun.position.set(5, 11, 7)
  sun.castShadow = !lowTier
  const shadowMapSize = coarsePointer ? 1024 : 2048
  sun.shadow.mapSize.set(shadowMapSize, shadowMapSize)
  sun.shadow.camera.left = -10
  sun.shadow.camera.right = 10
  sun.shadow.camera.top = 8
  sun.shadow.camera.bottom = -8
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 30
  sun.shadow.bias = -4e-4
  sun.shadow.normalBias = 0.02
  sun.shadow.radius = 4
  scene.add(sun)

  // Materials and small helpers
  const materials: THREE.Material[] = []
  const standard = (color: number, params: THREE.MeshStandardMaterialParameters = {}) => {
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0, ...params })
    materials.push(material)
    return material
  }
  const makeMesh = (geometry: THREE.BufferGeometry, material: THREE.Material, castShadow = true, receiveShadow = true) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = castShadow && !lowTier
    mesh.receiveShadow = receiveShadow && !lowTier
    return mesh
  }
  const roundedBox = (width: number, height: number, depth: number, radius = 0.08, segments = 3) =>
    new RoundedBoxGeometry(width, height, depth, segments, radius)

  const mat = {
    white: standard(COLORS.white, { roughness: 0.9 }),
    wall: standard(COLORS.wall, { roughness: 0.75 }),
    navy: standard(COLORS.navy, { roughness: 0.45, metalness: 0.1 }),
    navyMatte: standard(COLORS.navy, { roughness: 0.7 }),
    blue: standard(COLORS.blue, { roughness: 0.5 }),
    road: standard(COLORS.road, { roughness: 1 }),
    kraft: standard(COLORS.kraft, { roughness: 0.85 }),
    tape: standard(COLORS.tape, { roughness: 0.6 }),
    steel: standard(COLORS.steel, { roughness: 0.32, metalness: 0.75 }),
    glass: standard(COLORS.glass, { roughness: 0.15, metalness: 0.3 }),
    tyre: standard(COLORS.tyre, { roughness: 0.9 }),
    hedge: standard(COLORS.hedge, { roughness: 0.95 }),
    trunk: standard(COLORS.trunk, { roughness: 0.9 }),
    route: new THREE.MeshStandardMaterial({ color: COLORS.blue, emissive: COLORS.blue, emissiveIntensity: 0.55, roughness: 0.4 }),
    head: new THREE.MeshStandardMaterial({ color: 0xfff6dd, emissive: 0xfff1c8, emissiveIntensity: 0.6 }),
    tail: new THREE.MeshStandardMaterial({ color: COLORS.tail, emissive: COLORS.tail, emissiveIntensity: 0.35 }),
    dark: new THREE.MeshBasicMaterial({ color: 0x06111c }),
  }
  materials.push(mat.route, mat.head, mat.tail, mat.dark)

  const world = new THREE.Group()
  scene.add(world)

  // Board: a white rounded slab with a thin blue edge, and a soft shadow underneath
  const board = makeMesh(roundedBox(13.2, 0.6, 8.8, 0.3, 4), mat.white, false, true)
  board.position.y = -0.3
  world.add(board)
  const boardEdge = makeMesh(roundedBox(13.3, 0.08, 8.9, 0.04, 2), mat.blue, false, false)
  boardEdge.position.y = -0.62
  world.add(boardEdge)
  {
    const shadowCanvas = document.createElement('canvas')
    shadowCanvas.width = shadowCanvas.height = 256
    const ctx = shadowCanvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 128)
    gradient.addColorStop(0, 'rgba(10,28,46,0.22)')
    gradient.addColorStop(1, 'rgba(10,28,46,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
    const shadowMaterial = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false })
    materials.push(shadowMaterial)
    const boardShadow = new THREE.Mesh(new THREE.PlaneGeometry(21, 14), shadowMaterial)
    boardShadow.rotation.x = -Math.PI / 2
    boardShadow.position.y = -1.9
    world.add(boardShadow)
  }

  // Road, and the blue route line that draws in behind the van
  const routeCurve = new THREE.CatmullRomCurve3(
    [v3(-3.3, 0, 1.25), v3(-1.7, 0, 1.7), v3(0.2, 0, 2.15), v3(2.1, 0, 2.1), v3(3.5, 0, 2), v3(4.45, 0, 1.55), v3(4.65, 0, 0.95)],
    false,
    'centripetal',
  )
  const routeLength = routeCurve.getLength()
  const road = makeMesh(new THREE.TubeGeometry(routeCurve, 160, 0.42, 10, false), mat.road, false, true)
  road.scale.y = 0.04 // flatten the tube into a ribbon
  road.position.y = 0.005
  world.add(road)
  const ROUTE_SEGMENTS = 260
  const ROUTE_RADIAL_SEGMENTS = 8
  const routeLine = makeMesh(new THREE.TubeGeometry(routeCurve, ROUTE_SEGMENTS, 0.055, ROUTE_RADIAL_SEGMENTS, false), mat.route, false, false)
  routeLine.position.y = 0.06
  routeLine.geometry.setDrawRange(0, 0)
  world.add(routeLine)

  // Pulsing ring that marks the destination: shown before the move starts and again on arrival
  const pulseMaterial = new THREE.MeshBasicMaterial({ color: COLORS.glow, transparent: true, opacity: 0.6, depthWrite: false })
  materials.push(pulseMaterial)
  const pulse = new THREE.Mesh(new THREE.RingGeometry(0.32, 0.4, 48), pulseMaterial)
  pulse.rotation.x = -Math.PI / 2
  pulse.position.set(4.7, 0.02, -0.72)
  world.add(pulse)

  // Houses
  const makeHouse = (x: number, z: number, roofMaterial: THREE.Material) => {
    const house = new THREE.Group()
    house.position.set(x, 0, z)
    const walls = makeMesh(roundedBox(2, 1.5, 1.7, 0.08), mat.wall)
    walls.position.y = 0.75
    house.add(walls)
    const roofShape = new THREE.Shape()
    roofShape.moveTo(-1.18, 0)
    roofShape.lineTo(1.18, 0)
    roofShape.lineTo(0, 0.95)
    roofShape.closePath()
    const roofGeometry = new THREE.ExtrudeGeometry(roofShape, { depth: 1.92, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 })
    roofGeometry.translate(0, 0, -0.96)
    const roof = makeMesh(roofGeometry, roofMaterial)
    roof.position.y = 1.48
    house.add(roof)
    const chimney = makeMesh(roundedBox(0.26, 0.6, 0.26, 0.04), mat.wall)
    chimney.position.set(0.55, 2.05, -0.2)
    house.add(chimney)
    const door = makeMesh(roundedBox(0.46, 0.8, 0.08, 0.03), mat.navyMatte)
    door.position.set(0, 0.4, 0.86)
    house.add(door)
    const knob = makeMesh(new THREE.SphereGeometry(0.03, 10, 8), mat.steel, false, false)
    knob.position.set(0.14, 0.4, 0.91)
    house.add(knob)
    // Each house gets its own window material so its lights can switch on and off.
    const windows = new THREE.MeshStandardMaterial({ color: 0x9fc6ea, emissive: 0xffe7b0, emissiveIntensity: 0, roughness: 0.2 })
    materials.push(windows)
    for (const wx of [-0.58, 0.58]) {
      const pane = makeMesh(roundedBox(0.42, 0.42, 0.06, 0.03), windows, false, false)
      pane.position.set(wx, 0.98, 0.86)
      house.add(pane)
      const sill = makeMesh(roundedBox(0.5, 0.05, 0.12, 0.02), mat.white, false, false)
      sill.position.set(wx, 0.75, 0.88)
      house.add(sill)
    }
    const doorstep = makeMesh(roundedBox(0.7, 0.08, 0.36, 0.03), mat.white)
    doorstep.position.set(0, 0.04, 1.02)
    house.add(doorstep)
    world.add(house)
    return { group: house, windows }
  }
  const oldHome = makeHouse(-4.5, -1.85, mat.blue)
  const newHome = makeHouse(4.7, -2.1, mat.navy)

  // Trees and hedges: [x, z, size, has a trunk]
  const bushGeometry = new THREE.IcosahedronGeometry(1, 2)
  const trunkGeometry = new THREE.CylinderGeometry(0.06, 0.08, 1, 8)
  const plants: [number, number, number, boolean][] = [
    [-6, -3.1, 0.5, true],
    [-2.75, -2.9, 0.42, true],
    [-2.3, -2.35, 0.3, false],
    [2.85, -3, 0.46, true],
    [6.05, -2.9, 0.4, true],
    [-2, 3.6, 0.3, false],
    [1.4, 3.7, 0.34, false],
    [6.1, 3.7, 0.3, false],
    [-5.9, 3.5, 0.38, true],
    [3.6, 3.75, 0.26, false],
  ]
  for (const [x, z, size, isTree] of plants) {
    const bush = makeMesh(bushGeometry, mat.hedge)
    if (isTree) {
      const trunk = makeMesh(trunkGeometry, mat.trunk)
      trunk.scale.y = 0.55
      trunk.position.set(x, 0.27, z)
      world.add(trunk)
      bush.scale.set(size, size * 1.15, size)
      bush.position.set(x, 0.5 + size, z)
    } else {
      bush.scale.set(size * 1.3, size * 0.85, size * 1.1)
      bush.position.set(x, size * 0.6, z)
    }
    world.add(bush)
  }

  // Storage vault
  const vault = new THREE.Group()
  vault.position.set(0.05, 0, -1.5)
  world.add(vault)
  {
    const body = makeMesh(roundedBox(2.5, 1.95, 1.8, 0.16, 4), mat.navy)
    body.position.y = 0.975
    vault.add(body)
    const plinth = makeMesh(roundedBox(2.7, 0.12, 2, 0.05), mat.wall)
    plinth.position.y = 0.06
    vault.add(plinth)
    const opening = new THREE.Mesh(new THREE.CircleGeometry(0.66, 48), mat.dark)
    opening.position.set(0, 0.98, 0.905)
    vault.add(opening)
    const frame = makeMesh(new THREE.TorusGeometry(0.72, 0.055, 12, 64), mat.steel, true, false)
    frame.position.set(0, 0.98, 0.91)
    vault.add(frame)
    const signMaterial = new THREE.MeshStandardMaterial({
      map: makeLabelTexture([{ text: 'SECURE STORAGE', size: 46, weight: 800, color: '#F7F9FC' }], 512, 96, '#1F6FB2'),
      roughness: 0.5,
    })
    materials.push(signMaterial)
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.28), signMaterial)
    sign.position.set(0, 1.78, 0.905)
    vault.add(sign)
  }
  // The round door swings on a hinge at its left edge; the wheel spins to unlock it.
  const vaultDoor = new THREE.Group()
  vaultDoor.position.set(-0.68, 0.98, 0.93)
  vault.add(vaultDoor)
  const vaultWheel = new THREE.Group()
  {
    const disc = makeMesh(new THREE.CylinderGeometry(0.66, 0.66, 0.14, 56), mat.steel)
    disc.rotation.x = Math.PI / 2
    disc.position.set(0.68, 0, 0.05)
    vaultDoor.add(disc)
    vaultWheel.position.set(0.68, 0, 0.14)
    vaultWheel.add(makeMesh(new THREE.TorusGeometry(0.24, 0.035, 10, 40), mat.navy, false, false))
    for (let i = 0; i < 3; i++) {
      const spoke = makeMesh(new THREE.CylinderGeometry(0.025, 0.025, 0.48, 8), mat.navy, false, false)
      spoke.rotation.z = (i * Math.PI) / 3
      vaultWheel.add(spoke)
    }
    const hub = makeMesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 20), mat.blue, false, false)
    hub.rotation.x = Math.PI / 2
    vaultWheel.add(hub)
    vaultDoor.add(vaultWheel)
  }

  // Van: `van` follows the route; `vanBody` bounces and tilts on top of the wheels.
  const van = new THREE.Group()
  const vanBody = new THREE.Group()
  van.add(vanBody)
  world.add(van)
  const VAN_REAR = -1.5
  {
    const cargoBox = makeMesh(roundedBox(1.95, 1.22, 1.12, 0.1, 4), mat.navy)
    cargoBox.position.set(-0.52, 0.86, 0)
    vanBody.add(cargoBox)
    const cab = makeMesh(roundedBox(0.95, 0.94, 1.08, 0.13, 4), mat.white)
    cab.position.set(0.86, 0.72, 0)
    vanBody.add(cab)
    const bonnet = makeMesh(roundedBox(0.5, 0.52, 1.04, 0.12, 3), mat.white)
    bonnet.position.set(1.43, 0.5, 0)
    vanBody.add(bonnet)
    const windscreen = makeMesh(roundedBox(0.05, 0.4, 0.86, 0.02), mat.glass, false, false)
    windscreen.position.set(1.32, 0.95, 0)
    windscreen.rotation.z = -0.18
    vanBody.add(windscreen)
    for (const side of [1, -1]) {
      const sideWindow = makeMesh(roundedBox(0.5, 0.34, 0.03, 0.02), mat.glass, false, false)
      sideWindow.position.set(0.92, 0.96, 0.545 * side)
      vanBody.add(sideWindow)
    }
    const stripe = makeMesh(roundedBox(3.06, 0.08, 1.135, 0.03), mat.blue, false, false)
    stripe.position.set(0.02, 0.5, 0)
    vanBody.add(stripe)
    const frontBumper = makeMesh(roundedBox(0.12, 0.16, 1.08, 0.04), mat.navyMatte)
    frontBumper.position.set(1.68, 0.3, 0)
    vanBody.add(frontBumper)
    const rearBumper = makeMesh(roundedBox(0.1, 0.14, 1.1, 0.04), mat.navyMatte)
    rearBumper.position.set(VAN_REAR - 0.02, 0.3, 0)
    vanBody.add(rearBumper)
    for (const side of [1, -1]) {
      const headlight = new THREE.Mesh(roundedBox(0.04, 0.12, 0.2, 0.02), mat.head)
      headlight.position.set(1.69, 0.56, 0.34 * side)
      vanBody.add(headlight)
      const taillight = new THREE.Mesh(roundedBox(0.03, 0.2, 0.08, 0.01), mat.tail)
      taillight.position.set(VAN_REAR - 0.005, 0.75, 0.5 * side)
      vanBody.add(taillight)
    }
    const liveryMaterial = new THREE.MeshStandardMaterial({
      map: makeLabelTexture(
        [
          { text: 'SMOOTH VAULT', size: 84, weight: 800, color: '#F7F9FC' },
          { text: 'MOVES · DOOR TO DOOR', size: 38, weight: 600, color: '#6FB1E8' },
        ],
        1024,
        256,
        '#0A1C2E',
      ),
      roughness: 0.45,
      metalness: 0.1,
    })
    materials.push(liveryMaterial)
    for (const side of [1, -1]) {
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 0.43), liveryMaterial)
      panel.position.set(-0.52, 1, 0.563 * side)
      if (side < 0) panel.rotation.y = Math.PI
      vanBody.add(panel)
    }
  }

  // Rear doors, hinged at the back corners of the cargo box
  const rearDoorNear = new THREE.Group()
  const rearDoorFar = new THREE.Group()
  {
    rearDoorNear.position.set(VAN_REAR, 0.86, 0.55)
    rearDoorFar.position.set(VAN_REAR, 0.86, -0.55)
    const nearPanel = makeMesh(roundedBox(0.05, 1.14, 0.54, 0.02), mat.navy)
    nearPanel.position.set(-0.01, 0, -0.27)
    rearDoorNear.add(nearPanel)
    const farPanel = makeMesh(roundedBox(0.05, 1.14, 0.54, 0.02), mat.navy)
    farPanel.position.set(-0.01, 0, 0.27)
    rearDoorFar.add(farPanel)
    const nearStripe = makeMesh(roundedBox(0.055, 0.06, 0.54, 0.01), mat.blue, false, false)
    nearStripe.position.set(-0.012, -0.36, -0.27)
    rearDoorNear.add(nearStripe)
    const farStripe = makeMesh(roundedBox(0.055, 0.06, 0.54, 0.01), mat.blue, false, false)
    farStripe.position.set(-0.012, -0.36, 0.27)
    rearDoorFar.add(farStripe)
    vanBody.add(rearDoorNear, rearDoorFar)
  }
  const cargoInterior = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.05), mat.dark)
  cargoInterior.rotation.y = -Math.PI / 2
  cargoInterior.position.set(VAN_REAR + 0.06, 0.86, 0)
  vanBody.add(cargoInterior)

  const wheels: THREE.Group[] = []
  {
    const tyreGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 28)
    const hubGeometry = new THREE.CylinderGeometry(0.13, 0.13, 0.21, 20)
    for (const x of [-1, 1.15]) {
      for (const side of [1, -1]) {
        const wheel = new THREE.Group()
        wheel.position.set(x, 0.25, 0.5 * side)
        const tyre = makeMesh(tyreGeometry, mat.tyre)
        tyre.rotation.x = Math.PI / 2
        const hub = makeMesh(hubGeometry, mat.steel, false, false)
        hub.rotation.x = Math.PI / 2
        wheel.add(tyre, hub)
        van.add(wheel)
        wheels.push(wheel)
      }
    }
  }

  // Six taped boxes
  const boxGeometry = roundedBox(0.46, 0.38, 0.46, 0.035)
  const tapeGeometry = roundedBox(0.47, 0.014, 0.09, 0.005, 1)
  const boxes: THREE.Group[] = []
  for (let i = 0; i < 6; i++) {
    const box = new THREE.Group()
    const carton = makeMesh(boxGeometry, mat.kraft)
    const tape = makeMesh(tapeGeometry, mat.tape, false, false)
    tape.position.y = 0.193
    box.add(carton, tape)
    world.add(box)
    boxes.push(box)
  }
  // Each box starts in a stack outside the old home, rides in a slot in the van, then is dropped off:
  // boxes 0–1 go into the vault, boxes 2–5 to the new home.
  const boxStart = [v3(-5.8, 0.19, 0.75), v3(-5.28, 0.19, 0.8), v3(-5.78, 0.19, 1.26), v3(-5.26, 0.19, 1.3), v3(-5.53, 0.57, 0.8), v3(-5.5, 0.57, 1.27)]
  const boxStartAngle = [0.08, -0.12, 0.05, 0.14, -0.2, 0.22]
  const boxSlot = [v3(-0.1, 0.47, -0.26), v3(-0.1, 0.47, 0.26), v3(-0.6, 0.47, -0.26), v3(-0.6, 0.47, 0.26), v3(-1.1, 0.47, -0.26), v3(-1.1, 0.47, 0.26)]
  const vaultDrop = [v3(-0.35, 0.45, 0), v3(0.35, 0.45, -0.1)].map((p) => p.add(vault.position))
  const homeDrop = [v3(5.35, 0.19, 2.1), v3(5.87, 0.19, 2.15), v3(5.4, 0.19, 2.6), v3(5.62, 0.57, 2.35)]

  // Route position (0–1) where the van's rear doors line up with the vault.
  const vaultStop = (() => {
    let best = 0
    let bestDistance = Infinity
    const target = new THREE.Vector3(vault.position.x - VAN_REAR + 0.55, 0, 0)
    for (let i = 0; i <= 400; i++) {
      const t = i / 400
      const point = routeCurve.getPointAt(t)
      const distance = Math.abs(point.x - target.x)
      if (point.z > 1 && distance < bestDistance) {
        bestDistance = distance
        best = t
      }
    }
    return best
  })()

  // Animation state
  let targetProgress = 0
  let progress = 0
  let lastRouteT = 0
  let layout: DioramaLayout = 'side'
  let width = 1
  let height = 1
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  let active = true
  let frameId = 0
  let lastTime = performance.now()
  const startTime = lastTime
  let hop = 1 // 0→1 after a tap; 1 means idle
  let hovering = false
  const slotPoint = new THREE.Vector3()
  const doorPoint = new THREE.Vector3()
  const arcControl = new THREE.Vector3()
  const lookTarget = new THREE.Vector3()
  const cameraTarget = new THREE.Vector3()
  const cameraPosition = new THREE.Vector3(0.3, 10.9, 23.4)
  const cameraLook = new THREE.Vector3(0, 0.2, 0.4)
  let firstFrame = true

  // Camera keyframes along scroll progress. `follow` keys track the van.
  const sideStart: CameraKey = { p: 0, pos: v3(0.3, 10.9, 23.4), look: v3(0.15, 0.3, 0.4) }
  const sideKeys: CameraKey[] = [
    sideStart,
    { ...sideStart, p: 0.05 },
    { p: 0.18, pos: v3(-10.6, 6.2, 12.6), look: v3(-4.9, 0.6, 0.9) },
    { p: 0.29, pos: v3(-10.2, 6.3, 13), look: v3(-4.6, 0.6, 1) },
    { p: 0.41, follow: { off: v3(-2.6, 5.6, 12), look: v3(0.8, 0.5, -0.5) } },
    { p: 0.53, pos: v3(-1.9, 6.6, 12.2), look: v3(0.9, 0.85, -0.3) },
    { p: 0.66, pos: v3(-1.5, 6.7, 12.6), look: v3(1, 0.85, -0.3) },
    { p: 0.78, follow: { off: v3(-2.2, 5.8, 12), look: v3(0.6, 0.5, -0.5) } },
    { p: 0.9, pos: v3(10.8, 6.2, 11.4), look: v3(4.6, 0.7, 0.5) },
    { p: 0.95, pos: v3(10.4, 6.3, 11.8), look: v3(4.5, 0.7, 0.5) },
    { p: 1, pos: v3(0.3, 11.6, 24.6), look: v3(0, 0.3, 0.4) },
  ]
  const stackedStart: CameraKey = { p: 0, pos: v3(-1.5, 8.3, 15.4), look: v3(-3.9, 0.7, 0.7) }
  const stackedKeys: CameraKey[] = [
    stackedStart,
    { ...stackedStart, p: 0.05 },
    ...sideKeys.slice(2, -1),
    { p: 1, pos: v3(9.6, 6.6, 12.6), look: v3(4.4, 0.7, 0.4) },
  ]
  const resolveKey = (key: CameraKey, vanPosition: THREE.Vector3, outPosition: THREE.Vector3, outLook: THREE.Vector3) => {
    if ('follow' in key) {
      outPosition.copy(vanPosition).add(key.follow.off)
      outLook.copy(vanPosition).add(key.follow.look)
    } else {
      outPosition.copy(key.pos)
      outLook.copy(key.look)
    }
  }
  const keyPositionA = new THREE.Vector3()
  const keyLookA = new THREE.Vector3()
  const keyPositionB = new THREE.Vector3()
  const keyLookB = new THREE.Vector3()

  // Scroll progress → route position: wait at the old home, drive to the vault, pause, drive on.
  const routeTAt = (p: number) =>
    p < 0.31 ? 0 : p < 0.5 ? smooth(p, 0.31, 0.5) * vaultStop : p < 0.7 ? vaultStop : p < 0.86 ? vaultStop + smooth(p, 0.7, 0.86) * (1 - vaultStop) : 1

  const raycaster = new THREE.Raycaster()
  const pointerNdc = new THREE.Vector2()
  const hitsVan = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect()
    pointerNdc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1)
    raycaster.setFromCamera(pointerNdc, camera)
    return raycaster.intersectObject(van, true).length > 0
  }

  // Offset the frame so the board sits right of the copy ('side') or below it ('stacked').
  const updateCamera = () => {
    camera.aspect = width / height
    if (layout === 'side') camera.setViewOffset(width, height, -width * 0.19, 0, width, height)
    else camera.setViewOffset(width, height, 0, height * 0.2, width, height)
    camera.updateProjectionMatrix()
  }

  /** Advances the scene by `dt` seconds. Returns true while anything is still moving. */
  function update(dt: number, now: number) {
    progress = damp(progress, targetProgress, 5.5, dt)
    if (Math.abs(progress - targetProgress) < 1e-4) progress = targetProgress
    pointer.x = damp(pointer.x, pointer.tx, 3, dt)
    pointer.y = damp(pointer.y, pointer.ty, 3, dt)
    const intro = clamp01((now - startTime) / 1600)

    // Van along the route; wheels turn with the distance covered
    const routeT = routeTAt(progress)
    const position = routeCurve.getPointAt(routeT)
    const tangent = routeCurve.getTangentAt(Math.min(Math.max(routeT, 5e-4), 0.9995))
    van.position.copy(position)
    van.rotation.y = Math.atan2(-tangent.z, tangent.x)
    const travelled = (routeT - lastRouteT) * routeLength
    lastRouteT = routeT
    for (const wheel of wheels) wheel.rotation.z -= travelled / 0.25
    const speed = Math.min(1, Math.abs(travelled) / Math.max(dt, 0.001) / 2)

    // Idle bob while parked, road rumble while driving, a hop and a headlight flash after a tap
    hop = Math.min(1, hop + dt * 1.6)
    const hopHeight = hop < 1 ? Math.sin(hop * Math.PI) * 0.35 * (1 - hop * 0.3) : 0
    const parked = progress < 0.08 ? 1 : 0
    vanBody.position.y = Math.sin(now * 0.02) * 0.006 * speed + Math.sin(now * 0.0024) * 0.012 * (1 - speed) * parked + hopHeight
    vanBody.rotation.z = hop < 1 ? Math.sin(hop * Math.PI * 2) * 0.06 : 0
    mat.head.emissiveIntensity = 0.6 + (hop < 1 ? Math.sin(hop * Math.PI * 6) ** 2 * 2.5 : 0) + speed * 0.6

    // Rear doors open for loading, at the vault and at the new home
    const doorsOpen =
      smooth(progress, 0.08, 0.12) * (1 - smooth(progress, 0.28, 0.31)) +
      smooth(progress, 0.52, 0.55) * (1 - smooth(progress, 0.66, 0.69)) +
      smooth(progress, 0.86, 0.89)
    rearDoorNear.rotation.y = doorsOpen * 1.75
    rearDoorFar.rotation.y = -doorsOpen * 1.75

    // Vault: spin the wheel, swing the door open, then close and lock it again
    const vaultOpen = smooth(progress, 0.5, 0.555) * (1 - smooth(progress, 0.655, 0.7))
    vaultDoor.rotation.y = -vaultOpen * 1.95
    vaultWheel.rotation.z = smooth(progress, 0.47, 0.51) * Math.PI * 1.5 - smooth(progress, 0.69, 0.72) * Math.PI * 1.5

    const drawn = progress >= 0.995 ? 1 : routeT
    routeLine.geometry.setDrawRange(0, Math.floor(drawn * ROUTE_SEGMENTS) * ROUTE_RADIAL_SEGMENTS * 6)

    // Boxes: stacked → arced into the van → carried → arced out to the vault or the new home
    van.updateMatrixWorld(true)
    van.localToWorld(doorPoint.set(VAN_REAR - 0.5, 0.95, 0))
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i]
      const loadStart = 0.12 + (5 - i) * 0.026
      const load = smooth(progress, loadStart, loadStart + 0.055)
      van.localToWorld(slotPoint.copy(boxSlot[i]))
      const unloadStart = i < 2 ? 0.556 + i * 0.035 : 0.885 + (i - 2) * 0.022
      const unload = smooth(progress, unloadStart, unloadStart + (i < 2 ? 0.05 : 0.045))
      const drop = i < 2 ? vaultDrop[i] : homeDrop[i - 2]

      if (unload > 0) {
        if (i < 2) arcControl.set((doorPoint.x + drop.x) / 2, 1.3, vault.position.z + 2.05)
        else arcControl.copy(doorPoint).lerp(drop, 0.5).setY(Math.max(doorPoint.y, drop.y) + 0.9)
        if (unload < 0.3) box.position.lerpVectors(slotPoint, doorPoint, unload / 0.3)
        else quadraticBezier(doorPoint, arcControl, drop, (unload - 0.3) / 0.7, box.position)
        box.rotation.y = van.rotation.y * (1 - unload) + (i * 0.37 - 0.4) * unload
        box.rotation.x = 0
        // Boxes left in the vault disappear once its door has shut.
        box.visible = !(i < 2 && unload >= 1 && vaultOpen < 0.05)
      } else if (load > 0) {
        const start = boxStart[i]
        if (load < 0.75) {
          arcControl.copy(start).lerp(doorPoint, 0.5).setY(Math.max(start.y, doorPoint.y) + 0.9)
          quadraticBezier(start, arcControl, doorPoint, load / 0.75, box.position)
        } else {
          box.position.lerpVectors(doorPoint, slotPoint, (load - 0.75) / 0.25)
        }
        box.rotation.y = boxStartAngle[i] * (1 - load) + van.rotation.y * load
        box.rotation.x = Math.sin(load * Math.PI) * 0.35
        box.visible = true
      } else {
        // On first load the boxes drop into their stack one after another.
        const t = clamp01((intro - i * 0.09) / 0.5)
        box.position.copy(boxStart[i])
        box.position.y += (1 - easeOutBack(t)) * 2.2
        box.rotation.set(0, boxStartAngle[i] + (1 - t) * 0.6, 0)
        box.visible = t > 0
      }
    }

    // Lights go off at the old home and on at the new one
    oldHome.windows.emissiveIntensity = 0.85 * (1 - smooth(progress, 0.26, 0.33))
    newHome.windows.emissiveIntensity = 1.1 * smooth(progress, 0.9, 0.96)

    const pulsePhase = ((now - startTime) / 1600) % 1
    const pulseStrength = 1 - smooth(progress, 0.25, 0.31) + smooth(progress, 0.84, 0.88) * (1 - smooth(progress, 0.92, 0.97))
    pulse.visible = pulseStrength > 0.001
    pulse.scale.setScalar(1 + pulsePhase * 1.1)
    pulseMaterial.opacity = (1 - pulsePhase) * 0.7 * pulseStrength

    // Camera: blend between the two keys around the current progress
    const keys = layout === 'side' ? sideKeys : stackedKeys
    let k = 0
    while (k < keys.length - 2 && progress > keys[k + 1].p) k++
    const from = keys[k]
    const to = keys[k + 1]
    const blend = smooth(progress, from.p, to.p)
    resolveKey(from, van.position, keyPositionA, keyLookA)
    resolveKey(to, van.position, keyPositionB, keyLookB)
    cameraTarget.lerpVectors(keyPositionA, keyPositionB, blend)
    lookTarget.lerpVectors(keyLookA, keyLookB, blend)
    // Pull back on narrow viewports so the whole board stays in frame.
    const usableAspect = layout === 'side' ? (width * 0.6) / height : width / (height * 0.6)
    const pullBack = Math.min(1.25, Math.max(1, 1 / usableAspect)) ** 0.9
    cameraTarget.sub(lookTarget).multiplyScalar(pullBack).add(lookTarget)
    // Gentle sway on touch screens; mouse parallax elsewhere. Both fade out once scrolling starts.
    const idle = 1 - smooth(progress, 0.04, 0.1)
    cameraTarget.x += coarsePointer ? Math.sin(now * 4e-4) * 0.35 * idle : pointer.x * 0.9
    cameraTarget.y += coarsePointer ? 0 : pointer.y * 0.45
    if (firstFrame) {
      cameraPosition.copy(cameraTarget)
      cameraLook.copy(lookTarget)
      firstFrame = false
    } else {
      const t = 1 - Math.exp(-7 * dt)
      cameraPosition.lerp(cameraTarget, t)
      cameraLook.lerp(lookTarget, t)
    }
    camera.position.copy(cameraPosition)
    camera.lookAt(cameraLook)

    return (
      Math.abs(progress - targetProgress) > 1e-4 ||
      Math.abs(pointer.x - pointer.tx) > 0.001 ||
      Math.abs(pointer.y - pointer.ty) > 0.001 ||
      intro < 1 ||
      hop < 1 ||
      idle > 0 ||
      pulse.visible ||
      cameraPosition.distanceToSquared(cameraTarget) > 1e-6 ||
      cameraLook.distanceToSquared(lookTarget) > 1e-6
    )
  }

  // Render loop: only renders while something moves. If frames 21–80 average over 40 ms,
  // drop to a 1× pixel ratio without shadows.
  let forceRender = true
  let frameCount = 0
  let slowTime = 0
  let degraded = lowTier
  const degrade = () => {
    degraded = true
    renderer.setPixelRatio(Math.min(renderer.getPixelRatio(), 1))
    renderer.setSize(width, height, false)
    renderer.shadowMap.enabled = false
    sun.castShadow = false
    for (const material of materials) material.needsUpdate = true
  }
  function frame(now: number) {
    frameId = requestAnimationFrame(frame)
    const dt = Math.min(0.1, (now - lastTime) / 1000)
    lastTime = now
    const moving = update(dt, now)
    if (!moving && !forceRender) return
    forceRender = false
    renderer.render(scene, camera)
    if (!degraded && moving) {
      frameCount++
      if (frameCount > 20) slowTime += dt
      if (frameCount === 80 && slowTime / 60 > 0.04) degrade()
    }
  }
  function start() {
    if (frameId) return
    lastTime = performance.now()
    frameId = requestAnimationFrame(frame)
  }
  function stop() {
    if (frameId) cancelAnimationFrame(frameId)
    frameId = 0
  }
  const onVisibilityChange = () => {
    if (document.hidden) stop()
    else if (active) start()
  }

  document.addEventListener('visibilitychange', onVisibilityChange)
  updateCamera()
  update(0.016, performance.now())
  renderer.render(scene, camera)
  start()

  return {
    setProgress(next) {
      targetProgress = clamp01(next)
    },
    setPointer(x, y) {
      pointer.tx = x
      pointer.ty = y
    },
    setLayout(next) {
      layout = next
      updateCamera()
      forceRender = true
    },
    resize(nextWidth, nextHeight) {
      width = Math.max(1, nextWidth)
      height = Math.max(1, nextHeight)
      renderer.setSize(width, height, false)
      updateCamera()
      forceRender = true
    },
    setActive(next) {
      active = next
      if (active && !document.hidden) start()
      else stop()
    },
    pick(clientX, clientY) {
      const hit = hitsVan(clientX, clientY)
      if (hit !== hovering) {
        hovering = hit
        canvas.style.cursor = hit ? 'pointer' : ''
      }
      return hit
    },
    tap(clientX, clientY) {
      if (!hitsVan(clientX, clientY)) return false
      if (hop >= 1) hop = 0
      return true
    },
    dispose() {
      stop()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose()
      })
      for (const material of materials) {
        if ('map' in material && material.map instanceof THREE.Texture) material.map.dispose()
        material.dispose()
      }
      envMap.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}
