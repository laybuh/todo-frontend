import PublicNav from '../components/PublicNav'
import PublicFooter from '../components/PublicFooter'
import CareText from '../components/CareText'

const Email = () => (
    <a href="mailto:hello@layba.dev" className="text-sage-700 hover:text-sage-900 font-medium underline underline-offset-2">
        hello@layba.dev
    </a>
)

const Section = ({ title, children }) => (
    <section className="grid gap-3">
        <h2 className="font-serif text-2xl text-ink">{title}</h2>
        {children}
    </section>
)

const List = ({ items }) => (
    <ul className="list-disc pl-5 grid gap-2">
        {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
)

export default function Privacy() {
    return (
        <div className="min-h-screen bg-cream text-ink font-sans flex flex-col">
            <PublicNav />

            <main className="flex-1 max-w-2xl w-full mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-20">
                <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-3">
                    Privacy policy
                </h1>
                <p className="text-sm text-sand-600 mb-8">
                    Effective date: October 27, 2026
                    <br />
                    Last updated: October 27, 2026
                </p>
                <div className="grid gap-9 text-sand-700 leading-relaxed">
                    <p>We want to be transparent about what we collect.</p>

                    <Section title="What we collect">
                        <List items={[
                            'Your account: display name, email, and password. Your password is stored hashed, never as plain text.',
                            'What you write: journal entries, mood notes, task titles, and affirmations. These are encrypted before they are saved.',
                            'What is not encrypted: your email and display name, your mood score (1 to 5), custom journal type names and their emoji, task energy levels, whether things are completed or archived, and dates and times.',
                            'Security records: when a login or sign-in attempt fails, or a reused login session is detected, we save the event type, the time, and a shortened IP address (the last part is zeroed out). These are not linked to your account and are deleted after 90 days. To reduce repeated attempts, we also keep a hashed (scrambled) version of your IP address for about a day.',
                            'Short-lived technical logs: our hosting providers keep brief logs, like IP addresses and which pages were requested.',
                        ]} />
                    </Section>

                    <Section title="How we protect it">
                        <p>
                            Your journal entries, mood notes, task titles, and affirmations are encrypted with AES-256-GCM before
                            they are saved. The encryption key is kept separately from the database, so if the database ever
                            leaked, what you’ve written would show up as scrambled text. Your password and sign-in codes are
                            hashed, and sign-in uses a two-step email code by default.
                        </p>
                        <p>
                            The key belongs to our server, not your password. That means we could technically decrypt entries,
                            though we do not read them. It is also why forgetting your password does not lose your entries. After
                            a reset, everything is readable again.
                        </p>
                    </Section>

                    <Section title="Who else handles your data">
                        <List items={[
                            'Vercel hosts the app and our backend, and stores our encryption key.',
                            'Supabase stores our database.',
                            'Resend sends our emails.',
                        ]} />
                        <p>
                            All three are in the United States. We do not use analytics, advertising, or tracking tools, and we do
                            not sell your data. lunev links to Ko-fi, findahelpline.com, and a CraftPix art credit, which are
                            separate sites. Nothing is shared with them unless you click.
                        </p>
                    </Section>

                    <Section title="Emails we send">
                        <p>
                            Account verification, sign-in codes, password resets, and a notice if someone tries to sign up with an
                            email that already has an account.
                        </p>
                    </Section>

                    <Section title="Cookies and browser storage">
                        <p>
                            One cookie keeps you logged in for up to 30 days. It is removed when you log out. We also keep a few
                            small pieces of data in your browser, such as when you were last active (for the 60-minute idle
                            logout), whether you have seen the walkthrough, and whether you have answered or snoozed today’s mood
                            prompt. We use no tracking or marketing cookies. We do not track you across sites, so there is
                            nothing to respond to when your browser sends a Do Not Track signal.
                        </p>
                    </Section>

                    <Section title="Your choices and deleting your data">
                        <p>
                            You can delete anything you have written at any time, and you can edit your journal entries. To delete
                            your account, open Settings from the menu and choose Delete at the bottom of the page. That
                            immediately deletes your account, tasks, journal entries, custom journal types, moods, affirmations,
                            sign-in codes, and sessions.
                        </p>
                        <p>A few traces can stick around for a short time after that:</p>
                        <List items={[
                            'Hosting and database logs, kept for about an hour to a day',
                            'Security records with shortened IPs, up to 90 days',
                            'Our email provider’s record that an email was sent to you, for up to 30 days',
                            'Our current database plan does not include automatic backups, so there are no backup copies to wait out',
                        ]} />
                        <p>If you want something removed that you cannot remove yourself, email <Email />.</p>
                    </Section>

                    <Section title="Age">
                        <p>
                            lunev is for people 13 and older. If you live somewhere with a higher minimum age for using online
                            services, you need to meet that age too. We do not knowingly collect information from anyone under 13,
                            and if we find out we have, we will delete it. If you are under 18, we would encourage you to talk to a
                            parent or trusted adult about how you use lunev. The checkbox at sign-up is a statement, not a
                            verification.
                        </p>
                    </Section>

                    <Section title="Not a replacement for care">
                        <CareText />
                    </Section>

                    <Section title="Changes">
                        <p>If we change this policy, we will update this page and notify you by email.</p>
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
