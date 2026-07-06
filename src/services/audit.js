/**
 * Audit Logging Service
 * Writes audit events to Firestore `auditLogs` collection.
 * Each document records: who, what action, which resource, when, role, and IP hint.
 */
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { db, hasFirebaseConfig } from '../firebase'

export const AUDIT_ACTIONS = {
  // auth
  REGISTER:         'user.register',
  LOGIN:            'user.login',
  LOGOUT:           'user.logout',
  GOOGLE_LOGIN:     'user.google_login',
  GOOGLE_REGISTER:  'user.google_register',
  PROFILE_UPDATE:   'user.profile_update',
  // farmers
  FARMER_CREATE:    'farmer.create',
  FARMER_UPDATE:    'farmer.update',
  // reports
  REPORT_CREATE:    'report.create',
  REPORT_UPDATE:    'report.update',
  REPORT_DELETE:    'report.delete',
  // advisories
  ADVISORY_CREATE:  'advisory.create',
  ADVISORY_UPDATE:  'advisory.update',
  ADVISORY_DELETE:  'advisory.delete',
  // inventory
  INVENTORY_CREATE: 'inventory.create',
  INVENTORY_UPDATE: 'inventory.update',
  INVENTORY_DELETE: 'inventory.delete',
}

/**
 * Log an audit event.
 * @param {{ uid: string, name: string, role: string, email: string }} user
 * @param {string} action — one of AUDIT_ACTIONS
 * @param {object} [meta] — optional extra context (resourceId, changes, etc.)
 */
export async function logAudit(user, action, meta = {}) {
  if (!hasFirebaseConfig || !db) return // silently skip in demo mode

  try {
    await addDoc(collection(db, 'auditLogs'), {
      uid:       user?.uid   ?? 'unknown',
      name:      user?.name  ?? user?.displayName ?? 'Unknown',
      role:      user?.role  ?? 'unknown',
      email:     user?.email ?? '',
      action,
      meta,
      timestamp: serverTimestamp(),
      // store date string for easy filtering without Firestore indexes
      dateStr:   new Date().toISOString().slice(0, 10),
    })
  } catch {
    // audit logging should never break the main flow
  }
}

/**
 * Fetch audit logs — optionally filtered by uid or date.
 * District/admin use only.
 */
export async function getAuditLogs({ uid, dateStr, limitToRole } = {}) {
  if (!hasFirebaseConfig || !db) return []

  try {
    let q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'))
    if (uid)         q = query(collection(db, 'auditLogs'), where('uid', '==', uid), orderBy('timestamp', 'desc'))
    if (dateStr)     q = query(collection(db, 'auditLogs'), where('dateStr', '==', dateStr), orderBy('timestamp', 'desc'))
    if (limitToRole) q = query(collection(db, 'auditLogs'), where('role', '==', limitToRole), orderBy('timestamp', 'desc'))

    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}
