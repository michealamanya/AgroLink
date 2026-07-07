import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { Reveal } from '../components/RevealUtils'
import { getInventory } from '../services/agriculture'
import { hasFirebaseConfig } from '../firebase'

const CATEGORIES = ['All', 'Seeds', 'Fertilizers', 'Agrochemicals', 'Animal Health', 'Tools & Equipment']
const PRICE_RANGES = ['Any price', 'Under 10,000', '10,000–50,000', '50,000–200,000', 'Over 200,000']
const STATUS_COLORS = {
  Verified:            { bg: '#dcfce7', color: '#166534' },
  'Restocking soon':   { bg: '#fff7ed', color: '#9a3412' },
  'Pending inspection':{ bg: '#fef9c3', color: '#854d0e' },
}

function formatPrice(p) {
  if (!p || isNaN(Number(p))) return 'Price on request'
  return `UGX ${Number(p).toLocaleString()}`
}

/* ─── listing card ─────────────────────────────────────────────────── */
function ListingCard({ item, onView }) {
  const sc = STATUS_COLORS[item.status] ?? { bg: '#f3f4f6', color: '#374151' }
  const wa = item.whatsapp || (item.phone || '').replace(/\D/g, '')
  return (
    <div className="mp-card">
      <div className="mp-card-img">
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.item} loading="lazy" />
          : <div className="mp-card-img-placeholder"><span>🌿</span></div>}
        <span className="mp-card-status" style={{ background: sc.bg, color: sc.color }}>
          {item.status}
        </span>
        {item.category ? (
          <span className="mp-card-category">{item.category}</span>
        ) : null}
      </div>
      <div className="mp-card-body">
        <h3 className="mp-card-title">{item.item}</h3>
        <p className="mp-card-dealer">🏪 {item.dealer}</p>
        {item.location ? <p className="mp-card-location">📍 {item.location}</p> : null}
        <p className="mp-card-stock">📦 {item.stock} available</p>
        <div className="mp-card-price">
          <strong>{formatPrice(item.price)}</strong>
          {item.unit ? <span>/ {item.unit}</span> : null}
        </div>
      </div>
      <div className="mp-card-footer">
        <button type="button" className="mp-btn-view" onClick={() => onView(item)}>
          View details
        </button>
        {wa ? (
          <a
            href={`https://wa.me/${wa}?text=Hi, I saw your ${encodeURIComponent(item.item)} on AgroLink. Is it still available?`}
            target="_blank" rel="noreferrer" className="mp-btn-whatsapp">
            WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  )
}

/* ─── detail modal ─────────────────────────────────────────────────── */
function ListingModal({ item, onClose }) {
  if (!item) return null
  const sc = STATUS_COLORS[item.status] ?? { bg: '#f3f4f6', color: '#374151' }
  const wa = item.whatsapp || (item.phone || '').replace(/\D/g, '')
  return (
    <>
      <div className="mp-modal-backdrop" onClick={onClose} />
      <div className="mp-modal" role="dialog" aria-modal="true" aria-label={item.item}>
        <div className="mp-modal-header">
          <div>
            {item.category ? <span className="mp-modal-category">{item.category}</span> : null}
            <h2 className="mp-modal-title">{item.item}</h2>
          </div>
          <button type="button" className="mp-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="mp-modal-body">
          <div className="mp-modal-image">
            {item.imageUrl
              ? <img src={item.imageUrl} alt={item.item} />
              : <div className="mp-modal-img-placeholder"><span>🌿</span></div>}
          </div>
          <div className="mp-modal-info">
            <div className="mp-modal-price">
              <strong>{formatPrice(item.price)}</strong>
              {item.unit ? <span> / {item.unit}</span> : null}
            </div>
            <span className="mp-modal-status" style={{ background: sc.bg, color: sc.color }}>
              {item.status}
            </span>
            {item.description ? <p className="mp-modal-desc">{item.description}</p> : null}
            <div className="mp-modal-meta">
              <div><span>Dealer</span><strong>{item.dealer}</strong></div>
              {item.location ? <div><span>Location</span><strong>{item.location}</strong></div> : null}
              <div><span>In stock</span><strong>{item.stock}</strong></div>
              {item.phone ? <div><span>Phone</span><strong>{item.phone}</strong></div> : null}
              <div><span>Listed</span><strong>{item.createdAtDisplay || '—'}</strong></div>
            </div>
            <div className="mp-modal-actions">
              {wa ? (
                <a
                  href={`https://wa.me/${wa}?text=Hi ${encodeURIComponent(item.dealer)}, I saw your ${encodeURIComponent(item.item)} listed on AgroLink. Is it still available?`}
                  target="_blank" rel="noreferrer" className="mp-btn-whatsapp mp-btn-lg">
                  💬 Chat on WhatsApp
                </a>
              ) : null}
              {item.phone ? (
                <a href={`tel:${item.phone}`} className="mp-btn-call mp-btn-lg">
                  📞 Call dealer
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── main marketplace page ────────────────────────────────────────── */
function MarketplacePage() {
  const [listings, setListings]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priceRange, setPriceRange]   = useState('Any price')
  const [sortBy, setSortBy]           = useState('default')
  const [activeItem, setActiveItem]   = useState(null)

  // ── load from Firestore ──
  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (hasFirebaseConfig) {
          const data = await getInventory()
          setListings(data)
        } else {
          setListings([])
        }
      } catch (e) {
        setError('Could not load listings. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── price helper ──
  function matchesPrice(item) {
    const p = Number(item.price) || 0
    switch (priceRange) {
      case 'Under 10,000':      return p < 10000
      case '10,000–50,000':     return p >= 10000 && p <= 50000
      case '50,000–200,000':    return p > 50000 && p <= 200000
      case 'Over 200,000':      return p > 200000
      default: return true
    }
  }

  // ── filter + sort ──
  const filtered = listings
    .filter(item => {
      const q = search.trim().toLowerCase()
      if (q && !item.item?.toLowerCase().includes(q) &&
               !item.dealer?.toLowerCase().includes(q) &&
               !item.description?.toLowerCase().includes(q) &&
               !item.location?.toLowerCase().includes(q)) return false
      if (category !== 'All' && item.category !== category) return false
      if (statusFilter !== 'All' && item.status !== statusFilter) return false
      if (!matchesPrice(item)) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return (Number(a.price) || 0) - (Number(b.price) || 0)
      if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0)
      if (sortBy === 'name')       return (a.item || '').localeCompare(b.item || '')
      return 0
    })

  const verifiedCount = listings.filter(i => i.status === 'Verified').length
  const dealerCount   = [...new Set(listings.map(i => i.dealer).filter(Boolean))].length
  const locationCount = [...new Set(listings.map(i => i.location).filter(Boolean))].length

  return (
    <SiteLayout
      title="Agro-Input Marketplace"
      subtitle="Find verified seeds, fertilizers, and agrochemicals from trusted dealers in Bushenyi District."
    >
      {/* stats strip */}
      <div className="mp-stats-strip">
        <div className="mp-stat"><strong>{listings.length}</strong><span>Total listings</span></div>
        <div className="mp-stat"><strong>{verifiedCount}</strong><span>Verified products</span></div>
        <div className="mp-stat"><strong>{dealerCount}</strong><span>Active dealers</span></div>
        <div className="mp-stat"><strong>{locationCount || '8'}</strong><span>Locations covered</span></div>
      </div>

      <div className="mp-layout">
        {/* ── sidebar filters ── */}
        <aside className="mp-sidebar">
          <div className="mp-filter-group">
            <label className="mp-filter-label">Search</label>
            <div className="mp-search-wrap">
              <span className="mp-search-icon">🔍</span>
              <input className="mp-search" placeholder="Product, dealer, location…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="mp-filter-group">
            <label className="mp-filter-label">Category</label>
            <div className="mp-chip-group">
              {CATEGORIES.map(c => (
                <button key={c} type="button"
                  className={`mp-chip ${category === c ? 'mp-chip-active' : ''}`}
                  onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="mp-filter-group">
            <label className="mp-filter-label">Status</label>
            <select className="mp-select" value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All statuses</option>
              <option>Verified</option>
              <option>Restocking soon</option>
              <option>Pending inspection</option>
            </select>
          </div>

          <div className="mp-filter-group">
            <label className="mp-filter-label">Price range (UGX)</label>
            <select className="mp-select" value={priceRange}
              onChange={e => setPriceRange(e.target.value)}>
              {PRICE_RANGES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="mp-filter-group">
            <label className="mp-filter-label">Sort by</label>
            <select className="mp-select" value={sortBy}
              onChange={e => setSortBy(e.target.value)}>
              <option value="default">Newest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          <button type="button" className="mp-reset"
            onClick={() => { setSearch(''); setCategory('All'); setStatusFilter('All'); setPriceRange('Any price'); setSortBy('default') }}>
            Reset filters
          </button>

          <div className="mp-dealer-cta">
            <strong>Are you a dealer?</strong>
            <p>Register and list your products to reach farmers across Bushenyi District.</p>
            <NavLink to="/access" className="mp-dealer-cta-btn">List your products →</NavLink>
          </div>
        </aside>

        {/* ── listings ── */}
        <main className="mp-main">
          <div className="mp-results-bar">
            <span className="mp-results-count">
              {loading ? 'Loading…' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} found`}
            </span>
            {!loading && filtered.length < listings.length ? (
              <span className="mp-results-filtered">Filtered from {listings.length} total</span>
            ) : null}
          </div>

          {error ? (
            <div className="mp-empty">
              <span>⚠️</span>
              <strong>{error}</strong>
              <button type="button" className="mp-reset" onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="mp-loading-grid">
              {[1,2,3,4,5,6].map(n => <div key={n} className="mp-skeleton" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mp-empty">
              <span>🌿</span>
              <strong>
                {listings.length === 0
                  ? 'No products listed yet'
                  : 'No listings match your filters'}
              </strong>
              <p>
                {listings.length === 0
                  ? 'Dealers can sign in and add their products to appear here.'
                  : 'Try a different category, status, or price range.'}
              </p>
              {listings.length > 0 ? (
                <button type="button" className="mp-reset"
                  onClick={() => { setSearch(''); setCategory('All'); setStatusFilter('All'); setPriceRange('Any price') }}>
                  Clear all filters
                </button>
              ) : null}
            </div>
          ) : (
            <div className="mp-grid">
              {filtered.map((item, i) => (
                <Reveal key={item.id} delay={Math.min(i * 40, 320)}>
                  <ListingCard item={item} onView={setActiveItem} />
                </Reveal>
              ))}
            </div>
          )}
        </main>
      </div>

      <ListingModal item={activeItem} onClose={() => setActiveItem(null)} />
    </SiteLayout>
  )
}

export default MarketplacePage
