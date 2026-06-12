import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getAccessToken } from '../authClient'

export default function Focus() {
    const navigate = useNavigate()
    const [todos, setTodos] = useState([])
    const [current, setCurrent] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const token = getAccessToken()

    useEffect(() => {
        if (!token) { navigate('/login'); return }
        axios.get(`${import.meta.env.VITE_API_URL}/todos`, { headers: { authorization: token } })
            .then((res) => setTodos(res.data))
            .finally(() => setLoaded(true))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Candidates: active tasks that aren't sealed time-capsules.
    const candidates = todos.filter((t) => !t.completed && !t.locked)

    const pickRandom = (pool, excludeId) => {
        const choices = pool.filter((t) => t.id !== excludeId)
        if (choices.length === 0) return null
        return choices[Math.floor(Math.random() * choices.length)]
    }

    const markDone = async () => {
        if (!current) return
        await axios.put(`${import.meta.env.VITE_API_URL}/todos/${current.id}`, { completed: true }, { headers: { authorization: token } })
        const updated = todos.map((t) => (t.id === current.id ? { ...t, completed: true } : t))
        setTodos(updated)
        setCurrent(pickRandom(updated.filter((t) => !t.completed && !t.locked)))
    }

    const skip = () => {
        const next = pickRandom(candidates, current?.id)
        setCurrent(next || current) // if it's the only one, stay on it
    }

    const exitBtn = (
        <button
            onClick={() => navigate('/dashboard')}
            className="absolute top-5 right-6 text-sand-400 hover:text-ink transition-colors text-sm"
        >
            Exit ✕
        </button>
    )

    return (
        <div className="min-h-screen bg-cream text-ink font-sans flex items-center justify-center p-6 relative">
            {exitBtn}

            <div className="w-full max-w-xl text-center">
                {!current ? (
                    // ── Choose screen ──
                    <div>
                        <p className="text-sage-600 font-medium tracking-wide uppercase text-xs mb-3">Focus</p>
                        <h1 className="font-serif text-4xl mb-3">One thing at a time.</h1>

                        {!loaded ? (
                            <p className="text-sand-500">Loading…</p>
                        ) : candidates.length === 0 ? (
                            <div>
                                <p className="text-sand-600 mb-6">Nothing to focus on right now. Your active list is clear.</p>
                                <Link to="/dashboard" className="btn-primary w-auto inline-flex px-6">Back to today</Link>
                            </div>
                        ) : (
                            <>
                                <p className="text-sand-600 mb-7">Pick one task to give your full attention. Or let lunev choose for you.</p>
                                <button
                                    onClick={() => setCurrent(pickRandom(candidates))}
                                    className="btn-primary w-auto inline-flex px-7 mb-7"
                                >
                                    Pick one for me
                                </button>
                                <div className="flex flex-col gap-2 text-left">
                                    {candidates.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setCurrent(t)}
                                            className="bg-surface border border-sand-200 hover:border-sage-400 rounded-xl px-4 py-3 text-sm text-ink transition-colors"
                                        >
                                            {t.title}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    // ── Focus screen ──
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current.id}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="text-sage-600 font-medium tracking-wide uppercase text-xs mb-6">Right now, just this.</p>
                            <h1 className="font-serif text-4xl md:text-5xl leading-snug mb-12">{current.title}</h1>
                            <div className="flex gap-3 justify-center">
                                <button onClick={markDone} className="btn-primary w-auto px-8">Mark done</button>
                                <button onClick={skip} className="btn-soft px-8">Skip</button>
                            </div>
                            <button
                                onClick={() => setCurrent(null)}
                                className="block mx-auto mt-8 text-xs text-sand-500 hover:text-ink transition-colors"
                            >
                                Choose a different one
                            </button>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}
