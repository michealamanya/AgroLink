import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
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

async function updateDocument(name, id, payload) {
  ensureFirebase()

  await updateDoc(doc(db, collections[name], id), payload)
}

async function deleteDocument(name, id) {
  ensureFirebase()

  await deleteDoc(doc(db, collections[name], id))
}

export function getFarmers() {
  return readCollection('farmers')
}

export function addFarmer(payload) {
  return createDocument('farmers', payload)
}

export function updateFarmer(id, payload) {
  return updateDocument('farmers', id, payload)
}

export function getReports() {
  return readCollection('reports')
}

export function addReport(payload) {
  return createDocument('reports', payload)
}

export function updateReport(id, payload) {
  return updateDocument('reports', id, payload)
}

export function deleteReport(id) {
  return deleteDocument('reports', id)
}

export function getAdvisories() {
  return readCollection('advisories')
}

export function addAdvisory(payload) {
  return createDocument('advisories', payload)
}

export function updateAdvisory(id, payload) {
  return updateDocument('advisories', id, payload)
}

export function deleteAdvisory(id) {
  return deleteDocument('advisories', id)
}

export function getInventory() {
  return readCollection('inventory')
}

export function addInventoryItem(payload) {
  return createDocument('inventory', payload)
}

export function updateInventoryItem(id, payload) {
  return updateDocument('inventory', id, payload)
}

export function deleteInventoryItem(id) {
  return deleteDocument('inventory', id)
}
