export default function AboutPage() {
    return (
        <main
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/quotes-bg.jpg')" }}
        >
            <div className="max-w-3xl rounded-2xl bg-black/70 p-10 text-center text-white backdrop-blur-md">
                <h1 className="mb-6 text-5xl font-bold">ALONE · 3AM</h1>

                <p className="leading-8 text-white/80">
                    This is not just a music website.
                    <br /><br />
                    It's a place for people who find peace after midnight.
                    For silent listeners.
                    For overthinkers.
                    For people who never felt understood.
                    <br /><br />
                    Wear your headphones.
                    Turn off the lights.
                    Let the night speak.
                </p>
            </div>
        </main>
    );
}