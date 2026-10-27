import { Link } from 'react-router-dom'

export default function PublicFooter() {
    const year = new Date().getFullYear()
    return (
        <footer className="border-t border-sand-200">
            <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 flex flex-wrap items-center justify-center gap-x-2 text-xs text-sand-600">
                <span>© {year} lunev</span>
                <span aria-hidden="true">·</span>
                <Link to="/privacy" className="inline-block py-1 hover:text-ink transition-colors">Privacy policy</Link>
                <span aria-hidden="true">·</span>
                <Link to="/privacy/health" className="inline-block py-1 hover:text-ink transition-colors">Health data</Link>
                <span className="basis-full sm:basis-auto text-center whitespace-nowrap">
                    <span aria-hidden="true" className="hidden sm:inline mr-2">·</span>
                    Moon art by{' '}
                    <a
                        href="https://craftpix.net/freebies/free-moon-pixel-game-backgrounds/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block py-1 underline underline-offset-2 hover:text-ink transition-colors"
                    >
                        CraftPix
                    </a>
                </span>
            </div>
        </footer>
    )
}
