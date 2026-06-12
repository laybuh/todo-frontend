import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { setAccessToken, getAccessToken } from '../authClient'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (getAccessToken()) {
            navigate('/dashboard')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [searchParams] = useSearchParams()
    const verified = searchParams.get('verified')

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password })
            if (res.data.mfaRequired) {
                navigate('/verify-otp', { state: { email: res.data.email } })
                return
            }
            setAccessToken(res.data.token)
            localStorage.setItem('onboarded', res.data.onboarded ? 'true' : 'false')
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid email or password.')
        }
    }

    return (
        <AuthLayout
            title="Welcome back."
            subtitle="Sign in to your private space."
            footer={<>Don’t have an account? <Link className="text-sage-700 hover:text-sage-900 font-medium" to="/register">Create one</Link></>}
        >
            {verified && <p className="alert-success mb-3">Email verified! You can now sign in.</p>}
            {error && <p className="alert-error mb-3">{error}</p>}

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <input className="field" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="field" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="btn-primary mt-1" type="submit">Sign in</button>
            </form>

            <p className="mt-4 text-center text-xs text-sand-500">
                <Link className="hover:text-ink transition-colors" to="/forgot-password">Forgot your password?</Link>
            </p>
        </AuthLayout>
    )
}
