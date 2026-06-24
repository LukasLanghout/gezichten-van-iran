// Deterministic colored avatar from a name's initials.
const PALETTE = [
  '#C0503A', // terracotta
  '#3C5A4E', // pine
  '#D89B4A', // saffron
  '#7A5C8E', // plum
  '#4A6D8C', // steel
  '#A23E2B', // terracotta-dark
  '#5E7B5A', // moss
]

function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

export default function Avatar({
  name,
  size = 36,
  className = '',
}: {
  name: string
  size?: number
  className?: string
}) {
  const clean = (name || '?').trim()
  const initials = clean
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('') || '?'
  const color = PALETTE[hash(clean) % PALETTE.length]

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        fontSize: size * 0.4,
      }}
      aria-hidden
    >
      {initials}
    </span>
  )
}
