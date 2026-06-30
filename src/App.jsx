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
import { hasFirebaseConfig } from './firebase'
import {
  addAdvisory,
  addFarmer,
  addInventoryItem,
  addReport,
  deleteAdvisory,
  deleteInventoryItem,
  deleteReport,
  getAdvisories,
  getFarmers,
  getInventory,
  getReports,
  updateAdvisory,
  updateFarmer,
  updateInventoryItem,
  updateReport,
} from './services/agriculture'
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  subscribeToAuth,
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
import { createDisplayTimestamp } from './utils/records'

function parseDashboardPath(pathname) {
  const [, dashboardSegment, role, subview] = pathname.split('/')

  return {
    dashboardSegment,
    role: role ?? null,
    subview: subview ?? 'farm',
  }
}

function PublicShell({ children }) {
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
  const [isNavOpen, setIsNavOpen] = useState(true)
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
  const { role: activeRole, subview: activeSubview } = parseDashboardPath(
    location.pathname,
  )

  const sectionLinksByRole = {
    farmer: [
      { label: 'My Farm', to: '/dashboard/farmer/farm' },
      { label: 'My Profile', to: '/dashboard/farmer/profile' },
      { label: 'Season Planner', to: '/dashboard/farmer/planner' },
      { label: 'Input Requests', to: '/dashboard/farmer/requests' },
      { label: 'My Reports', to: '/dashboard/farmer/reports' },
      { label: 'Guidance', to: '/dashboard/farmer/guidance' },
    ],
    extension: [
      { label: 'Response Queue', to: '/dashboard/extension' },
      { label: 'Farmer Support', to: '/dashboard/extension' },
    ],
    dealer: [
      { label: 'Stock Board', to: '/dashboard/dealer' },
      { label: 'Supply Updates', to: '/dashboard/dealer' },
    ],
    district: [
      { label: 'Situation Room', to: '/dashboard/district' },
      { label: 'District Oversight', to: '/dashboard/district' },
    ],
  }

  const roleSectionLinks = sectionLinksByRole[currentProfile?.role] ?? []

  return (
    <div className={`app-shell ${isNavOpen ? 'nav-open' : 'nav-collapsed'}`}>
      {toast ? <div className="toast-banner">{toast}</div> : null}
      <button
        type="button"
        className={`nav-backdrop ${isNavOpen ? 'nav-backdrop-visible' : ''}`}
        aria-label="Close navigation"
        onClick={() => setIsNavOpen(false)}
      />

      <aside className={`sidebar ${isNavOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="brand-block">
          <div className="sidebar-head">
            <div>
              <span className="brand-kicker">Uganda Smart Agriculture</span>
              <strong className="brand-title">AgroLink</strong>
            </div>
            <button
              type="button"
              className="nav-toggle-button nav-toggle-button-inline"
              aria-label="Toggle navigation"
              onClick={() => setIsNavOpen((current) => !current)}
            >
              {isNavOpen ? 'Hide' : 'Menu'}
            </button>
          </div>
          <p>
            Smart agricultural information and agro-input management for Bushenyi
            District.
          </p>
        </div>

        <nav className="side-nav" aria-label="Workspace">
          {dashboardLink ? (
            <NavLink to={dashboardLink.path}>{dashboardLink.label}</NavLink>
          ) : null}
          <NavLink to="/">Landing page</NavLink>
          <NavLink to="/access">Account</NavLink>
        </nav>

        {roleSectionLinks.length > 0 ? (
          <div className="sidebar-card sidebar-section-card">
            <span className="mini-heading">Quick Sections</span>
            <div className="side-section-links">
              {roleSectionLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  className={
                    activeRole === 'farmer' &&
                    parseDashboardPath(link.to).subview === activeSubview
                      ? 'side-section-link side-section-link-active'
                      : 'side-section-link'
                  }
                  onClick={() => {
                    navigate(link.to)
                    setIsNavOpen(false)
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="sidebar-card">
          <span className={`mode-pill mode-${dataMode}`}>
            {isLoadingData ? 'Loading' : `${dataMode} mode`}
          </span>
          <p>{statusMessage}</p>
        </div>

        <div className="sidebar-card">
          <span className="mini-heading">Signed In</span>
          <strong>{currentProfile?.name ?? 'Active user'}</strong>
          <p>{currentProfile?.role ?? 'Protected workspace'}</p>
        </div>

        <div className="sidebar-card">
          <span className="mini-heading">Workspace Scope</span>
          <p>
            Full records, workflow actions, and role-specific operational tools
            are available inside this signed-in environment.
          </p>
        </div>

        <div className="sidebar-card sidebar-action-card">
          <span className="mini-heading">Session Control</span>
          <p>Sign out securely when you finish your operational work.</p>
          <button
            type="button"
            className="secondary-button sidebar-logout-button"
            onClick={handleLogout}
            disabled={authBusy}
          >
            {authBusy ? 'Signing out...' : 'Log out'}
          </button>
        </div>
      </aside>

      <button
        type="button"
        className={`floating-nav-fab ${isNavOpen ? 'floating-nav-fab-open' : ''}`}
        aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setIsNavOpen((current) => !current)}
      >
        <span className="floating-nav-fab-icon">{isNavOpen ? '×' : '☰'}</span>
        <span className="floating-nav-fab-label">{isNavOpen ? 'Close' : 'Menu'}</span>
      </button>

      <div className="main-panel">
        <header className="topbar">
          <div className="topbar-main">
            <button
              type="button"
              className="nav-toggle-button"
              aria-label="Toggle navigation"
              onClick={() => setIsNavOpen((current) => !current)}
            >
              {isNavOpen ? 'Close menu' : 'Open menu'}
            </button>
            <div>
              <span className="page-kicker">Operational workspace</span>
              <h1>Smart Agricultural Information System</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="session-chip">
              <span className="mini-heading">Active Session</span>
              <strong>{currentProfile?.name ?? 'Protected user'}</strong>
              <span>{currentProfile?.role ?? 'Approved account'}</span>
            </div>
            <button
              type="button"
              className="secondary-button topbar-logout-button"
              onClick={handleLogout}
              disabled={authBusy}
            >
              {authBusy ? 'Signing out...' : 'Log out'}
            </button>
          </div>

          <div className="topbar-summary">
            <div>
              <strong>{farmers.length}</strong>
              <span>Farmers</span>
            </div>
            <div>
              <strong>{reports.length}</strong>
              <span>Reports</span>
            </div>
            <div>
              <strong>{advisories.length}</strong>
              <span>Advisories</span>
            </div>
            <div>
              <strong>{inventory.length}</strong>
              <span>Inputs</span>
            </div>
          </div>
        </header>

        <DashboardRouter state={state} />
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

        if (profile?.role) {
          const targetDashboard = `/dashboard/${profile.role}`

          if (location.pathname === '/access') {
            navigate(targetDashboard, { replace: true })
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

  const handleAuthSubmit = async (event) => {
    event.preventDefault()

    if (!hasFirebaseConfig) {
      setStatusMessage(
        'Authentication is not fully configured yet for this environment.',
      )
      return
    }

    setAuthBusy(true)

    try {
      if (authMode === 'register') {
        await registerUser(authForm)
        setStatusMessage(
          `Account created for ${authForm.role}. You can now use your assigned platform workspace.`,
        )
      } else {
        await loginUser({
          email: authForm.email,
          password: authForm.password,
        })
        setStatusMessage('Signed in successfully. Your workspace is now ready.')
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
      setStatusMessage('Signed out successfully.')
      navigate('/access')
    } catch (error) {
      setStatusMessage(`Sign-out failed: ${error.message}`)
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
      reporter: reportForm.reporter,
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

  const handleSeasonPlanSubmit = (event) => {
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

    setSeasonPlans((current) => [nextPlan, ...current])
    setSeasonPlanForm({
      season: '',
      priority: 'Planting',
      note: '',
    })
    setStatusMessage('Your seasonal task plan was added successfully.')
  }

  const handleInputRequestSubmit = (event) => {
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

    setInputRequests((current) => [nextRequest, ...current])
    setInputRequestForm({
      item: '',
      quantity: '',
      urgency: 'Medium',
      note: '',
    })
    setStatusMessage('Your input request was submitted successfully.')
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
    handleAdvisoryChannelChange,
    handleAdvisoryDelete,
    handleAdvisorySubmit,
    handleAuthSubmit,
    handleFarmerSubmit,
    handleFarmerProfileSubmit,
    handleInventoryDelete,
    handleInventoryStatusChange,
    handleInventorySubmit,
    handleLogout,
    handleInputRequestSubmit,
    handleOwnReportDelete,
    handleOwnReportUpdate,
    handleReportManagementSubmit,
    handleReportStatusChange,
    handleReportSubmit,
    handleSeasonPlanSubmit,
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

  return (
    <PublicShell>
      {toast ? <div className="toast-banner">{toast}</div> : null}
      <Routes>
        <Route path="/" element={<OverviewPage />} />
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
