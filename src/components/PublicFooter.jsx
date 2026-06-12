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
                </div>
                <div className="flex flex-col items-center sm:items-end gap-1.5 text-xs">
                    <Link to="/proof-of-privacy" className="hover:text-ink transition-colors">Proof of privacy</Link>
                    <a href="https://ko-fi.com/layba" target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] uppercase tracking-widest text-[#6c5a93] border border-mauve/60 bg-mauve/20 rounded-md px-2.5 py-1 hover:bg-mauve/30 transition-colors">Buy me a coffee</a>
                    <p>
                        Questions or concerns?{' '}
                        <a href="mailto:hello@layba.dev" className="text-sage-700 hover:text-sage-900 font-medium">hello@layba.dev</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
