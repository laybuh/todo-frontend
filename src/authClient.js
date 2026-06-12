import axios from 'axios'

// Send the httpOnly refresh cookie with requests (needed for /auth/refresh & logout).
axios.defaults.withCredentials = true

const API = import.meta.env.VITE_API_URL

// The access token lives only in memory (never localStorage) so it isn't exposed
// to XSS-readable storage. It's lost on reload and recovered via bootstrapAuth()
// using the httpOnly refresh cookie.
let accessToken = null
let refreshPromise = null
let bootstrapPromise = null

export function setAccessToken(token) {
    accessToken = token || null
    if (accessToken) {
        axios.defaults.headers.common.authorization = accessToken
    } else {
        delete axios.defaults.headers.common.authorization
    }
}

export function getAccessToken() {
    return accessToken
}

export function clearAccessToken() {
    setAccessToken(null)
}

// On app load the in-memory token is gone; try to recover the session from the
// httpOnly refresh cookie. Resolves true if a session was restored. The in-flight
// promise is shared so concurrent callers (and StrictMode double-mounts) only
// trigger one /auth/refresh.
export function bootstrapAuth() {
    if (accessToken) return Promise.resolve(true)
    if (!bootstrapPromise) {
        bootstrapPromise = axios.post(`${API}/auth/refresh`)
            .then((res) => {
                setAccessToken(res.data.token)
                return true
            })
            .catch(() => {
                clearAccessToken()
                return false
            })
            .finally(() => {
                bootstrapPromise = null
            })
    }
    return bootstrapPromise
}

// When an access token expires, transparently rotate via /auth/refresh and retry
// the original request once. Concurrent 401s share a single refresh call.
axios.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config
        const status = error.response?.status
        const code = error.response?.data?.code
        const isRefreshCall = original?.url?.includes('/auth/refresh')

        if (status === 401 && code === 'token_expired' && original && !original._retry && !isRefreshCall) {
            original._retry = true
            try {
                refreshPromise = refreshPromise || axios.post(`${API}/auth/refresh`)
                const res = await refreshPromise
                refreshPromise = null

                const newToken = res.data.token
                setAccessToken(newToken)
                original.headers = original.headers || {}
                original.headers.authorization = newToken
                return axios(original)
            } catch (e) {
                refreshPromise = null
                clearAccessToken()
                localStorage.removeItem('lastActive')
                localStorage.removeItem('onboarded')
                if (window.location.pathname !== '/login') window.location.href = '/login'
                return Promise.reject(e)
            }
        }
        return Promise.reject(error)
    }
)
