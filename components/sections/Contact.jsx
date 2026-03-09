import Reveal from "../Reveal";

export default function Contact() {
  return (
    <section className="section-space" id="contact">
      <Reveal>
        <h2 className="section-title">Contact</h2>
      </Reveal>
      <Reveal delay={100}>
        <p className="section-copy">
          欢迎通过占位联系方式测试页面排版，发布前请替换为你自己的真实联系方式。
        </p>
      </Reveal>
      <Reveal delay={180}>
        <div className="mt-10 grid gap-3 sm:max-w-xl">
          <a
            href="mailto:hello@example.com"
            className="rounded-xl border bg-white/70 px-5 py-4 text-sm tracking-[0.08em] text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            Email · hello@example.com
          </a>
          <a
            href="https://example.com/portfolio"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border bg-white/70 px-5 py-4 text-sm tracking-[0.08em] text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            Website · example.com/portfolio
          </a>
          <a
            href="https://example.com/social"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border bg-white/70 px-5 py-4 text-sm tracking-[0.08em] text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            Social · example.com/social
          </a>
        </div>
      </Reveal>
    </section>
  );
}
