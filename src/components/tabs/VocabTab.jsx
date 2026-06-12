import { BookOpen } from "@phosphor-icons/react";

export default function VocabTab({ vocabulary, accent }) {
  return (
    <>
      <p className="slbl">
        <BookOpen size={12} weight="fill" /> Key vocabulary — {vocabulary.length} terms
      </p>
      <div className="vocab-grid">
        {vocabulary.map((v, i) => (
          <div key={v.word} className={`vcard au d${Math.min(i + 1, 6)}`}>
            <div className="vnum" style={{ color: accent }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="vword">{v.word}</div>
              <div className="vdef">{v.def}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
