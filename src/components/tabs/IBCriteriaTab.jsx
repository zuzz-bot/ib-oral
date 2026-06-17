import { Target, Check, Lightbulb } from "@phosphor-icons/react";
import { IO_RUBRIC } from "../../data/oralStructure.js";

// Real English B SL IO criteria (paraphrased — see oralStructure.js).
export default function IBCriteriaTab({ accent }) {
  return (
    <div className="crit">
      <div className="crit-head">
        <div className="crit-total" style={{ color: accent }}>
          <Target size={16} weight="fill" /> {IO_RUBRIC.total} marks
        </div>
        <p className="crit-note">{IO_RUBRIC.note}</p>
      </div>

      {IO_RUBRIC.criteria.map((c, i) => (
        <div key={c.k} className="crit-card au" style={{ "--i": i }}>
          <div className="crit-card-head">
            <span className="crit-badge" style={{ color: accent }}>{c.k}</span>
            <span className="crit-name">{c.name}</span>
            <span className="crit-marks">{c.marks} marks</span>
          </div>
          <p className="crit-measures">{c.measures}</p>
          <div className="crit-wins">
            {c.wins.map((w) => (
              <div key={w} className="crit-win">
                <Check size={14} weight="bold" style={{ color: accent }} />
                <span>{w}</span>
              </div>
            ))}
          </div>
          <div className="crit-tip">
            <Lightbulb size={14} weight="fill" style={{ color: accent }} />
            <span>{c.tip}</span>
          </div>
        </div>
      ))}

      <p className="crit-disclaimer">
        Paraphrased from the official IB English B criteria for study purposes —
        confirm the exact band wording with your teacher. Not affiliated with the IBO.
      </p>
    </div>
  );
}
