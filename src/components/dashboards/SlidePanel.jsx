import { useEffect, useRef } from 'react'

/**
 * Reusable slide-in panel that animates from the right.
 * Used by all role dashboards.
 */
function SlidePanel({ sectionKey, meta, open, onClose, children }) {
  const panelRef = useRef(null)
  const info = meta[sectionKey] ?? {}

  useEffect(() => {
    if (!open) return
    const el = panelRef.current
    if (!el) return
    el.querySelector('button, input, select, textarea, a[href]')?.focus()
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div
        className={`slide-backdrop ${open ? 'slide-backdrop-visible' : ''}`}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={info.title ?? 'Panel'}
        className={`slide-panel ${open ? 'slide-panel-open' : ''}`}
      >
        <div className="slide-panel-header">
          <div className="slide-panel-header-copy">
            <span className="eyebrow">{info.eyebrow}</span>
            <h2 className="slide-panel-title">{info.title}</h2>
            <p className="slide-panel-subtitle">{info.text}</p>
          </div>
          <button
            type="button"
            className="slide-panel-close"
            aria-label="Close panel"
            onClick={onClose}
          >
            <span aria-hidden="true">←</span>
            <span>Back</span>
          </button>
        </div>
        <div className="slide-panel-body">
          <div className="page-grid slide-panel-grid">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default SlidePanel
