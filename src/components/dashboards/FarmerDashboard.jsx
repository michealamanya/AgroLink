import { useEffect, useRef } from 'react'
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

  const subviewMeta = {
    farm: {
      eyebrow: 'My Farm',
      title: 'Farmer overview workspace',
      text: 'This screen brings together your farm identity, current signals, and operational records in one place.',
    },
    profile: {
      eyebrow: 'My Profile',
      title: 'Manage farmer profile details',
      text: 'Update the farm record that powers personalized advisory delivery and extension support.',
    },
    planner: {
      eyebrow: 'Season Planner',
      title: 'Plan the current season clearly',
      text: 'Track your seasonal tasks and priorities so the dashboard reflects what matters right now.',
    },
    requests: {
      eyebrow: 'Input Requests',
      title: 'Request the farm inputs you need',
      text: 'Log the supplies you need so your dashboard becomes an operational request workspace, not just an information page.',
    },
    reports: {
      eyebrow: 'My Reports',
      title: 'Manage the issues you reported',
      text: 'Create, update, and follow up on field reports you personally submitted through the platform.',
    },
    guidance: {
      eyebrow: 'Guidance',
      title: 'View personalized farming guidance',
      text: 'See advisories and supporting updates that better match your production focus and current farm context.',
    },
  }

  const activeScreen = subviewMeta[subview] ?? subviewMeta.farm
  const screenWorkspaceRef = useRef(null)

  useEffect(() => {
    screenWorkspaceRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [subview])

  function renderFarmHome() {
    return (
      <>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Farm Workspace"
            title="Your main farmer overview"
            lead="This is the home screen for your personalized farmer account."
            items={farmerActionPillars}
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
        <div className="screen-panel">
          <article className="content-card">
            <div className="section-title">
              <span className="eyebrow">Farmer Snapshot</span>
              <h3>Recent guidance, reports, and supply signals</h3>
            </div>
            <div className="message-stack">
              <div className="message-card">
                <strong>Latest advisory</strong>
                <p>
                  {latestAdvisory
                    ? `${latestAdvisory.title} for ${latestAdvisory.audience}.`
                    : 'No advisory has been published yet.'}
                </p>
              </div>
              <div className="message-card">
                <strong>Latest field report</strong>
                <p>
                  {latestReport
                    ? `${latestReport.title} in ${latestReport.location} is currently ${latestReport.status}.`
                    : 'No field reports have been logged yet.'}
                </p>
              </div>
              <div className="message-card">
                <strong>Verified input watch</strong>
                <p>
                  {latestVerifiedInput
                    ? `${latestVerifiedInput.item} is available through ${latestVerifiedInput.dealer}.`
                    : 'No verified input listing is visible yet.'}
                </p>
              </div>
            </div>
          </article>
        </div>
        <div className="screen-panel full-span">
          <FeedCard
            eyebrow="Live Workspace"
            title={workspace.spotlightTitle}
            lead="This board highlights the records that need the quickest attention in the current workflow."
            items={workspace.spotlight}
            emptyTitle="Nothing active yet"
            emptyText="Once new field activity is captured, this space becomes the first place to review it."
          />
        </div>
        <div className="screen-panel full-span">
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
      </>
    )
  }

  function renderProfileScreen() {
    return (
      <>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Profile Workspace"
            title="Keep your farmer identity accurate"
            lead="This screen is dedicated to your personal farm record and the details that power personalized support."
            items={[
              'Update your production focus after any major change.',
              'Keep acreage details current for planning support.',
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

  function renderPlannerScreen() {
    return (
      <>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Planner Workspace"
            title="Organize this season around clear priorities"
            lead={workflowNudge}
            items={[
              'Capture each important task as a seasonal item.',
              'Separate planting, pest control, and harvest planning clearly.',
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
            farmerSeasonPlans={farmerSeasonPlans}
          />
        </div>
        <div className="screen-panel">
          <FeedCard
            eyebrow="Planner Context"
            title="Signals affecting this season"
            lead="Use recent operational signals to inform what should come first in your plan."
            items={workspace.spotlight}
            emptyTitle="No active signals yet"
            emptyText="Field activity and advisory updates will appear here when available."
          />
        </div>
      </>
    )
  }

  function renderRequestsScreen() {
    return (
      <>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Request Workspace"
            title="Track the inputs you need to keep moving"
            lead="This screen focuses on the practical supply side of your farming cycle."
            items={[
              'Request inputs early before demand peaks.',
              'Be clear about quantity and urgency.',
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
            farmerInputRequests={farmerInputRequests}
          />
        </div>
        <div className="screen-panel">
          <FeedCard
            eyebrow="Reference Board"
            title={workspace.tertiaryTitle}
            lead="Compare your requests with the latest verified inputs visible in the platform."
            items={workspace.tertiary}
            emptyTitle="Reference board is empty"
            emptyText="Verified input records will appear here once they are available."
          />
        </div>
      </>
    )
  }

  function renderReportsScreen() {
    return (
      <>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Reports Workspace"
            title="Manage issues you have raised from the field"
            lead="This screen is focused on incident reporting, follow-up, and correction of submitted records."
            items={[
              'Log issues as soon as symptoms appear.',
              'Update report details if the situation changes.',
              'Withdraw reports only when they were logged by mistake.',
              'Check status changes for officer follow-up progress.',
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
            eyebrow="My Activity"
            title="Reports you have recently submitted"
            lead="Track the latest issues you raised and watch how the response status changes over time."
            items={farmerOwnReports}
            emptyTitle="No personal reports yet"
            emptyText="Once you submit a field issue, it will appear here for follow-up."
          />
        </div>
      </>
    )
  }

  function renderGuidanceScreen() {
    return (
      <>
        <div className="screen-panel full-span">
          <ChecklistCard
            eyebrow="Guidance Workspace"
            title="Use focused advisory information for better decisions"
            lead="This screen prioritizes knowledge and recommendations that relate more directly to your farm profile."
            items={[
              'Read personalized advisories before field work begins.',
              'Compare guidance with current reports and supply status.',
              'Use verified input listings alongside advisory advice.',
              'Review general updates even when no exact match exists.',
            ]}
          />
        </div>
        <div className="screen-panel full-span">
          <FeedCard
            eyebrow="Personalized Guidance"
            title="Advisories that match your farm profile"
            lead="This feed prioritizes guidance that aligns with your production focus and broad farmer updates."
            items={personalizedAdvisories}
            emptyTitle="No personalized advisories yet"
            emptyText="When matching advisories are available, they will appear here first."
          />
        </div>
        <div className="screen-panel">
          <article className="content-card">
            <div className="section-title">
              <span className="eyebrow">Farmer Snapshot</span>
              <h3>Recent guidance, reports, and supply signals</h3>
            </div>
            <div className="message-stack">
              <div className="message-card">
                <strong>Latest advisory</strong>
                <p>
                  {latestAdvisory
                    ? `${latestAdvisory.title} for ${latestAdvisory.audience}.`
                    : 'No advisory has been published yet.'}
                </p>
              </div>
              <div className="message-card">
                <strong>Latest field report</strong>
                <p>
                  {latestReport
                    ? `${latestReport.title} in ${latestReport.location} is currently ${latestReport.status}.`
                    : 'No field reports have been logged yet.'}
                </p>
              </div>
              <div className="message-card">
                <strong>Verified input watch</strong>
                <p>
                  {latestVerifiedInput
                    ? `${latestVerifiedInput.item} is available through ${latestVerifiedInput.dealer}.`
                    : 'No verified input listing is visible yet.'}
                </p>
              </div>
            </div>
          </article>
        </div>
        <div className="screen-panel">
          <FeedCard
            eyebrow="Supporting Feed"
            title={workspace.secondaryTitle}
            lead="Use this panel for related records that provide context around the main operational queue."
            items={workspace.secondary}
            emptyTitle="No supporting records yet"
            emptyText="As linked records are created, they will appear here to help teams interpret what is happening on the ground."
          />
        </div>
      </>
    )
  }

  function renderFarmerScreen() {
    if (subview === 'profile') {
      return renderProfileScreen()
    }

    if (subview === 'planner') {
      return renderPlannerScreen()
    }

    if (subview === 'requests') {
      return renderRequestsScreen()
    }

    if (subview === 'reports') {
      return renderReportsScreen()
    }

    if (subview === 'guidance') {
      return renderGuidanceScreen()
    }

    return renderFarmHome()
  }

  const isFocusedSubview = subview !== 'farm'

  return (
    <section className="page-grid">
      <DashboardHero
        role={role}
        config={config}
        metrics={metrics}
        statusMessage={state.statusMessage}
      />

      {!isAuthorized ? (
        <RoleMismatchCard currentRole={state.currentRole} role={role} />
      ) : null}

      <article className="content-card full-span farmer-operations-panel">
        <div className="section-title">
          <span className="eyebrow">Farmer Operations</span>
          <h3>Advanced farmer support and field readiness</h3>
        </div>
        <p className="section-lead">
          This workspace is designed to help a farmer move from information
          access to practical day-to-day agricultural action.
        </p>
        <div className="operations-grid">
          {farmerOperations.map((item) => (
            <div key={item.title} className="feature-card feature-card-soft">
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="content-card full-span active-screen-banner">
        <div className="section-title">
          <span className="eyebrow">{activeScreen.eyebrow}</span>
          <h3>{activeScreen.title}</h3>
        </div>
        <p className="section-lead">{activeScreen.text}</p>
      </article>

      {isFocusedSubview ? (
        <section
          ref={screenWorkspaceRef}
          key={subview}
          className="floating-screen-shell full-span"
        >
          <div className="floating-screen-topbar">
            <div className="section-title">
              <span className="eyebrow">Focused Screen</span>
              <h3>{activeScreen.title}</h3>
            </div>
            <button
              type="button"
              className="secondary-button floating-screen-close"
              onClick={() => navigate('/dashboard/farmer/farm')}
            >
              Back to overview
            </button>
          </div>
          <p className="section-lead floating-screen-lead">{activeScreen.text}</p>
          <div className="floating-screen-body">
            <div className="screen-panel-group page-grid">
              {renderFarmerScreen()}
            </div>
          </div>
        </section>
      ) : (
        <>
          <div
            ref={screenWorkspaceRef}
            key={subview}
            className="screen-workspace full-span"
          >
            <div className="screen-panel-group page-grid">
              {renderFarmerScreen()}
            </div>
          </div>

          <ChecklistCard
            eyebrow="Operational Playbook"
            title="What this role should focus on today"
            lead={workflowNudge}
            items={rolePlaybook}
          />

          <FiltersCard filters={state.filters} setFilters={state.setFilters} />
        </>
      )}
    </section>
  )
}

export default FarmerDashboard
