import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { setAccessToken } from '../authClient'

const LENGTH = 6

export default function VerifyOTP() {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email

    const [digits, setDigits] = useState(Array(LENGTH).fill(''))
    const [error, setError] = useState('')
    const [verifying, setVerifying] = useState(false)
    const [cooldown, setCooldown] = useState(0)
    const [resendMsg, setResendMsg] = useState('')
    const inputs = useRef([])

    useEffect(() => {
        if (!email) { navigate('/login'); return }
        inputs.current[0]?.focus()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Resend cooldown ticker.
    useEffect(() => {
        if (cooldown <= 0) return
        const id = setInterval(() => setCooldown((c) => c - 1), 1000)
        return () => clearInterval(id)
    }, [cooldown])

    const code = digits.join('')

    // Auto-submit once all six are filled.
    useEffect(() => {
        if (code.length === LENGTH && !verifying) submit(code)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code])

    const setDigit = (i, val) => {
        const clean = val.replace(/\D/g, '')
        if (!clean) {
            setDigits((d) => { const n = [...d]; n[i] = ''; return n })
            return
        }
        setDigits((d) => {
            const n = [...d]
            n[i] = clean[clean.length - 1]
            return n
        })
        if (i < LENGTH - 1) inputs.current[i + 1]?.focus()
    }

    const onKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus()
    }

    const onPaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH)
        if (!pasted) return
        e.preventDefault()
        const next = Array(LENGTH).fill('')
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
        setDigits(next)
        inputs.current[Math.min(pasted.length, LENGTH - 1)]?.focus()
    }

    const submit = async (value) => {
        setVerifying(true)
        setError('')
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, { email, code: value })
            setAccessToken(res.data.token)
            localStorage.setItem('onboarded', res.data.onboarded ? 'true' : 'false')
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid code.')
            setDigits(Array(LENGTH).fill(''))
            inputs.current[0]?.focus()
        } finally {
            setVerifying(false)
        }
    }

    const resend = async () => {
        if (cooldown > 0) return
        setResendMsg('')
        setError('')
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-otp`, { email })
            setResendMsg('A new code is on its way.')
            setCooldown(60)
        } catch (err) {
            if (err.response?.status === 429) setCooldown(60)
            setError(err.response?.data?.error || 'Could not resend the code.')
        }
    }

    return (
        <AuthLayout
            title="Check your email."
            subtitle={`We sent a 6-digit code to ${email || 'your email'}. Enter it below to finish signing in.`}
        >
            {error && <p className="alert-error mb-3">{error}</p>}
            {resendMsg && <p className="alert-success mb-3">{resendMsg}</p>}

            <div className="flex justify-between gap-2 mb-5" onPaste={onPaste}>
                {digits.map((d, i) => (
                    <input
                        key={i}
                        ref={(el) => (inputs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => setDigit(i, e.target.value)}
                        onKeyDown={(e) => onKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-medium bg-cream/50 border border-sand-200 rounded-xl text-ink outline-none focus:border-sage-400 focus:bg-surface transition-colors"
                    />
                ))}
            </div>

            <button onClick={() => submit(code)} disabled={code.length !== LENGTH || verifying} className="btn-primary">
                {verifying ? 'Verifying…' : 'Verify & sign in'}
            </button>

            <p className="mt-4 text-center text-sm text-sand-600">
                Didn’t get it?{' '}
                <button
                    onClick={resend}
                    disabled={cooldown > 0}
                    className="text-sage-700 hover:text-sage-900 font-medium disabled:text-sand-400 disabled:cursor-not-allowed"
                >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </button>
            </p>
        </AuthLayout>
    )
}
