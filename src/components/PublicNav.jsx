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
            <div className="nav-capsule">
                <Link to="/proof-of-privacy" className="nav-ghost hidden sm:inline-flex">
                    Proof of privacy
                </Link>
                {authed ? (
                    <Link to="/dashboard" className="nav-pill">
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="nav-ghost">
                            Log in
                        </Link>
                        <Link to="/register" className="nav-pill">
                            Sign up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
