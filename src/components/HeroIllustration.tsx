const cloudPuffs = [
  [110, 330, 26],
  [690, 330, 24],
  [250, 380, 18],
  [560, 385, 20],
  [150, 175, 20],
  [660, 178, 18],
]

const boxStack = [
  [96, 230],
  [120, 230],
  [108, 212],
]

/**
 * Flat illustration of the move: old home → van on the route → storage vault → new home.
 * Shown as the static hero, as the poster while the 3D scene loads, and if WebGL fails.
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 460"
      role="img"
      aria-label="Illustration: a Smooth Vault van driving along a blue route from one home, past a secure storage vault, to a new home"
    >
      <ellipse cx="400" cy="440" rx="330" ry="16" fill="#0A1C2E" opacity="0.08" />
      <path d="M60 400 L130 170 Q134 160 146 160 L654 160 Q666 160 670 170 L740 400 Z" fill="#E7EEF6" transform="translate(0 16)" />
      <path d="M60 400 L130 170 Q134 160 146 160 L654 160 Q666 160 670 170 L740 400 Z" fill="#FFFFFF" />
      <path d="M60 400 L740 400" stroke="#1F6FB2" strokeWidth="3" transform="translate(0 15)" />
      {cloudPuffs.map(([cx, cy, r], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={r * 1.3} ry={r} fill="#D3E2F2" />
      ))}

      {/* Route */}
      <path d="M180 292 C 260 332, 320 348, 400 302 S 540 332, 625 292" fill="none" stroke="#E2E9F2" strokeWidth="34" strokeLinecap="round" />
      <path d="M180 292 C 260 332, 320 348, 400 302 S 540 332, 625 292" fill="none" stroke="#1F6FB2" strokeWidth="5" strokeLinecap="round" />

      {/* Old home */}
      <g>
        <rect x="150" y="128" width="100" height="78" rx="6" fill="#F4F7FB" stroke="#DCE4EE" />
        <path d="M138 130 L200 82 L262 130 Z" fill="#1F6FB2" />
        <rect x="190" y="166" width="20" height="40" rx="3" fill="#0A1C2E" />
        <rect x="160" y="146" width="20" height="18" rx="3" fill="#9FC6EA" />
        <rect x="220" y="146" width="20" height="18" rx="3" fill="#9FC6EA" />
      </g>

      {/* New home, lights on */}
      <g>
        <rect x="550" y="128" width="100" height="78" rx="6" fill="#F4F7FB" stroke="#DCE4EE" />
        <path d="M538 130 L600 82 L662 130 Z" fill="#0A1C2E" />
        <rect x="590" y="166" width="20" height="40" rx="3" fill="#0A1C2E" />
        <rect x="560" y="146" width="20" height="18" rx="3" fill="#FFE7B0" />
        <rect x="620" y="146" width="20" height="18" rx="3" fill="#FFE7B0" />
        <ellipse cx="600" cy="222" rx="26" ry="7" fill="none" stroke="#6FB1E8" strokeWidth="3" />
      </g>

      {/* Storage vault */}
      <g>
        <rect x="334" y="104" width="132" height="104" rx="14" fill="#0A1C2E" />
        <rect x="356" y="112" width="88" height="14" rx="3" fill="#1F6FB2" />
        <circle cx="400" cy="164" r="34" fill="#CFD8E2" stroke="#A9B8C8" strokeWidth="4" />
        <circle cx="400" cy="164" r="13" fill="none" stroke="#0A1C2E" strokeWidth="3" />
        <path d="M400 149v30M387 164h26" stroke="#0A1C2E" strokeWidth="3" />
      </g>

      {/* Boxes waiting by the old home */}
      {boxStack.map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="24" height="19" rx="2" fill="#D9B48A" />
          <rect x={x} y={y + 7} width="24" height="3" fill="#B88A58" />
        </g>
      ))}

      {/* Van */}
      <g transform="translate(262 268)">
        <rect x="0" y="0" width="74" height="46" rx="7" fill="#0A1C2E" />
        <rect x="72" y="10" width="34" height="36" rx="7" fill="#FFFFFF" stroke="#DCE4EE" />
        <rect x="80" y="15" width="20" height="13" rx="2" fill="#1A3450" />
        <rect x="0" y="32" width="106" height="4" fill="#1F6FB2" />
        <circle cx="20" cy="48" r="8" fill="#17212C" />
        <circle cx="88" cy="48" r="8" fill="#17212C" />
      </g>
    </svg>
  )
}
