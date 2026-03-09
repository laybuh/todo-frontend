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
            const res = await axios.post('http://localhost:5000/auth/login', { email, password })
            localStorage.setItem('token', res.data.token)
            navigate('/dashboard')
        } catch (err) {
            setError('Invalid email or password.')
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <p className="app-name">DoSpace</p>
                <h1>Welcome back.</h1>
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
            </div>
        </div>
    )
}