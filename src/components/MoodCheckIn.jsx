import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAccessToken } from '../authClient'
import { MOODS } from './moods'

const moodLabel = (v) => MOODS.find((m) => m.v === v)?.label || ''

// Daily mood check-in. Used both as an auto-prompt on the dashboard and on the
// mood page. After saving, gently points toward journaling (low) or gratitude (high).
export default function MoodCheckIn({ initial, onComplete, onClose }) {
    const [mood, setMood] = useState(initial?.mood || 0)
    const [note, setNote] = useState(initial?.note || '')
    const [saved, setSaved] = useState(false)
    const [savedMood, setSavedMood] = useState(0)
    const [saving, setSaving] = useState(false)
    const token = getAccessToken()

    const save = async () => {
        if (!mood) return
        setSaving(true)
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/moods`, { mood, note }, { headers: { authorization: token } })
            setSavedMood(mood)
            setSaved(true)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md bg-surface border border-sand-200 rounded-2xl p-8 shadow-xl"
            >
                {saved ? (
                    <div className="text-center">
                        <p className="font-serif text-2xl mb-2">Thanks for checking in.</p>
                        <p className="text-sand-600 mb-5">You marked today as {moodLabel(savedMood).toLowerCase()}.</p>
                        {savedMood <= 2 && (
                            <p className="text-sand-700 mb-5">
                                I'm very sorry to hear. Writing it down can help. Want to{' '}
                                <Link to="/journal" className="text-sage-700 underline decoration-sand-300" onClick={onComplete}>open your journal</Link>?
                            </p>
                        )}
                        {savedMood >= 4 && (
                            <p className="text-sand-700 mb-5">
                                I love that for you. Want to write a{' '}
                                <Link to="/journal" className="text-sage-700 underline decoration-sand-300" onClick={onComplete}>gratitude entry</Link>?
                            </p>
                        )}
                        {savedMood === 3 && <p className="text-sand-700 mb-5">Noted. Be gentle with yourself today.</p>}
                        <button onClick={onComplete} className="btn-primary w-auto px-7">Done</button>
                    </div>
                ) : (
                    <>
                        <h2 className="font-serif text-2xl mb-1">How are you feeling?</h2>
                        <p className="text-sm text-sand-600 mb-5">A private daily check-in.</p>

                        <div className="flex justify-between gap-2 mb-5">
                            {MOODS.map((m) => (
                                <button
                                    key={m.v}
                                    onClick={() => setMood(m.v)}
                                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-colors ${
                                        mood === m.v ? 'bg-sage-100 border-sage-400' : 'border-sand-200 hover:border-sand-400'
                                    }`}
                                >
                                    <span className="font-serif text-xl text-ink">{m.v}</span>
                                    <span className="text-[10px] text-sand-600 text-center leading-tight">{m.label}</span>
                                </button>
                            ))}
                        </div>

                        <textarea
                            className="field min-h-[80px] resize-y mb-4"
                            placeholder="Anything you want to add? Optional."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />

                        <div className="flex gap-2">
                            <button onClick={save} disabled={!mood || saving} className="btn-primary px-6">
                                {saving ? 'Saving…' : 'Save check-in'}
                            </button>
                            {onClose && <button onClick={onClose} className="btn-soft px-5">Later</button>}
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    )
}
