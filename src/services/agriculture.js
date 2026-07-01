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
  where,
} from 'firebase/firestore'
import { db, hasFirebaseConfig } from '../firebase'

const collections = {
  advisories: 'advisories',
  farmers: 'farmers',
  inventory: 'inventory',
  reports: 'reports',
  seasonPlans: 'seasonPlans',
  inputRequests: 'inputRequests',
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

export function getSeasonPlans(userId) {
  ensureFirebase()
  const collectionRef = collection(db, collections.seasonPlans)
  const collectionQuery = query(
    collectionRef,
    where('createdById', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  return getDocs(collectionQuery).then((snapshot) =>
    snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  )
}

export function addSeasonPlan(payload) {
  return createDocument('seasonPlans', payload)
}

export function deleteSeasonPlan(id) {
  return deleteDocument('seasonPlans', id)
}

export function getInputRequests(userId) {
  ensureFirebase()
  const collectionRef = collection(db, collections.inputRequests)
  const collectionQuery = query(
    collectionRef,
    where('createdById', '==', userId),
    orderBy('createdAt', 'desc'),
  )
  return getDocs(collectionQuery).then((snapshot) =>
    snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  )
}

export function addInputRequest(payload) {
  return createDocument('inputRequests', payload)
}

export function deleteInputRequest(id) {
  return deleteDocument('inputRequests', id)
}

export function updateInputRequest(id, payload) {
  return updateDocument('inputRequests', id, payload)
}
