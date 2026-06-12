import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getAccessToken } from '../authClient'

// First-login walkthrough. Explains what lunev is and, in plain language, how the
// encryption keeps a user's data private, before they start using it.
const STEPS = [
    {
        title: 'Welcome to lunev.',
        body: 'This is your safe space for tasks, journaling, moods, and daily intentions. Somewhere calm to look after both your to-do list and your mind.',
    },
    {
        title: 'Your words are encrypted.',
        body: 'Everything you write is scrambled with strong encryption (AES-256) before it is saved. What lives in our database is unreadable code, not your private thoughts.',
    },
    {
        title: 'A leak would just be noise.',
        body: 'The key that unscrambles your data is never kept next to it in our database. If our database were ever leaked, what spilled out would just be unreadable code. We do not read your entries, and we will never sell or share them.',
    },
    {
        title: 'Start whenever you are ready.',
        body: 'Add a task, write a thought, or just look around. Your space is yours, and it is private from the very first word.',
    },
]

export default function OnboardingModal({ onComplete }) {
    const [step, setStep] = useState(0)
    const [closing, setClosing] = useState(false)
    const isLast = step === STEPS.length - 1
    const current = STEPS[step]

    const finish = async () => {
        setClosing(true)
        const token = getAccessToken()
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/onboarded`, {}, {
                headers: { authorization: token },
            })
        } catch {
            // Non-blocking: even if this fails, don't trap the user in the modal.
        }
        localStorage.setItem('onboarded', 'true')
        onComplete()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: closing ? 0 : 1, scale: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-md bg-surface border border-sand-200 rounded-2xl p-8 shadow-xl"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 className="font-serif text-2xl mb-2">{current.title}</h2>
                        <p className="text-sand-700 leading-relaxed">{current.body}</p>
                        {step === 2 && (
                            <Link to="/proof-of-privacy" className="inline-block mt-3 text-sm text-sage-700 hover:text-sage-900 underline decoration-sand-300">
                                Watch it happen
                            </Link>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Progress dots */}
                <div className="flex gap-1.5 mt-7 mb-5">
                    {STEPS.map((_, i) => (
                        <span
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-sage-500' : 'w-1.5 bg-sand-200'}`}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        onClick={finish}
                        className="text-sm text-sand-500 hover:text-ink transition-colors"
                    >
                        Skip
                    </button>
                    <div className="flex gap-2">
                        {step > 0 && (
                            <button onClick={() => setStep((s) => s - 1)} className="btn-soft px-4 py-2 text-sm">
                                Back
                            </button>
                        )}
                        {isLast ? (
                            <button onClick={finish} className="btn-primary w-auto px-5 py-2 text-sm">
                                Got it, let’s begin
                            </button>
                        ) : (
                            <button onClick={() => setStep((s) => s + 1)} className="btn-primary w-auto px-5 py-2 text-sm">
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
