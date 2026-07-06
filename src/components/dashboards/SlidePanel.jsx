import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * SlidePanel — slides in from the right, portalled to document.body
 * so it sits above the sidebar (z-index 300) and is never clipped.
 *
 * Props:
 *   sectionKey  – key into `meta` object
 *   meta        – { [key]: { eyebrow, title, text } }
 *   open        – boolean
 *   onClose     – () => void
 *   children    – panel content
 */
function SlidePanel({ sectionKey, meta, open, onClose, children }) {
  const panelRef   = useRef(null)
  const info       = (meta ?? {})[sectionKey] ?? {}

  // Track whether we've ever opened — so we don't render content at all
  // until first open (avoid hidden forms submitting, etc.)
  const [everOpened, setEverOpened] = useState(false)
  useEffect(() => { if (open) setEverOpened(true) }, [open])

  // Body scroll lock
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  // Escape key closes
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Move focus into panel when it opens
  useEffect(() => {
    if (!open || !panelRef.current) return
    const el = panelRef.current
    // Small delay so the CSS transition has started and element is interactive
    const t = setTimeout(() => {
      const first = el.querySelector('button, input, select, textarea, [tabindex]')
      first?.focus()
    }, 80)
    return () => clearTimeout(t)
  }, [open])

  const portal = (
    <>
      {/* ── Backdrop ── */}
      <div
        className={`sp-backdrop ${open ? 'sp-backdrop-in' : ''}`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* ── Panel ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={info.title ?? 'Section panel'}
        className={`sp-panel ${open ? 'sp-panel-open' : ''}`}
        inert={!open ? '' : undefined}
      >
        {/* Header */}
        <div className="sp-header">
          <div className="sp-header-copy">
            <span className="sp-eyebrow">{info.eyebrow}</span>
            <h2 className="sp-title">{info.title}</h2>
            {info.text ? <p className="sp-subtitle">{info.text}</p> : null}
          </div>
          <button
            type="button"
            className="sp-close"
            aria-label="Close panel"
            onClick={onClose}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            <span>Back</span>
          </button>
        </div>

        {/* Body — only render content after first open */}
        <div className="sp-body">
          {everOpened ? (
            <div className="page-grid sp-grid">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )

  return createPortal(portal, document.body)
}

export default SlidePanel
