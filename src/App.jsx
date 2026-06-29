import { useEffect, useState } from 'react'
import './App.css'
import { hasFirebaseConfig } from './firebase'
import {
  addAdvisory,
  addFarmer,
  addInventoryItem,
  addReport,
  getAdvisories,
  getFarmers,
  getInventory,
  getReports,
} from './services/agriculture'
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  subscribeToAuth,
} from './services/auth'

const navigation = [
  { id: 'overview', label: 'Overview' },
  { id: 'access', label: 'Access' },
  { id: 'roles', label: 'Stakeholders' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'operations', label: 'District View' },
]

const roleCards = [
  {
    id: 'farmer',
    title: 'Farmers',
    summary:
      'Register profiles, receive advisories, discover trusted inputs, and report field issues quickly.',
  },
  {
    id: 'extension',
    title: 'Extension Officers',
    summary:
      'Publish guidance, triage incoming reports, and keep local communities informed throughout the season.',
  },
  {
    id: 'dealer',
    title: 'Agro-Input Dealers',
    summary:
      'Promote verified stock, improve transparency, and strengthen last-mile access to quality inputs.',
  },
  {
    id: 'district',
    title: 'District Agriculture Offices',
    summary:
      'Monitor trends across sub-counties, coordinate service delivery, and make faster evidence-based decisions.',
  },
]

const spotlightModules = [
  {
    title: 'Farmer Registration',
    detail:
      'Build parish-level farmer profiles with crops, livestock, and preferred communication channel.',
  },
  {
    title: 'Advisory Broadcasts',
    detail:
      'Push seasonal recommendations and urgent notices from extension teams to the right communities.',
  },
  {
    title: 'Pest and Disease Alerts',
    detail:
      'Capture field incidents early and route them into visible response workflows.',
  },
  {
    title: 'Input Monitoring',
    detail:
      'Surface trusted seed, fertilizer, pesticide, and veterinary stock from nearby dealers.',
  },
]

const initialFarmers = [
  {
    name: 'Ninsiima Grace',
    parish: 'Kyeizooba',
    focus: 'Bananas, beans, dairy',
    channel: 'SMS alerts',
  },
  {
    name: 'Tumwesigye John',
    parish: 'Ibaare',
    focus: 'Maize, coffee, poultry',
    channel: 'Mobile web',
  },
]

const initialReports = [
  {
    title: 'Fall armyworm outbreak',
    location: 'Bumbaire',
    severity: 'High',
    status: 'Officer assigned',
    reporter: 'Farmer cooperative lead',
  },
  {
    title: 'Newcastle disease concern',
    location: 'Kakanju',
    severity: 'Medium',
    status: 'Verification ongoing',
    reporter: 'Village extension volunteer',
  },
]

const initialAdvisories = [
  {
    title: 'Coffee wilt prevention round',
    audience: 'Coffee farmers',
    channel: 'Field bulletin',
    message:
      'Remove infected stems early and sanitize cutting tools after each plant.',
  },
  {
    title: 'Dry spell planting guidance',
    audience: 'Mixed crop farmers',
    channel: 'SMS',
    message:
      'Prioritize early-maturing seed varieties and mulch moisture-sensitive plots.',
  },
]

const initialInventory = [
  {
    item: 'Hybrid maize seed',
    dealer: 'Bushenyi Agro Centre',
    stock: '120 bags',
    status: 'Verified',
  },
  {
    item: 'Tick control spray',
    dealer: 'Ishaka Vet Supplies',
    stock: '48 units',
    status: 'Restocking soon',
  },
]

const fieldActivities = [
  'Weather-aware advisories shared with maize, coffee, banana, and dairy farmers.',
  'Escalation queue helps officers follow up serious crop and livestock reports first.',
  'District offices view common issues by sub-county for faster planning and outreach.',
]

const workspaceModules = [
  {
    id: 'farmer-registration',
    title: 'Register a farmer profile',
    tag: 'Farmer onboarding',
    roles: ['farmer', 'extension', 'district'],
  },
  {
    id: 'field-reporting',
    title: 'Submit a pest or disease alert',
    tag: 'Field reporting',
    roles: ['farmer', 'extension', 'dealer', 'district'],
  },
  {
    id: 'advisory-publishing',
    title: 'Publish a farmer advisory',
    tag: 'Advisory services',
    roles: ['extension', 'district'],
  },
  {
    id: 'inventory-updates',
    title: 'Add agro-input stock information',
    tag: 'Dealer updates',
    roles: ['dealer', 'district'],
  },
]

function App() {
  const [activeRole, setActiveRole] = useState('farmer')
  const [farmers, setFarmers] = useState(initialFarmers)
  const [reports, setReports] = useState(initialReports)
  const [advisories, setAdvisories] = useState(initialAdvisories)
  const [inventory, setInventory] = useState(initialInventory)
  const [isLoadingData, setIsLoadingData] = useState(hasFirebaseConfig)
  const [dataMode, setDataMode] = useState(
    hasFirebaseConfig ? 'firebase' : 'demo',
  )
  const [statusMessage, setStatusMessage] = useState(
    hasFirebaseConfig
      ? 'Connected mode detected. Loading data from Firebase.'
      : 'Demo mode active. Add your Firebase keys in a .env file to persist data.',
  )
  const [currentUser, setCurrentUser] = useState(null)
  const [currentProfile, setCurrentProfile] = useState(null)
  const [authBusy, setAuthBusy] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({
    district: 'Bushenyi District',
    email: '',
    name: '',
    password: '',
    role: 'farmer',
  })

  const [farmerForm, setFarmerForm] = useState({
    name: '',
    parish: '',
    focus: '',
    channel: 'SMS alerts',
  })
  const [reportForm, setReportForm] = useState({
    title: '',
    location: '',
    severity: 'Medium',
    reporter: '',
  })
  const [advisoryForm, setAdvisoryForm] = useState({
    title: '',
    audience: '',
    channel: 'SMS',
    message: '',
  })
  const [inventoryForm, setInventoryForm] = useState({
    item: '',
    dealer: '',
    stock: '',
    status: 'Verified',
  })

  const totalVerifiedInputs = inventory.filter(
    (entry) => entry.status === 'Verified',
  ).length
  const highSeverityReports = reports.filter(
    (entry) => entry.severity === 'High',
  ).length
  const currentRole = currentProfile?.role ?? null

  const canManageFarmers =
    !hasFirebaseConfig ||
    currentRole === 'farmer' ||
    currentRole === 'extension' ||
    currentRole === 'district'
  const canSubmitReports = !hasFirebaseConfig || Boolean(currentRole)
  const canPublishAdvisories =
    !hasFirebaseConfig ||
    currentRole === 'extension' ||
    currentRole === 'district'
  const canManageInventory =
    !hasFirebaseConfig ||
    currentRole === 'dealer' ||
    currentRole === 'district'

  const visibleModules = workspaceModules.filter((module) =>
    module.roles.includes(activeRole),
  )

  useEffect(() => {
    if (!hasFirebaseConfig) {
      return
    }

    async function loadCollections() {
      try {
        const [farmerData, reportData, advisoryData, inventoryData] =
          await Promise.all([
            getFarmers(),
            getReports(),
            getAdvisories(),
            getInventory(),
          ])

        if (farmerData.length > 0) {
          setFarmers(farmerData)
        }
        if (reportData.length > 0) {
          setReports(reportData)
        }
        if (advisoryData.length > 0) {
          setAdvisories(advisoryData)
        }
        if (inventoryData.length > 0) {
          setInventory(inventoryData)
        }

        setDataMode('firebase')
        setStatusMessage(
          'Firebase connected. Reads and writes now use Firestore collections.',
        )
      } catch (error) {
        setDataMode('demo')
        setStatusMessage(
          `Firebase load failed, so the app stayed in demo mode: ${error.message}`,
        )
      } finally {
        setIsLoadingData(false)
      }
    }

    loadCollections()
  }, [])

  useEffect(() => {
    if (!hasFirebaseConfig) {
      return
    }

    const unsubscribe = subscribeToAuth(async (user) => {
      setCurrentUser(user)

      if (!user) {
        setCurrentProfile(null)
        return
      }

      try {
        const profile = await getUserProfile(user.uid)
        setCurrentProfile(profile)

        if (profile?.role) {
          setActiveRole(profile.role)
        }
      } catch (error) {
        setStatusMessage(
          `Signed in, but profile loading failed: ${error.message}`,
        )
      }
    })

    return unsubscribe
  }, [])

  const requireSignedInUser = () => {
    if (!hasFirebaseConfig) {
      return true
    }

    if (!currentUser) {
      setStatusMessage(
        'Please sign in with Firebase before saving records to Firestore.',
      )
      return false
    }

    return true
  }

  const getRoleRequirementMessage = (allowedRoles) => {
    if (!hasFirebaseConfig) {
      return 'Demo mode allows interaction without Firebase sign-in.'
    }

    if (!currentRole) {
      return `Sign in first. This action is intended for ${allowedRoles.join(', ')}.`
    }

    return `This action is limited to ${allowedRoles.join(', ')} accounts.`
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()

    if (!hasFirebaseConfig) {
      setStatusMessage(
        'Firebase config is missing, so authentication cannot start yet.',
      )
      return
    }

    setAuthBusy(true)

    try {
      if (authMode === 'register') {
        await registerUser(authForm)
        setStatusMessage(
          `Account created for ${authForm.role}. You can now use protected Firebase actions.`,
        )
      } else {
        await loginUser({
          email: authForm.email,
          password: authForm.password,
        })
        setStatusMessage('Signed in successfully. Firebase actions are now enabled.')
      }

      setAuthForm((current) => ({
        ...current,
        email: '',
        name: '',
        password: '',
      }))
    } catch (error) {
      setStatusMessage(`Authentication failed: ${error.message}`)
    } finally {
      setAuthBusy(false)
    }
  }

  const handleLogout = async () => {
    if (!hasFirebaseConfig || !currentUser) {
      return
    }

    setAuthBusy(true)

    try {
      await logoutUser()
      setStatusMessage('Signed out. Firebase writes now require a fresh login.')
    } catch (error) {
      setStatusMessage(`Sign-out failed: ${error.message}`)
    } finally {
      setAuthBusy(false)
    }
  }

  const handleFarmerSubmit = async (event) => {
    event.preventDefault()

    if (!requireSignedInUser()) {
      return
    }

    const nextFarmer = {
      name: farmerForm.name,
      parish: farmerForm.parish,
      focus: farmerForm.focus,
      channel: farmerForm.channel,
      createdById: currentUser?.uid ?? 'demo-user',
      createdByName: currentProfile?.name ?? 'Demo user',
      createdByRole: currentProfile?.role ?? 'demo',
    }

    if (hasFirebaseConfig) {
      try {
        await addFarmer(nextFarmer)
        setStatusMessage('Farmer profile saved to Firebase.')
        setDataMode('firebase')
      } catch (error) {
        setStatusMessage(
          `Firebase save failed for farmer profile. Stored locally instead: ${error.message}`,
        )
        setDataMode('demo')
      }
    }

    setFarmers((current) => [nextFarmer, ...current])
    setFarmerForm({
      name: '',
      parish: '',
      focus: '',
      channel: 'SMS alerts',
    })
  }

  const handleReportSubmit = async (event) => {
    event.preventDefault()

    if (!requireSignedInUser()) {
      return
    }

    const nextReport = {
      title: reportForm.title,
      location: reportForm.location,
      severity: reportForm.severity,
      status: 'Pending field response',
      reporter: reportForm.reporter,
      createdById: currentUser?.uid ?? 'demo-user',
      createdByName: currentProfile?.name ?? reportForm.reporter,
      createdByRole: currentProfile?.role ?? 'demo',
    }

    if (hasFirebaseConfig) {
      try {
        await addReport(nextReport)
        setStatusMessage('Field report saved to Firebase.')
        setDataMode('firebase')
      } catch (error) {
        setStatusMessage(
          `Firebase save failed for field report. Stored locally instead: ${error.message}`,
        )
        setDataMode('demo')
      }
    }

    setReports((current) => [nextReport, ...current])
    setReportForm({
      title: '',
      location: '',
      severity: 'Medium',
      reporter: '',
    })
  }

  const handleAdvisorySubmit = async (event) => {
    event.preventDefault()

    if (!requireSignedInUser()) {
      return
    }

    const nextAdvisory = {
      title: advisoryForm.title,
      audience: advisoryForm.audience,
      channel: advisoryForm.channel,
      message: advisoryForm.message,
      createdById: currentUser?.uid ?? 'demo-user',
      createdByName: currentProfile?.name ?? 'Demo user',
      createdByRole: currentProfile?.role ?? 'demo',
    }

    if (hasFirebaseConfig) {
      try {
        await addAdvisory(nextAdvisory)
        setStatusMessage('Advisory published to Firebase.')
        setDataMode('firebase')
      } catch (error) {
        setStatusMessage(
          `Firebase save failed for advisory. Stored locally instead: ${error.message}`,
        )
        setDataMode('demo')
      }
    }

    setAdvisories((current) => [nextAdvisory, ...current])
    setAdvisoryForm({
      title: '',
      audience: '',
      channel: 'SMS',
      message: '',
    })
  }

  const handleInventorySubmit = async (event) => {
    event.preventDefault()

    if (!requireSignedInUser()) {
      return
    }

    const nextInventoryItem = {
      item: inventoryForm.item,
      dealer: inventoryForm.dealer,
      stock: inventoryForm.stock,
      status: inventoryForm.status,
      createdById: currentUser?.uid ?? 'demo-user',
      createdByName: currentProfile?.name ?? 'Demo user',
      createdByRole: currentProfile?.role ?? 'demo',
    }

    if (hasFirebaseConfig) {
      try {
        await addInventoryItem(nextInventoryItem)
        setStatusMessage('Inventory record saved to Firebase.')
        setDataMode('firebase')
      } catch (error) {
        setStatusMessage(
          `Firebase save failed for inventory. Stored locally instead: ${error.message}`,
        )
        setDataMode('demo')
      }
    }

    setInventory((current) => [nextInventoryItem, ...current])
    setInventoryForm({
      item: '',
      dealer: '',
      stock: '',
      status: 'Verified',
    })
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <span className="brand-kicker">Uganda Smart Agriculture</span>
          <strong className="brand-name">Bushenyi Connect AMIS</strong>
        </div>

        <nav className="topnav" aria-label="Primary">
          {navigation.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero-section" id="overview">
        <div className="hero-copy">
          <span className="eyebrow">Smart Agricultural Information Platform</span>
          <h1>
            A beautiful web system for agricultural advice, field reporting, and
            district service delivery.
          </h1>
          <p className="hero-text">
            Built around Bushenyi District, this concept connects farmers,
            extension officers, agro-input dealers, and local government in one
            coordinated workflow. The experience is designed for phone and
            laptop use, with fast access to information, alerts, and practical
            decision support.
          </p>

          <div className="hero-actions">
            <a href="#workspace" className="primary-action">
              Open workspace
            </a>
            <a href="#access" className="secondary-action">
              Configure access
            </a>
          </div>

          <div className={`status-banner status-${dataMode}`}>
            <strong>{isLoadingData ? 'Loading data...' : `${dataMode} mode`}</strong>
            <p>{statusMessage}</p>
          </div>

          <div className="hero-chip-grid">
            {spotlightModules.map((module) => (
              <article key={module.title} className="hero-chip">
                <strong>{module.title}</strong>
                <p>{module.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="device-stage">
            <article className="device-card laptop-card">
              <div className="device-header">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="dashboard-grid">
                <div className="dashboard-panel tall-panel">
                  <p>District response queue</p>
                  <strong>{reports.length} active reports in view</strong>
                  <div className="bar-chart">
                    <span style={{ height: '46%' }}></span>
                    <span style={{ height: '80%' }}></span>
                    <span style={{ height: '58%' }}></span>
                    <span style={{ height: '92%' }}></span>
                  </div>
                </div>
                <div className="dashboard-panel">
                  <p>Advisories published</p>
                  <strong>{advisories.length} current notices</strong>
                </div>
                <div className="dashboard-panel">
                  <p>Trusted inputs</p>
                  <strong>{totalVerifiedInputs} verified listings</strong>
                </div>
              </div>
            </article>

            <article className="device-card phone-card">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                <span className="mini-label">Farmer mobile view</span>
                <h2>Urgent alert</h2>
                <p>Coffee growers in Kyeizooba: inspect for wilt symptoms this week.</p>
                <div className="status-pill">New advisory published</div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="metrics-strip">
        <div>
          <strong>{farmers.length}</strong>
          <span>registered farmer profiles</span>
        </div>
        <div>
          <strong>{reports.length}</strong>
          <span>incident reports in the system</span>
        </div>
        <div>
          <strong>{advisories.length}</strong>
          <span>active advisory messages</span>
        </div>
        <div>
          <strong>{inventory.length}</strong>
          <span>agro-input records shared</span>
        </div>
      </section>

      <section className="section-block access-section" id="access">
        <div className="section-heading section-row">
          <div>
            <span className="eyebrow">Firebase Access</span>
            <h2>Give each stakeholder a real account before they write to Firestore.</h2>
          </div>
          <div className="role-indicator">
            <span>Session state</span>
            <strong>{currentUser ? 'Signed in' : 'Signed out'}</strong>
          </div>
        </div>

        <div className="access-grid">
          <article className="workspace-card">
            <div className="card-header">
              <span className="service-tag">Authentication</span>
              <h3>{authMode === 'register' ? 'Create stakeholder account' : 'Sign in to AgroLink'}</h3>
            </div>

            <div className="auth-toggle-row">
              <button
                type="button"
                className={`auth-toggle ${authMode === 'login' ? 'auth-toggle-active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={`auth-toggle ${authMode === 'register' ? 'auth-toggle-active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                Register
              </button>
            </div>

            <form className="smart-form" onSubmit={handleAuthSubmit}>
              {authMode === 'register' ? (
                <>
                  <label>
                    Full name
                    <input
                      required
                      value={authForm.name}
                      onChange={(event) =>
                        setAuthForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    Role
                    <select
                      value={authForm.role}
                      onChange={(event) =>
                        setAuthForm((current) => ({
                          ...current,
                          role: event.target.value,
                        }))
                      }
                    >
                      <option value="farmer">Farmer</option>
                      <option value="extension">Extension Officer</option>
                      <option value="dealer">Agro-Input Dealer</option>
                      <option value="district">District Agriculture Office</option>
                    </select>
                  </label>
                  <label>
                    District
                    <input
                      required
                      value={authForm.district}
                      onChange={(event) =>
                        setAuthForm((current) => ({
                          ...current,
                          district: event.target.value,
                        }))
                      }
                    />
                  </label>
                </>
              ) : null}

              <label>
                Email
                <input
                  required
                  type="email"
                  value={authForm.email}
                  onChange={(event) =>
                    setAuthForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Password
                <input
                  required
                  type="password"
                  value={authForm.password}
                  onChange={(event) =>
                    setAuthForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                />
              </label>
              <button type="submit" className="form-action" disabled={authBusy}>
                {authBusy
                  ? 'Please wait...'
                  : authMode === 'register'
                    ? 'Create account'
                    : 'Sign in'}
              </button>
            </form>
          </article>

          <article className="workspace-card">
            <div className="card-header">
              <span className="service-tag">Current user</span>
              <h3>Role-aware Firebase session</h3>
            </div>

            {currentUser ? (
              <div className="session-card">
                <strong>{currentProfile?.name ?? currentUser.email}</strong>
                <p>{currentUser.email}</p>
                <span>Role: {currentProfile?.role ?? 'Profile not loaded yet'}</span>
                <span>District: {currentProfile?.district ?? 'Not set'}</span>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={handleLogout}
                  disabled={authBusy}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="session-card">
                <strong>No active Firebase session</strong>
                <p>Register or sign in to unlock protected writes for Firestore.</p>
                <span>
                  Suggested starting accounts: one farmer, one extension officer, one
                  dealer, and one district officer.
                </span>
              </div>
            )}
          </article>
        </div>
      </section>

      <section className="section-block stakeholder-section" id="roles">
        <div className="section-heading">
          <span className="eyebrow">Connected Stakeholders</span>
          <h2>Each actor gets a focused space while still working inside one shared system.</h2>
        </div>

        <div className="stakeholder-grid">
          {roleCards.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`role-card ${activeRole === item.id ? 'active-role' : ''}`}
              onClick={() => setActiveRole(item.id)}
            >
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block workspace-section" id="workspace">
        <div className="section-heading section-row">
          <div>
            <span className="eyebrow">Interactive Workspace</span>
            <h2>Prototype the real workflows, not just the pitch.</h2>
          </div>
          <div className="role-indicator">
            <span>Current focus</span>
            <strong>{roleCards.find((role) => role.id === activeRole)?.title}</strong>
          </div>
        </div>

        <div className="workspace-hint">
          Protected Firebase writes now use signed-in accounts and include creator metadata.
        </div>

        <div className="module-strip">
          {visibleModules.map((module) => (
            <div key={module.id} className="module-pill">
              <strong>{module.tag}</strong>
              <span>{module.title}</span>
            </div>
          ))}
        </div>

        <div className="workspace-grid">
          <article className={`workspace-card ${canManageFarmers ? '' : 'locked-card'}`}>
            <div className="card-header">
              <span className="service-tag">Farmer onboarding</span>
              <h3>Register a farmer profile</h3>
            </div>
            {!canManageFarmers ? (
              <p className="access-note">
                {getRoleRequirementMessage(['farmer', 'extension', 'district'])}
              </p>
            ) : null}
            <form className="smart-form" onSubmit={handleFarmerSubmit}>
              <label>
                Farmer name
                <input
                  required
                  disabled={!canManageFarmers}
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
                  disabled={!canManageFarmers}
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
                Crops or livestock focus
                <input
                  required
                  disabled={!canManageFarmers}
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
                  disabled={!canManageFarmers}
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
              <button type="submit" className="form-action" disabled={!canManageFarmers}>
                Save farmer
              </button>
            </form>
          </article>

          <article className={`workspace-card ${canSubmitReports ? '' : 'locked-card'}`}>
            <div className="card-header">
              <span className="service-tag">Field reporting</span>
              <h3>Submit a pest or disease alert</h3>
            </div>
            {!canSubmitReports ? (
              <p className="access-note">
                {getRoleRequirementMessage(['farmer', 'extension', 'dealer', 'district'])}
              </p>
            ) : null}
            <form className="smart-form" onSubmit={handleReportSubmit}>
              <label>
                Incident title
                <input
                  required
                  disabled={!canSubmitReports}
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
                Sub-county or parish
                <input
                  required
                  disabled={!canSubmitReports}
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
                  disabled={!canSubmitReports}
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
                  disabled={!canSubmitReports}
                  value={reportForm.reporter}
                  onChange={(event) =>
                    setReportForm((current) => ({
                      ...current,
                      reporter: event.target.value,
                    }))
                  }
                />
              </label>
              <button type="submit" className="form-action" disabled={!canSubmitReports}>
                Log report
              </button>
            </form>
          </article>

          <article
            className={`workspace-card ${canPublishAdvisories ? '' : 'locked-card'}`}
          >
            <div className="card-header">
              <span className="service-tag">Advisory services</span>
              <h3>Publish a farmer advisory</h3>
            </div>
            {!canPublishAdvisories ? (
              <p className="access-note">
                {getRoleRequirementMessage(['extension', 'district'])}
              </p>
            ) : null}
            <form className="smart-form" onSubmit={handleAdvisorySubmit}>
              <label>
                Advisory title
                <input
                  required
                  disabled={!canPublishAdvisories}
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
                  disabled={!canPublishAdvisories}
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
                Delivery channel
                <select
                  disabled={!canPublishAdvisories}
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
                  disabled={!canPublishAdvisories}
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
              <button
                type="submit"
                className="form-action"
                disabled={!canPublishAdvisories}
              >
                Publish advisory
              </button>
            </form>
          </article>

          <article className={`workspace-card ${canManageInventory ? '' : 'locked-card'}`}>
            <div className="card-header">
              <span className="service-tag">Dealer updates</span>
              <h3>Add agro-input stock information</h3>
            </div>
            {!canManageInventory ? (
              <p className="access-note">
                {getRoleRequirementMessage(['dealer', 'district'])}
              </p>
            ) : null}
            <form className="smart-form" onSubmit={handleInventorySubmit}>
              <label>
                Input item
                <input
                  required
                  disabled={!canManageInventory}
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
                  disabled={!canManageInventory}
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
                  disabled={!canManageInventory}
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
                Verification status
                <select
                  disabled={!canManageInventory}
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
              <button
                type="submit"
                className="form-action"
                disabled={!canManageInventory}
              >
                Add stock record
              </button>
            </form>
          </article>
        </div>
      </section>

      <section className="section-block feed-section">
        <div className="section-heading">
          <span className="eyebrow">Operational Feeds</span>
          <h2>Live-looking information panels for farmers, officers, and district teams.</h2>
        </div>

        <div className="feed-grid">
          <article className="feed-card">
            <div className="card-header">
              <span className="service-tag">Farmer directory</span>
              <h3>Recent registrations</h3>
            </div>
            <div className="feed-list">
              {farmers.map((farmer) => (
                <div
                  key={`${farmer.id ?? farmer.name}-${farmer.parish}`}
                  className="feed-item"
                >
                  <strong>{farmer.name}</strong>
                  <p>{farmer.parish}</p>
                  <span>{farmer.focus}</span>
                  <small>{farmer.channel}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="feed-card">
            <div className="card-header">
              <span className="service-tag">Extension queue</span>
              <h3>Pest and disease reports</h3>
            </div>
            <div className="feed-list">
              {reports.map((report) => (
                <div
                  key={`${report.id ?? report.title}-${report.location}`}
                  className="feed-item"
                >
                  <strong>{report.title}</strong>
                  <p>{report.location}</p>
                  <span>{report.reporter}</span>
                  <small>
                    {report.severity} severity | {report.status}
                  </small>
                </div>
              ))}
            </div>
          </article>

          <article className="feed-card">
            <div className="card-header">
              <span className="service-tag">Advisory board</span>
              <h3>Latest published guidance</h3>
            </div>
            <div className="feed-list">
              {advisories.map((advisory) => (
                <div
                  key={`${advisory.id ?? advisory.title}-${advisory.audience}`}
                  className="feed-item"
                >
                  <strong>{advisory.title}</strong>
                  <p>{advisory.audience}</p>
                  <span>{advisory.message}</span>
                  <small>{advisory.channel}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="feed-card">
            <div className="card-header">
              <span className="service-tag">Input visibility</span>
              <h3>Dealer stock records</h3>
            </div>
            <div className="feed-list">
              {inventory.map((entry) => (
                <div
                  key={`${entry.id ?? entry.item}-${entry.dealer}`}
                  className="feed-item"
                >
                  <strong>{entry.item}</strong>
                  <p>{entry.dealer}</p>
                  <span>{entry.stock}</span>
                  <small>{entry.status}</small>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-block operations-section" id="operations">
        <div className="section-heading">
          <span className="eyebrow">District Snapshot</span>
          <h2>A local government view of coordination, risk, and service coverage.</h2>
        </div>

        <div className="operations-grid">
          <article className="ops-card">
            <span className="ops-label">Monitoring</span>
            <strong>{highSeverityReports}</strong>
            <p>high-severity reports requiring faster follow-up</p>
          </article>
          <article className="ops-card">
            <span className="ops-label">Input assurance</span>
            <strong>{totalVerifiedInputs}</strong>
            <p>verified agro-input listings visible to farmers</p>
          </article>
          <article className="ops-card">
            <span className="ops-label">Outreach</span>
            <strong>{advisories.length + farmers.length}</strong>
            <p>combined knowledge and profile records shaping extension planning</p>
          </article>
        </div>

        <div className="problem-solution">
          <article className="problem-card">
            <span className="eyebrow">Field Impact</span>
            <h2>What improves when the system is active</h2>
            <ul>
              {fieldActivities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="solution-card">
            <span className="eyebrow">Why this matters</span>
            <h2>From scattered communication to coordinated public agricultural service</h2>
            <p>
              This moves beyond a simple information portal. It becomes a shared
              service-delivery layer where government offices can see activity,
              extension teams can respond faster, dealers can surface trusted
              products, and farmers can participate more directly.
            </p>
            <div className="solution-note">
              Starter Firestore rules now live in `firestore.rules`. Publish them in
              Firebase and your roles will begin shaping who can create or manage
              each record type.
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
