import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { getAccessToken } from '../authClient'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (getAccessToken()) {
            navigate('/dashboard')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleRegister = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { username, email, password })
            setError('')
            navigate('/login', { state: { justRegistered: true, email } })
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.')
        }
    }

    return (
        <AuthLayout
            title="Create your space."
            subtitle="A calmer place for your mind."
            footer={<>Already have an account? <Link className="text-sage-700 hover:text-sage-900 font-medium" to="/login">Sign in</Link></>}
        >
            {error && <p className="alert-error mb-3">{error}</p>}

            <form onSubmit={handleRegister} className="flex flex-col gap-3">
                <input className="field" type="text" placeholder="Display name" value={username} onChange={e => setUsername(e.target.value)} />
                <input className="field" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="field" type="password" placeholder="Password (8+ chars, 1 capital, 1 symbol)" value={password} onChange={e => setPassword(e.target.value)} />
                <input className="field" type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <button className="btn-primary mt-1" type="submit">Create account</button>
            </form>

            <p className="mt-4 text-center text-xs text-sand-500">
                Everything you write is encrypted. <Link className="hover:text-ink transition-colors underline decoration-sand-300" to="/proof-of-privacy">See how</Link>.
            </p>
        </AuthLayout>
    )
}
