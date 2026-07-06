/**
 * ImgBB Image Upload Service
 * API key: 0b56913a092868f8b0bc8bceaba41ad2
 * Docs: https://api.imgbb.com/
 */

const IMGBB_KEY = '0b56913a092868f8b0bc8bceaba41ad2'
const IMGBB_URL = 'https://api.imgbb.com/1/upload'

/**
 * Upload a File object to ImgBB.
 * Returns the image URL on success.
 * @param {File} file
 * @param {string} [name] - optional file name override
 * @returns {Promise<{ url: string, thumb: string, deleteUrl: string }>}
 */
export async function uploadImage(file, name) {
  const form = new FormData()
  form.append('key', IMGBB_KEY)
  form.append('image', file)
  if (name) form.append('name', name)

  const response = await fetch(IMGBB_URL, {
    method: 'POST',
    body: form,
  })

  if (!response.ok) {
    throw new Error(`ImgBB upload failed: HTTP ${response.status}`)
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error(`ImgBB error: ${data.error?.message ?? 'Upload failed'}`)
  }

  return {
    url:       data.data.url,
    thumb:     data.data.thumb?.url ?? data.data.url,
    deleteUrl: data.data.delete_url,
  }
}

/**
 * Upload a base64 string to ImgBB.
 * @param {string} base64 - raw base64 (no data:... prefix)
 * @param {string} [name]
 */
export async function uploadBase64(base64, name) {
  const form = new FormData()
  form.append('key', IMGBB_KEY)
  form.append('image', base64)
  if (name) form.append('name', name)

  const response = await fetch(IMGBB_URL, {
    method: 'POST',
    body: form,
  })

  if (!response.ok) {
    throw new Error(`ImgBB upload failed: HTTP ${response.status}`)
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error(`ImgBB error: ${data.error?.message ?? 'Upload failed'}`)
  }

  return {
    url:       data.data.url,
    thumb:     data.data.thumb?.url ?? data.data.url,
    deleteUrl: data.data.delete_url,
  }
}
