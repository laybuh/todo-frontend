import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { hasValidSession, bootstrapAuth } from '../authClient'

// Top nav for public (logged-out) pages: home, proof of privacy.
// If the visitor still has a live session, swap Log in / Sign up for a single
// Dashboard link. On a fresh page load the access token isn't in memory yet, so
// we try to restore it from the httpOnly refresh cookie before deciding.
export default function PublicNav({ masthead = false }) {
    const [authed, setAuthed] = useState(hasValidSession())

    useEffect(() => {
        let active = true
        // bootstrapAuth resolves true immediately if a token is already in memory,
        // otherwise it tries the refresh cookie.
        bootstrapAuth().then((ok) => { if (active) setAuthed(ok) })
        return () => { active = false }
    }, [])

    return (
        <nav className={`flex flex-col items-center px-6 md:px-10 max-w-6xl mx-auto w-full ${masthead ? 'gap-10 md:gap-16 pt-10 md:pt-12 pb-5' : 'gap-3 py-5'}`}>
            <Link to="/" className="inline-block">
                <img src="/lunev-logo.png" alt="lunev" width={masthead ? 281 : 108} height={masthead ? 104 : 40} className={masthead ? 'h-16 md:h-[104px] w-auto' : 'h-10 w-auto'} />
            </Link>
            <div className="nav-capsule">
                <Link to="/proof-of-privacy" className="nav-ghost">
                    Privacy
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
