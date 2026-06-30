import { summarizeTimestamp } from '../../utils/records'

export function DashboardHero({ role, config, metrics, statusMessage }) {
  return (
    <article className={`hero-panel hero-panel-${role}`}>
      <div className="hero-copy-block">
        <span className="eyebrow">{config.title}</span>
        <span className="hero-accent">{config.accent}</span>
        <h2>{config.description}</h2>
        <p>{statusMessage}</p>
      </div>

      <div className="stat-grid">
        {metrics.map((metric) => (
          <div key={metric.label} className="stat-card">
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
    </article>
  )
}

export function RoleMismatchCard({ currentRole, role }) {
  return (
    <article className="content-card full-span warning-card">
      <strong>Role mismatch detected</strong>
      <p>
        You are signed in as `{currentRole}`. This dashboard is intended for
        `{role}` accounts.
      </p>
    </article>
  )
}

export function ChecklistCard({ eyebrow, title, lead, items }) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
      </div>
      {lead ? <p className="section-lead">{lead}</p> : null}
      <div className="checklist">
        {items.map((item) => (
          <div key={item} className="checklist-item">
            {item}
          </div>
        ))}
      </div>
    </article>
  )
}

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

export function FeedCard({ eyebrow, title, lead, items, emptyTitle, emptyText }) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
      </div>
      {lead ? <p className="section-lead">{lead}</p> : null}
      {items.length === 0 ? (
        <div className="empty-state">
          <strong>{emptyTitle}</strong>
          <p>{emptyText}</p>
        </div>
      ) : (
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
      )}
    </article>
  )
}

export function FiltersCard({ filters, setFilters }) {
  return (
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
  )
}

export function FarmerFormCard({ farmerForm, setFarmerForm, handleFarmerSubmit }) {
  return (
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
  )
}

export function FarmerProfileManagerCard({
  farmerProfileForm,
  hasExistingProfile,
  linkedProfile,
  setFarmerProfileForm,
  handleFarmerProfileSubmit,
}) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">My Profile</span>
        <h3>Manage your farmer profile</h3>
      </div>
      <p className="section-lead">
        Keep your parish, production focus, and preferred communication channel
        current so extension support stays relevant.
      </p>

        {linkedProfile ? (
          <div className="message-card compact-message-card">
            <strong>Current profile record</strong>
            <p>
              {linkedProfile.name} | {linkedProfile.parish} | {linkedProfile.focus}
            </p>
            <span>
              {linkedProfile.acreage ?? 'Acreage not set'} |{' '}
              {linkedProfile.seasonGoal ?? 'Season goal not set'}
            </span>
          </div>
        ) : null}

      <form className="smart-form" onSubmit={handleFarmerProfileSubmit}>
        <label>
          Farmer name
          <input
            required
            value={farmerProfileForm.name}
            onChange={(event) =>
              setFarmerProfileForm((current) => ({
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
            value={farmerProfileForm.parish}
            onChange={(event) =>
              setFarmerProfileForm((current) => ({
                ...current,
                parish: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Production focus
          <input
            required
            value={farmerProfileForm.focus}
            onChange={(event) =>
              setFarmerProfileForm((current) => ({
                ...current,
                focus: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Acreage or farm size
          <input
            value={farmerProfileForm.acreage}
            onChange={(event) =>
              setFarmerProfileForm((current) => ({
                ...current,
                acreage: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Current season goal
          <input
            value={farmerProfileForm.seasonGoal}
            onChange={(event) =>
              setFarmerProfileForm((current) => ({
                ...current,
                seasonGoal: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Preferred channel
          <select
            value={farmerProfileForm.channel}
            onChange={(event) =>
              setFarmerProfileForm((current) => ({
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
          {hasExistingProfile ? 'Update my profile' : 'Create my profile'}
        </button>
      </form>
    </article>
  )
}

export function FarmerReportManagerCard({
  farmerOwnReports,
  ownReportForm,
  setOwnReportForm,
  handleOwnReportUpdate,
  handleOwnReportDelete,
}) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">My Report Management</span>
        <h3>Edit or withdraw your field reports</h3>
      </div>
      <p className="section-lead">
        Update report details when field conditions change, or remove a report
        that was submitted by mistake.
      </p>
      <form className="smart-form" onSubmit={handleOwnReportUpdate}>
        <label>
          Select my report
          <select
            value={ownReportForm.reportId}
            onChange={(event) => {
              const selectedReport = farmerOwnReports.find(
                (report) => report.id === event.target.value,
              )
              setOwnReportForm({
                reportId: event.target.value,
                title: selectedReport?.title ?? '',
                location: selectedReport?.location ?? '',
                severity: selectedReport?.severity ?? 'Medium',
                reporter: selectedReport?.reporter ?? '',
              })
            }}
          >
            <option value="">Choose report</option>
            {farmerOwnReports.map((report) => (
              <option key={report.id} value={report.id}>
                {report.title} - {report.location}
              </option>
            ))}
          </select>
        </label>
        <label>
          Incident title
          <input
            value={ownReportForm.title}
            onChange={(event) =>
              setOwnReportForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Location
          <input
            value={ownReportForm.location}
            onChange={(event) =>
              setOwnReportForm((current) => ({
                ...current,
                location: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Severity
          <select
            value={ownReportForm.severity}
            onChange={(event) =>
              setOwnReportForm((current) => ({
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
            value={ownReportForm.reporter}
            onChange={(event) =>
              setOwnReportForm((current) => ({
                ...current,
                reporter: event.target.value,
              }))
            }
          />
        </label>
        <div className="form-action-row">
          <button type="submit" className="primary-button">
            Update my report
          </button>
          <button
            type="button"
            className="secondary-button danger-button"
            onClick={() => handleOwnReportDelete(ownReportForm.reportId)}
            disabled={!ownReportForm.reportId}
          >
            Withdraw report
          </button>
        </div>
      </form>
    </article>
  )
}

export function FarmerIdentityCard({
  linkedFarmerProfile,
  farmerOwnReports,
  farmerSeasonPlans,
  farmerInputRequests,
}) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Farm Summary</span>
        <h3>Your personalized farm workspace</h3>
      </div>
      <div className="summary-grid">
        <div className="summary-tile">
          <span>Production focus</span>
          <strong>{linkedFarmerProfile?.focus ?? 'Set your production focus'}</strong>
        </div>
        <div className="summary-tile">
          <span>Farm size</span>
          <strong>{linkedFarmerProfile?.acreage ?? 'Add acreage details'}</strong>
        </div>
        <div className="summary-tile">
          <span>Season goal</span>
          <strong>{linkedFarmerProfile?.seasonGoal ?? 'Add a season goal'}</strong>
        </div>
        <div className="summary-tile">
          <span>Preferred channel</span>
          <strong>{linkedFarmerProfile?.channel ?? 'Choose a contact channel'}</strong>
        </div>
      </div>
      <div className="summary-grid summary-grid-metrics">
        <div className="summary-tile">
          <span>My reports</span>
          <strong>{farmerOwnReports.length}</strong>
        </div>
        <div className="summary-tile">
          <span>Season plans</span>
          <strong>{farmerSeasonPlans.length}</strong>
        </div>
        <div className="summary-tile">
          <span>Input requests</span>
          <strong>{farmerInputRequests.length}</strong>
        </div>
      </div>
    </article>
  )
}

export function FarmerSeasonPlannerCard({
  seasonPlanForm,
  setSeasonPlanForm,
  handleSeasonPlanSubmit,
  farmerSeasonPlans,
}) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Season Planner</span>
        <h3>Plan the current farming cycle</h3>
      </div>
      <form className="smart-form" onSubmit={handleSeasonPlanSubmit}>
        <label>
          Season or cycle
          <input
            required
            value={seasonPlanForm.season}
            onChange={(event) =>
              setSeasonPlanForm((current) => ({
                ...current,
                season: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Priority
          <select
            value={seasonPlanForm.priority}
            onChange={(event) =>
              setSeasonPlanForm((current) => ({
                ...current,
                priority: event.target.value,
              }))
            }
          >
            <option>Planting</option>
            <option>Weeding</option>
            <option>Pest control</option>
            <option>Harvest planning</option>
          </select>
        </label>
        <label>
          Task note
          <textarea
            rows="3"
            required
            value={seasonPlanForm.note}
            onChange={(event) =>
              setSeasonPlanForm((current) => ({
                ...current,
                note: event.target.value,
              }))
            }
          />
        </label>
        <button type="submit" className="primary-button">
          Save seasonal task
        </button>
      </form>
      <div className="planner-list">
        {farmerSeasonPlans.length === 0 ? (
          <div className="empty-state compact-empty-state">
            <strong>No seasonal tasks yet</strong>
            <p>Add the tasks you want to stay on top of this season.</p>
          </div>
        ) : (
          farmerSeasonPlans.map((plan) => (
            <div key={plan.id} className="planner-item">
              <strong>{plan.season}</strong>
              <p>{plan.note}</p>
              <span>
                {plan.priority} | {summarizeTimestamp(plan.createdAtDisplay)}
              </span>
            </div>
          ))
        )}
      </div>
    </article>
  )
}

export function FarmerInputRequestCard({
  inputRequestForm,
  setInputRequestForm,
  handleInputRequestSubmit,
  farmerInputRequests,
}) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Input Requests</span>
        <h3>Request farming inputs you need</h3>
      </div>
      <form className="smart-form" onSubmit={handleInputRequestSubmit}>
        <label>
          Input needed
          <input
            required
            value={inputRequestForm.item}
            onChange={(event) =>
              setInputRequestForm((current) => ({
                ...current,
                item: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Quantity
          <input
            required
            value={inputRequestForm.quantity}
            onChange={(event) =>
              setInputRequestForm((current) => ({
                ...current,
                quantity: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Urgency
          <select
            value={inputRequestForm.urgency}
            onChange={(event) =>
              setInputRequestForm((current) => ({
                ...current,
                urgency: event.target.value,
              }))
            }
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <label>
          Request note
          <textarea
            rows="3"
            value={inputRequestForm.note}
            onChange={(event) =>
              setInputRequestForm((current) => ({
                ...current,
                note: event.target.value,
              }))
            }
          />
        </label>
        <button type="submit" className="primary-button">
          Submit input request
        </button>
      </form>
      <div className="planner-list">
        {farmerInputRequests.length === 0 ? (
          <div className="empty-state compact-empty-state">
            <strong>No input requests yet</strong>
            <p>Requests you send for seed, spray, or other inputs will appear here.</p>
          </div>
        ) : (
          farmerInputRequests.map((request) => (
            <div key={request.id} className="planner-item">
              <strong>{request.item}</strong>
              <p>
                {request.quantity}
                {request.note ? ` | ${request.note}` : ''}
              </p>
              <span>
                {request.urgency} urgency | {request.status}
              </span>
            </div>
          ))
        )}
      </div>
    </article>
  )
}

export function ReportFormCard({ reportForm, setReportForm, handleReportSubmit }) {
  return (
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
  )
}

export function AdvisoryFormCard({
  advisoryForm,
  setAdvisoryForm,
  handleAdvisorySubmit,
}) {
  return (
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
  )
}

export function InventoryFormCard({
  inventoryForm,
  setInventoryForm,
  handleInventorySubmit,
}) {
  return (
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
  )
}

export function OfficerResponseCard({
  reports,
  filteredReports,
  reportManagementForm,
  setReportManagementForm,
  handleReportManagementSubmit,
}) {
  return (
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
  )
}

export function ManagementTable({
  advisories,
  canManageAdvisories,
  canManageReports,
  canManageStock,
  filteredInventory,
  filteredReports,
  handleAdvisoryChannelChange,
  handleAdvisoryDelete,
  handleInventoryDelete,
  handleInventoryStatusChange,
  handleReportStatusChange,
}) {
  return (
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
                        handleAdvisoryChannelChange(advisory.id, event.target.value)
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
  )
}
