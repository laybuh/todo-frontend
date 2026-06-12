import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AuthLayout from '../components/AuthLayout'
import { getAccessToken } from '../authClient'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (getAccessToken()) {
            navigate('/dashboard')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        <AuthLayout
            title="Forgot password."
            subtitle="Enter your email and we’ll send you a reset link. If no account exists with that email, you won’t receive anything."
            footer={<Link className="text-sage-700 hover:text-sage-900 font-medium" to="/login">← Back to sign in</Link>}
        >
            {error && <p className="alert-error mb-3">{error}</p>}
            {success && <p className="alert-success mb-3">{success}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input className="field" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <button className="btn-primary mt-1" type="submit">Send reset link</button>
            </form>
        </AuthLayout>
    )
}
