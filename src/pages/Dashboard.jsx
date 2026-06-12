import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import OnboardingModal from '../components/OnboardingModal'
import MoodCheckIn from '../components/MoodCheckIn'
import { getAccessToken } from '../authClient'

const ENERGY = {
    low: { label: 'Low', badge: 'bg-sage-100 text-sage-700 border-sage-200' },
    medium: { label: 'Medium', badge: 'bg-sand-200 text-sand-700 border-sand-300' },
    high: { label: 'High', badge: 'bg-rose-100 text-rose-700 border-rose-200' },
}

function formatCountdown(targetMs, nowMs) {
    const diff = targetMs - nowMs
    if (diff <= 0) return 'now'
    const mins = Math.floor(diff / 60000)
    const days = Math.floor(mins / 1440)
    const hours = Math.floor((mins % 1440) / 60)
    const m = mins % 60
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${m}m`
    return `${m}m`
}

export default function Dashboard() {
    const [todos, setTodos] = useState([])
    const [title, setTitle] = useState('')
    const [energy, setEnergy] = useState('')
    const [showCapsule, setShowCapsule] = useState(false)
    const [unlockDate, setUnlockDate] = useState('')
    const [filter, setFilter] = useState('all')
    const [energyFilter, setEnergyFilter] = useState('all')
    const [username, setUsername] = useState('')
    const [now, setNow] = useState(Date.now())
    const [intention, setIntention] = useState(null)
    const [needsMood, setNeedsMood] = useState(false)
    const [showOnboarding, setShowOnboarding] = useState(localStorage.getItem('onboarded') === 'false')

    const token = getAccessToken()

    useEffect(() => {
        if (!token) return
        fetchTodos()
        loadIntention()
        loadMoodStatus()
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            setUsername(payload.username || 'there')
        } catch {
            setUsername('there')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadIntention = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/affirmations/today`, { headers: { authorization: token } })
            setIntention(res.data)
        } catch { /* non-critical */ }
    }

    const loadMoodStatus = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/moods/today`, { headers: { authorization: token } })
            if (!res.data) setNeedsMood(true)
        } catch { /* non-critical */ }
    }

    // Tick so countdowns stay live, and auto-reveal capsules as they unlock.
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 30000)
        return () => clearInterval(id)
    }, [])
    useEffect(() => {
        const justUnlocked = todos.some((t) => t.locked && t.unlock_date && new Date(t.unlock_date).getTime() <= now)
        if (justUnlocked) fetchTodos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [now])

    const fetchTodos = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/todos`, {
            headers: { authorization: token },
        })
        setTodos(res.data)
    }

    const addTodo = async (e) => {
        e.preventDefault()
        if (!title.trim()) return
        await axios.post(`${import.meta.env.VITE_API_URL}/todos`,
            { title, energy: energy || null, unlock_date: showCapsule && unlockDate ? unlockDate : null },
            { headers: { authorization: token } }
        )
        setTitle('')
        setEnergy('')
        setUnlockDate('')
        setShowCapsule(false)
        fetchTodos()
    }

    const deleteTodo = async (id) => {
        await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`, { headers: { authorization: token } })
        fetchTodos()
    }

    const toggleComplete = async (id, completed) => {
        await axios.put(`${import.meta.env.VITE_API_URL}/todos/${id}`, { completed: !completed }, { headers: { authorization: token } })
        fetchTodos()
    }


    const filtered = todos.filter((t) => {
        if (filter === 'active' && t.completed) return false
        if (filter === 'completed' && !t.completed) return false
        if (energyFilter !== 'all' && t.energy !== energyFilter) return false
        return true
    })

    const statusFilters = [
        { key: 'all', label: 'All' },
        { key: 'active', label: 'Active' },
        { key: 'completed', label: 'Completed' },
    ]

    // Minimum selectable capsule time = now (local), formatted for datetime-local.
    const minDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)

    return (
        <DashboardLayout active="today">
            {showOnboarding && <OnboardingModal onComplete={() => setShowOnboarding(false)} />}
            {!showOnboarding && needsMood && (
                <MoodCheckIn onComplete={() => setNeedsMood(false)} onClose={() => setNeedsMood(false)} />
            )}

            <h1 className="font-serif text-3xl mb-1">Hi, {username}.</h1>
            <p className="text-sand-600 mb-6">What would you like to get done today?</p>

            {intention ? (
                <div className="bg-sage-50 border border-sage-100 rounded-2xl p-5 mb-7">
                    <p className="text-xs uppercase tracking-wide text-sage-600 mb-1">Today’s affirmation</p>
                    <p className="font-serif text-xl text-ink">“{intention.text}”</p>
                </div>
            ) : (
                <Link to="/affirmations" className="block bg-surface border border-dashed border-sand-300 rounded-2xl p-4 mb-7 text-sm text-sand-600 hover:border-sand-400 transition-colors">
                    Set a daily intention. Add your first affirmation.
                </Link>
            )}

            <form onSubmit={addTodo} className="mb-5">
                <div className="flex gap-2">
                    <input
                        className="field"
                        type="text"
                        placeholder="Add a task…"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <button type="submit" className="btn-primary w-auto px-6">Add</button>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="text-xs text-sand-500 mr-1">Energy:</span>
                    {Object.entries(ENERGY).map(([lvl, cfg]) => (
                        <button
                            type="button"
                            key={lvl}
                            onClick={() => setEnergy(energy === lvl ? '' : lvl)}
                            className={`text-xs rounded-full px-3 py-1 border transition-colors ${
                                energy === lvl ? cfg.badge : 'border-sand-200 text-sand-500 hover:border-sand-400'
                            }`}
                        >
                            {cfg.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <button
                        type="button"
                        onClick={() => setShowCapsule((s) => !s)}
                        className={`text-xs rounded-full px-3 py-1 border transition-colors ${
                            showCapsule ? 'bg-ink text-cream border-ink' : 'border-sand-200 text-sand-500 hover:border-sand-400'
                        }`}
                    >
                        Time capsule
                    </button>
                    <span className="text-xs text-sand-400">Seal a task so it stays hidden until a date you choose.</span>

                    {showCapsule && (
                        <input
                            type="datetime-local"
                            value={unlockDate}
                            min={minDateTime}
                            onChange={(e) => setUnlockDate(e.target.value)}
                            className="text-xs rounded-lg border border-sand-200 bg-surface px-2 py-1 text-ink"
                        />
                    )}
                </div>
            </form>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                {statusFilters.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`text-sm rounded-full px-4 py-1.5 border transition-colors ${
                            filter === f.key ? 'bg-ink text-cream border-ink' : 'bg-transparent text-sand-600 border-sand-200 hover:border-sand-400'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
                <span className="w-px h-5 bg-sand-200 mx-1" />
                {['all', 'low', 'medium', 'high'].map((lvl) => (
                    <button
                        key={lvl}
                        onClick={() => setEnergyFilter(lvl)}
                        className={`text-xs rounded-full px-3 py-1.5 border transition-colors ${
                            energyFilter === lvl ? 'bg-sage-500 text-white border-sage-500' : 'bg-transparent text-sand-500 border-sand-200 hover:border-sand-400'
                        }`}
                    >
                        {lvl === 'all' ? 'Any energy' : ENERGY[lvl].label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex flex-col gap-2">
                {filtered.length === 0 && (
                    <p className="text-center text-sand-400 py-12">Nothing here yet. Add your first task above.</p>
                )}
                {filtered.map((todo) =>
                    todo.locked ? (
                        <div key={todo.id} className="flex items-center gap-3 bg-sand-100/60 border border-dashed border-sand-300 rounded-xl px-4 py-3">
                            <span className="flex-1 text-sm text-sand-600">
                                Sealed task. Unlocks in {formatCountdown(new Date(todo.unlock_date).getTime(), now)}
                                <span className="block text-xs text-sand-400">
                                    {new Date(todo.unlock_date).toLocaleString()}
                                </span>
                            </span>
                            <button onClick={() => deleteTodo(todo.id)} className="text-sand-400 hover:text-rose-500 transition-colors text-sm shrink-0" aria-label="Delete task">✕</button>
                        </div>
                    ) : (
                        <div key={todo.id} className="flex items-center gap-3 bg-surface border border-sand-200 rounded-xl px-4 py-3 hover:border-sand-300 transition-colors">
                            <input
                                type="checkbox"
                                checked={!!todo.completed}
                                onChange={() => toggleComplete(todo.id, todo.completed)}
                                className="w-4 h-4 accent-sage-500 cursor-pointer shrink-0"
                            />
                            <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-sand-400' : 'text-ink'}`}>
                                {todo.title}
                            </span>
                            {todo.energy && ENERGY[todo.energy] && (
                                <span className={`text-[10px] rounded-full px-2 py-0.5 border ${ENERGY[todo.energy].badge} shrink-0`}>
                                    {ENERGY[todo.energy].label}
                                </span>
                            )}
                            <button onClick={() => deleteTodo(todo.id)} className="text-sand-400 hover:text-rose-500 transition-colors text-sm shrink-0" aria-label="Delete task">✕</button>
                        </div>
                    )
                )}
            </div>

        </DashboardLayout>
    )
}
