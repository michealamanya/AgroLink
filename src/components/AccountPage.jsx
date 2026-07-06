import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import ImageUpload from './ImageUpload'

const ROLE_LABELS = {
  farmer:    { label: 'Farmer',                 icon: '🌾', color: '#15803d' },
  extension: { label: 'Extension Officer',      icon: '🧑‍💼', color: '#1d4ed8' },
  dealer:    { label: 'Agro-Input Dealer',       icon: '🏪', color: '#c2410c' },
  district:  { label: 'District Agriculture Office', icon: '🏛️', color: '#7e22ce' },
}

/* ── section tab bar ───────────────────────────────────────────────── */
const TABS = [
  { key: 'profile',   label: 'Profile',   icon: '👤' },
  { key: 'account',   label: 'Account',   icon: '⚙️' },
  { key: 'security',  label: 'Security',  icon: '🔒' },
  { key: 'activity',  label: 'Activity',  icon: '📊' },
]

function AccountPage({ state }) {
  const {
    authBusy, accountForm, setAccountForm, handleAccountUpdate,
    handleLogout, currentProfile, currentUser, farmers, reports,
    advisories, inventory, seasonPlans, inputRequests, dataMode,
  } = state

  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)

  const roleInfo = ROLE_LABELS[currentProfile?.role] ?? ROLE_LABELS.farmer

  async function onSave(e) {
    e.preventDefault()
    await handleAccountUpdate(e)
    setSaved(true)
    setTimeout(() => setSaved(false), 2800)
  }

  /* ── activity stats per role ─────────────────────────────────────── */
  const activityStats = (() => {
    const role = currentProfile?.role
    if (role === 'farmer') {
      const myReports = reports.filter(r =>
        currentUser?.uid ? r.createdById === currentUser.uid : r.createdByName === currentProfile?.name
      )
      const myPlans = seasonPlans?.filter(p =>
        currentUser?.uid ? p.createdById === currentUser.uid : p.createdByName === currentProfile?.name
      ) ?? []
      const myRequests = inputRequests?.filter(r =>
        currentUser?.uid ? r.createdById === currentUser.uid : r.createdByName === currentProfile?.name
      ) ?? []
      return [
        { label: 'Field reports submitted', value: myReports.length, icon: '📋' },
        { label: 'Season plans created',    value: myPlans.length,   icon: '🌱' },
        { label: 'Input requests sent',     value: myRequests.length,icon: '📦' },
        { label: 'Active farmers in system',value: farmers.length,   icon: '👥' },
      ]
    }
    if (role === 'extension') {
      const myAdvisories = advisories.filter(a =>
        currentUser?.uid ? a.createdById === currentUser.uid : a.createdByName === currentProfile?.name
      )
      const resolvedReports = reports.filter(r => r.status === 'Resolved')
      return [
        { label: 'Advisories published',   value: myAdvisories.length,   icon: '📢' },
        { label: 'Reports resolved',       value: resolvedReports.length, icon: '✅' },
        { label: 'Farmers registered',     value: farmers.length,         icon: '🌾' },
        { label: 'Open incidents',         value: reports.filter(r => r.status !== 'Resolved').length, icon: '🚨' },
      ]
    }
    if (role === 'dealer') {
      const myStock = inventory.filter(i =>
        currentUser?.uid ? i.createdById === currentUser.uid : i.createdByName === currentProfile?.name
      )
      return [
        { label: 'Stock lines listed',    value: myStock.length,  icon: '📦' },
        { label: 'Verified lines',        value: myStock.filter(i => i.status === 'Verified').length, icon: '✅' },
        { label: 'Restocking soon',       value: myStock.filter(i => i.status === 'Restocking soon').length, icon: '⚠️' },
        { label: 'Active field reports',  value: reports.length,  icon: '📋' },
      ]
    }
    // district
    return [
      { label: 'Registered farmers',     value: farmers.length,    icon: '🌾' },
      { label: 'Total field reports',    value: reports.length,    icon: '📋' },
      { label: 'Published advisories',   value: advisories.length, icon: '📢' },
      { label: 'Inventory records',      value: inventory.length,  icon: '📦' },
    ]
  })()

  return (
    <div className="acc-root">
      {/* ── Left: identity card ───────────────────────────────────── */}
      <aside className="acc-sidebar">
        <div className="acc-avatar-wrap">
          {accountForm.photoUrl ? (
            <img src={accountForm.photoUrl} alt="Profile" className="acc-avatar-img" />
          ) : (
            <div className="acc-avatar-placeholder" style={{ background: roleInfo.color }}>
              {(currentProfile?.name ?? currentUser?.email ?? 'U')[0].toUpperCase()}
            </div>
          )}
          <div className="acc-role-badge" style={{ background: roleInfo.color }}>
            <span>{roleInfo.icon}</span>
            <span>{roleInfo.label}</span>
          </div>
        </div>

        <div className="acc-identity">
          <h2 className="acc-name">{currentProfile?.name ?? 'Your name'}</h2>
          <p className="acc-email">{currentUser?.email}</p>
          {currentProfile?.district ? (
            <p className="acc-district">📍 {currentProfile.district}</p>
          ) : null}
          {accountForm.bio ? (
            <p className="acc-bio">{accountForm.bio}</p>
          ) : null}
        </div>

        <div className="acc-sidebar-stats">
          {activityStats.slice(0, 3).map(s => (
            <div key={s.label} className="acc-sidebar-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="acc-sidebar-meta">
          <span className={`acc-data-mode acc-data-${dataMode}`}>
            {dataMode === 'firebase' ? '● Live data' : '● Demo mode'}
          </span>
        </div>

        <div className="acc-sidebar-actions">
          <NavLink
            to={currentProfile?.role ? `/dashboard/${currentProfile.role}` : '/'}
            className="acc-btn-dashboard"
          >
            Open dashboard →
          </NavLink>
          <button
            type="button"
            className="acc-btn-signout"
            onClick={handleLogout}
            disabled={authBusy}
          >
            {authBusy ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>

      {/* ── Right: tabbed settings ────────────────────────────────── */}
      <div className="acc-main">
        <div className="acc-header">
          <div>
            <h1 className="acc-title">Account Settings</h1>
            <p className="acc-subtitle">Manage your profile, preferences, and account details</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="acc-tabs" role="tablist">
          {TABS.map(tab => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`acc-tab ${activeTab === tab.key ? 'acc-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span aria-hidden="true">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Profile tab ──────────────────────────────────────────── */}
        {activeTab === 'profile' ? (
          <form className="acc-form" onSubmit={onSave}>
            <div className="acc-section">
              <h3 className="acc-section-title">Profile photo</h3>
              <ImageUpload
                currentUrl={accountForm.photoUrl}
                hint="Your photo is visible to extension officers and platform administrators"
                onUploaded={url => setAccountForm(c => ({ ...c, photoUrl: url }))}
              />
            </div>

            <div className="acc-section">
              <h3 className="acc-section-title">Personal information</h3>
              <div className="acc-field-grid">
                <div className="acc-field">
                  <label>Full name</label>
                  <input
                    required
                    placeholder="Your full name"
                    value={accountForm.name}
                    onChange={e => setAccountForm(c => ({ ...c, name: e.target.value }))}
                  />
                </div>
                <div className="acc-field">
                  <label>District</label>
                  <input
                    placeholder="e.g. Bushenyi District"
                    value={accountForm.district}
                    onChange={e => setAccountForm(c => ({ ...c, district: e.target.value }))}
                  />
                </div>
                <div className="acc-field">
                  <label>Phone number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +256 700 000000"
                    value={accountForm.phone}
                    onChange={e => setAccountForm(c => ({ ...c, phone: e.target.value }))}
                  />
                </div>
                <div className="acc-field acc-field-full">
                  <label>Bio / About</label>
                  <textarea
                    rows={3}
                    placeholder={
                      currentProfile?.role === 'extension'
                        ? 'e.g. Extension officer covering Kyeizooba and Ibaare sub-counties, specialising in crop pest management'
                        : currentProfile?.role === 'dealer'
                        ? 'e.g. Supplying verified seeds, fertilizers and agrochemicals in Bushenyi since 2018'
                        : 'A short description about yourself and your farm'
                    }
                    value={accountForm.bio}
                    onChange={e => setAccountForm(c => ({ ...c, bio: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Role-specific extra fields */}
            {currentProfile?.role === 'extension' ? (
              <div className="acc-section">
                <h3 className="acc-section-title">Extension officer details</h3>
                <div className="acc-field-grid">
                  <div className="acc-field">
                    <label>Sub-counties covered</label>
                    <input
                      placeholder="e.g. Kyeizooba, Ibaare, Kakanju"
                      value={accountForm.subCounties ?? ''}
                      onChange={e => setAccountForm(c => ({ ...c, subCounties: e.target.value }))}
                    />
                  </div>
                  <div className="acc-field">
                    <label>Specialisation</label>
                    <input
                      placeholder="e.g. Crop pest management, dairy"
                      value={accountForm.specialisation ?? ''}
                      onChange={e => setAccountForm(c => ({ ...c, specialisation: e.target.value }))}
                    />
                  </div>
                  <div className="acc-field">
                    <label>Office location</label>
                    <input
                      placeholder="e.g. Bushenyi Extension Office"
                      value={accountForm.officeLocation ?? ''}
                      onChange={e => setAccountForm(c => ({ ...c, officeLocation: e.target.value }))}
                    />
                  </div>
                  <div className="acc-field">
                    <label>Years of experience</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 5"
                      value={accountForm.experience ?? ''}
                      onChange={e => setAccountForm(c => ({ ...c, experience: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {currentProfile?.role === 'dealer' ? (
              <div className="acc-section">
                <h3 className="acc-section-title">Dealer details</h3>
                <div className="acc-field-grid">
                  <div className="acc-field">
                    <label>Business / shop name</label>
                    <input
                      placeholder="e.g. Bushenyi Agro Centre"
                      value={accountForm.businessName ?? ''}
                      onChange={e => setAccountForm(c => ({ ...c, businessName: e.target.value }))}
                    />
                  </div>
                  <div className="acc-field">
                    <label>Location / address</label>
                    <input
                      placeholder="e.g. Main Street, Bushenyi Town"
                      value={accountForm.businessLocation ?? ''}
                      onChange={e => setAccountForm(c => ({ ...c, businessLocation: e.target.value }))}
                    />
                  </div>
                  <div className="acc-field">
                    <label>Products speciality</label>
                    <input
                      placeholder="e.g. Seeds, fertilisers, agrochemicals"
                      value={accountForm.productsSpeciality ?? ''}
                      onChange={e => setAccountForm(c => ({ ...c, productsSpeciality: e.target.value }))}
                    />
                  </div>
                  <div className="acc-field">
                    <label>Verification / licence number</label>
                    <input
                      placeholder="e.g. URA-AGR-2024-0012"
                      value={accountForm.licenceNumber ?? ''}
                      onChange={e => setAccountForm(c => ({ ...c, licenceNumber: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {currentProfile?.role === 'district' ? (
              <div className="acc-section">
                <h3 className="acc-section-title">District office details</h3>
                <div className="acc-field-grid">
                  <div className="acc-field">
                    <label>Department</label>
                    <input
                      placeholder="e.g. Production and Marketing"
                      value={accountForm.department ?? ''}
                      onChange={e => setAccountForm(c => ({ ...c, department: e.target.value }))}
                    />
                  </div>
                  <div className="acc-field">
                    <label>Title / designation</label>
                    <input
                      placeholder="e.g. District Agricultural Officer"
                      value={accountForm.designation ?? ''}
                      onChange={e => setAccountForm(c => ({ ...c, designation: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="acc-form-footer">
              <button type="submit" className="acc-btn-save" disabled={authBusy}>
                {authBusy ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
              </button>
              {saved ? <span className="acc-saved-msg">Changes saved successfully</span> : null}
            </div>
          </form>
        ) : null}

        {/* ── Account tab ──────────────────────────────────────────── */}
        {activeTab === 'account' ? (
          <div className="acc-section-group">
            <div className="acc-section">
              <h3 className="acc-section-title">Account information</h3>
              <div className="acc-info-grid">
                <div className="acc-info-row">
                  <span>Email address</span>
                  <strong>{currentUser?.email ?? '—'}</strong>
                </div>
                <div className="acc-info-row">
                  <span>Role</span>
                  <strong style={{ color: roleInfo.color }}>
                    {roleInfo.icon} {roleInfo.label}
                  </strong>
                </div>
                <div className="acc-info-row">
                  <span>District</span>
                  <strong>{currentProfile?.district ?? 'Not set'}</strong>
                </div>
                <div className="acc-info-row">
                  <span>Account created</span>
                  <strong>{currentProfile?.createdAt?.toDate
                    ? new Date(currentProfile.createdAt.toDate()).toLocaleDateString('en-UG', { dateStyle: 'medium' })
                    : '—'}
                  </strong>
                </div>
                <div className="acc-info-row">
                  <span>Data mode</span>
                  <strong className={dataMode === 'firebase' ? 'acc-live' : 'acc-demo'}>
                    {dataMode === 'firebase' ? '● Live (Firebase)' : '● Demo mode'}
                  </strong>
                </div>
                <div className="acc-info-row">
                  <span>Sign-in method</span>
                  <strong>
                    {currentUser?.providerData?.[0]?.providerId === 'google.com'
                      ? '🔵 Google account'
                      : '📧 Email and password'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="acc-section acc-danger-section">
              <h3 className="acc-section-title acc-danger-title">Session</h3>
              <p className="acc-section-desc">
                Sign out securely when you are done with your operational work.
                Your data is saved and will be waiting when you return.
              </p>
              <button
                type="button"
                className="acc-btn-signout acc-btn-signout-lg"
                onClick={handleLogout}
                disabled={authBusy}
              >
                {authBusy ? 'Signing out…' : 'Sign out of AgroLink'}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Security tab ──────────────────────────────────────────── */}
        {activeTab === 'security' ? (
          <div className="acc-section-group">
            <div className="acc-section">
              <h3 className="acc-section-title">Password & security</h3>
              <p className="acc-section-desc">
                {currentUser?.providerData?.[0]?.providerId === 'google.com'
                  ? 'Your account is secured via Google Sign-In. Password management is handled through your Google account.'
                  : 'To change your password, sign out and use the "Forgot password?" option on the sign-in page. Password reset links are sent to your registered email.'}
              </p>
              <div className="acc-security-items">
                <div className="acc-security-item">
                  <div className="acc-security-icon">🔐</div>
                  <div>
                    <strong>Two-factor authentication</strong>
                    <p>Handled automatically through {currentUser?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Firebase Authentication'}.</p>
                  </div>
                  <span className="acc-badge-active">Active</span>
                </div>
                <div className="acc-security-item">
                  <div className="acc-security-icon">📧</div>
                  <div>
                    <strong>Email verification</strong>
                    <p>{currentUser?.email}</p>
                  </div>
                  <span className={`acc-badge-active ${currentUser?.emailVerified ? '' : 'acc-badge-pending'}`}>
                    {currentUser?.emailVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="acc-security-item">
                  <div className="acc-security-icon">🌐</div>
                  <div>
                    <strong>Sign-in provider</strong>
                    <p>{currentUser?.providerData?.[0]?.providerId === 'google.com' ? 'Google OAuth 2.0' : 'Email / Password'}</p>
                  </div>
                  <span className="acc-badge-active">Configured</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Activity tab ──────────────────────────────────────────── */}
        {activeTab === 'activity' ? (
          <div className="acc-section-group">
            <div className="acc-section">
              <h3 className="acc-section-title">Your activity summary</h3>
              <p className="acc-section-desc">
                A snapshot of your contributions and activity on the AgroLink platform.
              </p>
              <div className="acc-activity-grid">
                {activityStats.map(s => (
                  <div key={s.label} className="acc-activity-card">
                    <span className="acc-activity-icon">{s.icon}</span>
                    <strong className="acc-activity-value">{s.value}</strong>
                    <span className="acc-activity-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="acc-section">
              <h3 className="acc-section-title">Quick actions</h3>
              <div className="acc-quick-actions">
                <NavLink to={`/dashboard/${currentProfile?.role ?? 'farmer'}`} className="acc-quick-action">
                  <span>🏠</span>
                  <span>Go to dashboard</span>
                </NavLink>
                <button type="button" className="acc-quick-action" onClick={() => setActiveTab('profile')}>
                  <span>✏️</span>
                  <span>Edit profile</span>
                </button>
                <NavLink to="/" className="acc-quick-action">
                  <span>🌐</span>
                  <span>Public site</span>
                </NavLink>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default AccountPage
