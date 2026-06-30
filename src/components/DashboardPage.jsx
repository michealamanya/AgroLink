import { dashboardConfig, rolePlaybooks } from '../data/appData'
import { getRoleWorkspace } from '../utils/dashboard'
import { summarizeTimestamp } from '../utils/records'
import { hasFirebaseConfig } from '../firebase'

function renderFeedRecord(item) {
  if ('severity' in item) {
    return (
      <>
        <strong>{item.title}</strong>
        <p>{item.location}</p>
        <span>
          {item.severity} severity | {item.status}
        </span>
      </>
    )
  }

  if ('focus' in item) {
    return (
      <>
        <strong>{item.name}</strong>
        <p>{item.parish}</p>
        <span>{item.focus}</span>
      </>
    )
  }

  if ('stock' in item) {
    return (
      <>
        <strong>{item.item}</strong>
        <p>{item.dealer}</p>
        <span>
          {item.stock} | {item.status}
        </span>
      </>
    )
  }

  return (
    <>
      <strong>{item.title}</strong>
      <p>{item.audience}</p>
      <span>{item.channel}</span>
    </>
  )
}

function DashboardPage({ role, state }) {
  const config = dashboardConfig[role]
  const {
    advisories,
    advisoryForm,
    currentRole,
    currentUser,
    farmerForm,
    farmers,
    filters,
    handleAdvisoryChannelChange,
    handleAdvisoryDelete,
    handleAdvisorySubmit,
    handleFarmerSubmit,
    handleInventoryDelete,
    handleInventoryStatusChange,
    handleInventorySubmit,
    handleReportManagementSubmit,
    handleReportStatusChange,
    handleReportSubmit,
    highSeverityReports,
    inventory,
    inventoryForm,
    reportForm,
    reportManagementForm,
    reports,
    setAdvisoryForm,
    setFarmerForm,
    setFilters,
    setInventoryForm,
    setReportForm,
    setReportManagementForm,
    statusMessage,
    totalVerifiedInputs,
  } = state

  const isAuthorized = !hasFirebaseConfig || !currentUser || currentRole === role
  const workspace = getRoleWorkspace(
    role,
    farmers,
    reports,
    advisories,
    inventory,
  )
  const metricsByRole = {
    farmer: [
      { label: 'Advisories available', value: advisories.length },
      { label: 'Verified inputs', value: totalVerifiedInputs },
      { label: 'Open reports', value: reports.length },
    ],
    extension: [
      { label: 'High severity cases', value: highSeverityReports },
      { label: 'Farmer profiles', value: farmers.length },
      { label: 'Published advisories', value: advisories.length },
    ],
    dealer: [
      { label: 'Input listings', value: inventory.length },
      { label: 'Verified stock', value: totalVerifiedInputs },
      { label: 'Field alerts shaping demand', value: reports.length },
    ],
    district: [
      { label: 'District reports', value: reports.length },
      { label: 'Advisory campaigns', value: advisories.length },
      { label: 'Visible supply records', value: inventory.length },
    ],
  }
  const filteredReports = reports.filter((report) => {
    const searchPass =
      !filters.search ||
      report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.location.toLowerCase().includes(filters.search.toLowerCase())
    const severityPass =
      filters.severity === 'All' || report.severity === filters.severity

    return searchPass && severityPass
  })
  const filteredInventory = inventory.filter((entry) => {
    const searchPass =
      !filters.search ||
      entry.item.toLowerCase().includes(filters.search.toLowerCase()) ||
      entry.dealer.toLowerCase().includes(filters.search.toLowerCase())
    const statusPass =
      filters.inventoryStatus === 'All' || entry.status === filters.inventoryStatus

    return searchPass && statusPass
  })
  const canManageReports = role === 'extension' || role === 'district'
  const canManageAdvisories = role === 'extension' || role === 'district'
  const canManageStock = role === 'dealer' || role === 'district'
  const workflowNudgeByRole = {
    farmer:
      'Keep farmer records current, raise field incidents early, and use the boards below to follow new advice and verified supply updates.',
    extension:
      'Prioritize urgent cases first, publish short actionable advisories, and keep response notes updated so district teams can track progress.',
    dealer:
      'Use this workspace to keep stock visible, show verification status clearly, and respond quickly when demand shifts after field alerts.',
    district:
      'Use this overview to compare service activity, identify pressure points, and keep district-level intervention decisions grounded in live records.',
  }

  const renderFeedList = (items, emptyTitle, emptyText) => {
    if (items.length === 0) {
      return (
        <div className="empty-state">
          <strong>{emptyTitle}</strong>
          <p>{emptyText}</p>
        </div>
      )
    }

    return (
      <div className="feed-list">
        {items.map((item) => (
          <div
            key={
              item.id ??
              item.title ??
              item.name ??
              item.item ??
              JSON.stringify(item)
            }
            className="feed-item"
          >
            {renderFeedRecord(item)}
            {'createdAtDisplay' in item ? (
              <span className="meta-note">
                Logged: {summarizeTimestamp(item.createdAtDisplay)}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    )
  }

  return (
    <section className="page-grid">
      <article className={`hero-panel hero-panel-${role}`}>
        <div className="hero-copy-block">
          <span className="eyebrow">{config.title}</span>
          <span className="hero-accent">{config.accent}</span>
          <h2>{config.description}</h2>
          <p>{statusMessage}</p>
        </div>

        <div className="stat-grid">
          {metricsByRole[role].map((metric) => (
            <div key={metric.label} className="stat-card">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </article>

      {!isAuthorized ? (
        <article className="content-card full-span warning-card">
          <strong>Role mismatch detected</strong>
          <p>
            You are signed in as `{currentRole}`. This dashboard is intended for
            `{role}` accounts.
          </p>
        </article>
      ) : null}

      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Operational Playbook</span>
          <h3>What this role should focus on today</h3>
        </div>
        <p className="section-lead">{workflowNudgeByRole[role]}</p>
        <div className="checklist">
          {rolePlaybooks[role].map((item) => (
            <div key={item} className="checklist-item">
              {item}
            </div>
          ))}
        </div>
      </article>

      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Live Workspace</span>
          <h3>{workspace.spotlightTitle}</h3>
        </div>
        <p className="section-lead">
          This board highlights the records that need the quickest attention in
          the current workflow.
        </p>
        {renderFeedList(
          workspace.spotlight,
          'Nothing active yet',
          'Once new field activity is captured, this space becomes the first place to review it.',
        )}
      </article>

      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Filters</span>
          <h3>Focus the records in view</h3>
        </div>
        <p className="section-lead">
          Narrow the working set by place, urgency, or stock status to reduce
          noise during daily follow-up.
        </p>
        <div className="filter-grid">
          <label>
            Search title, item, or place
            <input
              value={filters.search}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Severity
            <select
              value={filters.severity}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  severity: event.target.value,
                }))
              }
            >
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <label>
            Inventory status
            <select
              value={filters.inventoryStatus}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  inventoryStatus: event.target.value,
                }))
              }
            >
              <option>All</option>
              <option>Verified</option>
              <option>Pending inspection</option>
              <option>Restocking soon</option>
            </select>
          </label>
        </div>
      </article>

      {config.modules.includes('register-farmer') ? (
        <article className="content-card">
          <div className="section-title">
            <span className="eyebrow">Farmer onboarding</span>
            <h3>Register farmer profile</h3>
          </div>
          <form className="smart-form" onSubmit={handleFarmerSubmit}>
            <label>
              Farmer name
              <input
                required
                value={farmerForm.name}
                onChange={(event) =>
                  setFarmerForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Parish
              <input
                required
                value={farmerForm.parish}
                onChange={(event) =>
                  setFarmerForm((current) => ({
                    ...current,
                    parish: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Focus
              <input
                required
                value={farmerForm.focus}
                onChange={(event) =>
                  setFarmerForm((current) => ({
                    ...current,
                    focus: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Preferred channel
              <select
                value={farmerForm.channel}
                onChange={(event) =>
                  setFarmerForm((current) => ({
                    ...current,
                    channel: event.target.value,
                  }))
                }
              >
                <option>SMS alerts</option>
                <option>Mobile web</option>
                <option>Extension office visits</option>
              </select>
            </label>
            <button type="submit" className="primary-button">
              Save farmer
            </button>
          </form>
        </article>
      ) : null}

      {config.modules.includes('report-issue') ? (
        <article className="content-card">
          <div className="section-title">
            <span className="eyebrow">Field reporting</span>
            <h3>Submit pest or disease alert</h3>
          </div>
          <form className="smart-form" onSubmit={handleReportSubmit}>
            <label>
              Incident title
              <input
                required
                value={reportForm.title}
                onChange={(event) =>
                  setReportForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Location
              <input
                required
                value={reportForm.location}
                onChange={(event) =>
                  setReportForm((current) => ({
                    ...current,
                    location: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Severity
              <select
                value={reportForm.severity}
                onChange={(event) =>
                  setReportForm((current) => ({
                    ...current,
                    severity: event.target.value,
                  }))
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
            <label>
              Reporter
              <input
                required
                value={reportForm.reporter}
                onChange={(event) =>
                  setReportForm((current) => ({
                    ...current,
                    reporter: event.target.value,
                  }))
                }
              />
            </label>
            <button type="submit" className="primary-button">
              Log report
            </button>
          </form>
        </article>
      ) : null}

      {canManageReports ? (
        <article className="content-card">
          <div className="section-title">
            <span className="eyebrow">Officer Response</span>
            <h3>Assign and resolve field reports</h3>
          </div>
          <form className="smart-form" onSubmit={handleReportManagementSubmit}>
            <label>
              Select report
              <select
                value={reportManagementForm.reportId}
                onChange={(event) => {
                  const selectedReport = reports.find(
                    (report) => report.id === event.target.value,
                  )
                  setReportManagementForm({
                    reportId: event.target.value,
                    assignedOfficer: selectedReport?.assignedOfficer ?? '',
                    resolutionNotes: selectedReport?.resolutionNotes ?? '',
                    status: selectedReport?.status ?? 'Officer assigned',
                  })
                }}
              >
                <option value="">Choose report</option>
                {filteredReports.map((report) => (
                  <option key={report.id} value={report.id}>
                    {report.title} - {report.location}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Assigned officer
              <input
                value={reportManagementForm.assignedOfficer}
                onChange={(event) =>
                  setReportManagementForm((current) => ({
                    ...current,
                    assignedOfficer: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Response status
              <select
                value={reportManagementForm.status}
                onChange={(event) =>
                  setReportManagementForm((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
              >
                <option>Officer assigned</option>
                <option>Verification ongoing</option>
                <option>Pending field response</option>
                <option>Resolved</option>
              </select>
            </label>
            <label>
              Resolution notes
              <textarea
                rows="4"
                value={reportManagementForm.resolutionNotes}
                onChange={(event) =>
                  setReportManagementForm((current) => ({
                    ...current,
                    resolutionNotes: event.target.value,
                  }))
                }
              />
            </label>
            <button type="submit" className="primary-button">
              Save response
            </button>
          </form>
        </article>
      ) : null}

      {config.modules.includes('publish-advisory') ? (
        <article className="content-card">
          <div className="section-title">
            <span className="eyebrow">Advisory publishing</span>
            <h3>Publish farmer advisory</h3>
          </div>
          <form className="smart-form" onSubmit={handleAdvisorySubmit}>
            <label>
              Title
              <input
                required
                value={advisoryForm.title}
                onChange={(event) =>
                  setAdvisoryForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Audience
              <input
                required
                value={advisoryForm.audience}
                onChange={(event) =>
                  setAdvisoryForm((current) => ({
                    ...current,
                    audience: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Channel
              <select
                value={advisoryForm.channel}
                onChange={(event) =>
                  setAdvisoryForm((current) => ({
                    ...current,
                    channel: event.target.value,
                  }))
                }
              >
                <option>SMS</option>
                <option>Field bulletin</option>
                <option>Web dashboard</option>
              </select>
            </label>
            <label>
              Message
              <textarea
                required
                rows="4"
                value={advisoryForm.message}
                onChange={(event) =>
                  setAdvisoryForm((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
              />
            </label>
            <button type="submit" className="primary-button">
              Publish advisory
            </button>
          </form>
        </article>
      ) : null}

      {config.modules.includes('manage-inventory') ? (
        <article className="content-card">
          <div className="section-title">
            <span className="eyebrow">Inventory update</span>
            <h3>Add agro-input stock</h3>
          </div>
          <form className="smart-form" onSubmit={handleInventorySubmit}>
            <label>
              Item
              <input
                required
                value={inventoryForm.item}
                onChange={(event) =>
                  setInventoryForm((current) => ({
                    ...current,
                    item: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Dealer
              <input
                required
                value={inventoryForm.dealer}
                onChange={(event) =>
                  setInventoryForm((current) => ({
                    ...current,
                    dealer: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Stock detail
              <input
                required
                value={inventoryForm.stock}
                onChange={(event) =>
                  setInventoryForm((current) => ({
                    ...current,
                    stock: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              Status
              <select
                value={inventoryForm.status}
                onChange={(event) =>
                  setInventoryForm((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
              >
                <option>Verified</option>
                <option>Pending inspection</option>
                <option>Restocking soon</option>
              </select>
            </label>
            <button type="submit" className="primary-button">
              Add stock record
            </button>
          </form>
        </article>
      ) : null}

      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Supporting Feed</span>
          <h3>{workspace.secondaryTitle}</h3>
        </div>
        <p className="section-lead">
          Use this panel for related records that provide context around the
          main operational queue.
        </p>
        {renderFeedList(
          workspace.secondary,
          'No supporting records yet',
          'As linked records are created, they will appear here to help teams interpret what is happening on the ground.',
        )}
      </article>

      <article className="content-card">
        <div className="section-title">
          <span className="eyebrow">Reference Board</span>
          <h3>{workspace.tertiaryTitle}</h3>
        </div>
        <p className="section-lead">
          This view acts like a quick reference shelf for decisions that depend
          on advisory, profile, or stock history.
        </p>
        {renderFeedList(
          workspace.tertiary,
          'Reference board is empty',
          'Populate a few more records and this board will become a reliable source of day-to-day reference.',
        )}
      </article>

      <article className="content-card full-span">
        <div className="section-title">
          <span className="eyebrow">Management Table</span>
          <h3>Structured records for day-to-day operations</h3>
        </div>
        <p className="section-lead">
          Review the latest report, advisory, and inventory entries in one
          structured table for faster status updates.
        </p>
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name or title</th>
                <th>Location or audience</th>
                <th>Status or channel</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.slice(0, 4).map((report) => (
                <tr key={`${report.id ?? report.title}-${report.location}`}>
                  <td>Report</td>
                  <td>{report.title}</td>
                  <td>{report.location}</td>
                  <td>
                    {canManageReports ? (
                      <select
                        value={report.status}
                        onChange={(event) =>
                          handleReportStatusChange(report.id, event.target.value)
                        }
                      >
                        <option>Pending field response</option>
                        <option>Officer assigned</option>
                        <option>Verification ongoing</option>
                        <option>Resolved</option>
                      </select>
                    ) : (
                      report.status
                    )}
                  </td>
                  <td>
                    {report.assignedOfficer
                      ? `${report.assignedOfficer} | ${summarizeTimestamp(
                          report.updatedAtDisplay,
                          report.createdAtDisplay,
                        )}`
                      : canManageReports
                        ? 'Update status'
                        : 'View only'}
                  </td>
                </tr>
              ))}
              {advisories.slice(0, 2).map((advisory) => (
                <tr key={`${advisory.id ?? advisory.title}-${advisory.audience}`}>
                  <td>Advisory</td>
                  <td>{advisory.title}</td>
                  <td>{advisory.audience}</td>
                  <td>
                    {canManageAdvisories ? (
                      <select
                        value={advisory.channel}
                        onChange={(event) =>
                          handleAdvisoryChannelChange(
                            advisory.id,
                            event.target.value,
                          )
                        }
                      >
                        <option>SMS</option>
                        <option>Field bulletin</option>
                        <option>Web dashboard</option>
                      </select>
                    ) : (
                      advisory.channel
                    )}
                  </td>
                  <td>
                    {canManageAdvisories ? (
                      <div className="table-action-group">
                        <span className="meta-inline">
                          {summarizeTimestamp(advisory.createdAtDisplay)}
                        </span>
                        <button
                          type="button"
                          className="table-action danger-action"
                          onClick={() => handleAdvisoryDelete(advisory.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      summarizeTimestamp(advisory.createdAtDisplay)
                    )}
                  </td>
                </tr>
              ))}
              {filteredInventory.slice(0, 3).map((entry) => (
                <tr key={`${entry.id ?? entry.item}-${entry.dealer}`}>
                  <td>Inventory</td>
                  <td>{entry.item}</td>
                  <td>{entry.dealer}</td>
                  <td>
                    {canManageStock ? (
                      <select
                        value={entry.status}
                        onChange={(event) =>
                          handleInventoryStatusChange(entry.id, event.target.value)
                        }
                      >
                        <option>Verified</option>
                        <option>Pending inspection</option>
                        <option>Restocking soon</option>
                      </select>
                    ) : (
                      entry.status
                    )}
                  </td>
                  <td>
                    {canManageStock ? (
                      <div className="table-action-group">
                        <span className="meta-inline">
                          {summarizeTimestamp(entry.createdAtDisplay)}
                        </span>
                        <button
                          type="button"
                          className="table-action danger-action"
                          onClick={() => handleInventoryDelete(entry.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      summarizeTimestamp(entry.createdAtDisplay)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

export default DashboardPage
