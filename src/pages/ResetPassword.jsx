import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            setError('')
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.')
        }
    }

    return (
        <AuthLayout
            title="Reset password."
            subtitle="Enter your new password below."
            footer={<Link className="text-sage-700 hover:text-sage-900 font-medium" to="/login">← Back to sign in</Link>}
        >
            {error && <p className="alert-error mb-3">{error}</p>}
            {success && <p className="alert-success mb-3">{success}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input className="field" type="password" placeholder="New password (8+ chars, 1 capital, 1 symbol)" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <input className="field" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <button className="btn-primary mt-1" type="submit">Reset password</button>
            </form>
        </AuthLayout>
    )
}
