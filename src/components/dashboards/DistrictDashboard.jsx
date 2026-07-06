import { useEffect, useState } from 'react'
import {
  AdvisoryFormCard,
  ChecklistCard,
  DashboardHero,
  FarmerFormCard,
  FeedCard,
  FiltersCard,
  InventoryFormCard,
  ManagementTable,
  OfficerResponseCard,
  ReportFormCard,
  RoleMismatchCard,
} from './shared'
import SlidePanel from './SlidePanel'
import DistrictAnalytics from './DistrictAnalytics'

/* ─── section config ───────────────────────────────────────────────────── */
const NAV_SECTIONS = [
  { key: 'situation', label: 'Situation Room',    icon: '🏛️', color: '#fef2f2' },
  { key: 'incidents', label: 'Incident Response', icon: '🚨', color: '#fff7ed' },
  { key: 'advisory',  label: 'Advisories',        icon: '📢', color: '#eff6ff' },
  { key: 'supply',    label: 'Supply Visibility',  icon: '📦', color: '#f0fdf4' },
  { key: 'farmers',   label: 'Farmer Profiles',   icon: '🌾', color: '#f5f3ff' },
  { key: 'analytics', label: 'Analytics',          icon: '📊', color: '#fafaf9' },
  { key: 'reports',   label: 'Submit Report',     icon: '📋', color: '#fafaf9' },
  { key: 'filters',   label: 'Filters',           icon: '🔍', color: '#f9fafb' },
  { key: 'records',   label: 'All Records',       icon: '🗂️',  color: '#f8fafc' },
]

const SECTION_META = {
  situation: { eyebrow: 'Situation Room',    title: 'District-wide operational overview',      text: 'Cross-cutting view of incidents, advisories, supply status, and farmer coverage.' },
  incidents: { eyebrow: 'Incident Response', title: 'Manage field incident reports',           text: 'Review, assign officers, and track resolution of all district-level reports.' },
  advisory:  { eyebrow: 'Advisories',        title: 'Publish and oversee district guidance',   text: 'Coordinate advisory publishing and review what guidance is currently in circulation.' },
  supply:    { eyebrow: 'Supply Visibility', title: 'Agro-input inventory and dealer records', text: 'Add and monitor verified stock lines and flag supply gaps before they affect farmers.' },
  farmers:   { eyebrow: 'Farmer Profiles',   title: 'Register and review farmer records',      text: 'Onboard farmers and review profile coverage across sub-counties.' },
  analytics: { eyebrow: 'District Analytics', title: 'Aggregated real-time metrics',           text: 'Live view of user registration, marketplace activity, report trends, and advisory reach.' },
  reports:   { eyebrow: 'Submit Report',     title: 'Log a district-level field observation',  text: 'Document an incident or concern directly from the district office.' },
  filters:   { eyebrow: 'Filters',           title: 'Filter the active records',               text: 'Narrow reports, inventory, and advisories by location, severity, or status.' },
  records:   { eyebrow: 'All Records',       title: 'Full district records table',             text: 'Structured table of all reports, advisories, and inventory across the district.' },
}

/* ─── component ────────────────────────────────────────────────────────── */
function DistrictDashboard({ context }) {
  const {
    advisories, canManageAdvisories, canManageReports, canManageStock,
    filteredInventory, filteredReports, isAuthorized,
    latestAdvisory, latestReport, latestVerifiedInput, metrics, role,
    rolePlaybook, state, workflowNudge, workspace, config, subview,
  } = context

  const [activePanel, setActivePanel] = useState(null)

  useEffect(() => {
    if (subview && subview !== 'overview') setActivePanel(subview)
    else setActivePanel(null)
  }, [subview])

  const open  = (key) => setActivePanel(key)
  const close = () => setActivePanel(null)

  /* ── panel renderers ─────────────────────────────────────────────────── */

  function renderSituationPanel() {
    const highCount   = state.reports.filter(r => r.severity === 'High').length
    const pendingCount= state.reports.filter(r => r.status === 'Pending field response').length
    const verifiedCount= state.inventory.filter(i => i.status === 'Verified').length

    return (
      <>
        <div className="screen-panel full-span">
          <article className="content-card">
            <div className="section-title">
              <span className="eyebrow">District Situation Room</span>
              <h3>Current operational picture</h3>
            </div>
            <p className="section-lead">
              An honest view of what is happening across all four pillars of the district agricultural system.
            </p>
            <div className="stat-grid" style={{ marginTop: '16px' }}>
              <div className="stat-card">
                <strong style={{ color: '#991b1b' }}>{highCount}</strong>
                <span>High-severity reports</span>
              </div>
              <div className="stat-card">
                <strong style={{ color: '#9a3412' }}>{pendingCount}</strong>
                <span>Pending officer response</span>
              </div>
              <div className="stat-card">
                <strong style={{ color: '#166534' }}>{verifiedCount}</strong>
                <span>Verified input lines</span>
              </div>
            </div>
            <div className="message-stack" style={{ marginTop: '16px' }}>
              <div className="message-card">
                <strong>Latest incident</strong>
                <p>{latestReport ? `${latestReport.title} in ${latestReport.location} — ${latestReport.status}.` : 'No active incidents.'}</p>
              </div>
              <div className="message-card">
                <strong>Latest advisory</strong>
                <p>{latestAdvisory ? `"${latestAdvisory.title}" — distributed via ${latestAdvisory.channel}.` : 'No advisories published yet.'}</p>
              </div>
              <div className="message-card">
                <strong>Supply watch</strong>
                <p>{latestVerifiedInput ? `${latestVerifiedInput.item} available at ${latestVerifiedInput.dealer}.` : 'No verified supply records yet.'}</p>
              </div>
            </div>
          </article>
        </div>
        <div className="screen-panel full-span">
          <FeedCard
            eyebrow="District Incident Monitor"
            title={workspace.spotlightTitle}
            lead="The most recent reports requiring oversight, escalation, or confirmation of field action."
            items={workspace.spotlight}
            emptyTitle="No incident records yet"
            emptyText="Reports will appear here as the district workflow grows."
          />
        </div>
      </>
    )
  }

  function renderIncidentsPanel() {
    return (
      <>
        <div className="screen-panel full-span">
          <OfficerResponseCard
            reports={state.reports}
            filteredReports={filteredReports}
            reportManagementForm={state.reportManagementForm}
            setReportManagementForm={state.setReportManagementForm}
            handleReportManagementSubmit={state.handleReportManagementSubmit}
          />
        </div>
        <div className="screen-panel full-span">
          <FeedCard
            eyebrow="Active Queue"
            title={workspace.spotlightTitle}
            lead="All active incidents — use the form above to assign, track, and resolve each one."
            items={workspace.spotlight}
            emptyTitle="No incidents"
            emptyText="Field reports will appear here as they are submitted."
          />
        </div>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="District Oversight Protocol"
            title="Managing incidents at scale"
            lead="A disciplined response workflow reduces escalation time and improves community trust."
            items={[
              'Prioritise High-severity reports for same-day officer assignment.',
              'Verify all reports before marking Resolved — check officer notes.',
              'Track officer workload to avoid response bottlenecks.',
              'Escalate unresolved High cases to district management after 48 hours.',
            ]}
          />
        </div>
      </>
    )
  }

  function renderAdvisoryPanel() {
    return (
      <>
        <div className="screen-panel">
          <AdvisoryFormCard
            advisoryForm={state.advisoryForm}
            setAdvisoryForm={state.setAdvisoryForm}
            handleAdvisorySubmit={state.handleAdvisorySubmit}
          />
        </div>
        <div className="screen-panel">
          <FeedCard
            eyebrow="Knowledge Feed"
            title={workspace.secondaryTitle}
            lead="Currently circulating advisories — compare against active incidents to identify coverage gaps."
            items={workspace.secondary}
            emptyTitle="No advisories yet"
            emptyText="Published advisories will appear here."
          />
        </div>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Advisory Oversight"
            title="District-level guidance management"
            lead="District teams coordinate advisory quality and ensure guidance matches what is happening on the ground."
            items={[
              'Cross-reference active incident reports before publishing new advisories.',
              'Ensure at least one advisory per active outbreak type is in circulation.',
              'Review channel selection — SMS reaches more farmers than web-only.',
              'Archive outdated advisories to keep the feed relevant.',
            ]}
          />
        </div>
      </>
    )
  }

  function renderSupplyPanel() {
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
          <FeedCard
            eyebrow="Supply Board"
            title={workspace.tertiaryTitle}
            lead="Verified input records from dealers — compare availability against current advisory recommendations."
            items={workspace.tertiary}
            emptyTitle="No supply records yet"
            emptyText="Dealer inventory entries will appear here once available."
          />
        </div>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Supply Management Tips"
            title="Ensuring input availability across the district"
            lead="Timely supply visibility prevents input shortages during critical planting and pest response windows."
            items={[
              'Flag districts with zero verified inputs for immediate outreach.',
              'Check if verified stock aligns with current advisory recommendations.',
              'Work with dealers to update Restocking Soon items before peak season.',
              'Report counterfeit or unverified products that appear in local markets.',
            ]}
          />
        </div>
      </>
    )
  }

  function renderFarmersPanel() {
    return (
      <>
        <div className="screen-panel">
          <FarmerFormCard
            farmerForm={state.farmerForm}
            setFarmerForm={state.setFarmerForm}
            handleFarmerSubmit={state.handleFarmerSubmit}
          />
        </div>
        <div className="screen-panel">
          <FeedCard
            eyebrow="Registered Farmers"
            title="Recently profiled farmers"
            lead="Farmer coverage across the district — verify parish and production focus are complete."
            items={state.farmers.slice(0, 6)}
            emptyTitle="No farmer profiles yet"
            emptyText="Registered farmers will appear here."
          />
        </div>
        <div className="screen-panel full-span">
          <article className="content-card">
            <div className="section-title">
              <span className="eyebrow">Coverage Metrics</span>
              <h3>Farmer registration by the numbers</h3>
            </div>
            <div className="stat-grid" style={{ marginTop: '16px' }}>
              <div className="stat-card">
                <strong>{state.farmers.length}</strong>
                <span>Total registered farmers</span>
              </div>
              <div className="stat-card">
                <strong>{[...new Set(state.farmers.map(f => f.parish).filter(Boolean))].length}</strong>
                <span>Parishes with coverage</span>
              </div>
              <div className="stat-card">
                <strong>{state.farmers.filter(f => f.focus).length}</strong>
                <span>With production focus set</span>
              </div>
            </div>
          </article>
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
            title="District-level observations worth logging"
            lead="District office reports carry institutional weight — use them for issues that need district-level response."
            items={[
              'Regional outbreaks not yet escalated by extension officers.',
              'Supply failures or suspected counterfeit inputs in local markets.',
              'Community concerns about crop losses across multiple sub-counties.',
              'Infrastructure or logistics problems affecting agricultural service delivery.',
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
      case 'analytics': return (
        <div className="screen-panel full-span">
          <article className="content-card">
            <div className="section-title">
              <span className="eyebrow">District Analytics</span>
              <h3>Aggregated real-time metrics</h3>
            </div>
            <DistrictAnalytics state={state} />
          </article>
        </div>
      )
      case 'situation': return renderSituationPanel()
      case 'incidents': return renderIncidentsPanel()
      case 'advisory':  return renderAdvisoryPanel()
      case 'supply':    return renderSupplyPanel()
      case 'farmers':   return renderFarmersPanel()
      case 'reports':   return renderReportsPanel()
      case 'filters':   return renderFiltersPanel()
      case 'records':   return renderRecordsPanel()
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
            <span className="eyebrow">District Agriculture Office</span>
            <h3>{state.currentProfile?.name ?? 'District Officer'}</h3>
            <p className="section-lead">
              {state.currentProfile?.district ?? 'Bushenyi District'} · Monitor incidents, coordinate advisories, and oversee supply and farmer coverage.
            </p>
          </div>
          <div className="farmer-welcome-quick">
            <button type="button" className="primary-button" onClick={() => open('situation')}>Open situation room</button>
            <button type="button" className="secondary-button" onClick={() => open('incidents')}>Manage incidents</button>
          </div>
        </div>
      </article>

      {/* live district signals */}
      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">District Overview</span>
          <h3>What is happening across the district</h3>
        </div>
        <div className="message-stack">
          <div className="message-card">
            <strong>Latest incident</strong>
            <p>{latestReport ? `${latestReport.title} in ${latestReport.location} — ${latestReport.status}.` : 'No active incidents.'}</p>
          </div>
          <div className="message-card">
            <strong>Latest advisory</strong>
            <p>{latestAdvisory ? `"${latestAdvisory.title}" via ${latestAdvisory.channel}.` : 'No advisories published yet.'}</p>
          </div>
          <div className="message-card">
            <strong>Supply watch</strong>
            <p>{latestVerifiedInput ? `${latestVerifiedInput.item} at ${latestVerifiedInput.dealer}.` : 'No verified supply yet.'}</p>
          </div>
        </div>
      </article>

      {/* playbook */}
      <ChecklistCard eyebrow="Today's Priorities" title="District oversight checklist" lead={workflowNudge} items={rolePlaybook} />

      {/* section nav */}
      <article className="content-card full-span">
        <div className="section-title">
          <span className="eyebrow">Your Workspace</span>
          <h3>Open a section to manage district operations</h3>
        </div>
        <p className="section-lead">Each section gives you a focused operational workspace. Start with the Situation Room for a full picture.</p>
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

      {/* incident feed */}
      <div className="full-span">
        <FeedCard
          eyebrow="Active Incidents"
          title={workspace.spotlightTitle}
          lead="The most recent reports requiring district-level oversight."
          items={workspace.spotlight}
          emptyTitle="No incidents yet"
          emptyText="Field reports will appear here as the district workflow grows."
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

export default DistrictDashboard
