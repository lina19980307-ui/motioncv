export default function LanguageToggle({ lang, onChange }) {
  return (
    <div className="language-toggle flex items-center gap-2 rounded-full border bg-[var(--panel)] p-1">
      <button
        type="button"
        onClick={() => onChange("zh")}
        className={`language-toggle-btn rounded-full px-3 py-1.5 text-xs tracking-[0.08em] transition ${
          lang === "zh" ? "bg-[var(--text)] text-[var(--on-accent)]" : "text-[var(--muted)]"
        }`}
      >
        Chinese
      </button>
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`language-toggle-btn rounded-full px-3 py-1.5 text-xs tracking-[0.08em] transition ${
          lang === "en" ? "bg-[var(--text)] text-[var(--on-accent)]" : "text-[var(--muted)]"
        }`}
      >
        English
      </button>
    </div>
  );
}
