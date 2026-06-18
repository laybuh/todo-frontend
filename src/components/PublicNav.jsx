import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { hasValidSession, bootstrapAuth } from '../authClient'

// Top nav for public (logged-out) pages: home, proof of privacy.
// If the visitor still has a live session, swap Log in / Sign up for a single
// Dashboard link. On a fresh page load the access token isn't in memory yet, so
// we try to restore it from the httpOnly refresh cookie before deciding.
export default function PublicNav() {
    const [authed, setAuthed] = useState(hasValidSession())

    useEffect(() => {
        let active = true
        // bootstrapAuth resolves true immediately if a token is already in memory,
        // otherwise it tries the refresh cookie.
        bootstrapAuth().then((ok) => { if (active) setAuthed(ok) })
        return () => { active = false }
    }, [])

    return (
        <nav className="flex items-center justify-between px-6 md:px-10 py-5 max-w-6xl mx-auto w-full">
            <Link to="/" className="text-2xl font-serif tracking-wide text-ink">
                lunev
            </Link>
            <div className="flex items-center gap-3 md:gap-5 text-sm">
                <Link
                    to="/proof-of-privacy"
                    className="hidden sm:inline text-sand-600 hover:text-ink transition-colors"
                >
                    Proof of privacy
                </Link>
                {authed ? (
                    <Link
                        to="/dashboard"
                        className="bg-sage-500 hover:bg-sage-600 text-white rounded-xl px-4 py-2 font-medium transition-colors"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="text-sand-700 hover:text-ink transition-colors">
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="bg-sage-500 hover:bg-sage-600 text-white rounded-xl px-4 py-2 font-medium transition-colors"
                        >
                            Sign up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
