import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import DashboardLayout from '../components/DashboardLayout'
import { getAccessToken } from '../authClient'

const BUILTIN_TYPES = [
    { key: 'brain_dump', label: 'Brain dump', prompt: 'Let it all out. Say words.' },
    { key: 'gratitude', label: 'Gratitude', prompt: 'What are you grateful for today?' },
    { key: 'letter_future', label: 'Letter to future self', prompt: 'Write to the you in the future.' },
    { key: 'on_my_mind', label: 'What’s on your mind?', prompt: 'What’s taking up space in your head right now?' },
]

const api = (path) => `${import.meta.env.VITE_API_URL}${path}`

export default function Journal() {
    const [types, setTypes] = useState([])       // custom types
    const [entries, setEntries] = useState([])
    const [selected, setSelected] = useState(BUILTIN_TYPES[0])
    const [content, setContent] = useState('')
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    const [showNewType, setShowNewType] = useState(false)
    const [newTypeName, setNewTypeName] = useState('')

    const [expandedId, setExpandedId] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [editContent, setEditContent] = useState('')

    // "Read more" should only appear when an entry is actually clipped. Measure
    // each entry's collapsed height against its full content after render (and on
    // resize, since wrapping changes the line count). An expanded entry stays in
    // the set so its "Show less" button persists.
    const contentRefs = useRef({})
    const [overflowing, setOverflowing] = useState(() => new Set())

    useEffect(() => {
        const measure = () => {
            const next = new Set()
            for (const entry of entries) {
                if (expandedId === entry.id) { next.add(entry.id); continue }
                const el = contentRefs.current[entry.id]
                if (el && el.scrollHeight > el.clientHeight + 1) next.add(entry.id)
            }
            setOverflowing(next)
        }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [entries, expandedId])

    const token = getAccessToken()
    const auth = { headers: { authorization: token } }

    useEffect(() => {
        loadTypes()
        loadEntries()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadTypes = async () => {
        const r = await axios.get(api('/journal/types'), auth)
        setTypes(r.data)
    }
    const loadEntries = async () => {
        const r = await axios.get(api('/journal'), auth)
        setEntries(r.data)
    }

    const isCustom = (t) => t && t.id !== undefined

    const save = async (e) => {
        e.preventDefault()
        if (!content.trim()) return
        setSaving(true)
        setError('')
        try {
            const body = isCustom(selected)
                ? { custom_type_id: selected.id, content }
                : { type: selected.key, content }
            await axios.post(api('/journal'), body, auth)
            setContent('')
            loadEntries()
        } catch (err) {
            setError(err.response?.data?.error || 'Could not save your entry.')
        } finally {
            setSaving(false)
        }
    }

    const createType = async (e) => {
        e.preventDefault()
        if (!newTypeName.trim()) return
        try {
            const r = await axios.post(api('/journal/types'), { name: newTypeName }, auth)
            setTypes((prev) => [...prev, r.data])
            setSelected(r.data)
            setNewTypeName('')
            setShowNewType(false)
        } catch {
            setError('Could not create that type.')
        }
    }

    const deleteType = async (id) => {
        await axios.delete(api(`/journal/types/${id}`), auth)
        setTypes((prev) => prev.filter((t) => t.id !== id))
        if (isCustom(selected) && selected.id === id) setSelected(BUILTIN_TYPES[0])
        loadEntries()
    }

    const saveEdit = async (id) => {
        if (!editContent.trim()) return
        await axios.put(api(`/journal/${id}`), { content: editContent }, auth)
        setEditingId(null)
        setEditContent('')
        loadEntries()
    }

    const deleteEntry = async (id) => {
        await axios.delete(api(`/journal/${id}`), auth)
        loadEntries()
    }

    const entryLabel = (entry) => {
        if (entry.type === 'custom') return entry.custom_type_name || 'Custom'
        const b = BUILTIN_TYPES.find((t) => t.key === entry.type)
        return b ? b.label : 'Entry'
    }

    const prompt = isCustom(selected) ? 'Write freely.' : selected.prompt

    return (
        <DashboardLayout active="journal">
            <h1 className="font-serif text-3xl mb-1">Journal</h1>
            <p className="text-sand-600 mb-7">Write whatever you need to.</p>

            {/* Type picker */}
            <div className="flex flex-wrap gap-2 mb-3">
                {BUILTIN_TYPES.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setSelected(t)}
                        className={`text-sm rounded-full px-3.5 py-1.5 border transition-colors ${
                            !isCustom(selected) && selected.key === t.key
                                ? 'bg-sage-500 text-white border-sage-500'
                                : 'bg-surface border-sand-200 text-sand-700 hover:border-sand-400'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
                {types.map((t) => (
                    <span key={t.id} className="inline-flex items-center">
                        <button
                            onClick={() => setSelected(t)}
                            className={`text-sm rounded-full px-3.5 py-1.5 border transition-colors ${
                                isCustom(selected) && selected.id === t.id
                                    ? 'bg-sage-500 text-white border-sage-500'
                                    : 'bg-surface border-sand-200 text-sand-700 hover:border-sand-400'
                            }`}
                        >
                            {t.name}
                        </button>
                        <button onClick={() => deleteType(t.id)} title="Delete type" className="text-sand-400 hover:text-rose-500 text-xs ml-1">✕</button>
                    </span>
                ))}
                <button
                    onClick={() => setShowNewType((s) => !s)}
                    className="text-sm rounded-full px-3.5 py-1.5 border border-dashed border-sand-300 text-sand-500 hover:border-sand-400 transition-colors"
                >
                    + Custom type
                </button>
            </div>

            {showNewType && (
                <form onSubmit={createType} className="flex flex-wrap gap-2 mb-4 items-center">
                    <input
                        className="field flex-1 min-w-[200px]"
                        placeholder="Name your type, for example Dreams"
                        value={newTypeName}
                        onChange={(e) => setNewTypeName(e.target.value)}
                        maxLength={40}
                    />
                    <button type="submit" className="btn-primary w-auto px-5">Create</button>
                </form>
            )}

            {/* Composer */}
            <form onSubmit={save} className="mb-9">
                <textarea
                    className="field min-h-[140px] resize-y"
                    placeholder={prompt}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                {error && <p className="alert-error mt-2">{error}</p>}
                <div className="flex justify-end mt-3">
                    <button type="submit" disabled={saving || !content.trim()} className="btn-primary w-auto px-7">
                        {saving ? 'Saving…' : 'Save entry'}
                    </button>
                </div>
            </form>

            {/* Past entries */}
            <h2 className="font-serif text-xl mb-3">Your entries</h2>
            {entries.length === 0 ? (
                <p className="text-sand-400 py-8 text-center">No entries yet. Your first thought is safe here.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {entries.map((entry) => {
                        const editing = editingId === entry.id
                        return (
                            <div key={entry.id} className="bg-surface border border-sand-200 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-sand-700">{entryLabel(entry)}</span>
                                    <span className="text-xs text-sand-400">
                                        {new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>

                                {editing ? (
                                    <>
                                        <textarea
                                            className="field min-h-[120px] resize-y"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => saveEdit(entry.id)} className="btn-primary w-auto px-5 py-2 text-sm">Save</button>
                                            <button onClick={() => { setEditingId(null); setEditContent('') }} className="btn-soft px-5 py-2 text-sm">Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p
                                            ref={(el) => { contentRefs.current[entry.id] = el }}
                                            className={`text-sm text-ink whitespace-pre-wrap leading-relaxed ${expandedId === entry.id ? '' : 'max-h-44 overflow-hidden'}`}
                                        >
                                            {entry.content}
                                        </p>
                                        <div className="flex gap-3 mt-3 text-xs">
                                            {overflowing.has(entry.id) && (
                                                <button onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)} className="text-sage-700 hover:text-sage-900">
                                                    {expandedId === entry.id ? 'Show less' : 'Read more'}
                                                </button>
                                            )}
                                            <button onClick={() => { setEditingId(entry.id); setEditContent(entry.content) }} className="text-sand-500 hover:text-ink">Edit</button>
                                            <button onClick={() => deleteEntry(entry.id)} className="text-sand-500 hover:text-rose-600">Delete</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </DashboardLayout>
    )
}
