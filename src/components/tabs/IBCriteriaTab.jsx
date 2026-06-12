import { Target } from "@phosphor-icons/react";
import { IB_DESC } from "../../data/content.js";

// Placeholder until Cristopher provides the official IB English B mark-band
// descriptors. For now it shows the official theme description as a study anchor.
export default function IBCriteriaTab({ themeId, themeLabel, accent }) {
  return (
    <div className="ib-empty">
      <div className="ib-empty-ico">
        <Target size={24} weight="fill" style={{ color: accent }} />
      </div>
      <h3>IB Criteria — Coming soon</h3>
      <p>
        This section will hold the IB English B mark band descriptors and exactly
        what examiners look for, once the official criteria document is added.
      </p>
      {IB_DESC[themeId] && (
        <div className="ib-desc-card">
          <div className="fl" style={{ color: accent }}>
            {themeLabel} — official IB description
          </div>
          <p>{IB_DESC[themeId]}</p>
        </div>
      )}
    </div>
  );
}
