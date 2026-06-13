import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
import { getAccessToken } from '../authClient'

const API = import.meta.env.VITE_API_URL
const PRESETS = [5, 15, 25, 50]
const MIN_MINUTES = 1
const MAX_MINUTES = 180

export default function Focus() {
    const navigate = useNavigate()
    const [todos, setTodos] = useState([])
    const [loaded, setLoaded] = useState(false)
    const token = getAccessToken()

    // stage: 'intro' → 'setup' → 'focus'
    const [stage, setStage] = useState('intro')
    const [minutes, setMinutes] = useState(25)
    const [current, setCurrent] = useState(null)

    // Inline add-a-task.
    const [newTitle, setNewTitle] = useState('')
    const [adding, setAdding] = useState(false)

    // Countdown state.
    const [secondsLeft, setSecondsLeft] = useState(0)
    const [running, setRunning] = useState(false)
    const [timeUp, setTimeUp] = useState(false)

    useEffect(() => {
        if (!token) { navigate('/login'); return }
        axios.get(`${API}/todos`, { headers: { authorization: token } })
            .then((res) => setTodos(res.data))
            .finally(() => setLoaded(true))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Tick down once per second while running.
    useEffect(() => {
        if (!running) return
        const id = setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) {
                    clearInterval(id)
                    setRunning(false)
                    setTimeUp(true)
                    chime()
                    return 0
                }
                return s - 1
            })
        }, 1000)
        return () => clearInterval(id)
    }, [running])

    // Candidates: active tasks that aren't sealed time-capsules.
    const candidates = todos.filter((t) => !t.completed && !t.locked)

    const pickRandom = (pool, excludeId) => {
        const choices = pool.filter((t) => t.id !== excludeId)
        if (choices.length === 0) return null
        return choices[Math.floor(Math.random() * choices.length)]
    }

    const addTask = async (e) => {
        e.preventDefault()
        const title = newTitle.trim()
        if (!title || adding) return
        setAdding(true)
        try {
            await axios.post(`${API}/todos`, { title }, { headers: { authorization: token } })
            setNewTitle('')
            const res = await axios.get(`${API}/todos`, { headers: { authorization: token } })
            setTodos(res.data)
        } finally {
            setAdding(false)
        }
    }

    const beginFocus = (task) => {
        if (!task) return
        setCurrent(task)
        setSecondsLeft(minutes * 60)
        setTimeUp(false)
        setRunning(true)
        setStage('focus')
    }

    // Finished the whole task.
    const markDone = async () => {
        if (!current) return
        await axios.put(`${API}/todos/${current.id}`, { completed: true }, { headers: { authorization: token } })
        setTodos((prev) => prev.map((t) => (t.id === current.id ? { ...t, completed: true } : t)))
        backToSetup()
    }

    // Did part of it — leave the task active and step back to choose what's next.
    const stepAway = () => backToSetup()

    const addMinutes = (extra) => {
        setSecondsLeft((s) => s + extra * 60)
        setTimeUp(false)
        setRunning(true)
    }

    const backToSetup = () => {
        setRunning(false)
        setTimeUp(false)
        setCurrent(null)
        setStage('setup')
    }

    const mmss = (total) => {
        const m = Math.floor(total / 60)
        const s = total % 60
        return `${m}:${String(s).padStart(2, '0')}`
    }

    const exitBtn = (
        <button
            onClick={() => navigate('/dashboard')}
            aria-label="Exit focus"
            className="absolute top-4 right-4 sm:top-5 sm:right-6 z-50 inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-surface/95 px-4 py-2 text-sm font-medium text-ink shadow-sm hover:bg-sand-100 hover:border-sand-400 transition-colors"
        >
            Exit
            <span aria-hidden className="text-sand-500">✕</span>
        </button>
    )

    // Reusable inline add-a-task form. Defined as a plain function (not a nested
    // component) so the input keeps focus across re-renders while typing.
    const renderAddTask = (placeholder) => (
        <form onSubmit={addTask} className="flex gap-2">
            <input
                className="field"
                placeholder={placeholder}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={200}
            />
            <button type="submit" disabled={!newTitle.trim() || adding} className="btn-primary w-auto px-6 disabled:opacity-50">
                {adding ? 'Adding…' : 'Add'}
            </button>
        </form>
    )

    // Intro renders inside the normal app shell (with nav). Only after "Get started"
    // does Focus take over the full screen.
    if (stage === 'intro') {
        return (
            <DashboardLayout active="focus">
                <div className="max-w-xl">
                    <p className="text-sage-600 font-medium tracking-wide uppercase text-xs mb-3">Focus</p>
                    <h1 className="font-serif text-3xl md:text-4xl mb-2">One thing at a time.</h1>
                    <p className="text-sand-600 mb-6">Focus gives one task your full attention on a timer.</p>
                    <div className="bg-surface border border-sand-200 rounded-2xl p-6 text-sand-700 mb-7 leading-relaxed">
                        <ol className="list-decimal list-inside space-y-1.5 text-sm">
                            <li>Pick a task, or add a new one right here.</li>
                            <li>Set how many minutes you want to give it.</li>
                            <li>The screen clears down to just that task and a countdown.</li>
                            <li>Finish it, or do a little and step away. Whatever you have in you today.</li>
                        </ol>
                    </div>
                    <button onClick={() => setStage('setup')} className="btn-primary w-auto inline-flex px-8">Get started</button>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <div className="min-h-screen bg-cream text-ink font-sans flex items-center justify-center p-6 relative">
            {exitBtn}

            <div className="w-full max-w-xl text-center">
                {/* ── Setup: choose a task and a duration ── */}
                {stage === 'setup' && (
                    <div>
                        <p className="text-sage-600 font-medium tracking-wide uppercase text-xs mb-3">Focus</p>
                        <h1 className="font-serif text-4xl mb-6">What are you giving your attention to?</h1>

                        {!loaded ? (
                            <p className="text-sand-500">Loading…</p>
                        ) : (
                            <>
                                {/* Duration picker */}
                                <div className="bg-surface border border-sand-200 rounded-2xl p-5 mb-6">
                                    <p className="text-sm text-sand-600 mb-3">How long?</p>
                                    <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                                        {PRESETS.map((m) => (
                                            <button
                                                key={m}
                                                onClick={() => setMinutes(m)}
                                                className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                                                    minutes === m
                                                        ? 'bg-sage-100 border-sage-400 text-sage-800 font-medium'
                                                        : 'bg-cream border-sand-200 text-sand-600 hover:border-sage-300'
                                                }`}
                                            >
                                                {m} min
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <span className="text-sand-500">Or set your own:</span>
                                        <input
                                            type="number"
                                            min={MIN_MINUTES}
                                            max={MAX_MINUTES}
                                            value={minutes}
                                            onChange={(e) => {
                                                const v = parseInt(e.target.value, 10)
                                                if (Number.isNaN(v)) { setMinutes(''); return }
                                                setMinutes(Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, v)))
                                            }}
                                            className="w-20 text-center bg-surface border border-sand-300 rounded-xl py-1.5 text-ink outline-none focus:border-sage-400"
                                        />
                                        <span className="text-sand-500">min</span>
                                    </div>
                                </div>

                                {candidates.length > 0 ? (
                                    <>
                                        <p className="text-sand-600 mb-4">Pick one task to focus on, or let lunev choose.</p>
                                        <button
                                            onClick={() => beginFocus(pickRandom(candidates))}
                                            disabled={!minutes}
                                            className="btn-primary w-auto inline-flex px-7 mb-6 disabled:opacity-50"
                                        >
                                            Pick one for me
                                        </button>
                                        <div className="flex flex-col gap-2 text-left mb-7">
                                            {candidates.map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => beginFocus(t)}
                                                    disabled={!minutes}
                                                    className="bg-surface border border-sand-200 hover:border-sage-400 rounded-xl px-4 py-3 text-sm text-ink transition-colors disabled:opacity-50"
                                                >
                                                    {t.title}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs uppercase tracking-wide text-sand-400 mb-2">Add another task</p>
                                            {renderAddTask('Something else on your mind…')}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-left">
                                        <p className="text-sand-600 mb-1 text-center">Your list is clear right now.</p>
                                        <p className="text-sand-500 text-sm mb-4 text-center">Add something you’d like to focus on and start whenever you’re ready.</p>
                                        {renderAddTask('What would you like to work on?')}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* ── Focus: the timed task ── */}
                {stage === 'focus' && current && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current.id + (timeUp ? '-up' : '')}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                        >
                            {!timeUp ? (
                                <>
                                    <p className="text-sage-600 font-medium tracking-wide uppercase text-xs mb-5">Right now, just this.</p>
                                    <h1 className="font-serif text-3xl md:text-4xl leading-snug mb-8">{current.title}</h1>
                                    <p className="font-serif text-6xl md:text-7xl tabular-nums text-sage-700 mb-3">{mmss(secondsLeft)}</p>
                                    <button
                                        onClick={() => setRunning((r) => !r)}
                                        className="text-xs text-sand-500 hover:text-ink transition-colors mb-10"
                                    >
                                        {running ? 'Pause' : 'Resume'}
                                    </button>
                                    <div className="flex gap-3 justify-center">
                                        <button onClick={markDone} className="btn-primary w-auto px-8">Mark done</button>
                                        <button onClick={stepAway} className="btn-soft px-8">Done for now</button>
                                    </div>
                                    <p className="text-xs text-sand-500 mt-5">“Done for now” keeps the task on your list for later.</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sage-600 font-medium tracking-wide uppercase text-xs mb-5">Time’s up.</p>
                                    <h1 className="font-serif text-3xl md:text-4xl leading-snug mb-3">{current.title}</h1>
                                    <p className="text-sand-600 mb-9">Nice work giving that your attention. What next?</p>
                                    <div className="flex flex-col items-center gap-3">
                                        <button onClick={markDone} className="btn-primary w-auto px-8">Mark done</button>
                                        <div className="flex gap-3 justify-center">
                                            <button onClick={() => addMinutes(5)} className="btn-soft px-6">Keep going +5</button>
                                            <button onClick={stepAway} className="btn-soft px-6">Done for now</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}

// A soft two-note chime via the Web Audio API, so there's no audio file to ship.
// Best-effort: if the browser blocks it, the visual "Time's up" still shows.
function chime() {
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext
        if (!Ctx) return
        const ctx = new Ctx()
        const play = (freq, start, dur) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.value = freq
            osc.connect(gain)
            gain.connect(ctx.destination)
            const t = ctx.currentTime + start
            gain.gain.setValueAtTime(0, t)
            gain.gain.linearRampToValueAtTime(0.18, t + 0.05)
            gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
            osc.start(t)
            osc.stop(t + dur)
        }
        play(528, 0, 0.6)
        play(660, 0.25, 0.7)
        setTimeout(() => ctx.close(), 1500)
    } catch {
        // ignore — audio is a nicety, not required
    }
}
