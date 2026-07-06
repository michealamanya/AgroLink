import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChecklistCard,
  DashboardHero,
  FarmerIdentityCard,
  FarmerInputRequestCard,
  FarmerProfileManagerCard,
  FarmerReportManagerCard,
  FarmerSeasonPlannerCard,
  FeedCard,
  FiltersCard,
  ManagementTable,
  ReportFormCard,
  RoleMismatchCard,
} from './shared'
import SlidePanel from './SlidePanel'

/* ─── static data ─────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    q: 'How do I update my farm profile?',
    a: 'Go to the Profile section and fill in your parish, production focus, acreage, and season goal. Your profile drives personalized advisory delivery.',
  },
  {
    q: 'What happens after I submit a field report?',
    a: 'An extension officer is notified and assigned to follow up. Track the status of your report in the Reports section.',
  },
  {
    q: 'How are advisories personalized for me?',
    a: 'The platform matches advisory audience tags with your production focus. Keep your profile current for the best results.',
  },
  {
    q: 'Can I request specific farming inputs?',
    a: 'Yes. Use the Input Requests section to log what you need, quantity, and urgency. The request enters the supply tracking queue.',
  },
  {
    q: 'What is the Season Planner for?',
    a: 'It helps you organize tasks for the current farming cycle — planting, pest control, harvest planning — so nothing is missed.',
  },
  {
    q: 'How do I withdraw a report submitted by mistake?',
    a: 'In the Reports section, select the report and click "Withdraw report". This removes it from the active response queue.',
  },
]

const CONTACT_ITEMS = [
  {
    icon: '🌾',
    title: 'Extension Officer Support',
    detail: 'Your assigned extension officer handles field visits, advisory clarifications, and urgent incident follow-up.',
    cta: 'Log a field issue to get a response.',
  },
  {
    icon: '🏛️',
    title: 'District Agriculture Desk',
    detail: 'For district-level concerns, supply issues, or account access problems — contact the production and marketing office.',
    cta: 'Bushenyi District Production & Marketing Office',
  },
  {
    icon: '💻',
    title: 'Platform Access Support',
    detail: 'Need help with your account, role assignment, or login issues? Use the account page to manage your session.',
    cta: 'Visit the access page for account help.',
  },
]

/* ─── nav config ──────────────────────────────────────────────────────── */

const NAV_SECTIONS = [
  { key: 'profile',  label: 'Profile',   icon: '👤', color: '#e8f5e9' },
  { key: 'planner',  label: 'Planner',   icon: '📋', color: '#e3f2fd' },
  { key: 'requests', label: 'Requests',  icon: '📦', color: '#fff8e1' },
  { key: 'reports',  label: 'Reports',   icon: '⚠️', color: '#fce4ec' },
  { key: 'guidance', label: 'Guidance',  icon: '💡', color: '#f3e5f5' },
  { key: 'faq',      label: 'FAQs',      icon: '❓', color: '#e8eaf6' },
  { key: 'contact',  label: 'Contact',   icon: '📞', color: '#e0f7fa' },
]

const SECTION_META = {
  profile:  { eyebrow: 'My Profile',     title: 'Manage your farmer profile',       text: 'Keep your parish, production focus, and farm details current for better support.' },
  planner:  { eyebrow: 'Season Planner', title: 'Plan the current farming season',  text: 'Organize seasonal tasks and priorities in one clear workspace.' },
  requests: { eyebrow: 'Input Requests', title: 'Request the inputs you need',      text: 'Log seed, spray, or other input needs and track them against verified supply.' },
  reports:  { eyebrow: 'My Reports',     title: 'Field issue management',           text: 'Submit, update, and follow up on pest or disease reports from your farm.' },
  guidance: { eyebrow: 'Guidance',       title: 'Personalized farming advisories',  text: 'Advisories filtered to match your farm profile and production focus.' },
  faq:      { eyebrow: 'FAQs',           title: 'Common questions answered',        text: 'Quick answers to help you get the most from the AgroLink farmer workspace.' },
  contact:  { eyebrow: 'Contact',        title: 'Support and coordination',         text: 'Reach extension officers, the district desk, or platform support.' },
}

/* ─── FarmerDashboard ─────────────────────────────────────────────────── */

function FarmerDashboard({ context }) {
  const navigate = useNavigate()
  const {
    advisories,
    farmerActionPillars,
    farmerOperations,
    filteredInventory,
    filteredReports,
    farmerInputRequests,
    farmerOwnReports,
    farmerSeasonPlans,
    linkedFarmerProfile,
    isAuthorized,
    latestAdvisory,
    latestReport,
    latestVerifiedInput,
    metrics,
    personalizedAdvisories,
    role,
    rolePlaybook,
    state,
    subview,
    workflowNudge,
    workspace,
    config,
  } = context

  const [activePanel, setActivePanel] = useState(null)

  // Sync URL-based subview → open panel on mount / subview change
  useEffect(() => {
    if (subview && subview !== 'farm') {
      setActivePanel(subview)
    } else {
      setActivePanel(null)
    }
  }, [subview])

  // When panel opens/closes, lock body scroll
  useEffect(() => {
    document.body.style.overflow = activePanel ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activePanel])

  function openPanel(key) {
    setActivePanel(key)
    navigate(`/dashboard/farmer/${key}`, { replace: true })
  }

  function closePanel() {
    setActivePanel(null)
    navigate('/dashboard/farmer/farm', { replace: true })
  }

  /* ── panel content renderers ───────────────────────────────────────── */

  function renderProfilePanel() {
    return (
      <>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Profile Tips"
            title="Keep your identity accurate"
            lead="Your profile drives personalized advisory delivery and extension targeting."
            items={[
              'Update your production focus after any major change.',
              'Keep acreage current for planning support.',
              'Use a communication channel you check regularly.',
              'Refresh your season goal at the start of each cycle.',
            ]}
          />
        </div>
        <div className="screen-panel">
          <FarmerProfileManagerCard
            farmerProfileForm={state.farmerProfileForm}
            hasExistingProfile={Boolean(linkedFarmerProfile)}
            linkedProfile={linkedFarmerProfile}
            setFarmerProfileForm={state.setFarmerProfileForm}
            handleFarmerProfileSubmit={state.handleFarmerProfileSubmit}
          />
        </div>
        <div className="screen-panel">
          <FarmerIdentityCard
            linkedFarmerProfile={linkedFarmerProfile}
            farmerOwnReports={farmerOwnReports}
            farmerSeasonPlans={farmerSeasonPlans}
            farmerInputRequests={farmerInputRequests}
          />
        </div>
      </>
    )
  }

  function renderPlannerPanel() {
    return (
      <>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Planner Tips"
            title="Organize this season clearly"
            lead={workflowNudge}
            items={[
              'Capture each important task as a seasonal item.',
              'Separate planting, pest control, and harvest planning.',
              'Use notes for timing, labor, or risk reminders.',
              'Review the planner before each field work session.',
            ]}
          />
        </div>
        <div className="screen-panel">
          <FarmerSeasonPlannerCard
            seasonPlanForm={state.seasonPlanForm}
            setSeasonPlanForm={state.setSeasonPlanForm}
            handleSeasonPlanSubmit={state.handleSeasonPlanSubmit}
            handleSeasonPlanDelete={state.handleSeasonPlanDelete}
            farmerSeasonPlans={farmerSeasonPlans}
          />
        </div>
        <div className="screen-panel">
          <FeedCard
            eyebrow="Season Context"
            title="Signals affecting this season"
            lead="Use recent field activity to inform what should come first in your plan."
            items={workspace.spotlight}
            emptyTitle="No active signals yet"
            emptyText="Field activity will appear here when available."
          />
        </div>
      </>
    )
  }

  function renderRequestsPanel() {
    return (
      <>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Request Tips"
            title="Track the inputs you need"
            lead="Log supply needs early and track them against what is currently verified."
            items={[
              'Request inputs early before demand peaks.',
              'Be specific about quantity and urgency.',
              'Add notes when a request is tied to a field problem.',
              'Compare requests against verified stock availability.',
            ]}
          />
        </div>
        <div className="screen-panel">
          <FarmerInputRequestCard
            inputRequestForm={state.inputRequestForm}
            setInputRequestForm={state.setInputRequestForm}
            handleInputRequestSubmit={state.handleInputRequestSubmit}
            handleInputRequestDelete={state.handleInputRequestDelete}
            farmerInputRequests={farmerInputRequests}
          />
        </div>
        <div className="screen-panel">
          <FeedCard
            eyebrow="Available Inputs"
            title={workspace.tertiaryTitle}
            lead="Compare your requests with verified inputs currently on the platform."
            items={workspace.tertiary}
            emptyTitle="No verified inputs listed"
            emptyText="Verified input records will appear here once available."
          />
        </div>
      </>
    )
  }

  function renderReportsPanel() {
    return (
      <>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Reporting Tips"
            title="Manage issues from the field"
            lead="Accurate, timely reports help extension officers respond faster."
            items={[
              'Log issues as soon as symptoms appear.',
              'Update report details if the situation changes.',
              'Withdraw reports only when logged by mistake.',
              'Check status for officer follow-up progress.',
            ]}
          />
        </div>
        <div className="screen-panel">
          <ReportFormCard
            reportForm={state.reportForm}
            setReportForm={state.setReportForm}
            handleReportSubmit={state.handleReportSubmit}
          />
        </div>
        <div className="screen-panel">
          <FarmerReportManagerCard
            farmerOwnReports={farmerOwnReports}
            ownReportForm={state.ownReportForm}
            setOwnReportForm={state.setOwnReportForm}
            handleOwnReportUpdate={state.handleOwnReportUpdate}
            handleOwnReportDelete={state.handleOwnReportDelete}
          />
        </div>
        <div className="screen-panel full-span">
          <FeedCard
            eyebrow="My Reports"
            title="Issues you have submitted"
            lead="Track status updates and watch for officer responses."
            items={farmerOwnReports}
            emptyTitle="No reports submitted yet"
            emptyText="Once you log a field issue, it will appear here."
          />
        </div>
      </>
    )
  }

  function renderGuidancePanel() {
    return (
      <>
        <div className="screen-panel full-span">
          <FeedCard
            eyebrow="Personalized Advisories"
            title="Guidance matched to your farm"
            lead="These advisories align with your production focus and recent field activity."
            items={personalizedAdvisories}
            emptyTitle="No personalized advisories yet"
            emptyText="Set your production focus in your profile to start getting matched advisories."
          />
        </div>
        <div className="screen-panel">
          <article className="content-card">
            <div className="section-title">
              <span className="eyebrow">Current Signals</span>
              <h3>What the field is showing</h3>
            </div>
            <div className="message-stack">
              <div className="message-card">
                <strong>Latest advisory</strong>
                <p>{latestAdvisory ? `${latestAdvisory.title} — for ${latestAdvisory.audience}.` : 'No advisories published yet.'}</p>
              </div>
              <div className="message-card">
                <strong>Latest field report</strong>
                <p>{latestReport ? `${latestReport.title} in ${latestReport.location}: ${latestReport.status}.` : 'No field reports logged yet.'}</p>
              </div>
              <div className="message-card">
                <strong>Verified supply watch</strong>
                <p>{latestVerifiedInput ? `${latestVerifiedInput.item} available at ${latestVerifiedInput.dealer}.` : 'No verified inputs listed yet.'}</p>
              </div>
            </div>
          </article>
        </div>
        <div className="screen-panel">
          <FeedCard
            eyebrow="All Advisories"
            title={workspace.secondaryTitle}
            lead="General advisories published for all farmer groups."
            items={workspace.secondary}
            emptyTitle="No advisories yet"
            emptyText="Extension advisories will appear here when published."
          />
        </div>
      </>
    )
  }

  function renderFaqPanel() {
    return (
      <>
        <div className="screen-panel full-span">
          <article className="content-card">
            <div className="section-title">
              <span className="eyebrow">Help Centre</span>
              <h3>Common questions about your farmer dashboard</h3>
            </div>
            <p className="section-lead">
              Find quick answers about how the platform works so you can get the most from your workspace.
            </p>
            <div className="faq-grid" style={{ marginTop: '16px' }}>
              {FAQ_ITEMS.map((item) => (
                <div key={item.q} className="faq-card">
                  <strong>{item.q}</strong>
                  <p>{item.a}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
        <div className="screen-panel full-span">
          <article className="content-card">
            <div className="section-title">
              <span className="eyebrow">Still Need Help?</span>
              <h3>Use the right support channel</h3>
            </div>
            <div className="hero-cta-row">
              <button type="button" className="primary-button" onClick={() => openPanel('contact')}>
                Go to Contact
              </button>
              <button type="button" className="secondary-button" onClick={() => openPanel('reports')}>
                Log a field issue
              </button>
            </div>
          </article>
        </div>
      </>
    )
  }

  function renderContactPanel() {
    return (
      <>
        <div className="screen-panel full-span">
          <article className="content-card">
            <div className="section-title">
              <span className="eyebrow">Support Channels</span>
              <h3>Who to reach and how</h3>
            </div>
            <p className="section-lead">
              Use the right channel for your situation. Extension officers handle field issues; the district desk handles broader concerns.
            </p>
            <div className="contact-grid">
              {CONTACT_ITEMS.map((item) => (
                <div key={item.title} className="contact-card">
                  <div style={{ fontSize: '1.8rem', marginBottom: '8px' }} aria-hidden="true">{item.icon}</div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                  <span className="meta-note" style={{ marginTop: '8px', display: 'block', color: 'var(--green-solid)', fontWeight: 600 }}>{item.cta}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
        <div className="screen-panel">
          <article className="content-card">
            <div className="section-title">
              <span className="eyebrow">Quick Actions</span>
              <h3>Act right now</h3>
            </div>
            <div className="message-stack">
              <div className="message-card">
                <strong>Report a field issue</strong>
                <p>Submit a pest, disease, or weather damage report to trigger officer response.</p>
                <button type="button" className="primary-button" style={{ marginTop: '10px' }} onClick={() => openPanel('reports')}>
                  Go to Reports
                </button>
              </div>
              <div className="message-card">
                <strong>Request farming inputs</strong>
                <p>Log seed, spray, or other inputs you need before demand peaks.</p>
                <button type="button" className="secondary-button" style={{ marginTop: '10px' }} onClick={() => openPanel('requests')}>
                  Go to Requests
                </button>
              </div>
            </div>
          </article>
        </div>
        <div className="screen-panel">
          <ChecklistCard
            eyebrow="Contact Tips"
            title="Getting the right help faster"
            lead="A few things to know before reaching out."
            items={[
              'Extension officers respond to verified reports first.',
              'Include your parish and production focus in any request.',
              'For account issues, use the access page.',
              'District-level concerns go to the production office.',
            ]}
          />
        </div>
      </>
    )
  }

  function getPanelContent(key) {
    switch (key) {
      case 'profile':  return renderProfilePanel()
      case 'planner':  return renderPlannerPanel()
      case 'requests': return renderRequestsPanel()
      case 'reports':  return renderReportsPanel()
      case 'guidance': return renderGuidancePanel()
      case 'faq':      return renderFaqPanel()
      case 'contact':  return renderContactPanel()
      default:         return null
    }
  }

  /* ── main dashboard render ─────────────────────────────────────────── */

  return (
    <section className="page-grid farmer-dashboard">

      {/* Hero stays visible always */}
      <DashboardHero
        role={role}
        config={config}
        metrics={metrics}
        statusMessage={state.statusMessage}
      />

      {!isAuthorized ? (
        <RoleMismatchCard currentRole={state.currentRole} role={role} />
      ) : null}

      {/* ── Welcome banner ── */}
      <article className="content-card full-span farmer-welcome-card">
        <div className="farmer-welcome-inner">
          <div className="farmer-welcome-copy">
            <span className="eyebrow">Welcome back</span>
            <h3>
              {linkedFarmerProfile?.name ?? state.currentProfile?.name ?? 'Farmer'}
            </h3>
            <p className="section-lead">
              {linkedFarmerProfile
                ? `${linkedFarmerProfile.parish} · ${linkedFarmerProfile.focus}`
                : 'Set up your profile to get personalized support and advisories.'}
            </p>
          </div>
          <div className="farmer-welcome-quick">
            <button type="button" className="primary-button" onClick={() => openPanel('reports')}>
              Log field issue
            </button>
            <button type="button" className="secondary-button" onClick={() => openPanel('guidance')}>
              View guidance
            </button>
          </div>
        </div>
      </article>

      {/* ── Farm identity card ── */}
      <div className="full-span">
        <FarmerIdentityCard
          linkedFarmerProfile={linkedFarmerProfile}
          farmerOwnReports={farmerOwnReports}
          farmerSeasonPlans={farmerSeasonPlans}
          farmerInputRequests={farmerInputRequests}
        />
      </div>

      {/* ── Live signals ── */}
      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Live Signals</span>
          <h3>What's happening now</h3>
        </div>
        <div className="message-stack">
          <div className="message-card">
            <strong>Latest advisory</strong>
            <p>{latestAdvisory ? `${latestAdvisory.title} — for ${latestAdvisory.audience}.` : 'No advisories published yet.'}</p>
          </div>
          <div className="message-card">
            <strong>Latest field report</strong>
            <p>{latestReport ? `${latestReport.title} in ${latestReport.location}: ${latestReport.status}.` : 'No field reports logged yet.'}</p>
          </div>
          <div className="message-card">
            <strong>Verified input watch</strong>
            <p>{latestVerifiedInput ? `${latestVerifiedInput.item} at ${latestVerifiedInput.dealer}.` : 'No verified inputs listed yet.'}</p>
          </div>
        </div>
      </article>

      {/* ── Today's playbook ── */}
      <ChecklistCard
        eyebrow="Today's Playbook"
        title="What to focus on"
        lead={workflowNudge}
        items={rolePlaybook}
      />

      {/* ── Section nav grid ── */}
      <article className="content-card full-span">
        <div className="section-title">
          <span className="eyebrow">Your Workspace</span>
          <h3>Open a section to get started</h3>
        </div>
        <p className="section-lead">
          Each section opens as its own focused workspace. You can go back to this home view any time.
        </p>
        <div className="farmer-section-grid">
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.key}
              type="button"
              className="farmer-section-card"
              style={{ '--section-color': section.color }}
              onClick={() => openPanel(section.key)}
            >
              <span className="farmer-section-icon" aria-hidden="true">{section.icon}</span>
              <strong className="farmer-section-label">{section.label}</strong>
              <span className="farmer-section-desc">{SECTION_META[section.key]?.text}</span>
              <span className="farmer-section-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </article>

      {/* ── Recent activity feed ── */}
      <div className="full-span">
        <FeedCard
          eyebrow="Recent Field Activity"
          title={workspace.spotlightTitle}
          lead="The latest reports and signals that need attention."
          items={workspace.spotlight}
          emptyTitle="No activity yet"
          emptyText="Field reports will show here once created."
        />
      </div>

      {/* ── Filters card ── */}
      <FiltersCard filters={state.filters} setFilters={state.setFilters} />

      {/* ── Management table (read-only for farmer) ── */}
      <div className="full-span">
        <ManagementTable
          advisories={advisories}
          canManageAdvisories={false}
          canManageReports={false}
          canManageStock={false}
          filteredInventory={filteredInventory}
          filteredReports={filteredReports}
          handleAdvisoryChannelChange={state.handleAdvisoryChannelChange}
          handleAdvisoryDelete={state.handleAdvisoryDelete}
          handleInventoryDelete={state.handleInventoryDelete}
          handleInventoryStatusChange={state.handleInventoryStatusChange}
          handleReportStatusChange={state.handleReportStatusChange}
        />
      </div>

      {/* ── Slide panels — rendered per section ── */}
      {NAV_SECTIONS.map((section) => (
        <SlidePanel
          key={section.key}
          sectionKey={section.key}
          meta={SECTION_META}
          open={activePanel === section.key}
          onClose={closePanel}
        >
          {getPanelContent(section.key)}
        </SlidePanel>
      ))}

    </section>
  )
}

export default FarmerDashboard
