import {
  dashboardConfig,
  farmerActionPillars,
  farmerOperations,
  rolePlaybooks,
} from '../data/appData'
import { hasFirebaseConfig } from '../firebase'
import { getRoleWorkspace } from '../utils/dashboard'
import DealerDashboard from './dashboards/DealerDashboard'
import DistrictDashboard from './dashboards/DistrictDashboard'
import ExtensionDashboard from './dashboards/ExtensionDashboard'
import FarmerDashboard from './dashboards/FarmerDashboard'

const workflowNudges = {
  farmer:
    'Start with field visibility, stay current on advisories, and keep your production profile accurate for better support.',
  extension:
    'Focus first on unresolved incidents, then turn observations into practical guidance farmers can use immediately.',
  dealer:
    'Keep stock records accurate, highlight trusted availability, and respond early to changing field demand signals.',
  district:
    'Track active incidents, advisory coverage, and verified supply records together so district decisions stay grounded in current field reality.',
}

function DashboardPage({ role, state, subview = 'farm' }) {
  const config = dashboardConfig[role]
  const workspace = getRoleWorkspace(
    role,
    state.farmers,
    state.reports,
    state.advisories,
    state.inventory,
  )

  const metricsByRole = {
    farmer: [
      { label: 'Farmer profiles', value: state.farmers.length },
      { label: 'High-risk reports', value: state.highSeverityReports },
      { label: 'Verified inputs', value: state.totalVerifiedInputs },
    ],
    extension: [
      { label: 'Open reports', value: state.reports.length },
      { label: 'High-risk cases', value: state.highSeverityReports },
      { label: 'Published advisories', value: state.advisories.length },
    ],
    dealer: [
      { label: 'Inventory records', value: state.inventory.length },
      { label: 'Verified stock lines', value: state.totalVerifiedInputs },
      { label: 'Field demand signals', value: state.reports.length },
    ],
    district: [
      { label: 'Farmer profiles', value: state.farmers.length },
      { label: 'Incident reports', value: state.reports.length },
      { label: 'Verified input lines', value: state.totalVerifiedInputs },
    ],
  }

  const searchTerm = state.filters.search.trim().toLowerCase()
  const filteredReports = state.reports.filter((report) => {
    const matchesSearch =
      !searchTerm ||
      report.title.toLowerCase().includes(searchTerm) ||
      report.location.toLowerCase().includes(searchTerm)

    const matchesSeverity =
      state.filters.severity === 'All' ||
      report.severity === state.filters.severity

    return matchesSearch && matchesSeverity
  })

  const filteredInventory = state.inventory.filter((entry) => {
    const matchesSearch =
      !searchTerm ||
      entry.item.toLowerCase().includes(searchTerm) ||
      entry.dealer.toLowerCase().includes(searchTerm)

    const matchesStatus =
      state.filters.inventoryStatus === 'All' ||
      entry.status === state.filters.inventoryStatus

    return matchesSearch && matchesStatus
  })

  const linkedFarmerProfile =
    state.farmers.find((farmer) => {
      if (state.currentUser?.uid) {
        return farmer.createdById === state.currentUser.uid
      }

      return (
        state.currentProfile?.role === 'farmer' &&
        farmer.name === state.currentProfile?.name
      )
    }) ?? null

  const farmerOwnReports = state.reports
    .filter((report) => {
      if (state.currentUser?.uid) {
        return report.createdById === state.currentUser.uid
      }
      return report.createdByName === state.currentProfile?.name
    })

  const profileFocusTokens = (linkedFarmerProfile?.focus ?? '')
    .toLowerCase()
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean)

  const personalizedAdvisories = state.advisories.filter((advisory) => {
    const audience = advisory.audience?.toLowerCase() ?? ''

    if (profileFocusTokens.length === 0) {
      return true
    }

    return (
      profileFocusTokens.some((token) => audience.includes(token)) ||
      audience.includes('mixed') ||
      audience.includes('all farmers')
    )
  }).slice(0, 4)

  const farmerSeasonPlans = state.seasonPlans
    .filter((plan) =>
      state.currentUser?.uid
        ? plan.createdById === state.currentUser.uid
        : plan.createdByName === state.currentProfile?.name,
    )

  const farmerInputRequests = state.inputRequests
    .filter((request) =>
      state.currentUser?.uid
        ? request.createdById === state.currentUser.uid
        : request.createdByName === state.currentProfile?.name,
    )

  const context = {
    advisories: state.advisories,
    canManageAdvisories: role === 'extension' || role === 'district',
    canManageReports: role === 'extension' || role === 'district',
    canManageStock: role === 'dealer' || role === 'district',
    config,
    farmerActionPillars,
    farmerOperations,
    filteredInventory,
    filteredReports,
    farmerInputRequests,
    farmerOwnReports,
    farmerSeasonPlans,
    inventory: state.inventory,
    isAuthorized:
      !hasFirebaseConfig || !state.currentUser || state.currentRole === role,
    linkedFarmerProfile,
    latestAdvisory: state.advisories[0] ?? null,
    latestReport: state.reports[0] ?? null,
    latestVerifiedInput:
      state.inventory.find((entry) => entry.status === 'Verified') ?? null,
    metrics: metricsByRole[role] ?? metricsByRole.district,
    personalizedAdvisories,
    role,
    rolePlaybook: rolePlaybooks[role] ?? rolePlaybooks.district,
    state,
    subview: subview ?? 'overview',
    workflowNudge: workflowNudges[role] ?? workflowNudges.district,
    workspace,
  }

  if (role === 'farmer') {
    return <FarmerDashboard context={context} />
  }

  if (role === 'extension') {
    return <ExtensionDashboard context={context} />
  }

  if (role === 'dealer') {
    return <DealerDashboard context={context} />
  }

  return <DistrictDashboard context={context} />
}

export default DashboardPage
