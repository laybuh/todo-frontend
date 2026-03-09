import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password })
            localStorage.setItem('token', res.data.token)
            navigate('/dashboard')
        } catch (err) {
            setError('Invalid email or password.')
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="brand">
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <p className="app-name">dospace</p>
                    </Link>
                    <p className="app-tagline">Your space. Your tasks.</p>
                </div>
                <h1>Sign in.</h1>
                <p className="auth-desc">A private, encrypted space for your tasks. Everything you write is secured and only visible to you. Your tasks are fully encrypted; we cannot read them, and neither can anyone else.</p>
                <p className="auth-sub">Sign in to your account.</p>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit">Sign in</button>
                </form>
                <p className="auth-link">Don't have an account? <Link to="/register">Register</Link></p>
                <p className="forgot-text">
                    Forgot your password?{' '}
                    <a href="mailto:dospace.app@gmail.com">Contact support</a>
                    {' '}or email{' '}
                    <a href="mailto:dospace.app@gmail.com">dospace.app@gmail.com</a>
                    {' '}using your registered email address.
                </p>
            </div>
        </div>
    )
}