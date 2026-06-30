import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { hasFirebaseConfig } from './firebase'
import {
  addAdvisory,
  addFarmer,
  addInventoryItem,
  addReport,
  deleteAdvisory,
  deleteInventoryItem,
  getAdvisories,
  getFarmers,
  getInventory,
  getReports,
  updateAdvisory,
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

function PublicShell({ children }) {
  return <div className="public-shell">{children}</div>
}

function DashboardRouter({ state }) {
  const location = useLocation()
  const routeRole = location.pathname.split('/').pop()
  const { currentRole, currentUser } = state

  if (!dashboardConfig[routeRole]) {
    return <Navigate to="/" replace />
  }

  if (hasFirebaseConfig && (!currentUser || currentRole !== routeRole)) {
    return <Navigate to="/access" replace />
  }

  return <DashboardPage role={routeRole} state={state} />
}

function WorkspaceShell({ dashboardLink, state }) {
  const {
    advisories,
    currentProfile,
    dataMode,
    farmers,
    inventory,
    isLoadingData,
    reports,
    statusMessage,
    toast,
  } = state

  return (
    <div className="app-shell">
      {toast ? <div className="toast-banner">{toast}</div> : null}

      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-kicker">Uganda Smart Agriculture</span>
          <strong className="brand-title">AgroLink</strong>
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
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <div>
            <span className="page-kicker">Operational workspace</span>
            <h1>Smart Agricultural Information System</h1>
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

        <Routes>
          <Route
            path="/dashboard/:role"
            element={<DashboardRouter state={state} />}
          />
          <Route path="*" element={<Navigate to={dashboardLink?.path ?? '/'} replace />} />
        </Routes>
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

          if (location.pathname !== targetDashboard) {
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
    farmers,
    filters,
    handleAdvisoryChannelChange,
    handleAdvisoryDelete,
    handleAdvisorySubmit,
    handleAuthSubmit,
    handleFarmerSubmit,
    handleInventoryDelete,
    handleInventoryStatusChange,
    handleInventorySubmit,
    handleLogout,
    handleReportManagementSubmit,
    handleReportStatusChange,
    handleReportSubmit,
    highSeverityReports,
    inventory,
    inventoryForm,
    isLoadingData,
    reportForm,
    reportManagementForm,
    reports,
    setAdvisoryForm,
    setAuthForm,
    setAuthMode,
    setFarmerForm,
    setFilters,
    setInventoryForm,
    setReportForm,
    setReportManagementForm,
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PublicShell>
  )
}

export default App
