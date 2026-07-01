import { useState } from 'react'
import {
  ChecklistCard,
  DashboardHero,
  FeedCard,
  FiltersCard,
  InventoryFormCard,
  ManagementTable,
  ReportFormCard,
  RoleMismatchCard,
} from './shared'
import SlidePanel from './SlidePanel'

/* ─── section config ───────────────────────────────────────────────────── */
const NAV_SECTIONS = [
  { key: 'stock',    label: 'Stock Board',     icon: '📦', color: '#f0fdf4' },
  { key: 'add',      label: 'Add Stock',        icon: '➕', color: '#eff6ff' },
  { key: 'demand',   label: 'Demand Signals',   icon: '📊', color: '#fff7ed' },
  { key: 'guidance', label: 'Guidance',         icon: '💡', color: '#f5f3ff' },
  { key: 'reports',  label: 'Field Reports',    icon: '⚠️', color: '#fef2f2' },
  { key: 'filters',  label: 'Filters',          icon: '🔍', color: '#f9fafb' },
  { key: 'records',  label: 'All Records',      icon: '🗂️',  color: '#fafaf9' },
]

const SECTION_META = {
  stock:    { eyebrow: 'Stock Board',     title: 'Current inventory and availability',    text: 'View verified stock lines and spot what needs restocking.' },
  add:      { eyebrow: 'Add Stock',       title: 'Add or update a stock record',          text: 'Log new agro-input stock with verification status and dealer details.' },
  demand:   { eyebrow: 'Demand Signals',  title: 'Field issues driving input demand',     text: 'Monitor reports and incidents that signal what farmers urgently need.' },
  guidance: { eyebrow: 'Guidance',        title: 'Extension advisories to align with',    text: 'Stay aligned with current field guidance so your stock choices support it.' },
  reports:  { eyebrow: 'Field Reports',   title: 'Report a supply issue from the field',  text: 'Log a pest, disease, or supply chain issue you have observed.' },
  filters:  { eyebrow: 'Filters',         title: 'Filter active records',                 text: 'Narrow inventory and reports by status, location, or keyword.' },
  records:  { eyebrow: 'All Records',     title: 'Full operational records table',        text: 'Structured view of inventory, reports, and advisories.' },
}

/* ─── component ────────────────────────────────────────────────────────── */
function DealerDashboard({ context }) {
  const {
    advisories, canManageAdvisories, canManageReports, canManageStock,
    filteredInventory, filteredReports, isAuthorized,
    latestReport, latestVerifiedInput, metrics, role,
    rolePlaybook, state, workflowNudge, workspace, config,
  } = context

  const [activePanel, setActivePanel] = useState(null)
  const open  = (key) => setActivePanel(key)
  const close = () => setActivePanel(null)

  /* ── panel renderers ─────────────────────────────────────────────────── */

  function renderStockPanel() {
    return (
      <>
        <div className="screen-panel full-span">
          <FeedCard
            eyebrow="Current Stock"
            title={workspace.spotlightTitle}
            lead="All active inventory lines — check verification status and restock levels."
            items={workspace.spotlight}
            emptyTitle="No stock records yet"
            emptyText="Add your first inventory listing using the Add Stock section."
          />
        </div>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Stock Management Tips"
            title="Keeping your inventory accurate and trusted"
            lead="Accurate stock data helps farmers make buying decisions and builds dealer credibility."
            items={[
              'Update stock quantities weekly — especially before planting seasons.',
              'Mark items as Restocking Soon before they actually run out.',
              'Only mark Verified if the item has passed a quality check.',
              'Use consistent item names so farmers can search and find your stock.',
            ]}
          />
        </div>
      </>
    )
  }

  function renderAddPanel() {
    return (
      <>
        <div className="screen-panel">
          <InventoryFormCard
            inventoryForm={state.inventoryForm}
            setInventoryForm={state.setInventoryForm}
            handleInventorySubmit={state.handleInventorySubmit}
          />
        </div>
        <div className="screen-panel">
          <article className="content-card">
            <div className="section-title">
              <span className="eyebrow">Verification Guide</span>
              <h3>What each status means</h3>
            </div>
            <div className="message-stack">
              <div className="message-card">
                <strong>Verified</strong>
                <p>The item has passed a quality check and is confirmed available at the listed quantity.</p>
              </div>
              <div className="message-card">
                <strong>Pending inspection</strong>
                <p>The item is in stock but has not yet been quality-checked. Do not mark Verified until confirmed.</p>
              </div>
              <div className="message-card">
                <strong>Restocking soon</strong>
                <p>Current stock is low or depleted. A new shipment is expected — list this so farmers plan ahead.</p>
              </div>
            </div>
          </article>
        </div>
      </>
    )
  }

  function renderDemandPanel() {
    return (
      <>
        <div className="screen-panel full-span">
          <FeedCard
            eyebrow="Active Reports"
            title={workspace.secondaryTitle}
            lead="Field incidents that signal demand — armyworm outbreaks drive pesticide needs, dry spells drive early-maturing seed demand."
            items={workspace.secondary}
            emptyTitle="No demand signals yet"
            emptyText="Field reports will appear here when there is new activity from farmers and extension officers."
          />
        </div>
        <div className="screen-panel full-span">
          <article className="content-card">
            <div className="section-title">
              <span className="eyebrow">Reading Demand Signals</span>
              <h3>How to act on field reports</h3>
            </div>
            <div className="message-stack">
              <div className="message-card">
                <strong>High severity reports</strong>
                <p>Indicate immediate demand for crop protection or emergency inputs. Prioritise stocking those items.</p>
              </div>
              <div className="message-card">
                <strong>Location clusters</strong>
                <p>Multiple reports from the same parish suggest a spreading problem — increase supply for that area.</p>
              </div>
              <div className="message-card">
                <strong>Advisory-driven demand</strong>
                <p>When extension officers publish guidance recommending specific inputs, expect a stock surge.</p>
              </div>
            </div>
          </article>
        </div>
      </>
    )
  }

  function renderGuidancePanel() {
    return (
      <>
        <div className="screen-panel full-span">
          <FeedCard
            eyebrow="Current Advisories"
            title={workspace.tertiaryTitle}
            lead="Extension guidance that affects what inputs farmers are likely to request. Stock accordingly."
            items={workspace.tertiary}
            emptyTitle="No advisories published yet"
            emptyText="Extension advisories will appear here once published."
          />
        </div>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Aligning with Extension"
            title="Stocking in sync with field guidance"
            lead="Dealers who align stock with current advisories reduce farmer confusion and increase trust."
            items={[
              'Check active advisories weekly for recommended product types.',
              'Flag any mismatch between advisory recommendations and your stock.',
              'Coordinate with extension officers during outbreak response.',
              'Share your verified stock updates so advisories can reference availability.',
            ]}
          />
        </div>
      </>
    )
  }

  function renderReportsPanel() {
    return (
      <>
        <div className="screen-panel">
          <ReportFormCard
            reportForm={state.reportForm}
            setReportForm={state.setReportForm}
            handleReportSubmit={state.handleReportSubmit}
          />
        </div>
        <div className="screen-panel">
          <ChecklistCard
            eyebrow="What to Report"
            title="Supply chain and field issues dealers should log"
            lead="Dealers are often the first to hear about emerging problems. Your reports improve district response."
            items={[
              'Counterfeit or suspicious products appearing in the market.',
              'Sudden spikes in demand for a specific input — signals a new outbreak.',
              'Farmers reporting input failures or unexpected crop damage.',
              'Supply disruptions that will leave farmers without critical inputs.',
            ]}
          />
        </div>
      </>
    )
  }

  function renderFiltersPanel() {
    return (
      <div className="screen-panel full-span">
        <FiltersCard filters={state.filters} setFilters={state.setFilters} />
      </div>
    )
  }

  function renderRecordsPanel() {
    return (
      <div className="screen-panel full-span">
        <ManagementTable
          advisories={advisories}
          canManageAdvisories={canManageAdvisories}
          canManageReports={canManageReports}
          canManageStock={canManageStock}
          filteredInventory={filteredInventory}
          filteredReports={filteredReports}
          handleAdvisoryChannelChange={state.handleAdvisoryChannelChange}
          handleAdvisoryDelete={state.handleAdvisoryDelete}
          handleInventoryDelete={state.handleInventoryDelete}
          handleInventoryStatusChange={state.handleInventoryStatusChange}
          handleReportStatusChange={state.handleReportStatusChange}
        />
      </div>
    )
  }

  function getPanelContent(key) {
    switch (key) {
      case 'stock':    return renderStockPanel()
      case 'add':      return renderAddPanel()
      case 'demand':   return renderDemandPanel()
      case 'guidance': return renderGuidancePanel()
      case 'reports':  return renderReportsPanel()
      case 'filters':  return renderFiltersPanel()
      case 'records':  return renderRecordsPanel()
      default: return null
    }
  }

  /* ── home screen ─────────────────────────────────────────────────────── */
  return (
    <section className="page-grid">
      <DashboardHero role={role} config={config} metrics={metrics} statusMessage={state.statusMessage} />

      {!isAuthorized ? <RoleMismatchCard currentRole={state.currentRole} role={role} /> : null}

      {/* welcome */}
      <article className="content-card full-span farmer-welcome-card">
        <div className="farmer-welcome-inner">
          <div className="farmer-welcome-copy">
            <span className="eyebrow">Agro-Input Dealer Workspace</span>
            <h3>{state.currentProfile?.name ?? 'Dealer'}</h3>
            <p className="section-lead">
              Manage your stock visibility, track demand signals, and stay aligned with extension guidance.
            </p>
          </div>
          <div className="farmer-welcome-quick">
            <button type="button" className="primary-button" onClick={() => open('add')}>Add stock record</button>
            <button type="button" className="secondary-button" onClick={() => open('stock')}>View stock board</button>
          </div>
        </div>
      </article>

      {/* supply snapshot */}
      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Supply Snapshot</span>
          <h3>Stock readiness and demand signals</h3>
        </div>
        <div className="message-stack">
          <div className="message-card">
            <strong>Latest verified stock</strong>
            <p>{latestVerifiedInput ? `${latestVerifiedInput.item} listed by ${latestVerifiedInput.dealer}.` : 'No verified stock listed yet.'}</p>
          </div>
          <div className="message-card">
            <strong>Latest field pressure</strong>
            <p>{latestReport ? `${latestReport.title} in ${latestReport.location} may influence local input demand.` : 'No field issues logged yet.'}</p>
          </div>
          <div className="message-card">
            <strong>Verified lines</strong>
            <p>{state.inventory.filter(i => i.status === 'Verified').length} verified stock line(s) currently active in the system.</p>
          </div>
        </div>
      </article>

      {/* playbook */}
      <ChecklistCard eyebrow="Today's Priorities" title="Dealer supply checklist" lead={workflowNudge} items={rolePlaybook} />

      {/* section nav */}
      <article className="content-card full-span">
        <div className="section-title">
          <span className="eyebrow">Your Workspace</span>
          <h3>Open a section to manage supply</h3>
        </div>
        <p className="section-lead">Each section gives you a focused workspace. Start with stock, then check demand signals.</p>
        <div className="farmer-section-grid">
          {NAV_SECTIONS.map((s) => (
            <button key={s.key} type="button" className="farmer-section-card"
              style={{ '--section-color': s.color }} onClick={() => open(s.key)}>
              <span className="farmer-section-icon" aria-hidden="true">{s.icon}</span>
              <strong className="farmer-section-label">{s.label}</strong>
              <span className="farmer-section-desc">{SECTION_META[s.key]?.text}</span>
              <span className="farmer-section-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </article>

      {/* stock feed */}
      <div className="full-span">
        <FeedCard
          eyebrow="Current Stock Board"
          title={workspace.spotlightTitle}
          lead="Your active inventory lines — click Add Stock to update."
          items={workspace.spotlight}
          emptyTitle="No stock records yet"
          emptyText="Add your first inventory listing to make your stock visible to farmers."
        />
      </div>

      {/* panels */}
      {NAV_SECTIONS.map((s) => (
        <SlidePanel key={s.key} sectionKey={s.key} meta={SECTION_META} open={activePanel === s.key} onClose={close}>
          {getPanelContent(s.key)}
        </SlidePanel>
      ))}
    </section>
  )
}

export default DealerDashboard
