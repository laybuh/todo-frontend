import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'

// ── real AES-256-GCM in the browser, the same scheme lunev runs server-side ──
const encoder = new TextEncoder()
const decoder = new TextDecoder()

const toHex = (buf) =>
    [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
const fromHex = (hex) =>
    new Uint8Array(hex.match(/.{1,2}/g)?.map((h) => parseInt(h, 16)) ?? [])

async function encrypt(key, text) {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const full = new Uint8Array(
        await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(text))
    )
    // Web Crypto appends the 16-byte authentication tag to the ciphertext.
    // Split it off so the demo matches our server's v3:iv:tag:cipher layout.
    const tag = full.slice(full.length - 16)
    const cipher = full.slice(0, full.length - 16)
    return { ivHex: toHex(iv), tagHex: toHex(tag), cipherHex: toHex(cipher) }
}

async function decrypt(key, ivHex, tagHex, cipherHex) {
    const cipher = fromHex(cipherHex)
    const tag = fromHex(tagHex)
    const full = new Uint8Array(cipher.length + tag.length)
    full.set(cipher)
    full.set(tag, cipher.length)
    const plain = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: fromHex(ivHex) }, key, full
    )
    return decoder.decode(plain)
}

export default function ProofOfPrivacy() {
    const [text, setText] = useState('I felt anxious today, but I went for a walk and it helped.')
    const [out, setOut] = useState(null) // { ivHex, tagHex, cipherHex }
    const [revealed, setRevealed] = useState(false)
    const keyRef = useRef(null)

    // One ephemeral demo key, generated in your browser, never sent anywhere.
    useEffect(() => {
        let active = true
        crypto.subtle
            .generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
            .then((k) => { if (active) keyRef.current = k })
        return () => { active = false }
    }, [])

    // Re-encrypt on every change — with a fresh random IV each time.
    useEffect(() => {
        let active = true
        const run = async () => {
            if (!keyRef.current) { setTimeout(run, 40); return }
            if (!text) { setOut(null); return }
            const result = await encrypt(keyRef.current, text)
            if (active) { setOut(result); setRevealed(false) }
        }
        run()
        return () => { active = false }
    }, [text])

    const stored = out ? `v3:${out.ivHex}:${out.tagHex}:${out.cipherHex}` : ''

    return (
        <div className="min-h-screen bg-cream text-ink font-sans">
            <PublicNav />

            <header className="max-w-3xl mx-auto px-6 md:px-10 pt-12 md:pt-16 text-center">
                <p className="text-sage-600 font-medium tracking-wide uppercase text-xs mb-4">
                    Proof of privacy
                </p>
                <h1 className="font-serif text-4xl md:text-5xl leading-tight">
                    See exactly what we store.
                </h1>
                <p className="mt-5 text-sm text-sand-700 leading-relaxed max-w-xl mx-auto">
                    You write real things here. So we want to show you exactly how we protect them.
                    This is real AES-256 encryption running in your browser right now, the same
                    scheme that protects your entries on our servers. Type something below and watch
                    what actually gets saved.
                </p>
            </header>

            <section className="max-w-3xl mx-auto px-6 md:px-10 mt-10 grid gap-4">
                {/* You type */}
                <div className="bg-surface border border-sand-200 rounded-2xl p-5">
                    <label className="block text-xs uppercase tracking-wide text-sand-500 mb-2">
                        What you write
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                        className="w-full resize-none bg-cream/60 border border-sand-200 rounded-xl p-3 text-ink outline-none focus:border-sage-400 transition-colors"
                        placeholder="Type a private thought…"
                    />
                </div>

                {/* Arrow */}
                <div className="text-center text-sand-400 text-sm">
                    AES-256-GCM, 256-bit key, fresh random value every time
                </div>

                {/* What the database stores */}
                <div className="bg-ink text-cream rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs uppercase tracking-wide text-sand-300">
                            What the database stores
                        </span>
                        <span className="text-[10px] text-sage-300 border border-sage-300/40 rounded-full px-2 py-0.5">
                            encrypted
                        </span>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.code
                            key={stored.slice(0, 40)}
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: 1 }}
                            className="block font-mono text-xs md:text-sm break-all leading-relaxed text-sage-200"
                        >
                            {stored || ''}
                        </motion.code>
                    </AnimatePresence>
                    <p className="text-[11px] text-sand-400 mt-3">
                        It changes completely on every keystroke. Type the same thing twice and you
                        still get something different, because every encryption uses a new random value.
                    </p>
                </div>

                {/* Reveal */}
                <div className="bg-surface border border-sand-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xs uppercase tracking-wide text-sand-500">
                            Decrypted, only possible with the key
                        </span>
                        <button
                            onClick={async () => {
                                if (!out || !keyRef.current) return
                                await decrypt(keyRef.current, out.ivHex, out.tagHex, out.cipherHex)
                                setRevealed((r) => !r)
                            }}
                            className="text-xs bg-sage-500 hover:bg-sage-600 text-white rounded-lg px-3 py-1.5 transition-colors"
                        >
                            {revealed ? 'Hide' : 'Use the key'}
                        </button>
                    </div>
                    <p className="mt-3 font-mono text-sm break-words min-h-[1.5rem]">
                        {revealed ? text : <span className="text-sand-400">•••••••••••••••••••</span>}
                    </p>
                </div>
            </section>

            {/* Explanation */}
            <section className="max-w-3xl mx-auto px-6 md:px-10 mt-14 mb-8 grid gap-6">
                {[
                    {
                        h: 'The key is not stored next to your words',
                        p: 'The encryption key is a server secret, never written into the database beside your entries. If someone copied the whole database, they would have a pile of locked boxes and nothing to open them with.',
                    },
                    {
                        h: 'A leak would just be noise',
                        p: 'That scrambled output above is exactly what an attacker would walk away with. Without the key, there is no way to turn it back into anything you wrote.',
                    },
                    {
                        h: 'The same thing twice looks different both times',
                        p: 'Every entry gets a fresh random value before it is encrypted, so two identical notes never produce the same output. Nobody can even tell which entries match.',
                    },
                ].map((item) => (
                    <div key={item.h} className="border-l-2 border-sage-300 pl-5">
                        <h3 className="font-serif text-xl mb-1.5">{item.h}</h3>
                        <p className="text-sand-700 leading-relaxed text-sm">{item.p}</p>
                    </div>
                ))}

                <div className="bg-surface border border-sand-200 rounded-2xl p-5 mt-2">
                    <h3 className="font-serif text-xl mb-1.5">What this covers, and what it does not.</h3>
                    <p className="text-sand-700 leading-relaxed text-sm">
                        Your entries are encrypted before they are saved, so if our database ever
                        leaked, all anyone would find is scrambled text. We do not read what you
                        write, and we will never sell or share it. To be transparent, the encryption
                        key lives on our servers, so we are not claiming it is impossible for us to
                        access an entry. It is a commitment that we will not. As with anything you
                        put online, it is always wise to use your own judgment with the most
                        sensitive details. And if you want to write something that never reaches our
                        servers at all, the vent box in{' '}
                        <Link to="/calm" className="text-sage-700 hover:text-sage-900 font-medium">Calm space</Link>
                        {' '}is never saved anywhere. Nothing to leak, because nothing is ever written down.
                    </p>
                </div>
            </section>

            <section className="text-center pb-20 px-6">
                <Link
                    to="/register"
                    className="inline-block bg-sage-500 hover:bg-sage-600 text-white rounded-xl px-7 py-3.5 font-medium transition-colors"
                >
                    Start your private space
                </Link>
                <p className="mt-4 text-xs text-sand-500">
                    <Link to="/" className="hover:text-ink transition-colors">Back home</Link>
                </p>
            </section>

            <PublicFooter />
        </div>
    )
}
