import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
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
