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

function ExtensionDashboard({ context }) {
  const {
    advisories,
    canManageAdvisories,
    canManageReports,
    canManageStock,
    filteredInventory,
    filteredReports,
    isAuthorized,
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

      <ChecklistCard
        eyebrow="Response Priorities"
        title="What extension teams should handle first"
        lead={workflowNudge}
        items={rolePlaybook}
      />

      <FeedCard
        eyebrow="Active Queue"
        title={workspace.spotlightTitle}
        lead="Start with the field issues that need verification, assignment, or direct farmer follow-up."
        items={workspace.spotlight}
        emptyTitle="No active response queue"
        emptyText="Once new incidents are submitted, the most urgent records will appear here."
      />

      <FarmerFormCard
        farmerForm={state.farmerForm}
        setFarmerForm={state.setFarmerForm}
        handleFarmerSubmit={state.handleFarmerSubmit}
      />

      <OfficerResponseCard
        reports={state.reports}
        filteredReports={filteredReports}
        reportManagementForm={state.reportManagementForm}
        setReportManagementForm={state.setReportManagementForm}
        handleReportManagementSubmit={state.handleReportManagementSubmit}
      />

      <FiltersCard filters={state.filters} setFilters={state.setFilters} />

      <ReportFormCard
        reportForm={state.reportForm}
        setReportForm={state.setReportForm}
        handleReportSubmit={state.handleReportSubmit}
      />

      <AdvisoryFormCard
        advisoryForm={state.advisoryForm}
        setAdvisoryForm={state.setAdvisoryForm}
        handleAdvisorySubmit={state.handleAdvisorySubmit}
      />

      <FeedCard
        eyebrow="Farmer Context"
        title={workspace.secondaryTitle}
        lead="Use recent farmer profiles to understand who needs guidance, where they are, and what they produce."
        items={workspace.secondary}
        emptyTitle="No farmer profiles yet"
        emptyText="Newly registered farmers will appear here for extension follow-up."
      />

      <FeedCard
        eyebrow="Knowledge Board"
        title={workspace.tertiaryTitle}
        lead="Track the latest published guidance so field communication stays consistent across the district."
        items={workspace.tertiary}
        emptyTitle="No advisories yet"
        emptyText="When guidance is published, it will be listed here for quick reference."
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

export default ExtensionDashboard
