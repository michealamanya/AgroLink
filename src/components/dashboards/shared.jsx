import { summarizeTimestamp } from '../../utils/records'
import ImageUpload from '../ImageUpload'

/* ─── severity / status badge colours ─────────────────────────────────── */
const SEVERITY_COLORS = { High: '#fee2e2', Medium: '#fff7ed', Low: '#f0fdf4' }
const SEVERITY_TEXT   = { High: '#991b1b', Medium: '#9a3412', Low: '#166534' }
const STATUS_COLORS   = {
  Resolved: '#f0fdf4',
  'Officer assigned': '#eff6ff',
  'Verification ongoing': '#fefce8',
  'Pending field response': '#fff7ed',
  'Pending review': '#faf5ff',
}

function Badge({ text, bg, color }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: '999px',
      fontSize: '0.75rem', fontWeight: 700,
      background: bg ?? '#f3f4f6', color: color ?? '#374151',
    }}>
      {text}
    </span>
  )
}

/* ─── DashboardHero ────────────────────────────────────────────────────── */
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

/* ─── RoleMismatchCard ─────────────────────────────────────────────────── */
export function RoleMismatchCard({ currentRole, role }) {
  return (
    <article className="content-card full-span warning-card">
      <strong>Role mismatch</strong>
      <p>Signed in as <code>{currentRole}</code> — this dashboard is for <code>{role}</code> accounts.</p>
    </article>
  )
}

/* ─── ChecklistCard ────────────────────────────────────────────────────── */
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
          <div key={item} className="checklist-item">{item}</div>
        ))}
      </div>
    </article>
  )
}

/* ─── FeedCard ─────────────────────────────────────────────────────────── */
function renderFeedRecord(item) {
  if ('severity' in item) {
    return (
      <>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="Field evidence"
            style={{ width:'100%', maxHeight:'160px', objectFit:'cover', borderRadius:'8px', marginBottom:'8px' }} />
        ) : null}
        <strong>{item.title}</strong>
        <p>{item.location}</p>
        <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
          <Badge text={item.severity} bg={SEVERITY_COLORS[item.severity]} color={SEVERITY_TEXT[item.severity]} />
          <Badge text={item.status} bg={STATUS_COLORS[item.status] ?? '#f9fafb'} color="#374151" />
        </div>
      </>
    )
  }
  if ('focus' in item) {
    return (
      <>
        {item.photoUrl ? (
          <img src={item.photoUrl} alt={item.name}
            style={{ width:'48px', height:'48px', objectFit:'cover', borderRadius:'50%', marginBottom:'6px' }} />
        ) : null}
        <strong>{item.name}</strong>
        <p>{item.parish}</p>
        <span>{item.focus}</span>
      </>
    )
  }
  if ('stock' in item) {
    return (
      <>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.item}
            style={{ width:'100%', maxHeight:'120px', objectFit:'cover', borderRadius:'8px', marginBottom:'8px' }} />
        ) : null}
        <strong>{item.item}</strong>
        <p>{item.dealer}</p>
        <span>{item.stock} | {item.status}</span>
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
            <div key={item.id ?? item.title ?? item.name ?? item.item ?? JSON.stringify(item)} className="feed-item">
              {renderFeedRecord(item)}
              {'createdAtDisplay' in item ? (
                <span className="meta-note">Logged: {summarizeTimestamp(item.createdAtDisplay)}</span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

/* ─── FiltersCard ──────────────────────────────────────────────────────── */
export function FiltersCard({ filters, setFilters }) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Filters</span>
        <h3>Focus the records in view</h3>
      </div>
      <p className="section-lead">Narrow records by place, urgency, or stock status.</p>
      <div className="filter-grid">
        <label>
          Search title, item, or place
          <input value={filters.search} onChange={(e) => setFilters((c) => ({ ...c, search: e.target.value }))} />
        </label>
        <label>
          Severity
          <select value={filters.severity} onChange={(e) => setFilters((c) => ({ ...c, severity: e.target.value }))}>
            <option>All</option><option>Low</option><option>Medium</option><option>High</option>
          </select>
        </label>
        <label>
          Inventory status
          <select value={filters.inventoryStatus} onChange={(e) => setFilters((c) => ({ ...c, inventoryStatus: e.target.value }))}>
            <option>All</option><option>Verified</option><option>Pending inspection</option><option>Restocking soon</option>
          </select>
        </label>
      </div>
    </article>
  )
}

/* ─── FarmerProfileManagerCard ─────────────────────────────────────────── */
export function FarmerProfileManagerCard({
  farmerProfileForm, hasExistingProfile, linkedProfile,
  setFarmerProfileForm, handleFarmerProfileSubmit,
}) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">My Profile</span>
        <h3>{hasExistingProfile ? 'Update your farm profile' : 'Create your farm profile'}</h3>
      </div>
      <p className="section-lead">
        This profile is what extension officers and advisories use to reach you with relevant support.
        {hasExistingProfile
          ? ' Your current record is shown below — edit and save to update.'
          : ' Fill in your details to get personalized advisories and extension support.'}
      </p>

      {linkedProfile ? (
        <div className="shared-profile-summary">
          {linkedProfile.photoUrl ? (
            <div className="shared-profile-photo-row">
              <img src={linkedProfile.photoUrl} alt="Profile" className="shared-profile-photo" />
            </div>
          ) : null}
          <div className="shared-profile-row">
            <span>Name</span><strong>{linkedProfile.name}</strong>
          </div>
          <div className="shared-profile-row">
            <span>Parish</span><strong>{linkedProfile.parish}</strong>
          </div>
          <div className="shared-profile-row">
            <span>Focus</span><strong>{linkedProfile.focus}</strong>
          </div>
          <div className="shared-profile-row">
            <span>Acreage</span><strong>{linkedProfile.acreage || '—'}</strong>
          </div>
          <div className="shared-profile-row">
            <span>Season goal</span><strong>{linkedProfile.seasonGoal || '—'}</strong>
          </div>
          <div className="shared-profile-row">
            <span>Channel</span><strong>{linkedProfile.channel}</strong>
          </div>
          {linkedProfile.updatedAtDisplay ? (
            <div className="shared-profile-row">
              <span>Last updated</span>
              <strong className="meta-note" style={{ fontSize: '0.82rem' }}>{linkedProfile.updatedAtDisplay}</strong>
            </div>
          ) : null}
        </div>
      ) : null}

      <form className="smart-form" onSubmit={handleFarmerProfileSubmit} style={{ marginTop: '18px' }}>
        <ImageUpload
          label="Profile photo"
          currentUrl={farmerProfileForm.photoUrl}
          hint="Optional — helps extension officers recognise you"
          onUploaded={(url) => setFarmerProfileForm(c => ({ ...c, photoUrl: url }))}
        />
        <label>
          Full name
          <input required placeholder="e.g. Ninsiima Grace" value={farmerProfileForm.name}
            onChange={(e) => setFarmerProfileForm((c) => ({ ...c, name: e.target.value }))} />
        </label>
        <label>
          Parish
          <input required placeholder="e.g. Kyeizooba" value={farmerProfileForm.parish}
            onChange={(e) => setFarmerProfileForm((c) => ({ ...c, parish: e.target.value }))} />
        </label>
        <label>
          Production focus
          <input required placeholder="e.g. Bananas, beans, dairy" value={farmerProfileForm.focus}
            onChange={(e) => setFarmerProfileForm((c) => ({ ...c, focus: e.target.value }))} />
        </label>
        <label>
          Farm size or acreage
          <input placeholder="e.g. 2 acres" value={farmerProfileForm.acreage}
            onChange={(e) => setFarmerProfileForm((c) => ({ ...c, acreage: e.target.value }))} />
        </label>
        <label>
          Current season goal
          <input placeholder="e.g. Increase maize yield by 20%" value={farmerProfileForm.seasonGoal}
            onChange={(e) => setFarmerProfileForm((c) => ({ ...c, seasonGoal: e.target.value }))} />
        </label>
        <label>
          Preferred contact channel
          <select value={farmerProfileForm.channel}
            onChange={(e) => setFarmerProfileForm((c) => ({ ...c, channel: e.target.value }))}>
            <option>SMS alerts</option>
            <option>Mobile web</option>
            <option>Extension office visits</option>
          </select>
        </label>
        <button type="submit" className="primary-button">
          {hasExistingProfile ? 'Save changes' : 'Create profile'}
        </button>
      </form>
    </article>
  )
}

/* ─── FarmerIdentityCard ────────────────────────────────────────────────── */
export function FarmerIdentityCard({ linkedFarmerProfile, farmerOwnReports, farmerSeasonPlans, farmerInputRequests }) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Farm Summary</span>
        <h3>Your farm at a glance</h3>
      </div>
      <div className="summary-grid">
        <div className="summary-tile">
          <span>Production focus</span>
          <strong>{linkedFarmerProfile?.focus ?? '— not set'}</strong>
        </div>
        <div className="summary-tile">
          <span>Farm size</span>
          <strong>{linkedFarmerProfile?.acreage ?? '— not set'}</strong>
        </div>
        <div className="summary-tile">
          <span>Season goal</span>
          <strong>{linkedFarmerProfile?.seasonGoal ?? '— not set'}</strong>
        </div>
        <div className="summary-tile">
          <span>Contact channel</span>
          <strong>{linkedFarmerProfile?.channel ?? '— not set'}</strong>
        </div>
      </div>
      <div className="summary-grid summary-grid-metrics" style={{ marginTop: '10px' }}>
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

/* ─── FarmerSeasonPlannerCard ───────────────────────────────────────────── */
const PRIORITY_COLORS = {
  Planting: { bg: '#f0fdf4', color: '#166534' },
  Weeding: { bg: '#fefce8', color: '#854d0e' },
  'Pest control': { bg: '#fff7ed', color: '#9a3412' },
  'Harvest planning': { bg: '#eff6ff', color: '#1e40af' },
}

export function FarmerSeasonPlannerCard({
  seasonPlanForm, setSeasonPlanForm, handleSeasonPlanSubmit,
  farmerSeasonPlans, handleSeasonPlanDelete,
}) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Season Planner</span>
        <h3>Plan the current farming cycle</h3>
      </div>
      <p className="section-lead">
        Add tasks for this season. Each entry is saved to your account and persists across sessions.
      </p>
      <form className="smart-form" onSubmit={handleSeasonPlanSubmit}>
        <label>
          Season or cycle name
          <input required placeholder="e.g. Long rains 2026" value={seasonPlanForm.season}
            onChange={(e) => setSeasonPlanForm((c) => ({ ...c, season: e.target.value }))} />
        </label>
        <label>
          Task type
          <select value={seasonPlanForm.priority}
            onChange={(e) => setSeasonPlanForm((c) => ({ ...c, priority: e.target.value }))}>
            <option>Planting</option>
            <option>Weeding</option>
            <option>Pest control</option>
            <option>Harvest planning</option>
          </select>
        </label>
        <label>
          Task details
          <textarea required rows="3" placeholder="Describe what needs to be done, when, and any key reminders."
            value={seasonPlanForm.note}
            onChange={(e) => setSeasonPlanForm((c) => ({ ...c, note: e.target.value }))} />
        </label>
        <button type="submit" className="primary-button">Add to plan</button>
      </form>

      <div className="planner-list">
        {farmerSeasonPlans.length === 0 ? (
          <div className="empty-state compact-empty-state">
            <strong>No seasonal tasks yet</strong>
            <p>Tasks you add will be saved here and persist after refresh.</p>
          </div>
        ) : (
          farmerSeasonPlans.map((plan) => {
            const pc = PRIORITY_COLORS[plan.priority] ?? { bg: '#f9fafb', color: '#374151' }
            return (
              <div key={plan.id} className="planner-item shared-planner-item">
                <div className="shared-planner-header">
                  <strong>{plan.season}</strong>
                  <Badge text={plan.priority} bg={pc.bg} color={pc.color} />
                </div>
                <p>{plan.note}</p>
                <div className="shared-planner-footer">
                  <span className="meta-note">{summarizeTimestamp(plan.createdAtDisplay)}</span>
                  {handleSeasonPlanDelete ? (
                    <button type="button" className="shared-delete-btn"
                      onClick={() => handleSeasonPlanDelete(plan.id)}>
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
            )
          })
        )}
      </div>
    </article>
  )
}

/* ─── FarmerInputRequestCard ────────────────────────────────────────────── */
const URGENCY_COLORS = {
  High: { bg: '#fee2e2', color: '#991b1b' },
  Medium: { bg: '#fff7ed', color: '#9a3412' },
  Low: { bg: '#f0fdf4', color: '#166534' },
}
const REQUEST_STATUS_COLORS = {
  'Pending review': { bg: '#faf5ff', color: '#6b21a8' },
  'In progress': { bg: '#eff6ff', color: '#1e40af' },
  Fulfilled: { bg: '#f0fdf4', color: '#166534' },
  Declined: { bg: '#fef2f2', color: '#991b1b' },
}

export function FarmerInputRequestCard({
  inputRequestForm, setInputRequestForm, handleInputRequestSubmit,
  farmerInputRequests, handleInputRequestDelete,
}) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Input Requests</span>
        <h3>Request farming inputs you need</h3>
      </div>
      <p className="section-lead">
        Log seed, spray, fertiliser, or any other input. Requests are saved to your account and visible to the supply chain.
      </p>
      <form className="smart-form" onSubmit={handleInputRequestSubmit}>
        <label>
          Input needed
          <input required placeholder="e.g. Hybrid maize seed" value={inputRequestForm.item}
            onChange={(e) => setInputRequestForm((c) => ({ ...c, item: e.target.value }))} />
        </label>
        <label>
          Quantity
          <input required placeholder="e.g. 5 bags, 10 litres" value={inputRequestForm.quantity}
            onChange={(e) => setInputRequestForm((c) => ({ ...c, quantity: e.target.value }))} />
        </label>
        <label>
          Urgency
          <select value={inputRequestForm.urgency}
            onChange={(e) => setInputRequestForm((c) => ({ ...c, urgency: e.target.value }))}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </label>
        <label>
          Additional notes
          <textarea rows="2" placeholder="Any context — linked to a specific report, disease problem, planting window, etc."
            value={inputRequestForm.note}
            onChange={(e) => setInputRequestForm((c) => ({ ...c, note: e.target.value }))} />
        </label>
        <button type="submit" className="primary-button">Submit request</button>
      </form>

      <div className="planner-list">
        {farmerInputRequests.length === 0 ? (
          <div className="empty-state compact-empty-state">
            <strong>No input requests yet</strong>
            <p>Requests you submit are saved here and visible to the supply tracking system.</p>
          </div>
        ) : (
          farmerInputRequests.map((req) => {
            const uc = URGENCY_COLORS[req.urgency] ?? { bg: '#f9fafb', color: '#374151' }
            const sc = REQUEST_STATUS_COLORS[req.status] ?? { bg: '#f9fafb', color: '#374151' }
            return (
              <div key={req.id} className="planner-item shared-planner-item">
                <div className="shared-planner-header">
                  <strong>{req.item}</strong>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <Badge text={req.urgency} bg={uc.bg} color={uc.color} />
                    <Badge text={req.status} bg={sc.bg} color={sc.color} />
                  </div>
                </div>
                <p>{req.quantity}{req.note ? ` — ${req.note}` : ''}</p>
                <div className="shared-planner-footer">
                  <span className="meta-note">{summarizeTimestamp(req.createdAtDisplay)}</span>
                  {handleInputRequestDelete ? (
                    <button type="button" className="shared-delete-btn"
                      onClick={() => handleInputRequestDelete(req.id)}>
                      Withdraw
                    </button>
                  ) : null}
                </div>
              </div>
            )
          })
        )}
      </div>
    </article>
  )
}

/* ─── ReportFormCard ────────────────────────────────────────────────────── */
// reporter is now auto-filled from the signed-in profile — field removed
export function ReportFormCard({ reportForm, setReportForm, handleReportSubmit }) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Field Reporting</span>
        <h3>Submit a pest or disease alert</h3>
      </div>
      <p className="section-lead">
        Describe what you observed, where it is, and how serious it looks. An extension officer will follow up.
      </p>
      <form className="smart-form" onSubmit={handleReportSubmit}>
        <label>
          Incident title
          <input required placeholder="e.g. Fall armyworm on maize, two acres affected"
            value={reportForm.title}
            onChange={(e) => setReportForm((c) => ({ ...c, title: e.target.value }))} />
        </label>
        <label>
          Location (village or parish)
          <input required placeholder="e.g. Bumbaire, Kyeizooba parish"
            value={reportForm.location}
            onChange={(e) => setReportForm((c) => ({ ...c, location: e.target.value }))} />
        </label>
        <label>
          How severe does it look?
          <select value={reportForm.severity}
            onChange={(e) => setReportForm((c) => ({ ...c, severity: e.target.value }))}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </label>
        <ImageUpload
          label="Photo evidence (optional)"
          currentUrl={reportForm.imageUrl}
          hint="Upload a photo of the affected area — helps officers assess the situation faster"
          onUploaded={(url) => setReportForm(c => ({ ...c, imageUrl: url }))}
        />
        {reportForm.imageUrl ? (
          <div className="report-image-preview">
            <img src={reportForm.imageUrl} alt="Field evidence" />
            <button type="button" className="shared-delete-btn"
              onClick={() => setReportForm(c => ({ ...c, imageUrl: '' }))}>
              Remove photo
            </button>
          </div>
        ) : null}
        <button type="submit" className="primary-button">Submit report</button>
      </form>
    </article>
  )
}

/* ─── FarmerReportManagerCard ───────────────────────────────────────────── */
export function FarmerReportManagerCard({
  farmerOwnReports, ownReportForm, setOwnReportForm,
  handleOwnReportUpdate, handleOwnReportDelete,
}) {
  const selectedReport = farmerOwnReports.find((r) => r.id === ownReportForm.reportId)

  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Manage My Reports</span>
        <h3>Edit or withdraw a submitted report</h3>
      </div>
      <p className="section-lead">
        Select a report to edit its details or withdraw it if it was logged by mistake.
        Status updates from extension officers appear here automatically.
      </p>

      {farmerOwnReports.length === 0 ? (
        <div className="empty-state">
          <strong>No reports to manage</strong>
          <p>Submit a field report above — it will appear here for editing and follow-up.</p>
        </div>
      ) : (
        <>
          {/* report cards — tap to select */}
          <div className="shared-report-list">
            {farmerOwnReports.map((report) => {
              const sc = SEVERITY_COLORS[report.severity] ?? '#f9fafb'
              const st = SEVERITY_TEXT[report.severity] ?? '#374151'
              const stc = STATUS_COLORS[report.status] ?? '#f9fafb'
              const isSelected = report.id === ownReportForm.reportId
              return (
                <button key={report.id} type="button"
                  className={`shared-report-card ${isSelected ? 'shared-report-card-selected' : ''}`}
                  onClick={() => setOwnReportForm({
                    reportId: report.id,
                    title: report.title,
                    location: report.location,
                    severity: report.severity,
                    reporter: report.reporter,
                  })}>
                  <div className="shared-report-card-header">
                    <strong>{report.title}</strong>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      <Badge text={report.severity} bg={sc} color={st} />
                      <Badge text={report.status} bg={stc} color="#374151" />
                    </div>
                  </div>
                  <span className="meta-note">{report.location} · {summarizeTimestamp(report.createdAtDisplay)}</span>
                  {report.assignedOfficer ? (
                    <span className="meta-note" style={{ color: 'var(--green-solid)', marginTop: '3px', display: 'block' }}>
                      Officer: {report.assignedOfficer}
                    </span>
                  ) : null}
                  {report.resolutionNotes ? (
                    <p style={{ marginTop: '6px', fontSize: '0.85rem', color: 'var(--muted-text)' }}>
                      {report.resolutionNotes}
                    </p>
                  ) : null}
                </button>
              )
            })}
          </div>

          {/* edit form — only shown when a report is selected */}
          {ownReportForm.reportId ? (
            <form className="smart-form" onSubmit={handleOwnReportUpdate} style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--card-border)' }}>
              <div className="section-title">
                <span className="eyebrow">Editing selected report</span>
              </div>
              <label>
                Incident title
                <input value={ownReportForm.title}
                  onChange={(e) => setOwnReportForm((c) => ({ ...c, title: e.target.value }))} />
              </label>
              <label>
                Location
                <input value={ownReportForm.location}
                  onChange={(e) => setOwnReportForm((c) => ({ ...c, location: e.target.value }))} />
              </label>
              <label>
                Severity
                <select value={ownReportForm.severity}
                  onChange={(e) => setOwnReportForm((c) => ({ ...c, severity: e.target.value }))}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </label>
              <div className="form-action-row">
                <button type="submit" className="primary-button">Save changes</button>
                <button type="button" className="secondary-button danger-button"
                  onClick={() => handleOwnReportDelete(ownReportForm.reportId)}>
                  Withdraw report
                </button>
                <button type="button" className="secondary-button"
                  onClick={() => setOwnReportForm({ reportId: '', title: '', location: '', severity: 'Medium', reporter: '' })}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="section-lead" style={{ marginTop: '14px' }}>
              Tap a report above to edit or withdraw it.
            </p>
          )}
        </>
      )}
    </article>
  )
}

/* ─── FarmerFormCard (extension/district use) ───────────────────────────── */
export function FarmerFormCard({ farmerForm, setFarmerForm, handleFarmerSubmit }) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Farmer Onboarding</span>
        <h3>Register a farmer profile</h3>
      </div>
      <form className="smart-form" onSubmit={handleFarmerSubmit}>
        <label>Full name
          <input required placeholder="e.g. Tumwesigye John" value={farmerForm.name}
            onChange={(e) => setFarmerForm((c) => ({ ...c, name: e.target.value }))} />
        </label>
        <label>Parish
          <input required placeholder="e.g. Ibaare" value={farmerForm.parish}
            onChange={(e) => setFarmerForm((c) => ({ ...c, parish: e.target.value }))} />
        </label>
        <label>Production focus
          <input required placeholder="e.g. Maize, coffee, poultry" value={farmerForm.focus}
            onChange={(e) => setFarmerForm((c) => ({ ...c, focus: e.target.value }))} />
        </label>
        <label>Preferred channel
          <select value={farmerForm.channel}
            onChange={(e) => setFarmerForm((c) => ({ ...c, channel: e.target.value }))}>
            <option>SMS alerts</option>
            <option>Mobile web</option>
            <option>Extension office visits</option>
          </select>
        </label>
        <button type="submit" className="primary-button">Register farmer</button>
      </form>
    </article>
  )
}

/* ─── AdvisoryFormCard ──────────────────────────────────────────────────── */
export function AdvisoryFormCard({ advisoryForm, setAdvisoryForm, handleAdvisorySubmit }) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Advisory Publishing</span>
        <h3>Publish a farmer advisory</h3>
      </div>
      <form className="smart-form" onSubmit={handleAdvisorySubmit}>
        <label>Title
          <input required placeholder="e.g. Coffee wilt prevention round" value={advisoryForm.title}
            onChange={(e) => setAdvisoryForm((c) => ({ ...c, title: e.target.value }))} />
        </label>
        <label>Target audience
          <input required placeholder="e.g. Coffee farmers, mixed crop farmers" value={advisoryForm.audience}
            onChange={(e) => setAdvisoryForm((c) => ({ ...c, audience: e.target.value }))} />
        </label>
        <label>Distribution channel
          <select value={advisoryForm.channel}
            onChange={(e) => setAdvisoryForm((c) => ({ ...c, channel: e.target.value }))}>
            <option>SMS</option>
            <option>Field bulletin</option>
            <option>Web dashboard</option>
          </select>
        </label>
        <label>Message
          <textarea required rows="4" placeholder="Write the advisory message clearly and concisely."
            value={advisoryForm.message}
            onChange={(e) => setAdvisoryForm((c) => ({ ...c, message: e.target.value }))} />
        </label>
        <button type="submit" className="primary-button">Publish advisory</button>
      </form>
    </article>
  )
}

/* ─── InventoryFormCard ─────────────────────────────────────────────────── */
export function InventoryFormCard({ inventoryForm, setInventoryForm, handleInventorySubmit }) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Inventory Update</span>
        <h3>Add agro-input stock record</h3>
      </div>
      <form className="smart-form" onSubmit={handleInventorySubmit}>
        <ImageUpload
          label="Product image (optional)"
          currentUrl={inventoryForm.imageUrl}
          hint="Upload a photo of the product — increases farmer trust in your listing"
          onUploaded={(url) => setInventoryForm(c => ({ ...c, imageUrl: url }))}
        />
        <label>Item
          <input required placeholder="e.g. Hybrid maize seed" value={inventoryForm.item}
            onChange={(e) => setInventoryForm((c) => ({ ...c, item: e.target.value }))} />
        </label>
        <label>Dealer
          <input required placeholder="e.g. Bushenyi Agro Centre" value={inventoryForm.dealer}
            onChange={(e) => setInventoryForm((c) => ({ ...c, dealer: e.target.value }))} />
        </label>
        <label>Stock quantity
          <input required placeholder="e.g. 120 bags" value={inventoryForm.stock}
            onChange={(e) => setInventoryForm((c) => ({ ...c, stock: e.target.value }))} />
        </label>
        <label>Verification status
          <select value={inventoryForm.status}
            onChange={(e) => setInventoryForm((c) => ({ ...c, status: e.target.value }))}>
            <option>Verified</option>
            <option>Pending inspection</option>
            <option>Restocking soon</option>
          </select>
        </label>
        <button type="submit" className="primary-button">Add stock record</button>
      </form>
    </article>
  )
}

/* ─── OfficerResponseCard ───────────────────────────────────────────────── */
export function OfficerResponseCard({
  reports, filteredReports, reportManagementForm,
  setReportManagementForm, handleReportManagementSubmit,
}) {
  return (
    <article className="content-card">
      <div className="section-title">
        <span className="eyebrow">Officer Response</span>
        <h3>Assign and resolve field reports</h3>
      </div>
      <form className="smart-form" onSubmit={handleReportManagementSubmit}>
        <label>Select report
          <select value={reportManagementForm.reportId}
            onChange={(e) => {
              const r = reports.find((rep) => rep.id === e.target.value)
              setReportManagementForm({
                reportId: e.target.value,
                assignedOfficer: r?.assignedOfficer ?? '',
                resolutionNotes: r?.resolutionNotes ?? '',
                status: r?.status ?? 'Officer assigned',
              })
            }}>
            <option value="">Choose a report to respond to</option>
            {filteredReports.map((r) => (
              <option key={r.id} value={r.id}>{r.title} — {r.location} ({r.severity})</option>
            ))}
          </select>
        </label>
        <label>Assigned officer
          <input placeholder="Full name of the responding officer" value={reportManagementForm.assignedOfficer}
            onChange={(e) => setReportManagementForm((c) => ({ ...c, assignedOfficer: e.target.value }))} />
        </label>
        <label>Response status
          <select value={reportManagementForm.status}
            onChange={(e) => setReportManagementForm((c) => ({ ...c, status: e.target.value }))}>
            <option>Officer assigned</option>
            <option>Verification ongoing</option>
            <option>Pending field response</option>
            <option>Resolved</option>
          </select>
        </label>
        <label>Resolution notes
          <textarea rows="4" placeholder="Describe what the officer found, what action was taken, and any follow-up needed."
            value={reportManagementForm.resolutionNotes}
            onChange={(e) => setReportManagementForm((c) => ({ ...c, resolutionNotes: e.target.value }))} />
        </label>
        <button type="submit" className="primary-button">Save response</button>
      </form>
    </article>
  )
}

/* ─── ManagementTable ───────────────────────────────────────────────────── */
export function ManagementTable({
  advisories, canManageAdvisories, canManageReports, canManageStock,
  filteredInventory, filteredReports,
  handleAdvisoryChannelChange, handleAdvisoryDelete,
  handleInventoryDelete, handleInventoryStatusChange, handleReportStatusChange,
}) {
  return (
    <article className="content-card full-span">
      <div className="section-title">
        <span className="eyebrow">Records Overview</span>
        <h3>Reports, advisories, and inventory at a glance</h3>
      </div>
      <p className="section-lead">
        Structured view of the current operational records. Use inline controls to update status or remove entries.
      </p>
      <div className="table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title / Item</th>
              <th>Location / Audience</th>
              <th>Status / Channel</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.slice(0, 5).map((report) => (
              <tr key={`${report.id}-${report.location}`}>
                <td><Badge text="Report" bg={SEVERITY_COLORS[report.severity] ?? '#f9fafb'} color={SEVERITY_TEXT[report.severity] ?? '#374151'} /></td>
                <td>{report.title}</td>
                <td>{report.location}</td>
                <td>
                  {canManageReports ? (
                    <select value={report.status}
                      onChange={(e) => handleReportStatusChange(report.id, e.target.value)}>
                      <option>Pending field response</option>
                      <option>Officer assigned</option>
                      <option>Verification ongoing</option>
                      <option>Resolved</option>
                    </select>
                  ) : (
                    <Badge text={report.status} bg={STATUS_COLORS[report.status] ?? '#f9fafb'} color="#374151" />
                  )}
                </td>
                <td>
                  {report.assignedOfficer
                    ? `${report.assignedOfficer} · ${summarizeTimestamp(report.updatedAtDisplay ?? report.createdAtDisplay)}`
                    : canManageReports ? 'Assign officer' : '—'}
                </td>
              </tr>
            ))}
            {advisories.slice(0, 2).map((advisory) => (
              <tr key={`${advisory.id}-${advisory.audience}`}>
                <td><Badge text="Advisory" bg="#eff6ff" color="#1e40af" /></td>
                <td>{advisory.title}</td>
                <td>{advisory.audience}</td>
                <td>
                  {canManageAdvisories ? (
                    <select value={advisory.channel}
                      onChange={(e) => handleAdvisoryChannelChange(advisory.id, e.target.value)}>
                      <option>SMS</option>
                      <option>Field bulletin</option>
                      <option>Web dashboard</option>
                    </select>
                  ) : advisory.channel}
                </td>
                <td>
                  {canManageAdvisories ? (
                    <div className="table-action-group">
                      <span className="meta-inline">{summarizeTimestamp(advisory.createdAtDisplay)}</span>
                      <button type="button" className="table-action danger-action"
                        onClick={() => handleAdvisoryDelete(advisory.id)}>Remove</button>
                    </div>
                  ) : summarizeTimestamp(advisory.createdAtDisplay)}
                </td>
              </tr>
            ))}
            {filteredInventory.slice(0, 3).map((entry) => (
              <tr key={`${entry.id}-${entry.dealer}`}>
                <td><Badge text="Inventory" bg="#f0fdf4" color="#166534" /></td>
                <td>{entry.item}</td>
                <td>{entry.dealer}</td>
                <td>
                  {canManageStock ? (
                    <select value={entry.status}
                      onChange={(e) => handleInventoryStatusChange(entry.id, e.target.value)}>
                      <option>Verified</option>
                      <option>Pending inspection</option>
                      <option>Restocking soon</option>
                    </select>
                  ) : entry.status}
                </td>
                <td>
                  {canManageStock ? (
                    <div className="table-action-group">
                      <span className="meta-inline">{summarizeTimestamp(entry.createdAtDisplay)}</span>
                      <button type="button" className="table-action danger-action"
                        onClick={() => handleInventoryDelete(entry.id)}>Remove</button>
                    </div>
                  ) : summarizeTimestamp(entry.createdAtDisplay)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}
