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

function DistrictDashboard({ context }) {
  const {
    advisories,
    canManageAdvisories,
    canManageReports,
    canManageStock,
    filteredInventory,
    filteredReports,
    isAuthorized,
    latestAdvisory,
    latestReport,
    latestVerifiedInput,
    metrics,
    role,
    rolePlaybook,
    state,
    workflowNudge,
    workspace,
    config,
  } = context

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

      <article className="content-card full-span">
        <div className="section-title">
          <span className="eyebrow">District Situation Room</span>
          <h3>Cross-cutting operational view</h3>
        </div>
        <p className="section-lead">
          Review what is happening across farmer support, outbreak response,
          advisory delivery, and agro-input visibility from one oversight space.
        </p>
        <div className="message-stack">
          <div className="message-card">
            <strong>Latest district incident</strong>
            <p>
              {latestReport
                ? `${latestReport.title} in ${latestReport.location} is ${latestReport.status}.`
                : 'No incident report is active yet.'}
            </p>
          </div>
          <div className="message-card">
            <strong>Latest public guidance</strong>
            <p>
              {latestAdvisory
                ? `${latestAdvisory.title} is currently being shared through ${latestAdvisory.channel}.`
                : 'No advisory has been published yet.'}
            </p>
          </div>
          <div className="message-card">
            <strong>Supply watch</strong>
            <p>
              {latestVerifiedInput
                ? `${latestVerifiedInput.item} remains visible through ${latestVerifiedInput.dealer}.`
                : 'No verified supply record is active yet.'}
            </p>
          </div>
        </div>
      </article>

      <ChecklistCard
        eyebrow="District Priorities"
        title="What district leadership should watch today"
        lead={workflowNudge}
        items={rolePlaybook}
      />

      <FeedCard
        eyebrow="Incident Monitor"
        title={workspace.spotlightTitle}
        lead="Start with current reports that need oversight, escalation, or confirmation of field action."
        items={workspace.spotlight}
        emptyTitle="No incident records yet"
        emptyText="Incoming reports will appear here as the district workflow grows."
      />

      <FiltersCard filters={state.filters} setFilters={state.setFilters} />

      <OfficerResponseCard
        reports={state.reports}
        filteredReports={filteredReports}
        reportManagementForm={state.reportManagementForm}
        setReportManagementForm={state.setReportManagementForm}
        handleReportManagementSubmit={state.handleReportManagementSubmit}
      />

      <AdvisoryFormCard
        advisoryForm={state.advisoryForm}
        setAdvisoryForm={state.setAdvisoryForm}
        handleAdvisorySubmit={state.handleAdvisorySubmit}
      />

      <InventoryFormCard
        inventoryForm={state.inventoryForm}
        setInventoryForm={state.setInventoryForm}
        handleInventorySubmit={state.handleInventorySubmit}
      />

      <FarmerFormCard
        farmerForm={state.farmerForm}
        setFarmerForm={state.setFarmerForm}
        handleFarmerSubmit={state.handleFarmerSubmit}
      />

      <ReportFormCard
        reportForm={state.reportForm}
        setReportForm={state.setReportForm}
        handleReportSubmit={state.handleReportSubmit}
      />

      <FeedCard
        eyebrow="Knowledge Feed"
        title={workspace.secondaryTitle}
        lead="Published advisories stay visible here so oversight teams can compare guidance against field pressure."
        items={workspace.secondary}
        emptyTitle="No knowledge feed yet"
        emptyText="Advisories will appear here as soon as they are published."
      />

      <FeedCard
        eyebrow="Supply Board"
        title={workspace.tertiaryTitle}
        lead="Use this board to compare verified input availability with current operational demand."
        items={workspace.tertiary}
        emptyTitle="No supply records yet"
        emptyText="Dealer stock records will show here once inventory entries are available."
      />

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
    </section>
  )
}

export default DistrictDashboard
