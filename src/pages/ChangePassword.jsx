import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { getAccessToken } from '../authClient'

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const token = getAccessToken()

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            setError('')
            setTimeout(() => navigate('/dashboard'), 2000)
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.')
        }
    }

    return (
        <AuthLayout
            title="Change password."
            subtitle="Keep your account secure."
            footer={<Link className="text-sage-700 hover:text-sage-900 font-medium" to="/dashboard">← Back to dashboard</Link>}
        >
            {error && <p className="alert-error mb-3">{error}</p>}
            {success && <p className="alert-success mb-3">{success}</p>}

            <form onSubmit={handleChange} className="flex flex-col gap-3">
                <input className="field" type="password" placeholder="Current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                <input className="field" type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <input className="field" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <button className="btn-primary mt-1" type="submit">Update password</button>
            </form>
        </AuthLayout>
    )
}
