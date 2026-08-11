import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

const features = [
    { title: 'To-Do List', body: 'Tasks organized around how much energy you actually have, not just what needs to get done.' },
    { title: 'Safe Space Journal', body: 'Brain dumps, gratitude, letters to your future self. A place to put what is in your head.' },
    { title: 'Mood Tracking', body: 'A daily check-in and a private history of how you have been feeling.' },
    { title: 'Affirmations', body: 'Write your own affirmations and see them when you need them.' },
    { title: 'Focus Center', body: 'One task, full screen, a timer. Nothing else.' },
    { title: 'Calm Space', body: 'Breathing, grounding, and a place to vent when it is a lot.' },
]

const fade = {
    hidden: { opacity: 0, y: 16 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
}

export default function Home() {
    return (
        <div className="min-h-screen text-ink font-sans">
            <PublicNav />

            {/* Hero */}
            <header className="relative overflow-hidden">
                {/* soft warm wash */}
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-cream via-cream to-rose-50/60" />
                {/* faded moon scene — natural colors, radial-masked in CSS, art credited in footer */}
                <div aria-hidden className="hero-scene">
                    <img src="/hero-scene.png" alt="" />
                </div>

                <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-20 text-center">
                    <motion.p
                        initial="hidden" animate="show" variants={fade}
                        className="inline-flex items-center gap-1.5 rounded-full border border-sage-200 bg-sage-50 text-sage-700/90 font-mono tracking-[0.18em] uppercase text-[10px] px-3.5 py-1.5 mb-5"
                    >
                        <span aria-hidden className="text-dusk">&gt;</span>
                        built for your mind
                    </motion.p>
                    <motion.h1
                        initial="hidden" animate="show" custom={1} variants={fade}
                        className="font-serif text-4xl md:text-6xl leading-tight max-w-3xl mx-auto"
                    >
                        <span className="block">Get things done.</span>
                        <span className="block bg-gradient-to-r from-sage-600 via-dusk to-mauve bg-clip-text text-transparent">Take care of your mind.</span>
                    </motion.h1>
                    <motion.p
                        initial="hidden" animate="show" custom={2} variants={fade}
                        className="mt-6 text-sm text-sand-700 max-w-md mx-auto leading-relaxed"
                    >
                        We bring your tasks, journal, moods, and affirmations into one place.
                        Built for people who want to feel better mentally and focus on tasks.
                        Everything you write is encrypted before it is saved.
                    </motion.p>
                    <motion.div
                        initial="hidden" animate="show" custom={3} variants={fade}
                        className="mt-9 flex flex-col sm:flex-row gap-3 justify-center"
                    >
                        <Link
                            to="/register"
                            className="bg-sage-500 hover:bg-sage-600 text-white rounded-xl px-7 py-3.5 font-medium transition-colors shadow-sm"
                        >
                            Create your space
                        </Link>
                    </motion.div>

                    <motion.p
                        initial="hidden" animate="show" custom={4} variants={fade}
                        className="mt-8 inline-flex items-center gap-2 rounded-md border border-sand-300 bg-transparent font-mono text-[11px] text-sand-500 tracking-wide px-3 py-1"
                    >
                        <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-sage-400 animate-pulse" />
                        AES-256 encrypted
                    </motion.p>

                    {/* Mobile: tuck the support link under the badge instead of
                        floating it in the corner where it covers content. */}
                    <div className="sm:hidden mt-3">
                        <a
                            href="https://ko-fi.com/layba"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center font-mono text-[9px] uppercase tracking-wide text-[#6c5a93] border border-mauve/60 bg-mauve/20 rounded px-2 py-1 hover:bg-mauve/30 transition-colors"
                        >
                            Buy me a coffee
                        </a>
                    </div>
                </div>
            </header>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
                            custom={i} variants={fade}
                            className="bg-surface border border-sand-200 rounded-2xl p-6 shadow-[0_1px_0_rgba(63,58,52,0.04),0_8px_24px_-12px_rgba(63,58,52,0.12)]"
                        >
                            <h3 className={`inline-flex items-center font-mono text-xs uppercase tracking-widest border rounded-md px-3 py-1 mb-3.5 ${i % 2 === 0 ? 'text-sage-700 border-sage-300 bg-sage-50' : 'text-[#6c5a93] border-mauve/60 bg-mauve/20'}`}>
                                {f.title}
                            </h3>
                            <p className="text-[13px] text-sand-600 leading-relaxed">{f.body}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Privacy band */}
            <section className="relative border-y border-sage-100 overflow-hidden">
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-sage-50 via-cream to-rose-50/80" />
                <div className="max-w-4xl mx-auto px-6 md:px-10 py-16 text-center">
                    <h2 className="font-serif text-3xl md:text-4xl mb-4">
                        We care about what you write here.
                    </h2>
                    <p className="text-sm text-sand-700 leading-relaxed max-w-xl mx-auto">
                        Your journal entries, mood notes, and tasks are encrypted before they are saved. The key is never stored next to them in the database. If our database ever leaked, all anyone would find is scrambled text. Don't take our word for it. See it for yourself.
                    </p>
                    <Link
                        to="/proof-of-privacy"
                        className="inline-block mt-8 bg-ink hover:bg-sand-800 text-cream rounded-xl px-7 py-3.5 font-medium transition-colors shadow-sm"
                    >
                        Watch your words get encrypted.
                    </Link>
                </div>
            </section>

            <PublicFooter />

            {/* Subtle floating support link — desktop only; on mobile it moves
                up under the AES-256 badge so it doesn't cover content. */}
            <a
                href="https://ko-fi.com/layba"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block fixed bottom-4 right-4 z-40 font-mono text-[9px] uppercase tracking-wide text-[#6c5a93] border border-mauve/60 bg-mauve/20 backdrop-blur rounded px-2 py-1 shadow-sm hover:bg-mauve/30 transition-colors"
            >
                Buy me a coffee
            </a>
        </div>
    )
}
