import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'
import { Reveal } from '../components/RevealUtils'

/* ─── category filters ─────────────────────────────────────────────── */
const CATEGORIES = ['All', 'Seeds', 'Fertilizers', 'Agrochemicals', 'Animal Health', 'Tools & Equipment']
const SUB_COUNTIES = ['All locations', 'Bushenyi Town', 'Ishaka', 'Kyeizooba', 'Kakanju', 'Bumbaire', 'Ibaare', 'Nyabubare', 'Bitooma']
const PRICE_RANGES = ['Any price', 'Under 10,000', '10,000–50,000', '50,000–200,000', 'Over 200,000']

/* ─── seed demo listings ───────────────────────────────────────────── */
const DEMO_LISTINGS = [
  { id: 'd1', item: 'Hybrid Maize Seed (NARO 5)', category: 'Seeds', dealer: 'Bushenyi Agro Centre', location: 'Bushenyi Town', stock: '120 bags', price: 45000, unit: 'bag', status: 'Verified', phone: '+256 772 000001', whatsapp: '256772000001', imageUrl: null, description: 'High-yielding hybrid maize seed. NARO-certified. Plant spacing 75×25cm. Matures in 90 days.', subcounty: 'Bushenyi Town' },
  { id: 'd2', item: 'DAP Fertilizer', category: 'Fertilizers', dealer: 'Agri Supplies Ishaka', location: 'Ishaka', stock: '80 bags', price: 120000, unit: '50kg bag', status: 'Verified', phone: '+256 772 000002', whatsapp: '256772000002', imageUrl: null, description: 'Di-Ammonium Phosphate. Ideal for maize, beans, and coffee at planting.', subcounty: 'Ishaka' },
  { id: 'd3', item: 'Tick Control Spray (Triatix)', category: 'Agrochemicals', dealer: 'Ishaka Vet Supplies', location: 'Ishaka', stock: '48 units', price: 28000, unit: 'litre', status: 'Verified', phone: '+256 772 000003', whatsapp: '256772000003', imageUrl: null, description: 'Amitraz-based acaricide for tick and mite control in cattle and dairy cows.', subcounty: 'Ishaka' },
  { id: 'd4', item: 'Bean Seed (K132)', category: 'Seeds', dealer: 'Bushenyi Agro Centre', location: 'Bushenyi Town', stock: '60 bags', price: 8000, unit: 'kg', status: 'Verified', phone: '+256 772 000001', whatsapp: '256772000001', imageUrl: null, description: 'Climbing bean variety. Disease-resistant. High protein content. 90-day maturity.', subcounty: 'Bushenyi Town' },
  { id: 'd5', item: 'Urea Fertilizer (46%N)', category: 'Fertilizers', dealer: 'Kakanju Farm Inputs', location: 'Kakanju', stock: '30 bags', price: 95000, unit: '50kg bag', status: 'Restocking soon', phone: '+256 772 000004', whatsapp: '256772000004', imageUrl: null, description: 'High-nitrogen fertilizer for top-dressing maize and coffee. Apply 6–8 weeks after planting.', subcounty: 'Kakanju' },
  { id: 'd6', item: 'Mancozeb Fungicide', category: 'Agrochemicals', dealer: 'Agri Supplies Ishaka', location: 'Ishaka', stock: '100 units', price: 12000, unit: '250g pack', status: 'Verified', phone: '+256 772 000002', whatsapp: '256772000002', imageUrl: null, description: 'Broad-spectrum fungicide for late blight on tomatoes and potatoes, and coffee rust.', subcounty: 'Ishaka' },
  { id: 'd7', item: 'Newcastle Vaccine (VIKTOVAC)', category: 'Animal Health', dealer: 'Ishaka Vet Supplies', location: 'Ishaka', stock: '200 doses', price: 3500, unit: 'dose', status: 'Verified', phone: '+256 772 000003', whatsapp: '256772000003', imageUrl: null, description: 'Live attenuated Newcastle disease vaccine for village poultry. Cold-chain maintained.', subcounty: 'Ishaka' },
  { id: 'd8', item: 'Coffee Seedlings (Robusta)', category: 'Seeds', dealer: 'Bushenyi Nursery', location: 'Bumbaire', stock: '5,000 seedlings', price: 500, unit: 'seedling', status: 'Verified', phone: '+256 772 000005', whatsapp: '256772000005', imageUrl: null, description: 'Certified Robusta coffee seedlings. Disease-tolerant. Ready to transplant at 6 months.', subcounty: 'Bumbaire' },
  { id: 'd9', item: 'Knapsack Sprayer (16L)', category: 'Tools & Equipment', dealer: 'Bushenyi Agro Centre', location: 'Bushenyi Town', stock: '25 units', price: 85000, unit: 'unit', status: 'Verified', phone: '+256 772 000001', whatsapp: '256772000001', imageUrl: null, description: 'Manual knapsack sprayer with adjustable nozzle. Suitable for field crop and livestock spraying.', subcounty: 'Bushenyi Town' },
]

const STATUS_COLORS = { Verified: { bg: '#dcfce7', color: '#166534' }, 'Restocking soon': { bg: '#fff7ed', color: '#9a3412' }, 'Pending inspection': { bg: '#fef9c3', color: '#854d0e' } }

function formatPrice(p) {
  return `UGX ${p.toLocaleString()}`
}

function ListingCard({ item, onView }) {
  const sc = STATUS_COLORS[item.status] ?? { bg: '#f3f4f6', color: '#374151' }
  return (
    <div className="mp-card">
      <div className="mp-card-img">
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.item} />
          : <div className="mp-card-img-placeholder"><span>🌿</span></div>}
        <span className="mp-card-status" style={{ background: sc.bg, color: sc.color }}>{item.status}</span>
        <span className="mp-card-category">{item.category}</span>
      </div>
      <div className="mp-card-body">
        <h3 className="mp-card-title">{item.item}</h3>
        <p className="mp-card-dealer">🏪 {item.dealer}</p>
        <p className="mp-card-location">📍 {item.location}</p>
        <p className="mp-card-stock">📦 {item.stock} available</p>
        <div className="mp-card-price">
          <strong>{formatPrice(item.price)}</strong>
          <span>/ {item.unit}</span>
        </div>
      </div>
      <div className="mp-card-footer">
        <button type="button" className="mp-btn-view" onClick={() => onView(item)}>View details</button>
        <a href={`https://wa.me/${item.whatsapp}?text=Hi, I saw your ${encodeURIComponent(item.item)} on AgroLink. Is it still available?`}
          target="_blank" rel="noreferrer" className="mp-btn-whatsapp">WhatsApp</a>
      </div>
    </div>
  )
}

function ListingModal({ item, onClose }) {
  if (!item) return null
  const sc = STATUS_COLORS[item.status] ?? { bg: '#f3f4f6', color: '#374151' }
  return (
    <>
      <div className="mp-modal-backdrop" onClick={onClose} />
      <div className="mp-modal" role="dialog" aria-modal="true" aria-label={item.item}>
        <div className="mp-modal-header">
          <div>
            <span className="mp-modal-category">{item.category}</span>
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
              <strong>{formatPrice(item.price)}</strong><span> / {item.unit}</span>
            </div>
            <span className="mp-modal-status" style={{ background: sc.bg, color: sc.color }}>{item.status}</span>
            <p className="mp-modal-desc">{item.description}</p>
            <div className="mp-modal-meta">
              <div><span>Dealer</span><strong>{item.dealer}</strong></div>
              <div><span>Location</span><strong>{item.location}</strong></div>
              <div><span>In stock</span><strong>{item.stock}</strong></div>
              <div><span>Phone</span><strong>{item.phone}</strong></div>
            </div>
            <div className="mp-modal-actions">
              <a href={`https://wa.me/${item.whatsapp}?text=Hi ${encodeURIComponent(item.dealer)}, I saw your ${encodeURIComponent(item.item)} listed on AgroLink. Is it still available?`}
                target="_blank" rel="noreferrer" className="mp-btn-whatsapp mp-btn-lg">
                💬 Chat on WhatsApp
              </a>
              <a href={`tel:${item.phone}`} className="mp-btn-call mp-btn-lg">
                📞 Call dealer
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function MarketplacePage() {
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('All')
  const [location, setLocation]   = useState('All locations')
  const [priceRange, setPriceRange] = useState('Any price')
  const [sortBy, setSortBy]       = useState('default')
  const [activeItem, setActiveItem] = useState(null)

  // price range filter logic
  function matchesPrice(item) {
    const p = item.price
    switch (priceRange) {
      case 'Under 10,000':        return p < 10000
      case '10,000–50,000':       return p >= 10000 && p <= 50000
      case '50,000–200,000':      return p > 50000 && p <= 200000
      case 'Over 200,000':        return p > 200000
      default:                    return true
    }
  }

  const filtered = DEMO_LISTINGS
    .filter(item => {
      const q = search.trim().toLowerCase()
      if (q && !item.item.toLowerCase().includes(q) &&
               !item.dealer.toLowerCase().includes(q) &&
               !item.description.toLowerCase().includes(q)) return false
      if (category !== 'All' && item.category !== category) return false
      if (location !== 'All locations' && item.subcounty !== location) return false
      if (!matchesPrice(item)) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'name')       return a.item.localeCompare(b.item)
      return 0
    })

  const verifiedCount = DEMO_LISTINGS.filter(i => i.status === 'Verified').length

  return (
    <SiteLayout
      title="Agro-Input Marketplace"
      subtitle="Find verified seeds, fertilizers, and agrochemicals from trusted dealers in Bushenyi District."
    >
      {/* stats strip */}
      <div className="mp-stats-strip">
        <div className="mp-stat"><strong>{DEMO_LISTINGS.length}</strong><span>Total listings</span></div>
        <div className="mp-stat"><strong>{verifiedCount}</strong><span>Verified products</span></div>
        <div className="mp-stat"><strong>{[...new Set(DEMO_LISTINGS.map(i => i.dealer))].length}</strong><span>Verified dealers</span></div>
        <div className="mp-stat"><strong>{[...new Set(DEMO_LISTINGS.map(i => i.subcounty))].length}</strong><span>Sub-counties covered</span></div>
      </div>

      <div className="mp-layout">
        {/* ── sidebar filters ── */}
        <aside className="mp-sidebar">
          <div className="mp-filter-group">
            <label className="mp-filter-label">Search</label>
            <div className="mp-search-wrap">
              <span className="mp-search-icon">🔍</span>
              <input
                className="mp-search"
                placeholder="Product, dealer, keyword…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
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
            <label className="mp-filter-label">Location</label>
            <select className="mp-select" value={location} onChange={e => setLocation(e.target.value)}>
              {SUB_COUNTIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="mp-filter-group">
            <label className="mp-filter-label">Price range (UGX)</label>
            <select className="mp-select" value={priceRange} onChange={e => setPriceRange(e.target.value)}>
              {PRICE_RANGES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="mp-filter-group">
            <label className="mp-filter-label">Sort by</label>
            <select className="mp-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Default</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          <button type="button" className="mp-reset"
            onClick={() => { setSearch(''); setCategory('All'); setLocation('All locations'); setPriceRange('Any price'); setSortBy('default') }}>
            Reset filters
          </button>

          {/* dealer CTA */}
          <div className="mp-dealer-cta">
            <strong>Are you a dealer?</strong>
            <p>Register and list your agro-inputs to reach farmers across Bushenyi District.</p>
            <NavLink to="/access" className="mp-dealer-cta-btn">List your products →</NavLink>
          </div>
        </aside>

        {/* ── listings grid ── */}
        <main className="mp-main">
          <div className="mp-results-bar">
            <span className="mp-results-count">
              {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
            </span>
            {filtered.length < DEMO_LISTINGS.length ? (
              <span className="mp-results-filtered">Filtered from {DEMO_LISTINGS.length} total</span>
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <div className="mp-empty">
              <span>🌿</span>
              <strong>No listings match your filters</strong>
              <p>Try a different category, location, or price range.</p>
              <button type="button" className="mp-reset"
                onClick={() => { setSearch(''); setCategory('All'); setLocation('All locations'); setPriceRange('Any price') }}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="mp-grid">
              {filtered.map((item, i) => (
                <Reveal key={item.id} delay={i * 40}>
                  <ListingCard item={item} onView={setActiveItem} />
                </Reveal>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* modal */}
      <ListingModal item={activeItem} onClose={() => setActiveItem(null)} />
    </SiteLayout>
  )
}

export default MarketplacePage
