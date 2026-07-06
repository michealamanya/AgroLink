/**
 * District Analytics — real-time aggregated metrics for district officials.
 * Shows user registration, marketplace activity, report trends, advisory reach.
 * Objective 3: Administrative and reporting dashboard with real-time visibility.
 */
import { useEffect, useState } from 'react'
import { getAuditLogs } from '../../services/audit'
import { hasFirebaseConfig } from '../../firebase'

function MetricCard({ icon, value, label, sub, accent }) {
  return (
    <div className="da-metric-card">
      <span className="da-metric-icon">{icon}</span>
      <strong className="da-metric-value" style={accent ? { color: accent } : {}}>
        {value}
      </strong>
      <span className="da-metric-label">{label}</span>
      {sub ? <span className="da-metric-sub">{sub}</span> : null}
    </div>
  )
}

function ProgressBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="da-bar-row">
      <div className="da-bar-label-row">
        <span>{label}</span>
        <span>{value} ({pct}%)</span>
      </div>
      <div className="da-bar-track">
        <div className="da-bar-fill" style={{ width: `${pct}%`, background: color ?? '#15803d' }} />
      </div>
    </div>
  )
}

function DistrictAnalytics({ state }) {
  const { farmers, reports, advisories, inventory } = state
  const [auditLogs, setAuditLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!hasFirebaseConfig) return
    setLogsLoading(true)
    getAuditLogs({}).then(logs => {
      setAuditLogs(logs.slice(0, 50))
      setLogsLoading(false)
    }).catch(() => setLogsLoading(false))
  }, [])

  // ── computed metrics ──
  const totalUsers   = farmers.length
  const verifiedStock = inventory.filter(i => i.status === 'Verified').length
  const pendingStock  = inventory.filter(i => i.status === 'Pending inspection').length
  const highReports   = reports.filter(r => r.severity === 'High').length
  const medReports    = reports.filter(r => r.severity === 'Medium').length
  const lowReports    = reports.filter(r => r.severity === 'Low').length
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length
  const pendingReports  = reports.filter(r => r.status === 'Pending field response').length
  const smsAdvisories   = advisories.filter(a => a.channel === 'SMS').length
  const webAdvisories   = advisories.filter(a => a.channel === 'Web dashboard').length
  const bulletinAdvisories = advisories.filter(a => a.channel === 'Field bulletin').length

  // parish coverage
  const parishMap = {}
  farmers.forEach(f => { if (f.parish) parishMap[f.parish] = (parishMap[f.parish] || 0) + 1 })
  const topParishes = Object.entries(parishMap).sort((a, b) => b[1] - a[1]).slice(0, 6)

  // crop focus
  const cropMap = {}
  farmers.forEach(f => {
    if (!f.focus) return
    f.focus.split(',').forEach(c => {
      const k = c.trim().toLowerCase()
      if (k) cropMap[k] = (cropMap[k] || 0) + 1
    })
  })
  const topCrops = Object.entries(cropMap).sort((a, b) => b[1] - a[1]).slice(0, 6)

  // dealer breakdown
  const dealerMap = {}
  inventory.forEach(i => { dealerMap[i.dealer] = (dealerMap[i.dealer] || 0) + 1 })
  const topDealers = Object.entries(dealerMap).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const TABS = [
    { key: 'overview',    label: '📊 Overview' },
    { key: 'users',       label: '👥 Users' },
    { key: 'reports',     label: '⚠️ Reports' },
    { key: 'advisories',  label: '📢 Advisories' },
    { key: 'supply',      label: '📦 Supply' },
    { key: 'audit',       label: '🔐 Audit Log' },
  ]

  return (
    <div className="da-root">
      {/* tab bar */}
      <div className="da-tabs">
        {TABS.map(t => (
          <button key={t.key} type="button"
            className={`da-tab ${activeTab === t.key ? 'da-tab-active' : ''}`}
            onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === 'overview' && (
        <div className="da-section">
          <div className="da-metrics-grid">
            <MetricCard icon="👥" value={totalUsers}      label="Registered farmers"     sub="Across all parishes" />
            <MetricCard icon="⚠️" value={reports.length}  label="Total field reports"    sub={`${highReports} high severity`} accent={highReports > 0 ? '#dc2626' : undefined} />
            <MetricCard icon="📢" value={advisories.length} label="Published advisories" sub={`${smsAdvisories} via SMS`} />
            <MetricCard icon="📦" value={inventory.length} label="Inventory records"     sub={`${verifiedStock} verified`} accent="#15803d" />
            <MetricCard icon="✅" value={resolvedReports}  label="Resolved reports"      sub={`${pendingReports} still pending`} />
            <MetricCard icon="🏪" value={Object.keys(dealerMap).length} label="Active dealers" sub="With stock listed" />
          </div>

          <div className="da-two-col">
            <div className="da-chart-card">
              <h4>Reports by severity</h4>
              <ProgressBar label="High"   value={highReports} max={reports.length} color="#dc2626" />
              <ProgressBar label="Medium" value={medReports}  max={reports.length} color="#ea7a12" />
              <ProgressBar label="Low"    value={lowReports}  max={reports.length} color="#15803d" />
            </div>
            <div className="da-chart-card">
              <h4>Advisory channels</h4>
              <ProgressBar label="SMS"          value={smsAdvisories}      max={advisories.length} color="#1d4ed8" />
              <ProgressBar label="Field bulletin" value={bulletinAdvisories} max={advisories.length} color="#15803d" />
              <ProgressBar label="Web dashboard" value={webAdvisories}      max={advisories.length} color="#7e22ce" />
            </div>
          </div>
        </div>
      )}

      {/* ── Users ── */}
      {activeTab === 'users' && (
        <div className="da-section">
          <h3 className="da-section-title">Farmer registration coverage</h3>
          <div className="da-metrics-grid">
            <MetricCard icon="🌾" value={totalUsers}   label="Total farmers" />
            <MetricCard icon="📍" value={topParishes.length} label="Parishes covered" />
            <MetricCard icon="🌱" value={topCrops.length}    label="Distinct crop types" />
            <MetricCard icon="📱" value={farmers.filter(f => f.channel === 'Mobile web').length} label="Using mobile web" />
          </div>
          <div className="da-two-col">
            <div className="da-chart-card">
              <h4>Farmers by parish</h4>
              {topParishes.length === 0
                ? <p className="da-empty">No parish data yet</p>
                : topParishes.map(([p, n]) => (
                    <ProgressBar key={p} label={p} value={n} max={totalUsers} />
                  ))}
            </div>
            <div className="da-chart-card">
              <h4>Top crop focuses</h4>
              {topCrops.length === 0
                ? <p className="da-empty">No crop data yet</p>
                : topCrops.map(([c, n]) => (
                    <ProgressBar key={c} label={c} value={n} max={totalUsers} />
                  ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Reports ── */}
      {activeTab === 'reports' && (
        <div className="da-section">
          <h3 className="da-section-title">Field incident reports</h3>
          <div className="da-metrics-grid">
            <MetricCard icon="📋" value={reports.length}    label="Total reports" />
            <MetricCard icon="🔴" value={highReports}       label="High severity"  accent="#dc2626" />
            <MetricCard icon="✅" value={resolvedReports}   label="Resolved" accent="#15803d" />
            <MetricCard icon="⏳" value={pendingReports}    label="Pending response" accent="#ea7a12" />
          </div>
          <div className="da-chart-card">
            <h4>Report status breakdown</h4>
            {['Pending field response', 'Officer assigned', 'Verification ongoing', 'Resolved'].map(s => {
              const n = reports.filter(r => r.status === s).length
              const colors = { Resolved: '#15803d', 'Officer assigned': '#1d4ed8', 'Verification ongoing': '#a16207', 'Pending field response': '#dc2626' }
              return <ProgressBar key={s} label={s} value={n} max={reports.length} color={colors[s]} />
            })}
          </div>
          <div className="da-table-card">
            <h4>Recent reports</h4>
            <div className="da-table-scroll">
              <table className="da-table">
                <thead><tr><th>Title</th><th>Location</th><th>Severity</th><th>Status</th><th>Reporter</th></tr></thead>
                <tbody>
                  {reports.slice(0, 10).map(r => (
                    <tr key={r.id}>
                      <td>{r.title}</td>
                      <td>{r.location}</td>
                      <td><span className="da-badge" style={r.severity === 'High' ? { background: '#fee2e2', color: '#991b1b' } : r.severity === 'Medium' ? { background: '#fff7ed', color: '#9a3412' } : { background: '#f0fdf4', color: '#166534' }}>{r.severity}</span></td>
                      <td>{r.status}</td>
                      <td>{r.reporter || r.createdByName || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Advisories ── */}
      {activeTab === 'advisories' && (
        <div className="da-section">
          <h3 className="da-section-title">Advisory publishing & reach</h3>
          <div className="da-metrics-grid">
            <MetricCard icon="📢" value={advisories.length}  label="Total advisories" />
            <MetricCard icon="📱" value={smsAdvisories}       label="Via SMS" />
            <MetricCard icon="📰" value={bulletinAdvisories}  label="Via field bulletin" />
            <MetricCard icon="🌐" value={webAdvisories}       label="Via web dashboard" />
          </div>
          <div className="da-table-card">
            <h4>All published advisories</h4>
            <div className="da-table-scroll">
              <table className="da-table">
                <thead><tr><th>Title</th><th>Audience</th><th>Channel</th><th>Published by</th><th>Date</th></tr></thead>
                <tbody>
                  {advisories.map(a => (
                    <tr key={a.id}>
                      <td>{a.title}</td>
                      <td>{a.audience}</td>
                      <td>{a.channel}</td>
                      <td>{a.createdByName || '—'}</td>
                      <td>{a.createdAtDisplay || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Supply ── */}
      {activeTab === 'supply' && (
        <div className="da-section">
          <h3 className="da-section-title">Agro-input supply visibility</h3>
          <div className="da-metrics-grid">
            <MetricCard icon="📦" value={inventory.length} label="Total listings" />
            <MetricCard icon="✅" value={verifiedStock}    label="Verified"     accent="#15803d" />
            <MetricCard icon="⏳" value={pendingStock}     label="Pending inspection" accent="#a16207" />
            <MetricCard icon="🏪" value={Object.keys(dealerMap).length} label="Active dealers" />
          </div>
          <div className="da-two-col">
            <div className="da-chart-card">
              <h4>Listings by dealer</h4>
              {topDealers.map(([d, n]) => (
                <ProgressBar key={d} label={d} value={n} max={inventory.length} />
              ))}
            </div>
            <div className="da-chart-card">
              <h4>Stock status</h4>
              {['Verified', 'Pending inspection', 'Restocking soon'].map(s => {
                const n = inventory.filter(i => i.status === s).length
                const colors = { Verified: '#15803d', 'Pending inspection': '#a16207', 'Restocking soon': '#dc2626' }
                return <ProgressBar key={s} label={s} value={n} max={inventory.length} color={colors[s]} />
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Audit Log ── */}
      {activeTab === 'audit' && (
        <div className="da-section">
          <h3 className="da-section-title">System audit log</h3>
          <p className="da-section-desc">
            {hasFirebaseConfig
              ? 'Real-time record of all significant actions performed on the platform.'
              : 'Audit logging is available when Firebase is configured. Currently in demo mode.'}
          </p>
          {logsLoading ? (
            <div className="da-loading">Loading audit records…</div>
          ) : auditLogs.length === 0 ? (
            <div className="da-empty-state">
              <span>🔐</span>
              <strong>No audit records yet</strong>
              <p>Actions like sign-ins, registrations, and data changes will appear here.</p>
            </div>
          ) : (
            <div className="da-table-card">
              <div className="da-table-scroll">
                <table className="da-table">
                  <thead><tr><th>Action</th><th>User</th><th>Role</th><th>Email</th><th>Date</th></tr></thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td><span className="da-action-badge">{log.action}</span></td>
                        <td>{log.name}</td>
                        <td>{log.role}</td>
                        <td>{log.email}</td>
                        <td>{log.dateStr || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DistrictAnalytics
