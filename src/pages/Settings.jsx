import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { getAccessToken, clearAccessToken } from '../authClient'

export default function Settings() {
    const [me, setMe] = useState(null)
    const [saving, setSaving] = useState(false)
    const [msg, setMsg] = useState('')
    // Disabling MFA requires re-confirming the password, so a stolen/lingering
    // access token alone can't weaken the account's security.
    const [confirmingDisable, setConfirmingDisable] = useState(false)
    const [disablePassword, setDisablePassword] = useState('')
    const [disableError, setDisableError] = useState('')

    // Delete account: confirm by re-typing the email, then it's gone for good.
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteEmail, setDeleteEmail] = useState('')
    const [deletePassword, setDeletePassword] = useState('')
    const [deleteError, setDeleteError] = useState('')

    const token = getAccessToken()
    const auth = { headers: { authorization: token } }

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, auth).then((r) => setMe(r.data))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Enabling is simple; disabling opens a password confirmation first.
    const onToggleMfa = () => {
        if (!me) return
        setMsg('')
        if (me.mfa_enabled) {
            setDisableError('')
            setDisablePassword('')
            setConfirmingDisable(true)
        } else {
            enableMfa()
        }
    }

    const enableMfa = async () => {
        setSaving(true)
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/mfa`, { enabled: true }, auth)
            setMe((m) => ({ ...m, mfa_enabled: res.data.enabled }))
            setMsg('Two-step verification is on. You’ll get a code by email each time you sign in.')
        } catch {
            setMsg('Could not update that. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const confirmDisableMfa = async () => {
        setSaving(true)
        setDisableError('')
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/mfa`,
                { enabled: false, password: disablePassword },
                auth
            )
            setMe((m) => ({ ...m, mfa_enabled: res.data.enabled }))
            setConfirmingDisable(false)
            setDisablePassword('')
            setMsg('Two-step verification is off.')
        } catch (err) {
            setDisableError(err.response?.data?.error || 'Could not turn this off. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/auth/delete-account`, {
                headers: { authorization: token },
                data: { email: deleteEmail, password: deletePassword },
            })
            clearAccessToken()
            localStorage.removeItem('lastActive')
            localStorage.removeItem('onboarded')
            window.location.href = '/login'
        } catch (err) {
            setDeleteError(err.response?.data?.error || 'Something went wrong.')
        }
    }

    return (
        <DashboardLayout active="settings">
            <h1 className="font-serif text-3xl mb-1">Settings</h1>
            <p className="text-sand-600 mb-7">Manage your account and security.</p>

            {!me ? (
                <p className="text-sand-400 py-8">Loading…</p>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="bg-surface border border-sand-200 rounded-2xl p-5">
                        <p className="text-xs uppercase tracking-wide text-sand-500 mb-1">Account</p>
                        <p className="text-ink">{me.username}</p>
                        <p className="text-sm text-sand-600">{me.email}</p>
                    </div>

                    {/* MFA */}
                    <div className="bg-surface border border-sand-200 rounded-2xl p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="font-medium text-ink mb-1">Two-step verification</p>
                                <p className="text-sm text-sand-600">
                                    On by default. We’ll email a one-time code each time you sign in. You can turn it off if you prefer.
                                </p>
                            </div>
                            <button
                                onClick={onToggleMfa}
                                disabled={saving || confirmingDisable}
                                role="switch"
                                aria-checked={me.mfa_enabled}
                                className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${me.mfa_enabled ? 'bg-sage-500' : 'bg-sand-300'} disabled:opacity-60`}
                            >
                                <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${me.mfa_enabled ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>

                        {confirmingDisable && (
                            <div className="mt-4 border-t border-sand-200 pt-4">
                                <p className="text-sm text-sand-600 mb-2">
                                    Confirm your password to turn off two-step verification.
                                </p>
                                {disableError && <p className="alert-error mb-2">{disableError}</p>}
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        className="field flex-1"
                                        type="password"
                                        placeholder="Current password"
                                        value={disablePassword}
                                        onChange={(e) => setDisablePassword(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={confirmDisableMfa}
                                            disabled={saving || !disablePassword}
                                            className="btn-primary px-4 py-2 text-sm disabled:opacity-60"
                                        >
                                            Turn off
                                        </button>
                                        <button
                                            onClick={() => { setConfirmingDisable(false); setDisablePassword(''); setDisableError('') }}
                                            disabled={saving}
                                            className="btn-soft px-4 py-2 text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {msg && <p className="text-sm text-sage-700 mt-3">{msg}</p>}
                    </div>

                    {/* Password */}
                    <div className="bg-surface border border-sand-200 rounded-2xl p-5 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-ink mb-1">Password</p>
                            <p className="text-sm text-sand-600">Change the password you use to sign in.</p>
                        </div>
                        <Link to="/change-password" className="btn-soft px-5 py-2 text-sm shrink-0">Change</Link>
                    </div>

                    {/* Contact */}
                    <div className="bg-surface border border-sand-200 rounded-2xl p-5">
                        <p className="font-medium text-ink mb-1">Contact</p>
                        <p className="text-sm text-sand-600">
                            Questions or concerns? Email{' '}
                            <a href="mailto:hello@layba.dev" className="text-sage-700 hover:text-sage-900">hello@layba.dev</a>.
                        </p>
                    </div>

                    {/* Delete account */}
                    <div className="bg-surface border border-sand-200 rounded-2xl p-5 flex items-center justify-between gap-4">
                        <div>
                            <p className="font-medium text-ink mb-1">Delete account</p>
                            <p className="text-sm text-sand-600">Permanently remove your account and everything in it. This cannot be undone.</p>
                        </div>
                        <button
                            onClick={() => { setShowDeleteConfirm(true); setDeleteEmail(''); setDeletePassword(''); setDeleteError('') }}
                            className="text-sm text-rose-600 hover:text-rose-700 font-medium shrink-0"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-surface border border-sand-200 rounded-2xl p-7 shadow-xl">
                        <h2 className="font-serif text-2xl mb-1">Delete account</h2>
                        <p className="text-sm text-sand-600 mb-4">Enter your email and password to confirm. This cannot be undone.</p>
                        <input
                            className="field mb-3"
                            type="email"
                            placeholder="Your email"
                            value={deleteEmail}
                            onChange={(e) => { setDeleteEmail(e.target.value); setDeleteError('') }}
                        />
                        <input
                            className="field mb-3"
                            type="password"
                            placeholder="Your password"
                            value={deletePassword}
                            onChange={(e) => { setDeletePassword(e.target.value); setDeleteError('') }}
                        />
                        {deleteError && <p className="alert-error mb-3">{deleteError}</p>}
                        <div className="flex gap-2">
                            <button onClick={handleDeleteAccount} disabled={!deleteEmail || !deletePassword} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                                Yes, delete
                            </button>
                            <button onClick={() => { setShowDeleteConfirm(false); setDeleteEmail(''); setDeletePassword(''); setDeleteError('') }} className="btn-soft px-4 py-2.5 text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
