import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { getAccessToken, clearAccessToken } from '../authClient'

const IDLE_MS = 60 * 60 * 1000

// Sidebar items. `ready: false` ones are upcoming features (shown but disabled)
// so the full shape of the app is visible as it gets built out.
const NAV = [
    { key: 'today', label: 'Today', to: '/dashboard', ready: true },
    { key: 'journal', label: 'Journal', to: '/journal', ready: true },
    { key: 'mood', label: 'Mood', to: '/mood', ready: true },
    { key: 'affirmations', label: 'Affirmations', to: '/affirmations', ready: true },
    { key: 'focus', label: 'Focus', to: '/focus', ready: true },
    { key: 'calm', label: 'Calm space', to: '/calm', ready: true },
    { key: 'crisis', label: 'Crisis corner', to: '/crisis', ready: true },
]

export default function DashboardLayout({ active, children }) {
    const navigate = useNavigate()
    const timeoutRef = useRef(null)
    const token = getAccessToken()
    const [menuOpen, setMenuOpen] = useState(false)

    const logout = () => {
        // Best-effort server-side revoke of the refresh token; never block logout on it.
        axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`).catch(() => {})
        clearAccessToken()
        localStorage.removeItem('lastActive')
        localStorage.removeItem('onboarded')
        navigate('/login')
    }

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        const lastActive = localStorage.getItem('lastActive')
        if (lastActive && Date.now() - parseInt(lastActive) > IDLE_MS) {
            logout()
            return
        }

        const reset = () => {
            localStorage.setItem('lastActive', Date.now().toString())
            clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(logout, IDLE_MS)
        }
        window.addEventListener('mousemove', reset)
        window.addEventListener('keydown', reset)
        window.addEventListener('click', reset)
        reset()

        return () => {
            clearTimeout(timeoutRef.current)
            window.removeEventListener('mousemove', reset)
            window.removeEventListener('keydown', reset)
            window.removeEventListener('click', reset)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const NavItems = ({ onNavigate }) => (
        <>
            {NAV.map((item) => {
                const isActive = item.key === active
                const base = 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors'
                if (!item.ready) {
                    return (
                        <div key={item.key} className={`${base} text-sand-400 cursor-default select-none`} title="Coming soon">
                            <span>{item.label}</span>
                            <span className="ml-auto text-[10px] uppercase tracking-wide text-sand-400 border border-sand-200 rounded-full px-1.5 py-0.5">soon</span>
                        </div>
                    )
                }
                return (
                    <Link
                        key={item.key}
                        to={item.to}
                        onClick={onNavigate}
                        className={`${base} ${isActive ? 'bg-sage-100 text-sage-800 font-medium border-l-2 border-sage-500 pl-[10px]' : 'text-sand-700 hover:bg-sand-100'}`}
                    >
                        <span>{item.label}</span>
                    </Link>
                )
            })}
        </>
    )

    return (
        <div className="min-h-screen bg-cream text-ink font-sans flex">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-sand-200 bg-gradient-to-b from-surface via-surface to-cream p-5">
                <Link to="/" className="px-2 mb-6">
                    <p className="font-serif text-2xl tracking-wide leading-none bg-gradient-to-r from-sage-700 to-dusk bg-clip-text text-transparent">lunev</p>
                </Link>
                <nav className="flex flex-col gap-1">
                    <NavItems />
                </nav>
                <div className="mt-auto pt-5 border-t border-sand-200 flex flex-col gap-1">
                    <Link to="/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sand-700 hover:bg-sand-100 transition-colors">
                        <span>Settings</span>
                    </Link>
                    <button onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sand-700 hover:bg-sand-100 transition-colors text-left">
                        <span>Sign out</span>
                    </button>
                    <a
                        href="https://ko-fi.com/layba"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start ml-3 mt-2 font-mono text-[9px] uppercase tracking-wide text-[#6c5a93] border border-mauve/60 bg-mauve/20 rounded px-2 py-1 hover:bg-mauve/30 transition-colors"
                    >
                        Buy me a coffee
                    </a>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile top bar */}
                <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-sand-200 bg-surface/60">
                    <Link to="/" className="font-serif text-xl text-ink">lunev</Link>
                    <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="text-ink p-1 -mr-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile slide-in drawer */}
                {menuOpen && (
                    <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
                        <div className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} />
                        <aside className="absolute left-0 top-0 h-full w-64 max-w-[80%] bg-surface border-r border-sand-200 p-5 flex flex-col shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <Link to="/" onClick={() => setMenuOpen(false)} className="font-serif text-2xl tracking-wide leading-none bg-gradient-to-r from-sage-700 to-dusk bg-clip-text text-transparent">lunev</Link>
                                <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-sand-500 hover:text-ink p-1">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M6 6l12 12M18 6L6 18" />
                                    </svg>
                                </button>
                            </div>
                            <nav className="flex flex-col gap-1">
                                <NavItems onNavigate={() => setMenuOpen(false)} />
                            </nav>
                            <div className="mt-auto pt-5 border-t border-sand-200 flex flex-col gap-1">
                                <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sand-700 hover:bg-sand-100 transition-colors">
                                    <span>Settings</span>
                                </Link>
                                <button onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sand-700 hover:bg-sand-100 transition-colors text-left">
                                    <span>Sign out</span>
                                </button>
                                <a href="https://ko-fi.com/layba" target="_blank" rel="noopener noreferrer" className="self-start ml-3 mt-2 font-mono text-[9px] uppercase tracking-wide text-[#6c5a93] border border-mauve/60 bg-mauve/20 rounded px-2 py-1 hover:bg-mauve/30 transition-colors">Buy me a coffee</a>
                            </div>
                        </aside>
                    </div>
                )}

                <main className="flex-1 w-full max-w-3xl mx-auto px-5 md:px-10 py-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
