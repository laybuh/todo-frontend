import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

export default function ProofOfPrivacy() {
    return (
        <div className="min-h-screen bg-cream text-ink font-sans flex flex-col">
            <PublicNav />

            <main className="flex-1 max-w-2xl w-full mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-20">
                <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
                    Proof of privacy
                </h1>
                <div className="grid gap-5 text-sand-700 leading-relaxed">
                    <p>
                        Everything you write in lunev is encrypted with AES-256 before it’s saved.
                        That includes your journal entries, mood notes, and tasks.
                    </p>
                    <p>
                        The encryption key is stored separately from your data. So if our database
                        ever leaked, all anyone would find is scrambled text, not your words.
                    </p>
                    <p>
                        If you have questions about how it works, email{' '}
                        <a
                            href="mailto:hello@layba.dev"
                            className="text-sage-700 hover:text-sage-900 font-medium underline underline-offset-2"
                        >
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
