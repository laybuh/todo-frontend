import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'

export default function CrisisCorner() {
    return (
        <DashboardLayout active="crisis">
            <h1 className="font-serif text-3xl mb-1">Crisis support</h1>
            <p className="text-sand-600 mb-7">
                If things feel like too much right now, you’re not alone. Reach a real person any time.
            </p>

            {/* Hotlines — most important if someone's in crisis */}
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 mb-8">
                <h2 className="font-serif text-xl mb-1">Talk to someone now</h2>
                <p className="text-sm text-sand-600 mb-4">Free, confidential helplines, wherever you are in the world.</p>
                <a
                    href="https://findahelpline.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 bg-surface border border-sand-200 rounded-xl px-4 py-3 hover:border-rose-300 transition-colors"
                >
                    <span>
                        <span className="block text-sm font-medium text-ink">Find a helpline near you</span>
                        <span className="block text-xs text-sand-500">Crisis lines for your country, via findahelpline.com</span>
                    </span>
                    <span className="text-sm font-medium text-rose-600 shrink-0">Open</span>
                </a>
                <p className="text-xs text-sand-500 mt-4">
                    Lunev isn’t a medical or crisis service and can’t replace professional help. If you’re in immediate danger, please call your local emergency number.
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
