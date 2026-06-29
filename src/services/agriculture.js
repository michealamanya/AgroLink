import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db, hasFirebaseConfig } from '../firebase'

const collections = {
  advisories: 'advisories',
  farmers: 'farmers',
  inventory: 'inventory',
  reports: 'reports',
}

function ensureFirebase() {
  if (!hasFirebaseConfig || !db) {
    throw new Error('Firebase environment variables are not configured yet.')
  }
}

async function readCollection(name) {
  ensureFirebase()

  const collectionRef = collection(db, collections[name])
  const collectionQuery = query(collectionRef, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(collectionQuery)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

async function createDocument(name, payload) {
  ensureFirebase()

  const docRef = await addDoc(collection(db, collections[name]), {
    ...payload,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export function getFarmers() {
  return readCollection('farmers')
}

export function addFarmer(payload) {
  return createDocument('farmers', payload)
}

export function getReports() {
  return readCollection('reports')
}

export function addReport(payload) {
  return createDocument('reports', payload)
}

export function getAdvisories() {
  return readCollection('advisories')
}

export function addAdvisory(payload) {
  return createDocument('advisories', payload)
}

export function getInventory() {
  return readCollection('inventory')
}

export function addInventoryItem(payload) {
  return createDocument('inventory', payload)
}
