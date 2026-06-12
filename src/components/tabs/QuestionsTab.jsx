import { Quotes } from "@phosphor-icons/react";

export default function QuestionsTab({ questions, accent }) {
  return (
    <div className="qlist">
      {questions.map((q, i) => (
        <div key={i} className={`qcard au d${Math.min(i + 1, 6)}`}>
          <div className="qn" style={{ color: accent }}>
            <Quotes size={12} weight="fill" /> Q{i + 1}
          </div>
          <div className="qt">{q}</div>
        </div>
      ))}
    </div>
  );
}
