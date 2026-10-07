import { Journey } from './Journey'
import { StaticHero } from './StaticHero'

export function Hero({ enable3D }: { enable3D: boolean }) {
  return enable3D ? <Journey /> : <StaticHero />
}
