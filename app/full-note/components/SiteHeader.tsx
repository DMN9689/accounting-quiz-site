type SiteHeaderProps = {
  title: string;
  sourceDate: string;
  updatedAt: string;
};

export function SiteHeader({ title, sourceDate, updatedAt }: SiteHeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            재
          </span>
          <strong>{title}</strong>
        </div>
        <div className="topbar-meta" aria-label="자료 정보">
          <span>기준 {sourceDate}</span>
          <span>수정 {updatedAt}</span>
        </div>
      </div>
    </header>
  );
}

