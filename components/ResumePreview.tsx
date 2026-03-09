export function ResumePreview() {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[#faf8f5] p-6">
      <div className="rounded-xl border border-[var(--line)] bg-white p-6">
        <p className="text-3xl font-semibold tracking-tight">Sample Artist</p>
        <p className="mt-1 text-xs tracking-[0.2em] text-[var(--warm-gray)]">
          CREATIVE PORTFOLIO
        </p>
        <div className="mt-6 space-y-4 text-sm">
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--warm-gray)]">
              WORK EXPERIENCE
            </p>
            <p className="mt-1 leading-6">
              Featured Performer @ Studio Residency
              <br />
              2024 - Present
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--warm-gray)]">
              EDUCATION
            </p>
            <p className="mt-1 leading-6">
              Creative Practice & Performance
              <br />
              Portfolio-ready Placeholder
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-[var(--warm-gray)]">
        <p className="rounded-lg border border-[var(--line)] bg-white px-3 py-2">
          Placeholder Layout
        </p>
        <p className="rounded-lg border border-[var(--line)] bg-white px-3 py-2">
          Media-ready Blocks
        </p>
        <p className="rounded-lg border border-[var(--line)] bg-white px-3 py-2">
          Bilingual Support
        </p>
        <p className="rounded-lg border border-[var(--line)] bg-white px-3 py-2">
          Custom Theme
        </p>
      </div>
    </section>
  );
}
