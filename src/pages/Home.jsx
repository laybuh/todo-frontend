import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

const features = [
    { title: 'To-Do List', body: 'Tasks with energy levels and reminders specialized for you.' },
    { title: 'Safe Space Journal', body: 'Brain dumps, gratitude, letters to your future self.' },
    { title: 'Mood Tracking', body: 'A daily check-in, with a private history only you can see.' },
    { title: 'Daily Affirmations', body: 'Your own affirmations, shown when you need it.' },
    { title: 'Focus Center', body: 'One task, full screen, nothing else.' },
    { title: 'Crisis Corner', body: 'Breathing, grounding, and real hotlines.' },
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
                {/* soft warm wash — color only, no graphics */}
                <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-cream via-cream to-rose-50/60" />

                <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-20 text-center">
                    <motion.p
                        initial="hidden" animate="show" variants={fade}
                        className="text-sage-600 font-medium tracking-[0.2em] uppercase text-xs mb-5"
                    >
                        Private by design
                    </motion.p>
                    <motion.h1
                        initial="hidden" animate="show" custom={1} variants={fade}
                        className="font-serif text-4xl md:text-6xl leading-tight max-w-3xl mx-auto"
                    >
                        A calmer, more{' '}
                        <span className="bg-gradient-to-r from-sage-600 via-dusk to-mauve bg-clip-text text-transparent">private</span>
                        {' '}place for your mind.
                    </motion.h1>
                    <motion.p
                        initial="hidden" animate="show" custom={2} variants={fade}
                        className="mt-6 text-base text-sand-700 max-w-xl mx-auto leading-relaxed"
                    >
                        We brings your tasks, journal, moods, and affirmations into one safe space.
                        Everything you write is encrypted. Even we cannot read it.
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
                        <Link
                            to="/proof-of-privacy"
                            className="bg-surface/80 backdrop-blur border border-sand-200 hover:border-sand-300 text-ink rounded-xl px-7 py-3.5 font-medium transition-colors"
                        >
                            See the proof
                        </Link>
                    </motion.div>

                    <motion.p
                        initial="hidden" animate="show" custom={4} variants={fade}
                        className="mt-8 text-xs text-sand-500 tracking-wide"
                    >
                        AES-256 encrypted. We cannot read your data. Honest about how it works.
                    </motion.p>
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
                            <div className="h-1 w-10 rounded-full mb-4 bg-gradient-to-r from-sage-400 to-peach" />
                            <h3 className="font-serif text-xl mb-1.5">{f.title}</h3>
                            <p className="text-sm text-sand-600 leading-relaxed">{f.body}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Privacy band */}
            <section className="relative border-y border-sage-100 overflow-hidden">
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-sage-50 via-cream to-rose-50/80" />
                <div className="max-w-4xl mx-auto px-6 md:px-10 py-16 text-center">
                    <h2 className="font-serif text-3xl md:text-4xl mb-4">
                        Privacy isn’t a setting. It’s the foundation.
                    </h2>
                    <p className="text-sand-700 leading-relaxed max-w-2xl mx-auto">
                        Your journal entries, moods, and notes are encrypted on our server with a key
                        that never travels with your data. If our database were ever breached, what
                        leaked would be unreadable noise. Don’t take our word for it. Watch it happen
                        for yourself.
                    </p>
                    <Link
                        to="/proof-of-privacy"
                        className="inline-block mt-8 bg-ink hover:bg-sand-800 text-cream rounded-xl px-7 py-3.5 font-medium transition-colors shadow-sm"
                    >
                        Watch your words get encrypted
                    </Link>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
