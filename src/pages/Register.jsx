import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        try {
            await axios.post('http://localhost:5000/auth/register', { username, email, password })
            setSuccess('Account created! Redirecting to login...')
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (err) {
            setError('Something went wrong. Try a different email.')
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
                <h1>Get started.</h1>
                <p className="auth-sub">Get things done.</p>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Display Name"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
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
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit">Create account</button>
                </form>
                <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
        </div>
    )
}