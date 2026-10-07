export function Logo() {
  return (
    <span className="logo">
      <svg className="logo__mark" viewBox="0 0 40 40" aria-hidden>
        <rect width="40" height="40" rx="11" fill="#0A1C2E" />
        <circle cx="11" cy="27" r="3.6" fill="#6FB1E8" />
        <circle cx="29" cy="13" r="3.6" fill="#F7F9FC" />
        <path d="M11 27c7 0 4-14 18-14" fill="none" stroke="#1F6FB2" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="logo__word">
        Smoothvault<span className="logo__sub">Moves</span>
      </span>
    </span>
  )
}
