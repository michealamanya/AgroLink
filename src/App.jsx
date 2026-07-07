import { useEffect, useState } from 'react'
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import './App.css'
import './workspace.css'
import { hasFirebaseConfig } from './firebase'
import {
  addAdvisory,
  addFarmer,
  addInputRequest,
  addInventoryItem,
  addReport,
  addSeasonPlan,
  deleteAdvisory,
  deleteInputRequest,
  deleteInventoryItem,
  deleteReport,
  deleteSeasonPlan,
  getAdvisories,
  getFarmers,
  getInputRequests,
  getInventory,
  getReports,
  getSeasonPlans,
  updateAdvisory,
  updateFarmer,
  updateInputRequest,
  updateInventoryItem,
  updateReport,
} from './services/agriculture'
import {
  getUserProfile,
  loginUser,
  loginWithGoogle,
  logoutUser,
  registerUser,
  registerWithGoogle,
  subscribeToAuth,
  updateUserProfile,
} from './services/auth'
import {
  dashboardConfig,
  initialAdvisories,
  initialFarmers,
  initialInventory,
  initialReports,
} from './data/appData'
import OverviewPage from './components/OverviewPage'
import AccessPage from './components/AccessPage'
import DashboardPage from './components/DashboardPage'
import AboutPage from './pages/AboutPage'
import HowItWorksPage from './pages/HowItWorksPage'
import FeaturesPage from './pages/FeaturesPage'
import RolesPage from './pages/RolesPage'
import ImpactPage from './pages/ImpactPage'
import FaqsPage from './pages/FaqsPage'
import ContactPage from './pages/ContactPage'
import MarketplacePage from './pages/MarketplacePage'
import { createDisplayTimestamp } from './utils/records'
import { logAudit, AUDIT_ACTIONS } from './services/audit'
import { friendlyAuthError } from './utils/authErrors'

function parseDashboardPath(pathname) {
  const [, dashboardSegment, role, subview] = pathname.split('/')

  return {
    dashboardSegment,
    role: role ?? null,
    subview: subview ?? 'farm',
  }
}

function PublicShell({ children, fullWidth }) {
  if (fullWidth) return <div>{children}</div>
  return <div className="public-shell">{children}</div>
}

function DashboardRouter({ state }) {
  const location = useLocation()
  const { dashboardSegment, role: routeRole, subview: routeSubview } =
    parseDashboardPath(location.pathname)
  const { currentRole, currentUser } = state

  if (dashboardSegment !== 'dashboard' || !dashboardConfig[routeRole]) {
    return <Navigate to="/" replace />
  }

  if (hasFirebaseConfig && (!currentUser || currentRole !== routeRole)) {
    return <Navigate to="/access" replace />
  }

  return (
    <DashboardPage
      role={routeRole}
      state={state}
      subview={routeSubview || 'farm'}
    />
  )
}

function WorkspaceShell({ dashboardLink, state }) {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    authBusy,
    advisories,
    currentProfile,
    dataMode,
    farmers,
    handleLogout,
    inventory,
    isLoadingData,
    reports,
    statusMessage,
    toast,
  } = state
  const { subview: activeSubview } = parseDashboardPath(location.pathname)

  const roleColors = {
    farmer: '#15803d', extension: '#1d4ed8', dealer: '#c2410c', district: '#7e22ce',
  }
  const roleAccent = roleColors[currentProfile?.role] ?? '#15803d'

  const roleIcons = {
    farmer: '🌾', extension: '🧑‍💼', dealer: '🏪', district: '🏛️',
  }

  const sectionLinksByRole = {
    farmer: [
      { label: 'Home',      icon: '🏡', to: '/dashboard/farmer/farm' },
      { label: 'Profile',   icon: '👤', to: '/dashboard/farmer/profile' },
      { label: 'Planner',   icon: '📋', to: '/dashboard/farmer/planner' },
      { label: 'Requests',  icon: '📦', to: '/dashboard/farmer/requests' },
      { label: 'Reports',   icon: '⚠️', to: '/dashboard/farmer/reports' },
      { label: 'Guidance',  icon: '💡', to: '/dashboard/farmer/guidance' },
      { label: 'FAQs',      icon: '❓', to: '/dashboard/farmer/faq' },
      { label: 'Contact',   icon: '📞', to: '/dashboard/farmer/contact' },
    ],
    extension: [
      { label: 'Response Queue', icon: '🚨', to: '/dashboard/extension/queue' },
      { label: 'Farmer Support', icon: '🌾', to: '/dashboard/extension/farmers' },
      { label: 'Advisories',     icon: '📢', to: '/dashboard/extension/advisory' },
      { label: 'Field Reports',  icon: '📋', to: '/dashboard/extension/reports' },
      { label: 'Filters',        icon: '🔍', to: '/dashboard/extension/filters' },
      { label: 'All Records',    icon: '🗂️',  to: '/dashboard/extension/records' },
    ],
    dealer: [
      { label: 'Stock Board',    icon: '📦', to: '/dashboard/dealer/stock' },
      { label: 'Add Stock',      icon: '➕', to: '/dashboard/dealer/add' },
      { label: 'Demand Signals', icon: '📊', to: '/dashboard/dealer/demand' },
      { label: 'Guidance',       icon: '💡', to: '/dashboard/dealer/guidance' },
      { label: 'Field Reports',  icon: '⚠️', to: '/dashboard/dealer/reports' },
      { label: 'Filters',        icon: '🔍', to: '/dashboard/dealer/filters' },
      { label: 'All Records',    icon: '🗂️',  to: '/dashboard/dealer/records' },
    ],
    district: [
      { label: 'Situation Room',    icon: '🏛️', to: '/dashboard/district/situation' },
      { label: 'Incident Response', icon: '🚨', to: '/dashboard/district/incidents' },
      { label: 'Advisories',        icon: '📢', to: '/dashboard/district/advisory' },
      { label: 'Supply Visibility', icon: '📦', to: '/dashboard/district/supply' },
      { label: 'Farmer Profiles',   icon: '🌾', to: '/dashboard/district/farmers' },
      { label: 'Submit Report',     icon: '📋', to: '/dashboard/district/reports' },
      { label: 'Filters',           icon: '🔍', to: '/dashboard/district/filters' },
      { label: 'All Records',       icon: '🗂️',  to: '/dashboard/district/records' },
    ],
  }

  const roleSectionLinks = sectionLinksByRole[currentProfile?.role] ?? []

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const highSeverity = reports.filter(r => r.severity === 'High' && r.status !== 'Resolved').length

  return (
    <div className={`ws-shell ${sidebarOpen ? 'ws-sidebar-is-open' : ''}`}>
      {toast ? (
        <div className="ws-toast" role="alert">{toast}</div>
      ) : null}

      {/* ── mobile backdrop ─────────────────────────────────────── */}
      {sidebarOpen ? (
        <div className="ws-mobile-backdrop" aria-hidden="true"
          onClick={() => setSidebarOpen(false)} />
      ) : null}

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <aside
        className={`ws-sidebar ${sidebarOpen ? 'ws-sidebar-mobile-open' : ''}`}
        aria-label="Workspace navigation"
      >
        {/* logo + mobile close */}
        <div className="ws-logo">
          <div className="ws-logo-mark" style={{ background: roleAccent }}>A</div>
          <span className="ws-logo-text">AgroLink</span>
          <button type="button" className="ws-mobile-close"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        {/* role badge */}
        <div className="ws-role-badge">
          <span className="ws-role-icon">{roleIcons[currentProfile?.role] ?? '🌱'}</span>
          <div className="ws-role-info">
            <span className="ws-role-name">{currentProfile?.name ?? 'User'}</span>
            <span className="ws-role-tag" style={{ color: roleAccent }}>
              {currentProfile?.role ?? 'member'}
            </span>
          </div>
        </div>

        {/* main nav */}
        <nav className="ws-nav" aria-label="Main navigation">
          <span className="ws-nav-group-label">Workspace</span>
          {roleSectionLinks.map((link) => {
            const isActive = parseDashboardPath(link.to).subview === activeSubview
            return (
              <button
                key={link.to}
                type="button"
                className={`ws-nav-item ${isActive ? 'ws-nav-item-active' : ''}`}
                style={isActive ? { '--nav-accent': roleAccent } : {}}
                onClick={() => {
                  navigate(link.to)
                  setSidebarOpen(false)
                }}
              >
                <span className="ws-nav-icon" aria-hidden="true">{link.icon}</span>
                <span className="ws-nav-label">{link.label}</span>
                {isActive ? <span className="ws-nav-pip" style={{ background: roleAccent }} /> : null}
              </button>
            )
          })}
        </nav>

        {/* divider */}
        <div className="ws-sidebar-divider" />

        {/* utility nav */}
        <nav className="ws-nav ws-nav-util" aria-label="Utility navigation">
          <NavLink to="/" className="ws-nav-item" onClick={() => setSidebarOpen(false)}>
            <span className="ws-nav-icon" aria-hidden="true">🏠</span>
            <span className="ws-nav-label">Public site</span>
          </NavLink>
          <NavLink to="/access" className="ws-nav-item" onClick={() => setSidebarOpen(false)}>
            <span className="ws-nav-icon" aria-hidden="true">👤</span>
            <span className="ws-nav-label">Account</span>
          </NavLink>
        </nav>

        {/* status pill */}
        <div className="ws-status-pill">
          <span className={`ws-status-dot ${dataMode === 'firebase' ? 'ws-status-live' : 'ws-status-demo'}`} />
          <span className="ws-status-label">{isLoadingData ? 'Loading…' : dataMode === 'firebase' ? 'Live data' : 'Demo mode'}</span>
        </div>

        {/* sign out */}
        <button
          type="button"
          className="ws-signout"
          onClick={handleLogout}
          disabled={authBusy}
        >
          <span className="ws-nav-icon" aria-hidden="true">🚪</span>
          <span className="ws-nav-label">{authBusy ? 'Signing out…' : 'Sign out'}</span>
        </button>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────── */}
      <div className="ws-main">

        {/* topbar */}
        <header className="ws-topbar">
          <div className="ws-topbar-left">
            {/* mobile menu button */}
            <button type="button" className="ws-menu-btn"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}>
              <span /><span /><span />
            </button>
            <div className="ws-greeting">
              <span className="ws-greeting-time">{greeting}</span>
              <h1 className="ws-greeting-name">
                {currentProfile?.name?.split(' ')[0] ?? 'Welcome'}
              </h1>
            </div>
          </div>

          <div className="ws-topbar-right">
            {/* quick stats chips */}
            <div className="ws-stat-chips">
              <div className="ws-stat-chip">
                <strong>{farmers.length}</strong>
                <span>Farmers</span>
              </div>
              <div className="ws-stat-chip">
                <strong>{reports.length}</strong>
                <span>Reports</span>
              </div>
              {highSeverity > 0 ? (
                <div className="ws-stat-chip ws-stat-chip-alert">
                  <strong>{highSeverity}</strong>
                  <span>High</span>
                </div>
              ) : null}
              <div className="ws-stat-chip ws-stat-chip-hide-sm">
                <strong>{inventory.length}</strong>
                <span>Stock</span>
              </div>
              <div className="ws-stat-chip ws-stat-chip-hide-sm">
                <strong>{advisories.length}</strong>
                <span>Advisories</span>
              </div>
            </div>

            {/* avatar */}
            <div className="ws-avatar" style={{ background: roleAccent }} title={currentProfile?.name}>
              {(currentProfile?.name ?? currentProfile?.role ?? 'U')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* page content */}
        <main className="ws-content">
          <DashboardRouter state={state} />
        </main>
      </div>
    </div>
  )
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()

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
      ? 'Loading platform records and preparing your workspace.'
      : 'Demo mode active. The platform is running with sample records for preview.',
  )
  const [currentUser, setCurrentUser] = useState(null)
  const [currentProfile, setCurrentProfile] = useState(null)
  const [authBusy, setAuthBusy] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [accountForm, setAccountForm] = useState({
    name: '',
    district: '',
    phone: '',
    bio: '',
    photoUrl: '',
  })
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
  const [farmerProfileForm, setFarmerProfileForm] = useState({
    name: '',
    parish: '',
    focus: '',
    acreage: '',
    seasonGoal: '',
    channel: 'SMS alerts',
    photoUrl: '',
  })
  const [reportForm, setReportForm] = useState({
    title: '',
    location: '',
    severity: 'Medium',
    reporter: '',
    imageUrl: '',
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
    imageUrl: '',
  })
  const [filters, setFilters] = useState({
    search: '',
    severity: 'All',
    inventoryStatus: 'All',
  })
  const [reportManagementForm, setReportManagementForm] = useState({
    reportId: '',
    assignedOfficer: '',
    resolutionNotes: '',
    status: 'Officer assigned',
  })
  const [ownReportForm, setOwnReportForm] = useState({
    reportId: '',
    title: '',
    location: '',
    severity: 'Medium',
    reporter: '',
  })
  const [seasonPlanForm, setSeasonPlanForm] = useState({
    season: '',
    priority: 'Planting',
    note: '',
  })
  const [inputRequestForm, setInputRequestForm] = useState({
    item: '',
    quantity: '',
    urgency: 'Medium',
    note: '',
  })
  const [seasonPlans, setSeasonPlans] = useState([])
  const [inputRequests, setInputRequests] = useState([])
  const [toast, setToast] = useState('')

  const currentRole = currentProfile?.role ?? null
  const totalVerifiedInputs = inventory.filter(
    (entry) => entry.status === 'Verified',
  ).length
  const highSeverityReports = reports.filter(
    (entry) => entry.severity === 'High',
  ).length
  const createLocalId = () =>
    `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  useEffect(() => {
    if (!statusMessage) {
      return
    }

    setToast(statusMessage)
    const timeoutId = setTimeout(() => {
      setToast('')
    }, 3200)

    return () => clearTimeout(timeoutId)
  }, [statusMessage])

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
          'Platform records loaded successfully.',
        )
      } catch (error) {
        setDataMode('demo')
        setStatusMessage(
          `Some records could not be loaded, so demo content is being shown: ${error.message}`,
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

        // Pre-fill account settings form from loaded profile
        if (profile) {
          setAccountForm({
            name: profile.name ?? '',
            district: profile.district ?? '',
            phone: profile.phone ?? '',
            bio: profile.bio ?? '',
            photoUrl: profile.photoUrl ?? '',
          })
        }

        if (profile?.role) {
          const targetDashboard = `/dashboard/${profile.role}`

          if (location.pathname === '/access') {
            navigate(targetDashboard, { replace: true })
          }
        }

        // Load farmer-specific persisted data after auth
        if (profile?.role === 'farmer') {
          try {
            const [planData, requestData] = await Promise.all([
              getSeasonPlans(user.uid),
              getInputRequests(user.uid),
            ])
            if (planData.length > 0) setSeasonPlans(planData)
            if (requestData.length > 0) setInputRequests(requestData)
          } catch {
            // non-fatal — local state still usable
          }
        }
      } catch (error) {
        setStatusMessage(
          `You are signed in, but your profile details could not be loaded: ${error.message}`,
        )
      }
    })

    return unsubscribe
  }, [location.pathname, navigate])

  useEffect(() => {
    if (currentProfile?.role !== 'farmer') {
      return
    }

    const linkedProfile =
      farmers.find((farmer) => {
        if (currentUser?.uid) {
          return farmer.createdById === currentUser.uid
        }

        return farmer.name === currentProfile?.name
      }) ?? null

    setFarmerProfileForm({
      name: linkedProfile?.name ?? currentProfile?.name ?? '',
      parish: linkedProfile?.parish ?? '',
      focus: linkedProfile?.focus ?? '',
      acreage: linkedProfile?.acreage ?? '',
      seasonGoal: linkedProfile?.seasonGoal ?? '',
      channel: linkedProfile?.channel ?? 'SMS alerts',
      photoUrl: linkedProfile?.photoUrl ?? '',
    })
  }, [currentProfile, currentUser, farmers])

  const requireSignedInUser = () => {
    if (!hasFirebaseConfig) {
      return true
    }

    if (!currentUser) {
      setStatusMessage(
        'Please sign in with Firebase before saving records to Firestore.',
      )
      navigate('/access')
      return false
    }

    return true
  }

  const handleAuthSubmit = async (event, modeOverride) => {
    // preventDefault may have been called by the form's onSubmit wrapper already
    // call it again safely — idempotent on SyntheticEvent
    if (event?.preventDefault) event.preventDefault()

    if (!hasFirebaseConfig) {
      setStatusMessage('Authentication is not configured for this environment.')
      return
    }

    const activeMode = modeOverride ?? authMode
    setAuthBusy(true)

    try {
      if (activeMode === 'register') {
        const user = await registerUser(authForm)
        await logAudit({ uid: user.uid, email: authForm.email, name: authForm.name, role: authForm.role }, AUDIT_ACTIONS.REGISTER, { role: authForm.role, district: authForm.district })
        setStatusMessage(`Account created for ${authForm.role}. You can now use your assigned platform workspace.`)
      } else {
        const user = await loginUser({ email: authForm.email, password: authForm.password })
        await logAudit({ uid: user.uid, email: authForm.email }, AUDIT_ACTIONS.LOGIN)
        setStatusMessage('Signed in successfully. Your workspace is now ready.')
      }

      setAuthForm((current) => ({
        ...current,
        email: '',
        name: '',
        password: '',
      }))
    } catch (error) {
      // Re-throw so AuthForm's local catch can display it inline
      setStatusMessage(friendlyAuthError(error))
      throw new Error(friendlyAuthError(error))
    } finally {
      setAuthBusy(false)
    }
  }

  const handleAccountUpdate = async (event) => {
    event.preventDefault()
    if (!hasFirebaseConfig || !currentUser) {
      setStatusMessage('You must be signed in to update your account.')
      return
    }
    setAuthBusy(true)
    try {
      const payload = {
        name: accountForm.name,
        district: accountForm.district,
        phone: accountForm.phone ?? '',
        bio: accountForm.bio ?? '',
        photoUrl: accountForm.photoUrl ?? '',
        updatedAt: new Date().toISOString(),
      }
      await updateUserProfile(currentUser.uid, payload)
      setCurrentProfile(prev => ({ ...prev, ...payload }))
      setStatusMessage('Account settings saved successfully.')
    } catch (error) {
      setStatusMessage(friendlyAuthError(error))
    } finally {
      setAuthBusy(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!hasFirebaseConfig) {
      setStatusMessage('Google sign-in is not available without Firebase configuration.')
      return
    }
    setAuthBusy(true)
    try {
      await loginWithGoogle()
      await logAudit({ uid: currentUser?.uid, email: currentUser?.email, role: currentRole }, AUDIT_ACTIONS.GOOGLE_LOGIN)
      setStatusMessage('Signed in with Google successfully.')
    } catch (error) {
      if (error.code === 'auth/no-profile') {
        setStatusMessage(
          `No AgroLink account found for ${error.googleUser?.email ?? 'this Google account'}. Please create an account first.`
        )
        return { noProfile: true, googleUser: error.googleUser }
      }
      setStatusMessage(friendlyAuthError(error))
    } finally {
      setAuthBusy(false)
    }
    return null
  }

  const handleGoogleRegister = async () => {
    if (!hasFirebaseConfig) {
      setStatusMessage('Google sign-up is not available without Firebase configuration.')
      return
    }
    setAuthBusy(true)
    try {
      await registerWithGoogle(authForm.district)
      setStatusMessage('Account created with Google. Welcome to AgroLink — you have been registered as a farmer.')
    } catch (error) {
      setStatusMessage(friendlyAuthError(error))
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
      await logAudit({ uid: currentUser.uid, email: currentUser.email, role: currentRole }, AUDIT_ACTIONS.LOGOUT)
      setStatusMessage('Signed out successfully.')
      navigate('/access')
    } catch (error) {
      setStatusMessage(friendlyAuthError(error))
    } finally {
      setAuthBusy(false)
    }
  }

  const handleFarmerSubmit = async (event) => {
    event.preventDefault()
    if (!requireSignedInUser()) return

    const nextFarmer = {
      id: createLocalId(),
      name: farmerForm.name,
      parish: farmerForm.parish,
      focus: farmerForm.focus,
      channel: farmerForm.channel,
      createdById: currentUser?.uid ?? 'demo-user',
      createdByName: currentProfile?.name ?? 'Demo user',
      createdByRole: currentProfile?.role ?? 'demo',
      createdAtDisplay: createDisplayTimestamp(),
    }

    if (hasFirebaseConfig) {
      try {
        await addFarmer(nextFarmer)
        setStatusMessage('Farmer profile saved successfully.')
        setDataMode('firebase')
      } catch (error) {
        setStatusMessage(
          `Farmer profile could not be saved to the main record store, so it was kept locally instead: ${error.message}`,
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
    if (!requireSignedInUser()) return

    const nextReport = {
      id: createLocalId(),
      title: reportForm.title,
      location: reportForm.location,
      severity: reportForm.severity,
      status: 'Pending field response',
      reporter: currentProfile?.name ?? reportForm.reporter,
      imageUrl: reportForm.imageUrl ?? '',
      createdById: currentUser?.uid ?? 'demo-user',
      createdByName: currentProfile?.name ?? reportForm.reporter,
      createdByRole: currentProfile?.role ?? 'demo',
      assignedOfficer: '',
      resolutionNotes: '',
      createdAtDisplay: createDisplayTimestamp(),
    }

    if (hasFirebaseConfig) {
      try {
        await addReport(nextReport)
        setStatusMessage('Field report saved successfully.')
        setDataMode('firebase')
      } catch (error) {
        setStatusMessage(
          `Field report could not be saved to the main record store, so it was kept locally instead: ${error.message}`,
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
      imageUrl: '',
    })
  }

  const handleFarmerProfileSubmit = async (event) => {
    event.preventDefault()
    if (!requireSignedInUser()) return

    const linkedProfile =
      farmers.find((farmer) => {
        if (currentUser?.uid) {
          return farmer.createdById === currentUser.uid
        }

        return farmer.name === currentProfile?.name
      }) ?? null

    const profilePayload = {
      name: farmerProfileForm.name,
      parish: farmerProfileForm.parish,
      focus: farmerProfileForm.focus,
      acreage: farmerProfileForm.acreage,
      seasonGoal: farmerProfileForm.seasonGoal,
      channel: farmerProfileForm.channel,
      photoUrl: farmerProfileForm.photoUrl ?? '',
      createdById: currentUser?.uid ?? 'demo-user',
      createdByName: currentProfile?.name ?? farmerProfileForm.name,
      createdByRole: currentProfile?.role ?? 'farmer',
      updatedAtDisplay: createDisplayTimestamp(),
    }

    if (linkedProfile) {
      try {
        if (linkedProfile.id && !String(linkedProfile.id).startsWith('local-')) {
          await updateFarmer(linkedProfile.id, profilePayload)
        }

        setFarmers((current) =>
          current.map((farmer) =>
            farmer.id === linkedProfile.id
              ? {
                  ...farmer,
                  ...profilePayload,
                }
              : farmer,
          ),
        )
        setStatusMessage('Your farmer profile was updated successfully.')
        return
      } catch (error) {
        setStatusMessage(`Updating your farmer profile failed: ${error.message}`)
        return
      }
    }

    const nextFarmerProfile = {
      id: createLocalId(),
      ...profilePayload,
      createdAtDisplay: createDisplayTimestamp(),
    }

    if (hasFirebaseConfig) {
      try {
        await addFarmer(nextFarmerProfile)
        setDataMode('firebase')
      } catch (error) {
        setStatusMessage(
          `Your profile could not be saved to the main record store, so it was kept locally instead: ${error.message}`,
        )
        setDataMode('demo')
      }
    }

    setFarmers((current) => [nextFarmerProfile, ...current])
    setStatusMessage('Your farmer profile was created successfully.')
  }

  const handleOwnReportUpdate = async (event) => {
    event.preventDefault()

    if (!ownReportForm.reportId) {
      setStatusMessage('Choose one of your reports first before updating it.')
      return
    }

    const updatePayload = {
      title: ownReportForm.title,
      location: ownReportForm.location,
      severity: ownReportForm.severity,
      reporter: ownReportForm.reporter,
      updatedAtDisplay: createDisplayTimestamp(),
    }

    try {
      if (!String(ownReportForm.reportId).startsWith('local-')) {
        await updateReport(ownReportForm.reportId, updatePayload)
      }

      setReports((current) =>
        current.map((report) =>
          report.id === ownReportForm.reportId
            ? { ...report, ...updatePayload }
            : report,
        ),
      )
      setOwnReportForm({
        reportId: '',
        title: '',
        location: '',
        severity: 'Medium',
        reporter: '',
      })
      setStatusMessage('Your report was updated successfully.')
    } catch (error) {
      setStatusMessage(`Updating your report failed: ${error.message}`)
    }
  }

  const handleOwnReportDelete = async (reportId) => {
    if (!reportId) {
      setStatusMessage('Choose one of your reports first before removing it.')
      return
    }

    try {
      if (!String(reportId).startsWith('local-')) {
        await deleteReport(reportId)
      }

      setReports((current) => current.filter((report) => report.id !== reportId))
      setOwnReportForm({
        reportId: '',
        title: '',
        location: '',
        severity: 'Medium',
        reporter: '',
      })
      setStatusMessage('Your report was withdrawn successfully.')
    } catch (error) {
      setStatusMessage(`Removing your report failed: ${error.message}`)
    }
  }

  const handleSeasonPlanSubmit = async (event) => {
    event.preventDefault()
    if (!requireSignedInUser()) return

    const nextPlan = {
      id: createLocalId(),
      season: seasonPlanForm.season,
      priority: seasonPlanForm.priority,
      note: seasonPlanForm.note,
      createdById: currentUser?.uid ?? 'demo-user',
      createdByName: currentProfile?.name ?? 'Farmer',
      createdAtDisplay: createDisplayTimestamp(),
    }

    if (hasFirebaseConfig) {
      try {
        const newId = await addSeasonPlan(nextPlan)
        nextPlan.id = newId
        setStatusMessage('Seasonal task saved to your plan.')
        setDataMode('firebase')
      } catch (error) {
        setStatusMessage(`Plan saved locally — could not sync: ${error.message}`)
        setDataMode('demo')
      }
    } else {
      setStatusMessage('Plan saved locally (demo mode — will not persist after refresh).')
    }

    setSeasonPlans((current) => [nextPlan, ...current])
    setSeasonPlanForm({ season: '', priority: 'Planting', note: '' })
  }

  const handleSeasonPlanDelete = async (planId) => {
    if (!planId) return
    try {
      if (hasFirebaseConfig && !String(planId).startsWith('local-')) {
        await deleteSeasonPlan(planId)
      }
      setSeasonPlans((current) => current.filter((p) => p.id !== planId))
      setStatusMessage('Seasonal task removed.')
    } catch (error) {
      setStatusMessage(`Could not remove plan: ${error.message}`)
    }
  }

  const handleInputRequestSubmit = async (event) => {
    event.preventDefault()
    if (!requireSignedInUser()) return

    const nextRequest = {
      id: createLocalId(),
      item: inputRequestForm.item,
      quantity: inputRequestForm.quantity,
      urgency: inputRequestForm.urgency,
      note: inputRequestForm.note,
      status: 'Pending review',
      createdById: currentUser?.uid ?? 'demo-user',
      createdByName: currentProfile?.name ?? 'Farmer',
      createdAtDisplay: createDisplayTimestamp(),
    }

    if (hasFirebaseConfig) {
      try {
        const newId = await addInputRequest(nextRequest)
        nextRequest.id = newId
        setStatusMessage('Input request submitted.')
        setDataMode('firebase')
      } catch (error) {
        setStatusMessage(`Request saved locally — could not sync: ${error.message}`)
        setDataMode('demo')
      }
    } else {
      setStatusMessage('Request saved locally (demo mode — will not persist after refresh).')
    }

    setInputRequests((current) => [nextRequest, ...current])
    setInputRequestForm({ item: '', quantity: '', urgency: 'Medium', note: '' })
  }

  const handleInputRequestDelete = async (requestId) => {
    if (!requestId) return
    try {
      if (hasFirebaseConfig && !String(requestId).startsWith('local-')) {
        await deleteInputRequest(requestId)
      }
      setInputRequests((current) => current.filter((r) => r.id !== requestId))
      setStatusMessage('Input request withdrawn.')
    } catch (error) {
      setStatusMessage(`Could not withdraw request: ${error.message}`)
    }
  }

  const handleInputRequestStatusChange = async (requestId, nextStatus) => {
    try {
      if (hasFirebaseConfig && !String(requestId).startsWith('local-')) {
        await updateInputRequest(requestId, { status: nextStatus })
      }
      setInputRequests((current) =>
        current.map((r) => r.id === requestId ? { ...r, status: nextStatus } : r),
      )
    } catch (error) {
      setStatusMessage(`Could not update request: ${error.message}`)
    }
  }

  const handleAdvisorySubmit = async (event) => {
    event.preventDefault()
    if (!requireSignedInUser()) return

    const nextAdvisory = {
      id: createLocalId(),
      title: advisoryForm.title,
      audience: advisoryForm.audience,
      channel: advisoryForm.channel,
      message: advisoryForm.message,
      createdById: currentUser?.uid ?? 'demo-user',
      createdByName: currentProfile?.name ?? 'Demo user',
      createdByRole: currentProfile?.role ?? 'demo',
      createdAtDisplay: createDisplayTimestamp(),
    }

    if (hasFirebaseConfig) {
      try {
        await addAdvisory(nextAdvisory)
        setStatusMessage('Advisory published successfully.')
        setDataMode('firebase')
      } catch (error) {
        setStatusMessage(
          `Advisory could not be saved to the main record store, so it was kept locally instead: ${error.message}`,
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
    if (!requireSignedInUser()) return

    const nextInventoryItem = {
      id: createLocalId(),
      item: inventoryForm.item,
      dealer: inventoryForm.dealer,
      stock: inventoryForm.stock,
      status: inventoryForm.status,
      imageUrl: inventoryForm.imageUrl ?? '',
      createdById: currentUser?.uid ?? 'demo-user',
      createdByName: currentProfile?.name ?? 'Demo user',
      createdByRole: currentProfile?.role ?? 'demo',
      createdAtDisplay: createDisplayTimestamp(),
    }

    if (hasFirebaseConfig) {
      try {
        await addInventoryItem(nextInventoryItem)
        setStatusMessage('Inventory record saved successfully.')
        setDataMode('firebase')
      } catch (error) {
        setStatusMessage(
          `Inventory record could not be saved to the main record store, so it was kept locally instead: ${error.message}`,
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
      imageUrl: '',
    })
  }

  const handleReportStatusChange = async (reportId, nextStatus) => {
    try {
      if (reportId && !String(reportId).startsWith('local-')) {
        await updateReport(reportId, {
          status: nextStatus,
          updatedAtDisplay: createDisplayTimestamp(),
        })
      }
      setReports((current) =>
        current.map((report) =>
          report.id === reportId
            ? {
                ...report,
                status: nextStatus,
                updatedAtDisplay: createDisplayTimestamp(),
              }
            : report,
        ),
      )
      setStatusMessage('Report status updated successfully.')
    } catch (error) {
      setStatusMessage(`Updating report status failed: ${error.message}`)
    }
  }

  const handleReportManagementSubmit = async (event) => {
    event.preventDefault()

    if (!reportManagementForm.reportId) {
      setStatusMessage('Choose a report first before saving officer response.')
      return
    }

    const updatePayload = {
      assignedOfficer: reportManagementForm.assignedOfficer,
      resolutionNotes: reportManagementForm.resolutionNotes,
      status: reportManagementForm.status,
      updatedAtDisplay: createDisplayTimestamp(),
      resolvedAtDisplay:
        reportManagementForm.status === 'Resolved'
          ? createDisplayTimestamp()
          : '',
    }

    try {
      if (
        reportManagementForm.reportId &&
        !String(reportManagementForm.reportId).startsWith('local-')
      ) {
        await updateReport(reportManagementForm.reportId, updatePayload)
      }

      setReports((current) =>
        current.map((report) =>
          report.id === reportManagementForm.reportId
            ? { ...report, ...updatePayload }
            : report,
        ),
      )
      setStatusMessage('Officer response saved successfully.')
      setReportManagementForm({
        reportId: '',
        assignedOfficer: '',
        resolutionNotes: '',
        status: 'Officer assigned',
      })
    } catch (error) {
      setStatusMessage(`Saving officer response failed: ${error.message}`)
    }
  }

  const handleAdvisoryDelete = async (advisoryId) => {
    try {
      if (advisoryId && !String(advisoryId).startsWith('local-')) {
        await deleteAdvisory(advisoryId)
      }
      setAdvisories((current) =>
        current.filter((advisory) => advisory.id !== advisoryId),
      )
      setStatusMessage('Advisory removed successfully.')
    } catch (error) {
      setStatusMessage(`Removing advisory failed: ${error.message}`)
    }
  }

  const handleAdvisoryChannelChange = async (advisoryId, nextChannel) => {
    try {
      if (advisoryId && !String(advisoryId).startsWith('local-')) {
        await updateAdvisory(advisoryId, { channel: nextChannel })
      }
      setAdvisories((current) =>
        current.map((advisory) =>
          advisory.id === advisoryId
            ? { ...advisory, channel: nextChannel }
            : advisory,
        ),
      )
      setStatusMessage('Advisory channel updated successfully.')
    } catch (error) {
      setStatusMessage(`Updating advisory failed: ${error.message}`)
    }
  }

  const handleInventoryStatusChange = async (inventoryId, nextStatus) => {
    try {
      if (inventoryId && !String(inventoryId).startsWith('local-')) {
        await updateInventoryItem(inventoryId, { status: nextStatus })
      }
      setInventory((current) =>
        current.map((entry) =>
          entry.id === inventoryId ? { ...entry, status: nextStatus } : entry,
        ),
      )
      setStatusMessage('Inventory status updated successfully.')
    } catch (error) {
      setStatusMessage(`Updating inventory failed: ${error.message}`)
    }
  }

  const handleInventoryDelete = async (inventoryId) => {
    try {
      if (inventoryId && !String(inventoryId).startsWith('local-')) {
        await deleteInventoryItem(inventoryId)
      }
      setInventory((current) =>
        current.filter((entry) => entry.id !== inventoryId),
      )
      setStatusMessage('Inventory record removed successfully.')
    } catch (error) {
      setStatusMessage(`Removing inventory failed: ${error.message}`)
    }
  }

  const appState = {
    advisories,
    advisoryForm,
    authBusy,
    authForm,
    authMode,
    currentProfile,
    currentRole,
    currentUser,
    dataMode,
    farmerForm,
    farmerProfileForm,
    farmers,
    filters,
    accountForm,
    setAccountForm,
    handleAccountUpdate,
    handleAdvisoryChannelChange,
    handleAdvisoryDelete,
    handleAdvisorySubmit,
    handleAuthSubmit,
    handleGoogleSignIn,
    handleGoogleRegister,
    handleFarmerSubmit,
    handleFarmerProfileSubmit,
    handleInventoryDelete,
    handleInventoryStatusChange,
    handleInventorySubmit,
    handleLogout,
    handleInputRequestSubmit,
    handleInputRequestDelete,
    handleInputRequestStatusChange,
    handleOwnReportDelete,
    handleOwnReportUpdate,
    handleReportManagementSubmit,
    handleReportStatusChange,
    handleReportSubmit,
    handleSeasonPlanSubmit,
    handleSeasonPlanDelete,
    highSeverityReports,
    inputRequestForm,
    inputRequests,
    inventory,
    inventoryForm,
    isLoadingData,
    ownReportForm,
    reportForm,
    reportManagementForm,
    reports,
    seasonPlanForm,
    seasonPlans,
    setAdvisoryForm,
    setAuthForm,
    setAuthMode,
    setFarmerForm,
    setFarmerProfileForm,
    setFilters,
    setInputRequestForm,
    setInventoryForm,
    setOwnReportForm,
    setReportForm,
    setReportManagementForm,
    setSeasonPlanForm,
    statusMessage,
    toast,
    totalVerifiedInputs,
  }

  const dashboardLink =
    currentRole && dashboardConfig[currentRole]
      ? {
          label: dashboardConfig[currentRole].title.replace(' Dashboard', ''),
          path: `/dashboard/${currentRole}`,
        }
      : null

  const isAuthenticatedWorkspace =
    hasFirebaseConfig && currentRole && dashboardLink

  if (isAuthenticatedWorkspace && location.pathname.startsWith('/dashboard')) {
    return <WorkspaceShell dashboardLink={dashboardLink} state={appState} />
  }

  const isHome   = location.pathname === '/'
  const isAccess = location.pathname === '/access'
  const isFullWidth = isHome || isAccess ||
    ['/about', '/how-it-works', '/features', '/roles', '/impact', '/faqs', '/contact', '/marketplace'].includes(location.pathname)

  return (
    <PublicShell fullWidth={isFullWidth}>
      {toast && !isFullWidth ? <div className="toast-banner">{toast}</div> : null}
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route
          path="/access"
          element={
            currentRole && dashboardLink ? (
              <Navigate to={dashboardLink.path} replace />
            ) : (
              <AccessPage state={appState} />
            )
          }
        />
        <Route
          path="/dashboard/:role"
          element={<DashboardRouter state={appState} />}
        />
        <Route
          path="/dashboard/:role/*"
          element={<DashboardRouter state={appState} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PublicShell>
  )
}

export default App
