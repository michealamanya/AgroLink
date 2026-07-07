import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { doc, collection, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, hasFirebaseConfig } from '../firebase'

function ensureFirebaseAuth() {
  if (!hasFirebaseConfig || !auth || !db) {
    throw new Error('Firebase authentication is not configured yet.')
  }
}

export async function registerUser({ district, email, name, password, role }) {
  ensureFirebaseAuth()

  const credential = await createUserWithEmailAndPassword(auth, email, password)

  await setDoc(doc(db, 'users', credential.user.uid), {
    createdAt: serverTimestamp(),
    district,
    email,
    name,
    role,
  })

  return credential.user
}

export async function resetPassword(email) {
  ensureFirebaseAuth()
  await sendPasswordResetEmail(auth, email)
}

export async function loginUser({ email, password }) {
  ensureFirebaseAuth()

  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function logoutUser() {
  ensureFirebaseAuth()
  await signOut(auth)
}

export function subscribeToAuth(callback) {
  ensureFirebaseAuth()
  return onAuthStateChanged(auth, callback)
}

export async function getUserProfile(uid) {
  ensureFirebaseAuth()

  const snapshot = await getDoc(doc(db, 'users', uid))
  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

export async function updateUserProfile(uid, payload) {
  ensureFirebaseAuth()
  await updateDoc(doc(db, 'users', uid), payload)
}

/**
 * Admin: fetch all platform users from the users collection.
 * Only district officers should call this.
 */
export async function getAllUsers() {
  ensureFirebaseAuth()
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Admin: update a user's role and/or status.
 */
export async function updateUserRole(uid, { role, status }) {
  ensureFirebaseAuth()
  const payload = {}
  if (role   !== undefined) payload.role   = role
  if (status !== undefined) payload.status = status
  await updateDoc(doc(db, 'users', uid), payload)
}

export async function loginWithGoogle(roleHint = 'farmer', districtHint = 'Bushenyi District') {
  ensureFirebaseAuth()

  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  const credential = await signInWithPopup(auth, provider)
  const user = credential.user

  // Check if a profile already exists
  const snap = await getDoc(doc(db, 'users', user.uid))

  if (!snap.exists()) {
    // No profile — sign them back out and throw a structured error
    // so the UI knows to offer registration instead
    await signOut(auth)
    const err = new Error('NO_PROFILE')
    err.code = 'auth/no-profile'
    err.googleUser = {
      name: user.displayName ?? '',
      email: user.email ?? '',
    }
    throw err
  }

  // Profile exists — normal sign-in, return user
  return user
}

/**
 * Called when user chooses to register via Google.
 * Always creates the account as a farmer by default.
 * district defaults to Bushenyi District.
 */
export async function registerWithGoogle(district = 'Bushenyi District') {
  ensureFirebaseAuth()

  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  const credential = await signInWithPopup(auth, provider)
  const user = credential.user

  // If a profile already exists, just sign in — don't overwrite
  const snap = await getDoc(doc(db, 'users', user.uid))
  if (!snap.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      createdAt: serverTimestamp(),
      district,
      email: user.email,
      name: user.displayName ?? user.email,
      role: 'farmer', // always farmer for Google sign-up
    })
  }

  return user
}
