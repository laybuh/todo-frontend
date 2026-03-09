import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [username, setUsername] = useState('')
    const navigate = useNavigate()

    const token = localStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUsername(payload.username || '')
    }, [])

    const handleChange = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.')
            return
        }
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/auth/change-password`,
                { currentPassword, newPassword },
                { headers: { authorization: token } }
            )
            setSuccess('Password updated! Redirecting...')
            setTimeout(() => navigate('/dashboard'), 2000)
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
                <h1>Change password.</h1>
                <p className="auth-sub">Keep your account secure.</p>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleChange}>
                    <input
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit">Update password</button>
                </form>
                <p className="auth-link"><Link to="/dashboard">← Back to dashboard</Link></p>
            </div>
        </div>
    )
}