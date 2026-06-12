import { LinkSimple, ArrowSquareOut } from "@phosphor-icons/react";

export default function SourcesTab({ sources, accent }) {
  return (
    <>
      <p className="slbl">
        <LinkSimple size={12} weight="bold" /> Verified sources
        <span className="src-count">{sources.length}</span>
      </p>
      <div className="src-list">
        {sources.map((s, i) => {
          // The source data mixes `desc` and `description` keys.
          const desc = s.desc || s.description || "";
          return (
            <div key={s.url + i} className={`scard au d${Math.min(i + 1, 6)}`}>
              <div className="sico">
                <ArrowSquareOut size={15} style={{ color: accent }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <a
                  className="stitle"
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: accent }}
                >
                  {s.title}
                </a>
                <p className="sdesc">{desc}</p>
                <p className="surl">{s.url}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
