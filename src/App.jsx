import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { bootstrapAuth, hasValidSession } from './authClient'

// Eager: the public landing + auth (first paint).
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

const VerifyOTP = lazy(() => import('./pages/VerifyOTP'))
const Settings = lazy(() => import('./pages/Settings'))

// Lazy: in-app pages load on demand. Keeps recharts/framer out of first load.
const ProofOfPrivacy = lazy(() => import('./pages/ProofOfPrivacy'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Focus = lazy(() => import('./pages/Focus'))
const Journal = lazy(() => import('./pages/Journal'))
const Mood = lazy(() => import('./pages/Mood'))
const Affirmations = lazy(() => import('./pages/Affirmations'))
const CrisisCorner = lazy(() => import('./pages/CrisisCorner'))
const CalmSpace = lazy(() => import('./pages/CalmSpace'))
const ChangePassword = lazy(() => import('./pages/ChangePassword'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

function Loading() {
  return <div className="min-h-screen bg-cream" />
}

// Gate for routes that need a signed-in user. If a still-valid access token is in
// memory (just signed in), render immediately. Otherwise — fresh page load, or a
// token that's expired in memory — try to restore the session from the httpOnly
// refresh cookie before deciding whether to show the page or bounce to /login.
function RequireAuth({ children }) {
  const [status, setStatus] = useState(hasValidSession() ? 'authed' : 'pending')

  useEffect(() => {
    if (hasValidSession()) return
    let active = true
    bootstrapAuth().then((ok) => {
      if (active) setStatus(ok ? 'authed' : 'guest')
    })
    return () => { active = false }
  }, [])

  if (status === 'pending') return <Loading />
  if (status === 'guest') return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proof-of-privacy" element={<ProofOfPrivacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/focus" element={<RequireAuth><Focus /></RequireAuth>} />
          <Route path="/journal" element={<RequireAuth><Journal /></RequireAuth>} />
          <Route path="/mood" element={<RequireAuth><Mood /></RequireAuth>} />
          <Route path="/affirmations" element={<RequireAuth><Affirmations /></RequireAuth>} />
          <Route path="/calm" element={<RequireAuth><CalmSpace /></RequireAuth>} />
          <Route path="/crisis" element={<RequireAuth><CrisisCorner /></RequireAuth>} />
          <Route path="/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
