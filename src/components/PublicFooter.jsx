import { Link } from 'react-router-dom'

// Shared footer for public pages: brand, copyright, and a contact address.
export default function PublicFooter() {
    const year = new Date().getFullYear()
    return (
        <footer className="border-t border-sand-200">
            <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 text-sm text-sand-500">
                <div className="text-center sm:text-left">
                    <p className="font-serif text-lg text-ink mb-1">lunev</p>
                    <p className="text-xs">© {year} lunev. All rights reserved.</p>
                    <p className="text-[11px] text-sand-400 mt-1">
                        Moon background by{' '}
                        <a
                            href="https://craftpix.net/freebies/free-moon-pixel-game-backgrounds/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 hover:text-sand-600 transition-colors"
                        >
                            CraftPix
                        </a>
                    </p>
                </div>
                <div className="flex flex-col items-center sm:items-end gap-1.5 text-xs">
                    <Link to="/proof-of-privacy" className="hover:text-ink transition-colors">Proof of privacy</Link>
                    <p>
                        Questions or concerns?{' '}
                        <a href="mailto:hello@layba.dev" className="text-sage-700 hover:text-sage-900 font-medium">hello@layba.dev</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
