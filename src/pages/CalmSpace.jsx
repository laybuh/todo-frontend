import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'

// ── Box breathing: 4s inhale · 4s hold · 4s exhale · 4s hold ──
const PHASES = [
    { label: 'Breathe in', scale: 1.5 },
    { label: 'Hold', scale: 1.5 },
    { label: 'Breathe out', scale: 1 },
    { label: 'Hold', scale: 1 },
]

function BoxBreathing() {
    const [phase, setPhase] = useState(0)
    useEffect(() => {
        const id = setInterval(() => setPhase((p) => (p + 1) % PHASES.length), 4000)
        return () => clearInterval(id)
    }, [])
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-48 h-48 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: PHASES[phase].scale }}
                    transition={{ duration: 4, ease: 'easeInOut' }}
                    className="w-24 h-24 rounded-full bg-sage-300/60 border border-sage-400"
                />
                <span className="absolute text-sage-800 font-medium">{PHASES[phase].label}</span>
            </div>
            <p className="text-xs text-sand-500 mt-4">Follow the circle. In for four, hold, out for four, hold.</p>
        </div>
    )
}

// ── 5-4-3-2-1 grounding ──
const GROUNDING = [
    { n: 5, sense: 'see', prompt: 'Name five things you can see around you.' },
    { n: 4, sense: 'feel', prompt: 'Notice four things you can feel, like your feet, a texture, or the air.' },
    { n: 3, sense: 'hear', prompt: 'Listen for three things you can hear.' },
    { n: 2, sense: 'smell', prompt: 'Find two things you can smell.' },
    { n: 1, sense: 'taste', prompt: 'Notice one thing you can taste.' },
]

function Grounding() {
    const [step, setStep] = useState(0)
    const done = step >= GROUNDING.length
    return (
        <div className="bg-surface border border-sand-200 rounded-2xl p-6 text-center flex-1 flex flex-col justify-center">
            {done ? (
                <>
                    <p className="text-sand-700 mb-4 mt-2">You’re here, and you’re grounded. Take one more slow breath.</p>
                    <button onClick={() => setStep(0)} className="btn-soft px-5 py-2 text-sm">Start again</button>
                </>
            ) : (
                <>
                    <p className="text-5xl font-serif text-sage-600 mb-2">{GROUNDING[step].n}</p>
                    <p className="text-ink mb-5">{GROUNDING[step].prompt}</p>
                    <div className="flex items-center justify-center gap-2">
                        {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="btn-soft px-4 py-2 text-sm">Back</button>}
                        <button onClick={() => setStep((s) => s + 1)} className="btn-primary w-auto px-6 py-2 text-sm">
                            {step === GROUNDING.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                    <div className="flex justify-center gap-1.5 mt-5">
                        {GROUNDING.map((_, i) => (
                            <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-sage-500' : 'w-1.5 bg-sand-200'}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

// ── Vent: write whatever you need, never saved, never sent anywhere ──
function VentSpace() {
    // Lives only in memory. Nothing here is ever persisted or sent to a server,
    // and it disappears the moment this page unmounts.
    const [text, setText] = useState('')
    return (
        <div className="bg-surface border border-sand-200 rounded-2xl p-6">
            <textarea
                className="field min-h-[160px] resize-y"
                placeholder="Type whatever. Vent it out. No one will ever read this."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center justify-between gap-3 mt-3">
                <p className="text-xs text-sand-500 flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
                        <rect x="4" y="11" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    Never saved. The second you leave this page it is gone. Nothing is stored or sent anywhere.
                </p>
                {text && (
                    <button onClick={() => setText('')} className="btn-soft px-4 py-2 text-sm shrink-0">Clear it</button>
                )}
            </div>
        </div>
    )
}

export default function CalmSpace() {
    return (
        <DashboardLayout active="calm">
            <h1 className="font-serif text-3xl mb-1">Calm space</h1>
            <p className="text-sand-600 mb-7">
                A quiet place to slow down. Breathe with the circle, or ground yourself in the present. Take as long as you need.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <h2 className="font-serif text-xl mb-3">Breathe</h2>
                    <div className="bg-surface border border-sand-200 rounded-2xl flex-1 flex items-center justify-center">
                        <BoxBreathing />
                    </div>
                </div>
                <div className="flex flex-col">
                    <h2 className="font-serif text-xl mb-3">Ground yourself</h2>
                    <Grounding />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="font-serif text-xl mb-3">Vent</h2>
                <VentSpace />
            </div>

            <p className="text-sm text-sand-500 mt-8">
                If things feel like too much right now, the{' '}
                <Link to="/crisis" className="text-sage-700 hover:text-sage-900 font-medium">crisis support</Link>
                {' '}has real people you can reach any time.
            </p>
        </DashboardLayout>
    )
}
