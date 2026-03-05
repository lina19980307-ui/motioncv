import resume from "../../resume.json";

export default function Hero() {
  const name = resume.hero?.name || "Your Name";
  const tagline =
    resume.hero?.tagline ||
    "A concise positioning statement that communicates your strengths.";

  return (
    <section className="relative flex min-h-screen flex-col justify-center border-b py-24">
      <p className="eyebrow">MOTIONCV</p>

      <h1 className="mt-8 text-6xl font-semibold leading-[0.95] tracking-tight md:text-8xl">
        {name}
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl">
        {tagline}
      </p>

      <div className="absolute bottom-12 left-0 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
        <span>Scroll</span>
        <span className="inline-block h-10 w-px bg-[var(--line)]" />
      </div>
    </section>
  );
}
