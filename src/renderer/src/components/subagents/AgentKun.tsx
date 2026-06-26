import type { ReactElement } from 'react'
import kunGhost from '../../../../asset/img/kun_mascot.png'

/**
 * 小元 ghost mascot avatar. Every role renders the same 小元 ghost figure;
 * per-role distinction comes from the coloured disc the caller draws *behind*
 * it (the profile's `color` in the subagents panel, a status/hash tint in the
 * delegation card). Each role id keeps a distinct subtle CSS motion
 * (float / sway / breathe / bob) so a row of agents still feels alive.
 * Disabled rows render the ghost in grayscale with no motion.
 *
 * Single-pose stopgap (matches AnimatedWorkLogo): there is currently only one
 * 小元 ghost figure (kun_mascot.png), so all roles alias to it. If multi-pose
 * 小元 art is ever produced, map role ids to distinct figures in FIGURE below.
 */

type Anim = 'float' | 'sway' | 'breathe' | 'bob'

const STYLE_ID = 'ds-agent-kun-style'
const STYLE = `
@keyframes dsKunFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes dsKunSway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes dsKunBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@keyframes dsKunBob{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-2.5px) rotate(3deg)}}
.ds-agent-kun{display:inline-flex;align-items:center;justify-content:center}
.ds-agent-kun img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 2px 3px rgba(31,45,64,.14))}
.ds-agent-kun.is-disabled img{filter:grayscale(1) opacity(.7)}
.ds-agent-kun-float img{animation:dsKunFloat 2.4s ease-in-out infinite}
.ds-agent-kun-sway img{animation:dsKunSway 2.1s ease-in-out infinite;transform-origin:50% 90%}
.ds-agent-kun-breathe img{animation:dsKunBreathe 3s ease-in-out infinite}
.ds-agent-kun-bob img{animation:dsKunBob 2.7s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.ds-agent-kun img{animation:none!important}}
`

function ensureStyle(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const el = document.createElement('style')
  el.id = STYLE_ID
  el.textContent = STYLE
  document.head.appendChild(el)
}

// Per-role motion. Same 小元 ghost figure, distinct sway so a list reads alive.
const ANIM: Record<string, Anim> = {
  general: 'breathe',
  explore: 'float',
  'design-reviewer': 'bob',
  'over-engineering-reviewer': 'sway',
  'code-review': 'breathe',
  compaction: 'sway',
  title: 'bob',
  summary: 'float'
}

const FALLBACK_ANIM: Anim = 'breathe'

/**
 * @param id       role id (drives the motion); unknown ids → fallback motion
 * @param disabled when true, renders the resting ghost in grayscale, no motion
 * @param className sizing wrapper class (e.g. "h-9 w-9")
 */
export function AgentKun({
  id,
  disabled = false,
  className
}: {
  id: string
  /** Retained for API compatibility with old callers; the coloured disc is drawn by the wrapper. */
  color?: string
  disabled?: boolean
  className?: string
}): ReactElement {
  ensureStyle()
  if (disabled) {
    return (
      <span className={`ds-agent-kun is-disabled ${className ?? ''}`}>
        <img src={kunGhost} alt="" aria-hidden="true" />
      </span>
    )
  }
  const anim = ANIM[id] ?? FALLBACK_ANIM
  return (
    <span className={`ds-agent-kun ds-agent-kun-${anim} ${className ?? ''}`}>
      <img src={kunGhost} alt="" aria-hidden="true" />
    </span>
  )
}
