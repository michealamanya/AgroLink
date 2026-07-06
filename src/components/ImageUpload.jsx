import { useRef, useState } from 'react'
import { uploadImage } from '../services/imgbb'

/**
 * Reusable image upload widget backed by ImgBB.
 *
 * Props:
 *   label       – field label text
 *   currentUrl  – existing image URL to preview
 *   onUploaded  – (url) => void — called with the public ImgBB URL
 *   accept      – MIME types (default 'image/*')
 *   hint        – helper text
 */
function ImageUpload({ label, currentUrl, onUploaded, accept = 'image/*', hint }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFile(file) {
    if (!file) return
    setError(null)

    // show local preview immediately
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const result = await uploadImage(file, file.name)
      onUploaded(result.url)
    } catch (err) {
      setError(err.message)
      setPreview(currentUrl ?? null) // revert preview on failure
    } finally {
      setUploading(false)
    }
  }

  function onChange(e) {
    handleFile(e.target.files?.[0])
  }

  function onDrop(e) {
    e.preventDefault()
    handleFile(e.dataTransfer.files?.[0])
  }

  function onDragOver(e) { e.preventDefault() }

  return (
    <div className="imgup-root">
      {label ? <span className="imgup-label">{label}</span> : null}

      <div
        className={`imgup-zone ${uploading ? 'imgup-zone-uploading' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        role="button"
        tabIndex={0}
        aria-label={label ?? 'Upload image'}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="imgup-preview" />
        ) : (
          <div className="imgup-placeholder">
            <span className="imgup-icon" aria-hidden="true">📷</span>
            <span className="imgup-placeholder-text">
              {uploading ? 'Uploading…' : 'Click or drag image here'}
            </span>
          </div>
        )}

        {uploading ? (
          <div className="imgup-overlay">
            <div className="imgup-spinner" />
          </div>
        ) : null}
      </div>

      {preview && !uploading ? (
        <button
          type="button"
          className="imgup-change"
          onClick={() => inputRef.current?.click()}
        >
          Change image
        </button>
      ) : null}

      {hint ? <span className="imgup-hint">{hint}</span> : null}
      {error ? <span className="imgup-error">{error}</span> : null}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={onChange}
      />
    </div>
  )
}

export default ImageUpload
