import Reveal from "../Reveal";

export default function Contact() {
  return (
    <section className="section-space" id="contact">
      <Reveal>
        <h2 className="section-title">Contact</h2>
      </Reveal>
      <Reveal delay={100}>
        <p className="section-copy">
          欢迎联系合作或交流设计系统、产品体验与简历优化相关问题。
        </p>
      </Reveal>
      <Reveal delay={180}>
        <div className="mt-10 grid gap-3 sm:max-w-xl">
          <a
            href="mailto:hello@motioncv.design"
            className="rounded-xl border bg-white/70 px-5 py-4 text-sm tracking-[0.08em] text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            Email · hello@motioncv.design
          </a>
          <a
            href="https://github.com/motioncv"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border bg-white/70 px-5 py-4 text-sm tracking-[0.08em] text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            GitHub · github.com/motioncv
          </a>
          <a
            href="https://www.linkedin.com/in/motioncv"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border bg-white/70 px-5 py-4 text-sm tracking-[0.08em] text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            LinkedIn · linkedin.com/in/motioncv
          </a>
        </div>
      </Reveal>
    </section>
  );
}
