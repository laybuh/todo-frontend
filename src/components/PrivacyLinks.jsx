import { Link } from 'react-router-dom'

const LINKS = [
    { to: '/privacy', label: 'Privacy policy' },
    { to: '/privacy/health', label: 'Health data' },
]

export default function PrivacyLinks({ className = '' }) {
    return (
        <nav aria-label="Privacy" className={`flex flex-wrap gap-x-4 ${className}`}>
            {LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="inline-block py-1 hover:text-ink transition-colors">
                    {l.label}
                </Link>
            ))}
        </nav>
    )
}
