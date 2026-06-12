import { Link } from 'react-router-dom'

// Shared warm-themed card layout for all auth pages.
export default function AuthLayout({ title, subtitle, children, footer }) {
    return (
        <div className="min-h-screen text-ink font-sans flex items-center justify-center p-4 relative overflow-hidden">
            {/* soft warm wash — color only, no graphics */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-cream via-cream to-peach/25" />

            <div className="w-full max-w-md bg-surface/90 backdrop-blur border border-sand-200 rounded-2xl shadow-[0_2px_24px_rgba(63,58,52,0.08)] p-8 md:p-10">
                <Link to="/" className="inline-flex items-center gap-1 text-xs text-sand-500 hover:text-ink transition-colors mb-5">
                    ← Back to home
                </Link>
                <div className="h-1 w-12 rounded-full mb-5 bg-gradient-to-r from-sage-400 to-peach" />
                <Link to="/" className="inline-block mb-6">
                    <p className="font-serif text-2xl tracking-wide text-ink leading-none">lunev</p>
                    <p className="text-xs text-sand-500 mt-1">A safe space for your mind.</p>
                </Link>

                {title && <h1 className="font-serif text-3xl mb-1">{title}</h1>}
                {subtitle && <p className="text-sm text-sand-600 mb-5">{subtitle}</p>}

                {children}

                {footer && (
                    <p className="mt-6 text-center text-sm text-sand-600">{footer}</p>
                )}
            </div>
        </div>
    )
}
