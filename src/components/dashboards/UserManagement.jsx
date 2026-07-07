/**
 * UserManagement — District officer admin panel.
 * Lets district officials view all registered users,
 * upgrade/downgrade roles, and suspend accounts.
 *
 * Only rendered inside DistrictDashboard.
 */
import { useEffect, useState } from 'react'
import { getAllUsers, updateUserRole } from '../../services/auth'
import { hasFirebaseConfig } from '../../firebase'

const ROLES = ['farmer', 'extension', 'dealer', 'district']
const ROLE_LABELS = {
  farmer:    { icon: '🌾', label: 'Farmer',                 color: '#15803d', bg: '#f0fdf4' },
  extension: { icon: '🧑‍💼', label: 'Extension Officer',      color: '#1d4ed8', bg: '#eff6ff' },
  dealer:    { icon: '🏪', label: 'Agro-Input Dealer',       color: '#c2410c', bg: '#fff7ed' },
  district:  { icon: '🏛️', label: 'District Office',         color: '#7e22ce', bg: '#faf5ff' },
}
const STATUS_LABELS = {
  active:    { label: 'Active',    color: '#15803d', bg: '#f0fdf4' },
  suspended: { label: 'Suspended', color: '#dc2626', bg: '#fef2f2' },
}

function RoleBadge({ role }) {
  const r = ROLE_LABELS[role] ?? ROLE_LABELS.farmer
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '999px',
      fontSize: '0.75rem', fontWeight: 700,
      background: r.bg, color: r.color,
    }}>
      {r.icon} {r.label}
    </span>
  )
}

function UserCard({ user, onRoleChange, onStatusChange, saving }) {
  const [roleEdit, setRoleEdit] = useState(user.role ?? 'farmer')
  const [dirty, setDirty] = useState(false)
  const isSuspended = user.status === 'suspended'
  const isMe = false // can't suspend yourself — district should know their own uid

  function handleRoleChange(e) {
    setRoleEdit(e.target.value)
    setDirty(true)
  }

  function handleSave() {
    onRoleChange(user.id, roleEdit)
    setDirty(false)
  }

  return (
    <div className={`um-card ${isSuspended ? 'um-card-suspended' : ''}`}>
      {/* avatar */}
      <div className="um-avatar"
        style={{ background: ROLE_LABELS[user.role ?? 'farmer']?.color ?? '#15803d' }}>
        {(user.name ?? user.email ?? '?')[0].toUpperCase()}
      </div>

      {/* info */}
      <div className="um-info">
        <strong className="um-name">{user.name ?? '(no name)'}</strong>
        <span className="um-email">{user.email}</span>
        <span className="um-district">📍 {user.district ?? 'District not set'}</span>
        {user.createdAt?.toDate ? (
          <span className="um-joined">
            Joined {new Date(user.createdAt.toDate()).toLocaleDateString('en-UG', { dateStyle: 'medium' })}
          </span>
        ) : null}
      </div>

      {/* role select */}
      <div className="um-role-section">
        <span className="um-role-label">Role</span>
        <select className="um-role-select" value={roleEdit}
          onChange={handleRoleChange} disabled={isSuspended || saving}>
          {ROLES.map(r => (
            <option key={r} value={r}>{ROLE_LABELS[r].icon} {ROLE_LABELS[r].label}</option>
          ))}
        </select>
        {dirty ? (
          <button type="button" className="um-save-btn"
            onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save role'}
          </button>
        ) : (
          <RoleBadge role={user.role ?? 'farmer'} />
        )}
      </div>

      {/* status toggle */}
      <div className="um-actions">
        {isSuspended ? (
          <button type="button" className="um-restore-btn"
            onClick={() => onStatusChange(user.id, 'active')} disabled={saving}>
            ✓ Restore access
          </button>
        ) : (
          <button type="button" className="um-suspend-btn"
            onClick={() => onStatusChange(user.id, 'suspended')} disabled={saving}>
            ⊘ Suspend account
          </button>
        )}
      </div>
    </div>
  )
}

function UserManagement() {
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [saving, setSaving]       = useState(null) // uid being saved
  const [toast, setToast]         = useState(null)

  // filters
  const [search, setSearch]       = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (!hasFirebaseConfig) { setLoading(false); return }
    getAllUsers()
      .then(data => { setUsers(data); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleRoleChange(uid, newRole) {
    setSaving(uid)
    try {
      await updateUserRole(uid, { role: newRole })
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, role: newRole } : u))
      showToast(`Role updated to ${ROLE_LABELS[newRole]?.label ?? newRole}`)
    } catch (e) {
      showToast(`Failed: ${e.message}`)
    } finally {
      setSaving(null)
    }
  }

  async function handleStatusChange(uid, newStatus) {
    setSaving(uid)
    try {
      await updateUserRole(uid, { status: newStatus })
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, status: newStatus } : u))
      showToast(newStatus === 'suspended' ? 'Account suspended.' : 'Access restored.')
    } catch (e) {
      showToast(`Failed: ${e.message}`)
    } finally {
      setSaving(null)
    }
  }

  const filtered = users.filter(u => {
    const q = search.trim().toLowerCase()
    if (q && !u.name?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q)) return false
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (statusFilter === 'active'    && u.status === 'suspended') return false
    if (statusFilter === 'suspended' && u.status !== 'suspended') return false
    return true
  })

  // role counts
  const counts = {}
  ROLES.forEach(r => { counts[r] = users.filter(u => u.role === r).length })

  return (
    <div className="um-root">
      {toast ? <div className="um-toast" role="alert">{toast}</div> : null}

      {/* summary */}
      <div className="um-summary">
        {ROLES.map(r => (
          <div key={r} className="um-summary-pill"
            style={{ background: ROLE_LABELS[r].bg, borderColor: `${ROLE_LABELS[r].color}30` }}>
            <span className="um-summary-icon">{ROLE_LABELS[r].icon}</span>
            <strong style={{ color: ROLE_LABELS[r].color }}>{counts[r]}</strong>
            <span>{ROLE_LABELS[r].label}</span>
          </div>
        ))}
        <div className="um-summary-pill">
          <span className="um-summary-icon">👥</span>
          <strong>{users.length}</strong>
          <span>Total users</span>
        </div>
      </div>

      {/* filters */}
      <div className="um-filters">
        <div className="um-search-wrap">
          <span>🔍</span>
          <input className="um-search" placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="um-filter-select" value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All roles</option>
          {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r].label}</option>)}
        </select>
        <select className="um-filter-select" value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* results */}
      {loading ? (
        <div className="um-loading">Loading users…</div>
      ) : error ? (
        <div className="um-error">⚠️ {error}</div>
      ) : !hasFirebaseConfig ? (
        <div className="um-empty">
          <span>🔐</span>
          <strong>User management requires Firebase</strong>
          <p>Configure your Firebase environment variables to manage platform users.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="um-empty">
          <span>👥</span>
          <strong>{users.length === 0 ? 'No users registered yet' : 'No users match your filters'}</strong>
          <p>{users.length === 0 ? 'Users will appear here once they sign up.' : 'Try clearing the search or filters.'}</p>
        </div>
      ) : (
        <div className="um-list">
          <p className="um-count">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</p>
          {filtered.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onRoleChange={handleRoleChange}
              onStatusChange={handleStatusChange}
              saving={saving === user.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default UserManagement
