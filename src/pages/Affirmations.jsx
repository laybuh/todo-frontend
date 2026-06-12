import { useState, useEffect } from 'react'
import axios from 'axios'
import DashboardLayout from '../components/DashboardLayout'
import { getAccessToken } from '../authClient'

const api = (p) => `${import.meta.env.VITE_API_URL}${p}`

export default function Affirmations() {
    const [items, setItems] = useState([])
    const [text, setText] = useState('')
    const [error, setError] = useState('')

    const token = getAccessToken()
    const auth = { headers: { authorization: token } }

    const load = async () => {
        const r = await axios.get(api('/affirmations'), auth)
        setItems(r.data)
    }
    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const add = async (e) => {
        e.preventDefault()
        if (!text.trim()) return
        try {
            await axios.post(api('/affirmations'), { text }, auth)
            setText('')
            setError('')
            load()
        } catch (err) {
            setError(err.response?.data?.error || 'Could not add that.')
        }
    }

    const setArchived = async (id, archived) => {
        await axios.put(api(`/affirmations/${id}/archive`), { archived }, auth)
        load()
    }
    const remove = async (id) => {
        await axios.delete(api(`/affirmations/${id}`), auth)
        load()
    }

    const active = items.filter((a) => !a.archived)
    const archived = items.filter((a) => a.archived)

    return (
        <DashboardLayout active="affirmations">
            <h1 className="font-serif text-3xl mb-1">Intentions</h1>
            <p className="text-sand-600 mb-7">
                Words to come back to. One appears on your dashboard each day as today’s intention. All private and encrypted.
            </p>

            <form onSubmit={add} className="mb-8">
                <div className="flex gap-2">
                    <input
                        className="field"
                        placeholder="Write an affirmation… e.g. “I am allowed to rest.”"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={500}
                    />
                    <button type="submit" className="btn-primary w-auto px-6">Add</button>
                </div>
                {error && <p className="alert-error mt-2">{error}</p>}
            </form>

            {active.length === 0 && archived.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-sand-600">You haven’t written any intentions yet.</p>
                    <p className="text-sand-500 text-sm">Add your first one above. Something kind you’d like to remember.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {active.map((a) => (
                        <div key={a.id} className="bg-surface border border-sand-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                            <p className="flex-1 font-serif text-lg text-ink">“{a.text}”</p>
                            <button onClick={() => setArchived(a.id, true)} className="text-xs text-sand-500 hover:text-ink shrink-0">Archive</button>
                            <button onClick={() => remove(a.id)} className="text-xs text-sand-500 hover:text-rose-600 shrink-0">Delete</button>
                        </div>
                    ))}

                    {archived.length > 0 && (
                        <>
                            <p className="text-xs uppercase tracking-wide text-sand-400 mt-6 mb-1">Archived</p>
                            {archived.map((a) => (
                                <div key={a.id} className="bg-sand-100/50 border border-sand-200 rounded-2xl px-5 py-3 flex items-center gap-3">
                                    <p className="flex-1 text-sand-500">“{a.text}”</p>
                                    <button onClick={() => setArchived(a.id, false)} className="text-xs text-sage-700 hover:text-sage-900 shrink-0">Restore</button>
                                    <button onClick={() => remove(a.id)} className="text-xs text-sand-500 hover:text-rose-600 shrink-0">Delete</button>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </DashboardLayout>
    )
}
