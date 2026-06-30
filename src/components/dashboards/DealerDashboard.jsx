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

function DealerDashboard({ context }) {
  const {
    advisories,
    canManageAdvisories,
    canManageReports,
    canManageStock,
    filteredInventory,
    filteredReports,
    isAuthorized,
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

      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Supply Snapshot</span>
          <h3>Stock readiness and demand signals</h3>
        </div>
        <div className="message-stack">
          <div className="message-card">
            <strong>Latest verified stock</strong>
            <p>
              {latestVerifiedInput
                ? `${latestVerifiedInput.item} is currently listed by ${latestVerifiedInput.dealer}.`
                : 'No verified stock listing is available yet.'}
            </p>
          </div>
          <div className="message-card">
            <strong>Latest field pressure</strong>
            <p>
              {latestReport
                ? `${latestReport.title} in ${latestReport.location} may influence local input demand.`
                : 'No field issue has been logged yet.'}
            </p>
          </div>
        </div>
      </article>

      <ChecklistCard
        eyebrow="Dealer Priorities"
        title="What supply teams should maintain today"
        lead={workflowNudge}
        items={rolePlaybook}
      />

      <FeedCard
        eyebrow="Stock Board"
        title={workspace.spotlightTitle}
        lead="This is the main record board for trusted agro-input visibility and supply readiness."
        items={workspace.spotlight}
        emptyTitle="No stock records yet"
        emptyText="Create your first inventory listing to start the dealer workspace."
      />

      <FiltersCard filters={state.filters} setFilters={state.setFilters} />

      <InventoryFormCard
        inventoryForm={state.inventoryForm}
        setInventoryForm={state.setInventoryForm}
        handleInventorySubmit={state.handleInventorySubmit}
      />

      <ReportFormCard
        reportForm={state.reportForm}
        setReportForm={state.setReportForm}
        handleReportSubmit={state.handleReportSubmit}
      />

      <FeedCard
        eyebrow="Demand Signals"
        title={workspace.secondaryTitle}
        lead="Monitor field issues that could affect urgency around crop protection, seed supply, or animal health inputs."
        items={workspace.secondary}
        emptyTitle="No demand signals yet"
        emptyText="Incident reports will appear here when there is new activity from the field."
      />

      <FeedCard
        eyebrow="Reference Guidance"
        title={workspace.tertiaryTitle}
        lead="Stay aligned with extension communication so stock updates support current field recommendations."
        items={workspace.tertiary}
        emptyTitle="No guidance yet"
        emptyText="Published advisories will show here for quick reference."
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

export default DealerDashboard
