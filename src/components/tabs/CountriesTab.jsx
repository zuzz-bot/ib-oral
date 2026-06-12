import { useState } from "react";
import { Rows, Columns } from "@phosphor-icons/react";

const COUNTRIES = [
  { k: "uk", n: "United Kingdom", short: "UK", flag: "https://flagcdn.com/w40/gb.png" },
  { k: "usa", n: "USA", short: "USA", flag: "https://flagcdn.com/w40/us.png" },
  { k: "india", n: "India", short: "India", flag: "https://flagcdn.com/w40/in.png" },
];

function Fact({ f, accent }) {
  return (
    <div className="fcard">
      <div className="fl">{f.label}</div>
      <div className="fs" style={{ color: accent }}>
        {f.stat}
      </div>
      <div className="fd">{f.detail}</div>
    </div>
  );
}

export default function CountriesTab({ countries, accent }) {
  const [view, setView] = useState("single"); // "single" | "compare"
  const [active, setActive] = useState("uk");

  return (
    <>
      <div className="ctabs-row">
        {view === "single" &&
          COUNTRIES.map((c) => {
            const on = c.k === active;
            return (
              <button
                key={c.k}
                className={`ctab-btn${on ? " on" : ""}`}
                style={
                  on
                    ? { background: accent, color: "#000", borderColor: accent }
                    : undefined
                }
                onClick={() => setActive(c.k)}
              >
                <img
                  className="flag-img"
                  src={c.flag}
                  alt={c.n}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                {c.n}
              </button>
            );
          })}
        <div className="view-toggle">
          <button
            className={view === "single" ? "on" : ""}
            onClick={() => setView("single")}
          >
            <Rows size={13} weight="bold" /> By country
          </button>
          <button
            className={view === "compare" ? "on" : ""}
            onClick={() => setView("compare")}
          >
            <Columns size={13} weight="bold" /> Compare
          </button>
        </div>
      </div>

      {view === "single" ? (
        <div className="facts-grid">
          {(countries[active] || []).map((f, i) => (
            <Fact key={i} f={f} accent={accent} />
          ))}
          {countries.tip && (
            <div className="tip-box">
              <p>{countries.tip}</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="compare-grid">
            {COUNTRIES.map((c) => (
              <div className="compare-col" key={c.k}>
                <div className="compare-head">
                  <img
                    className="flag-img"
                    src={c.flag}
                    alt={c.n}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  {c.short}
                </div>
                {(countries[c.k] || []).map((f, i) => (
                  <Fact key={i} f={f} accent={accent} />
                ))}
              </div>
            ))}
          </div>
          {countries.tip && (
            <div className="tip-box" style={{ marginTop: 14 }}>
              <p>{countries.tip}</p>
            </div>
          )}
        </>
      )}
    </>
  );
}
