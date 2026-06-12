import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'

// ── Real crisis resources (US) ──
const HOTLINES = [
    { name: '988 Suicide & Crisis Lifeline', desc: 'Call or text, 24/7', action: 'Call or text 988', href: 'tel:988' },
    { name: 'Crisis Text Line', desc: 'Text HOME to 741741', action: 'Text now', href: 'sms:741741?&body=HOME' },
    { name: 'Trans Lifeline', desc: 'Peer support · 877-565-8860', action: 'Call', href: 'tel:18775658860' },
    { name: 'The Trevor Project', desc: 'LGBTQ+ youth · 1-866-488-7386', action: 'Call', href: 'tel:18664887386' },
    { name: 'NAMI HelpLine', desc: 'Mon to Fri, 1-800-950-6264', action: 'Call', href: 'tel:18009506264' },
]

export default function CrisisCorner() {
    return (
        <DashboardLayout active="crisis">
            <h1 className="font-serif text-3xl mb-1">Crisis corner</h1>
            <p className="text-sand-600 mb-7">
                If things feel like too much right now, you’re not alone. Reach a real person any time.
            </p>

            {/* Hotlines — most important if someone's in crisis */}
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 mb-8">
                <h2 className="font-serif text-xl mb-1">Talk to someone now</h2>
                <p className="text-sm text-sand-600 mb-4">Free, confidential, and available when you need it.</p>
                <div className="flex flex-col gap-2">
                    {HOTLINES.map((h) => (
                        <a
                            key={h.name}
                            href={h.href}
                            className="flex items-center justify-between gap-3 bg-surface border border-sand-200 rounded-xl px-4 py-3 hover:border-rose-300 transition-colors"
                        >
                            <span>
                                <span className="block text-sm font-medium text-ink">{h.name}</span>
                                <span className="block text-xs text-sand-500">{h.desc}</span>
                            </span>
                            <span className="text-sm font-medium text-rose-600 shrink-0">{h.action}</span>
                        </a>
                    ))}
                </div>
                <p className="text-xs text-sand-500 mt-4">
                    If you’re in immediate danger, please call your local emergency number (911 in the US).
                </p>
            </div>

            <p className="text-sm text-sand-500">
                Need a moment to settle rather than a call? The{' '}
                <Link to="/calm" className="text-sage-700 hover:text-sage-900 font-medium">calm space</Link>
                {' '}has breathing and grounding exercises.
            </p>
        </DashboardLayout>
    )
}
