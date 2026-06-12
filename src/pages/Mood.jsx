import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../components/DashboardLayout'
import MoodCheckIn from '../components/MoodCheckIn'
import { MOODS } from '../components/moods'
import { getAccessToken } from '../authClient'

const moodMeta = (v) => MOODS.find((m) => m.v === v) || { label: '' }
const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

export default function Mood() {
    const [history, setHistory] = useState([])
    const [today, setToday] = useState(undefined) // undefined = loading, null = none
    const [selected, setSelected] = useState(null)
    const [checkIn, setCheckIn] = useState(false)

    const token = getAccessToken()
    const auth = { headers: { authorization: token } }

    const load = async () => {
        const [h, t] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/moods`, auth),
            axios.get(`${import.meta.env.VITE_API_URL}/moods/today`, auth),
        ])
        setHistory(h.data)
        setToday(t.data)
    }

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const chartData = history.map((m) => ({ ...m, dateLabel: fmtDate(m.entry_date) }))

    return (
        <DashboardLayout active="mood">
            {checkIn && (
                <MoodCheckIn
                    initial={today}
                    onComplete={() => { setCheckIn(false); load() }}
                    onClose={() => setCheckIn(false)}
                />
            )}

            <div className="flex items-start justify-between gap-4 mb-7">
                <div>
                    <h1 className="font-serif text-3xl mb-1">Mood</h1>
                    <p className="text-sand-600">A record of how you’ve been feeling.</p>
                </div>
                <button onClick={() => setCheckIn(true)} className="btn-primary w-auto px-5 shrink-0">
                    {today ? 'Update today' : 'Check in'}
                </button>
            </div>

            {today && (
                <div className="bg-sage-50 border border-sage-100 rounded-2xl p-5 mb-7">
                    <p className="text-sm text-sand-600">Today you’re feeling</p>
                    <p className="font-medium text-ink">{moodMeta(today.mood).label}</p>
                </div>
            )}

            {history.length === 0 ? (
                <p className="text-sand-400 py-12 text-center">No check-ins yet. Your mood history will appear here.</p>
            ) : (
                <>
                    <div className="bg-surface border border-sand-200 rounded-2xl p-4 pt-6 mb-4">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                                    onClick={(state) => {
                                        if (state && state.activePayload && state.activePayload.length) {
                                            setSelected(state.activePayload[0].payload)
                                        }
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e7ddcd" />
                                    <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: '#9a8b72' }} stroke="#e7ddcd" />
                                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#9a8b72' }} stroke="#e7ddcd" />
                                    <Tooltip
                                        contentStyle={{ background: '#fffdf8', border: '1px solid #e7ddcd', borderRadius: 12, fontSize: 12 }}
                                        formatter={(value) => [moodMeta(value).label, 'Mood']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="mood"
                                        stroke="#7f936a"
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: '#7f936a', cursor: 'pointer' }}
                                        activeDot={{ r: 6, cursor: 'pointer' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-sand-500 text-center mt-2">Tap a point to read that day’s note.</p>
                    </div>

                    {selected && (
                        <div className="bg-surface border border-sand-200 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-sand-700">
                                    {moodMeta(selected.mood).label}
                                </span>
                                <span className="text-xs text-sand-400">{fmtDate(selected.entry_date)}</span>
                            </div>
                            <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">
                                {selected.note || <span className="text-sand-400">No note for this day.</span>}
                            </p>
                        </div>
                    )}
                </>
            )}
        </DashboardLayout>
    )
}
