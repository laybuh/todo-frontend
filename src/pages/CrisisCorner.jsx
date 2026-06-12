import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
        <div className="bg-surface border border-sand-200 rounded-2xl p-6 text-center">
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

// ── Real crisis resources (US) ──
const HOTLINES = [
    { name: '988 Suicide & Crisis Lifeline', desc: 'Call or text, 24/7', action: 'Call or text 988', href: 'tel:988' },
    { name: 'Crisis Text Line', desc: 'Text HOME to 741741', action: 'Text now', href: 'sms:741741?&body=HOME' },
    { name: 'Trans Lifeline', desc: 'Peer support · 877-565-8860', action: 'Call', href: 'tel:18775658860' },
    { name: 'The Trevor Project', desc: 'LGBTQ+ youth · 1-866-488-7386', action: 'Call', href: 'tel:18664887386' },
    { name: 'NAMI HelpLine', desc: 'Mon to Fri, 1-800-950-6264', action: 'Call', href: 'tel:18009506264' },
]

export default function CrisisCorner() {
    return (
        <DashboardLayout active="crisis">
            <h1 className="font-serif text-3xl mb-1">Crisis corner</h1>
            <p className="text-sand-600 mb-7">
                If things feel like too much right now, you’re not alone. Take a breath here, or reach a real person any time.
            </p>

            {/* Hotlines first — most important if someone's in crisis */}
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 mb-8">
                <h2 className="font-serif text-xl mb-1">Talk to someone now</h2>
                <p className="text-sm text-sand-600 mb-4">Free, confidential, and available when you need it.</p>
                <div className="flex flex-col gap-2">
                    {HOTLINES.map((h) => (
                        <a
                            key={h.name}
                            href={h.href}
                            className="flex items-center justify-between gap-3 bg-surface border border-sand-200 rounded-xl px-4 py-3 hover:border-rose-300 transition-colors"
                        >
                            <span>
                                <span className="block text-sm font-medium text-ink">{h.name}</span>
                                <span className="block text-xs text-sand-500">{h.desc}</span>
                            </span>
                            <span className="text-sm font-medium text-rose-600 shrink-0">{h.action}</span>
                        </a>
                    ))}
                </div>
                <p className="text-xs text-sand-500 mt-4">
                    If you’re in immediate danger, please call your local emergency number (911 in the US).
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h2 className="font-serif text-xl mb-3">Breathe</h2>
                    <div className="bg-surface border border-sand-200 rounded-2xl">
                        <BoxBreathing />
                    </div>
                </div>
                <div>
                    <h2 className="font-serif text-xl mb-3">Ground yourself</h2>
                    <Grounding />
                </div>
            </div>
        </DashboardLayout>
    )
}
