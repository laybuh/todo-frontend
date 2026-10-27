import { Link } from 'react-router-dom'
import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import CareText from '../components/CareText'

const linkClass = 'text-sage-700 hover:text-sage-900 font-medium underline underline-offset-2'

const Email = () => <a href="mailto:hello@layba.dev" className={linkClass}>hello@layba.dev</a>

const Section = ({ title, children }) => (
    <section className="grid gap-3">
        <h2 className="font-serif text-2xl text-ink">{title}</h2>
        {children}
    </section>
)

export default function PrivacyHealth() {
    return (
        <div className="min-h-screen bg-cream text-ink font-sans flex flex-col">
            <PublicNav />

            <main className="flex-1 max-w-2xl w-full mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-20">
                <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-3">
                    Health data notice
                </h1>
                <p className="text-sm text-sand-600 mb-8">
                    Effective date: October 27, 2026
                    <br />
                    Last updated: October 27, 2026
                </p>
                <div className="grid gap-9 text-sand-700 leading-relaxed">
                    <p>
                        Your mood check-ins and journal can say a lot about your mental health. We treat them as sensitive.
                        This page covers that data specifically. Otherwise, check our{' '}
                        <Link to="/privacy" className={linkClass}>Privacy policy</Link>.
                    </p>

                    <Section title="What we collect">
                        <p>
                            Your mood scores (1 to 5), mood notes, and journal entries, plus the journal entry type and the date.
                            We only collect them when you choose to write them in the app.
                        </p>
                    </Section>

                    <Section title="Why we collect it">
                        <p>
                            Only to give you the features you asked for, like your journal, your mood history, and your daily
                            check-in. We do not use it for ads, profiling, or anything else.
                        </p>
                    </Section>

                    <Section title="Where it comes from">
                        <p>Only from you.</p>
                    </Section>

                    <Section title="Who we share it with">
                        <p>
                            Nobody. Your data is stored with our hosting and database providers (Vercel and Supabase) so the app
                            can work, and that is it. We do not sell it, rent it, or share it with advertisers or anyone else. Our
                            email provider, Resend, sends your account emails but does not receive your mood or journal data.
                        </p>
                    </Section>

                    <Section title="How it is protected">
                        <p>
                            Your journal entries and mood notes are encrypted with AES-256-GCM before they are saved. Your mood
                            score, journal entry type, and dates are not encrypted. The encryption key is kept separately from the
                            database. The key belongs to our server, not your password. That means we could technically decrypt
                            entries, though we do not read them.
                        </p>
                    </Section>

                    <Section title="Your rights">
                        <ul className="list-disc pl-5 grid gap-2">
                            <li>Ask what health data we hold about you</li>
                            <li>Delete it at any time, in the app or by email. To delete your account, open Settings from the menu and choose Delete at the bottom of the page.</li>
                            <li>Withdraw your consent whenever you want by deleting your data or your account</li>
                        </ul>
                        <p>
                            Email <Email /> for anything you cannot do in the app. If you disagree with how we handled a request,
                            please let us know, and we will take another look.
                        </p>
                    </Section>

                    <Section title="How long we keep it">
                        <p>
                            After you delete it or your account, small traces, such as short-lived logs, can linger for a limited
                            time, as described in our <Link to="/privacy" className={linkClass}>Privacy policy</Link>.
                        </p>
                    </Section>

                    <Section title="Age">
                        <p>
                            lunev is for people 13 and older. We do not knowingly collect information from anyone under 13, and if
                            we find out we have, we will delete it. If you are under 18, we would encourage you to talk to a parent
                            or trusted adult about how you use lunev.
                        </p>
                    </Section>

                    <Section title="Not a replacement for care">
                        <CareText />
                    </Section>

                    <Section title="Contact">
                        <p><Email /></p>
                    </Section>
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}
