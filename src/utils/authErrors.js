/**
 * Translates raw Firebase auth error codes into plain, friendly messages.
 * Users should never see "Firebase: Error (auth/...)" strings.
 */

const MESSAGES = {
  // sign-in
  'auth/invalid-credential':           'Incorrect email or password. Please check your details and try again.',
  'auth/wrong-password':               'Incorrect password. Please try again.',
  'auth/user-not-found':               'No account found with that email address. Please check the email or create an account.',
  'auth/invalid-email':                'That email address doesn\'t look right. Please check the format.',
  'auth/user-disabled':                'This account has been disabled. Please contact support.',
  'auth/too-many-requests':            'Too many failed attempts. Please wait a moment before trying again.',
  'auth/network-request-failed':       'No internet connection. Please check your network and try again.',

  // registration
  'auth/email-already-in-use':         'An account with that email already exists. Try signing in instead.',
  'auth/weak-password':                'Your password is too short. Please use at least 6 characters.',
  'auth/operation-not-allowed':        'This sign-in method is not enabled. Please contact support.',

  // Google
  'auth/popup-closed-by-user':         'Sign-in window was closed. Please try again.',
  'auth/popup-blocked':                'Sign-in popup was blocked by your browser. Please allow popups and try again.',
  'auth/cancelled-popup-request':      'Sign-in was cancelled. Please try again.',
  'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method. Try signing in with email and password.',
  'auth/no-profile':                   'No AgroLink account found for this Google account. Please create an account first.',

  // session
  'auth/requires-recent-login':        'Please sign out and sign back in to complete this action.',
  'auth/credential-already-in-use':    'This account is already linked to another user.',

  // configuration
  'auth/configuration-not-found':      'Authentication is not fully set up yet. Please contact support.',
  'auth/internal-error':               'Something went wrong on our end. Please try again in a moment.',
  'auth/timeout':                      'The request timed out. Please check your connection and try again.',
}

/**
 * Returns a clean, user-friendly error message.
 * @param {Error|{ code?: string, message?: string }} error
 * @returns {string}
 */
export function friendlyAuthError(error) {
  if (!error) return 'Something went wrong. Please try again.'

  // check known code first
  const code = error?.code ?? ''
  if (code && MESSAGES[code]) return MESSAGES[code]

  // try to extract code from message string (Firebase sometimes embeds it)
  const embedded = code || ((error.message ?? '').match(/\(([^)]+)\)/)?.[1] ?? '')
  if (embedded && MESSAGES[embedded]) return MESSAGES[embedded]

  // network check
  const msg = (error.message ?? '').toLowerCase()
  if (msg.includes('network') || msg.includes('fetch'))
    return 'No internet connection. Please check your network and try again.'
  if (msg.includes('timeout'))
    return 'The request timed out. Please check your connection and try again.'

  // never show raw Firebase errors to users
  return 'Something went wrong. Please try again.'
}
