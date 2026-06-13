import { Sparkle, MoonStars } from "@phosphor-icons/react";

// AUTO (sky follows local time) / NIGHT (forced night). Persisted by App.
export default function SkyToggle({ mode, onChange }) {
  return (
    <div className="sky-toggle" role="group" aria-label="Sky mode">
      <button
        className={mode === "auto" ? "on" : ""}
        onClick={() => onChange("auto")}
        aria-pressed={mode === "auto"}
      >
        <Sparkle size={13} weight="fill" /> Auto
      </button>
      <button
        className={mode === "night" ? "on" : ""}
        onClick={() => onChange("night")}
        aria-pressed={mode === "night"}
      >
        <MoonStars size={13} weight="fill" /> Night
      </button>
    </div>
  );
}
