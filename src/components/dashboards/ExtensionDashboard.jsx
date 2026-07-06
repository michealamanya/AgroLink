import { useEffect, useState } from 'react'
import {
  AdvisoryFormCard,
  ChecklistCard,
  DashboardHero,
  FarmerFormCard,
  FeedCard,
  FiltersCard,
  ManagementTable,
  OfficerResponseCard,
  ReportFormCard,
  RoleMismatchCard,
} from './shared'
import SlidePanel from './SlidePanel'

/* ─── section config ───────────────────────────────────────────────────── */
const NAV_SECTIONS = [
  { key: 'queue',    label: 'Response Queue', icon: '🚨', color: '#fef2f2' },
  { key: 'farmers',  label: 'Farmer Support', icon: '🌾', color: '#f0fdf4' },
  { key: 'advisory', label: 'Advisories',     icon: '📢', color: '#eff6ff' },
  { key: 'reports',  label: 'Field Reports',  icon: '📋', color: '#fff7ed' },
  { key: 'filters',  label: 'Filters',        icon: '🔍', color: '#f5f3ff' },
  { key: 'records',  label: 'All Records',    icon: '🗂️',  color: '#f9fafb' },
]

const SECTION_META = {
  queue:    { eyebrow: 'Response Queue',  title: 'Active field incident queue',         text: 'Assign officers to pending reports and track resolution progress.' },
  farmers:  { eyebrow: 'Farmer Support',  title: 'Register and manage farmer profiles', text: 'Onboard farmers, review existing profiles, and guide advisory targeting.' },
  advisory: { eyebrow: 'Advisories',      title: 'Publish and manage guidance',         text: 'Write targeted advisories and push them through the right channels.' },
  reports:  { eyebrow: 'Field Reports',   title: 'Submit a field observation',          text: 'Log a new incident directly from the field as an extension officer.' },
  filters:  { eyebrow: 'Filters',         title: 'Filter active records',               text: 'Narrow reports and inventory by location, severity, or status.' },
  records:  { eyebrow: 'All Records',     title: 'Full operational records table',      text: 'Review all reports, advisories, and inventory in one structured view.' },
}

/* ─── component ────────────────────────────────────────────────────────── */
function ExtensionDashboard({ context }) {
  const {
    advisories, canManageAdvisories, canManageReports, canManageStock,
    filteredInventory, filteredReports, isAuthorized, metrics, role,
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

  function renderQueuePanel() {
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
            eyebrow="Active Incidents"
            title={workspace.spotlightTitle}
            lead="Reports needing verification, assignment, or direct follow-up — prioritise by severity and location."
            items={workspace.spotlight}
            emptyTitle="No active incidents"
            emptyText="Submitted field reports will appear here as they arrive."
          />
        </div>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Response Protocol"
            title="How to handle incoming reports"
            lead="A consistent response process reduces resolution time and improves farmer trust."
            items={[
              'Triage by severity — High reports get same-day officer assignment.',
              'Assign the officer closest to the reported location first.',
              'Add resolution notes even for unresolved cases to track progress.',
              'Mark Resolved only after physical field confirmation.',
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
            eyebrow="Recently Registered"
            title={workspace.secondaryTitle}
            lead="Newly profiled farmers — check parish, focus, and contact channel are filled in correctly."
            items={workspace.secondary}
            emptyTitle="No farmer profiles yet"
            emptyText="Registered farmers appear here for extension follow-up and advisory targeting."
          />
        </div>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Onboarding Tips"
            title="What makes a useful farmer profile"
            lead="Complete profiles let the system match advisories to the right audience automatically."
            items={[
              'Record the parish accurately — advisories filter by location.',
              'Use production focus to match farmers with relevant guidance.',
              'Confirm the preferred contact channel before they leave.',
              'Update profiles after major land or crop changes.',
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
            eyebrow="Published Guidance"
            title={workspace.tertiaryTitle}
            lead="Recently published advisories — check for gaps before publishing new ones."
            items={workspace.tertiary}
            emptyTitle="No advisories published yet"
            emptyText="Guidance you publish will appear here for review and channel tracking."
          />
        </div>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Advisory Quality"
            title="Writing guidance farmers actually use"
            lead="Clear, actionable advisories outperform long technical documents every time."
            items={[
              'Target a specific audience — not all farmers at once.',
              'Lead with the action, then explain the reason.',
              'Match the channel to how that audience receives information.',
              'Follow up with field officers to confirm delivery reach.',
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
            eyebrow="Before You Submit"
            title="What to capture in a field report"
            lead="An accurate first report saves multiple follow-up visits."
            items={[
              'Describe what you observed — symptoms, not just a label.',
              'Log the specific village or plot location.',
              'Set severity based on spread, not just visible damage.',
              'Submit immediately — early reports get faster response.',
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
      case 'queue':    return renderQueuePanel()
      case 'farmers':  return renderFarmersPanel()
      case 'advisory': return renderAdvisoryPanel()
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

      {/* welcome banner */}
      <article className="content-card full-span farmer-welcome-card">
        <div className="farmer-welcome-inner">
          <div className="farmer-welcome-copy">
            <span className="eyebrow">Extension Officer Workspace</span>
            <h3>{state.currentProfile?.name ?? 'Extension Officer'}</h3>
            <p className="section-lead">
              {state.currentProfile?.district ?? 'Bushenyi District'} · Respond to incidents, publish advisories, and support farmer onboarding.
            </p>
          </div>
          <div className="farmer-welcome-quick">
            <button type="button" className="primary-button" onClick={() => open('queue')}>Open response queue</button>
            <button type="button" className="secondary-button" onClick={() => open('advisory')}>Publish advisory</button>
          </div>
        </div>
      </article>

      {/* live signals */}
      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Live Signals</span>
          <h3>What needs attention now</h3>
        </div>
        <div className="message-stack">
          <div className="message-card">
            <strong>Pending reports</strong>
            <p>{state.reports.filter(r => r.status === 'Pending field response').length} report(s) are waiting for officer assignment.</p>
          </div>
          <div className="message-card">
            <strong>Latest incident</strong>
            <p>{workspace.spotlight[0] ? `${workspace.spotlight[0].title} in ${workspace.spotlight[0].location} — ${workspace.spotlight[0].status}` : 'No active incidents.'}</p>
          </div>
          <div className="message-card">
            <strong>Latest advisory</strong>
            <p>{workspace.tertiary[0] ? `${workspace.tertiary[0].title} targeting ${workspace.tertiary[0].audience}` : 'No advisories published yet.'}</p>
          </div>
        </div>
      </article>

      {/* today's playbook */}
      <ChecklistCard eyebrow="Today's Priorities" title="Extension officer workflow" lead={workflowNudge} items={rolePlaybook} />

      {/* section nav */}
      <article className="content-card full-span">
        <div className="section-title">
          <span className="eyebrow">Your Workspace</span>
          <h3>Open a section to act</h3>
        </div>
        <p className="section-lead">Each section opens as a focused workspace. Use the response queue first, then move to advisory publishing.</p>
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

      {/* recent reports feed */}
      <div className="full-span">
        <FeedCard
          eyebrow="Recent Field Reports"
          title={workspace.spotlightTitle}
          lead="The most recent incidents requiring extension attention."
          items={workspace.spotlight}
          emptyTitle="No reports yet"
          emptyText="Field reports will show here as farmers and officers submit them."
        />
      </div>

      {/* slide panels */}
      {NAV_SECTIONS.map((s) => (
        <SlidePanel key={s.key} sectionKey={s.key} meta={SECTION_META} open={activePanel === s.key} onClose={close}>
          {getPanelContent(s.key)}
        </SlidePanel>
      ))}
    </section>
  )
}

export default ExtensionDashboard
