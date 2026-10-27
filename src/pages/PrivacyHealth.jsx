import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

export default function PrivacyHealth() {
    return (
        <div className="min-h-screen bg-cream text-ink font-sans flex flex-col">
            <PublicNav />

            <main className="flex-1 max-w-2xl w-full mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-20">
                <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-3">
                    Health data
                </h1>
                <p className="text-sm text-sand-600 mb-8">
                    Effective date: October 27, 2026
                    <br />
                    Last updated: October 27, 2026
                </p>
                <div className="grid gap-5 text-sand-700 leading-relaxed">
                    <p>
                        Placeholder. The consumer health data notice goes here.
                    </p>
                    <p>
                        This page covers mood check-ins and journal entries: what we collect, why, and how to delete it.
                    </p>
                    <p>
                        Questions? Email{' '}
                        <a href="mailto:hello@layba.dev" className="text-sage-700 hover:text-sage-900 font-medium underline underline-offset-2">
                            hello@layba.dev
                        </a>
                        .
                    </p>
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
