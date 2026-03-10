import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) {
            navigate('/forgot-password')
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, { token, newPassword })
            setSuccess('Password reset! Redirecting to sign in...')
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.')
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
                <h1>Reset password.</h1>
                <p className="auth-sub">Enter your new password below.</p>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New password (8+ chars, 1 capital, 1 symbol)"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit">Reset password</button>
                </form>
                <p className="auth-link"><Link to="/login">← Back to sign in</Link></p>
            </div>
        </div>
    )
}