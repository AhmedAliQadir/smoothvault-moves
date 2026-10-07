import { useEffect, useRef, useState } from 'react'
import { steps } from '../content'
import type { Diorama, DioramaLayout } from '../three/diorama'
import { HeroCopy } from './HeroCopy'
import { HeroIllustration } from './HeroIllustration'
import { ArrowRightIcon } from './icons'

/** Scroll-progress ranges for the hero (0) and the four chapters (1–4). */
const CHAPTER_RANGES = [
  [0, 0.06],
  [0.06, 0.31],
  [0.31, 0.5],
  [0.5, 0.74],
  [0.74, 1.01],
]

const chapterAt = (progress: number) =>
  Math.max(0, CHAPTER_RANGES.findIndex(([start, end]) => progress >= start && progress < end))

const layoutFor = (width: number, height: number): DioramaLayout =>
  width >= 900 && width / height >= 1.05 ? 'side' : 'stacked'

/**
 * The 3D hero: a tall section whose sticky stage plays the move (pack → move → store → deliver)
 * as you scroll. The Three.js scene is loaded lazily; the flat illustration shows until it's ready.
 */
export function Journey() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<Diorama | null>(null)
  const progressRef = useRef(0)
  const [chapter, setChapter] = useState(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  // Scroll progress through the section drives the scene, the rail and the active chapter.
  useEffect(() => {
    const section = sectionRef.current!
    const stage = stageRef.current!
    let frame = 0
    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
      progressRef.current = progress
      stage.style.setProperty('--p', progress.toFixed(4))
      sceneRef.current?.setProgress(progress)
      setChapter(chapterAt(progress))
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Load the Three.js scene when the browser is idle.
  useEffect(() => {
    let cancelled = false
    let scene: Diorama | null = null
    const stage = stageRef.current!
    const canvas = canvasRef.current!
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const nav = navigator as Navigator & { deviceMemory?: number }
    const lowTier = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 3

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (scene) {
        scene.setLayout(layoutFor(width, height))
        scene.resize(width, height)
      }
    })
    const visibilityObserver = new IntersectionObserver(([entry]) => scene?.setActive(entry.isIntersecting), {
      rootMargin: '100px',
    })

    const load = async () => {
      try {
        const { createDiorama } = await import('../three/diorama')
        if (cancelled) return
        scene = await createDiorama({ canvas, lowTier, coarsePointer })
        if (cancelled) {
          scene.dispose()
          return
        }
        const rect = stage.getBoundingClientRect()
        scene.setLayout(layoutFor(rect.width, rect.height))
        scene.resize(rect.width, rect.height)
        scene.setProgress(progressRef.current)
        sceneRef.current = scene
        resizeObserver.observe(stage)
        visibilityObserver.observe(stage)
        requestAnimationFrame(() => setReady(true))
      } catch (error) {
        console.warn('3D scene unavailable, showing illustration instead', error)
        setFailed(true)
      }
    }

    const hasIdleCallback = typeof window.requestIdleCallback === 'function'
    const handle = hasIdleCallback
      ? window.requestIdleCallback(() => void load(), { timeout: 600 })
      : window.setTimeout(load, 120)

    return () => {
      cancelled = true
      if (hasIdleCallback) window.cancelIdleCallback(handle)
      else clearTimeout(handle)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      sceneRef.current = null
      scene?.dispose()
    }
  }, [])

  // Mouse parallax, hover cursor and "tap the van".
  useEffect(() => {
    const stage = stageRef.current!
    let frame = 0
    let lastEvent: PointerEvent | null = null
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      lastEvent = event
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const e = lastEvent!
        const rect = stage.getBoundingClientRect()
        sceneRef.current?.setPointer(((e.clientX - rect.left) / rect.width) * 2 - 1, -(((e.clientY - rect.top) / rect.height) * 2 - 1))
        sceneRef.current?.pick(e.clientX, e.clientY)
      })
    }
    const onPointerLeave = () => sceneRef.current?.setPointer(0, 0)
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element).closest('a,button')) return
      sceneRef.current?.tap(event.clientX, event.clientY)
    }
    stage.addEventListener('pointermove', onPointerMove)
    stage.addEventListener('pointerleave', onPointerLeave)
    stage.addEventListener('click', onClick)
    return () => {
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerleave', onPointerLeave)
      stage.removeEventListener('click', onClick)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const goToChapter = (index: number) => {
    const section = sectionRef.current
    if (!section) return
    const scrollable = section.offsetHeight - window.innerHeight
    const [start, end] = CHAPTER_RANGES[index]
    const top = section.offsetTop + scrollable * (index === 4 ? 0.97 : start + (end - start) * 0.55)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="journey" aria-label="From door to door: how a move works">
      <div ref={stageRef} className={`journey__stage${ready ? ' is-ready' : ''}`} data-chapter={chapter}>
        <HeroIllustration className="journey__poster" />
        {!failed && <canvas ref={canvasRef} className="journey__canvas" aria-hidden />}

        <div className="journey__copy">
          <div className={`chapter chapter--hero${chapter === 0 ? ' is-active' : ''}`} inert={chapter !== 0 || undefined}>
            <HeroCopy />
          </div>
          {steps.map((step, i) => (
            <div key={step.kicker} className={`chapter${chapter === i + 1 ? ' is-active' : ''}`}>
              <p className="kicker">{step.kicker}</p>
              <h2 className="chapter__title">{step.title}</h2>
              <p className="chapter__text">{step.text}</p>
              {i === 3 && (
                <a className="btn btn--cta chapter__cta" href="#quote">
                  Get your free quote <ArrowRightIcon width={18} height={18} />
                </a>
              )}
            </div>
          ))}
        </div>

        <nav className="journey__rail" aria-label="Move steps">
          {steps.map((step, i) => (
            <button
              key={step.kicker}
              type="button"
              className={`rail__step${chapter === i + 1 ? ' is-active' : ''}${chapter > i + 1 ? ' is-done' : ''}`}
              onClick={() => goToChapter(i + 1)}
            >
              <span className="rail__label">{step.kicker.split('— ')[1]}</span>
            </button>
          ))}
          <span className="rail__track" aria-hidden>
            <span className="rail__fill" />
          </span>
        </nav>

        <p className={`journey__hint${chapter === 0 ? ' is-active' : ''}`} aria-hidden>
          <span className="journey__hint-line" /> Scroll to follow the move
          {ready && <span className="journey__hint-tap"> · tap the van</span>}
        </p>
      </div>
    </section>
  )
}
