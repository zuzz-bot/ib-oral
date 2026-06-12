import { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  BookOpen,
  Globe,
  LinkSimple,
  Question,
  ChatCircle,
  Target,
  Circle,
  CircleHalf,
  CheckCircle,
  ChartBar,
} from "@phosphor-icons/react";
import { DATA } from "../data/content.js";
import { useProgress } from "../hooks/useProgress.js";
import VocabTab from "./tabs/VocabTab.jsx";
import CountriesTab from "./tabs/CountriesTab.jsx";
import SourcesTab from "./tabs/SourcesTab.jsx";
import QuestionsTab from "./tabs/QuestionsTab.jsx";
import PhrasesTab from "./tabs/PhrasesTab.jsx";
import IBCriteriaTab from "./tabs/IBCriteriaTab.jsx";

const TABS = [
  { k: "vocab", l: "Vocabulary", Icon: BookOpen },
  { k: "countries", l: "Countries", Icon: Globe },
  { k: "sources", l: "Sources", Icon: LinkSimple },
  { k: "questions", l: "Questions", Icon: Question },
  { k: "phrases", l: "Oral phrases", Icon: ChatCircle },
  { k: "ib", l: "IB Criteria", Icon: Target },
];

const PROG_STATES = [
  { key: "none", Icon: Circle, label: "Not started" },
  { key: "progress", Icon: CircleHalf, label: "In progress" },
  { key: "done", Icon: CheckCircle, label: "Done" },
];

export default function Drawer({ topic, theme, onClose }) {
  const [tab, setTab] = useState("vocab");
  const { get, set } = useProgress();
  const data = DATA[topic];
  const accent = theme?.accent || "#fff";
  if (!data) return null;

  const cur = get(topic);

  return (
    <motion.div
      className="drawer"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.4 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 140 || info.velocity.y > 600) onClose();
      }}
    >
      <div className="drawer-handle" onClick={onClose} />
      <button className="drawer-close" onClick={onClose} aria-label="Close">
        <X size={14} weight="bold" />
      </button>

      <div className="drawer-header">
        <span className="drawer-theme-tag" style={{ color: accent }}>
          {theme?.label}
        </span>
        <div className="drawer-topic-name">{topic}</div>

        <div className="prog-row">
          <span className="prog-lbl">
            <ChartBar size={11} weight="fill" /> Progress
          </span>
          <div className="prog-pills">
            {PROG_STATES.map((s) => {
              const on = s.key === cur;
              return (
                <button
                  key={s.key}
                  className={`pp${on ? " " + s.key : ""}`}
                  onClick={() => set(topic, s.key)}
                >
                  <s.Icon size={12} weight={on ? "fill" : "regular"} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="drawer-tabs">
          {TABS.map((t) => {
            const on = tab === t.k;
            return (
              <button
                key={t.k}
                className={`dtab${on ? " on" : ""}`}
                style={on ? { color: accent } : undefined}
                onClick={() => setTab(t.k)}
              >
                <t.Icon size={13} weight={on ? "fill" : "regular"} /> {t.l}
              </button>
            );
          })}
        </div>
      </div>

      <div className="drawer-content" key={tab}>
        {tab === "vocab" && <VocabTab vocabulary={data.vocabulary} accent={accent} />}
        {tab === "countries" && (
          <CountriesTab countries={data.countries} accent={accent} />
        )}
        {tab === "sources" && <SourcesTab sources={data.sources} accent={accent} />}
        {tab === "questions" && (
          <QuestionsTab questions={data.questions} accent={accent} />
        )}
        {tab === "phrases" && <PhrasesTab accent={accent} />}
        {tab === "ib" && (
          <IBCriteriaTab
            themeId={theme?.id}
            themeLabel={theme?.label}
            accent={accent}
          />
        )}
      </div>
    </motion.div>
  );
}
