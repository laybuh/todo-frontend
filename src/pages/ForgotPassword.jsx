import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email })
            setSuccess('Password reset link sent! Please check your email.')
            setError('')
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.')
            setSuccess('')
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
                <h1>Forgot password.</h1>
                <p className="auth-sub">Enter your email and we'll send you a reset link. If no account exists with that email, you won't receive anything.</p>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <button type="submit">Send reset link</button>
                </form>
                <p className="auth-link"><Link to="/login">← Back to sign in</Link></p>
            </div>
        </div>
    )
}