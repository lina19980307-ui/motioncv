export function ResumePreview() {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[#faf8f5] p-6">
      <div className="rounded-xl border border-[var(--line)] bg-white p-6">
        <p className="text-3xl font-semibold tracking-tight">张晨</p>
        <p className="mt-1 text-xs tracking-[0.2em] text-[var(--warm-gray)]">
          PRODUCT DESIGNER
        </p>
        <div className="mt-6 space-y-4 text-sm">
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--warm-gray)]">
              WORK EXPERIENCE
            </p>
            <p className="mt-1 leading-6">
              Lead Product Designer @ Atelier Labs
              <br />
              2022 - Present
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--warm-gray)]">
              EDUCATION
            </p>
            <p className="mt-1 leading-6">
              M.Des, Visual Communication
              <br />
              Tsinghua University
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-[var(--warm-gray)]">
        <p className="rounded-lg border border-[var(--line)] bg-white px-3 py-2">
          ATS 友好排版
        </p>
        <p className="rounded-lg border border-[var(--line)] bg-white px-3 py-2">
          一键导出 PDF
        </p>
        <p className="rounded-lg border border-[var(--line)] bg-white px-3 py-2">
          中英双语模板
        </p>
        <p className="rounded-lg border border-[var(--line)] bg-white px-3 py-2">
          自定义主题色
        </p>
      </div>
    </section>
  );
}
