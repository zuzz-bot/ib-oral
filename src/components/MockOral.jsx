import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  X, Microphone, Stop, Play, ArrowRight, ArrowsClockwise, Clock,
  Sparkle, CheckCircle, Circle, Star, Flag,
} from "@phosphor-icons/react";
import { THEMES, DATA } from "../data/content.js";
import { STIMULI } from "../data/stimuli.js";
import { ORAL_SECTIONS, AEED, IO_CRITERIA } from "../data/oralStructure.js";

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const pick = (a) => a[Math.floor(Math.random() * a.length)];

function buildExam() {
  // Random stimulus image (people-in-context) → its theme is the picture theme.
  const stim = pick(STIMULI);
  const picT = THEMES.find((t) => t.label === stim.theme) || THEMES[0];
  const topicOf = (t) => pick(t.topics);
  const qOf = (topic) => DATA[topic]?.questions || [];
  const [t2, t3] = THEMES.filter((t) => t.label !== stim.theme).sort(
    () => Math.random() - 0.5
  );
  return {
    accent: picT.accent,
    stimulus: { photo: stim.photo, theme: stim.theme, topic: stim.topic },
    ctx: {
      presentation: { theme: stim.theme },
      discussion1: { theme: stim.theme, questions: qOf(stim.topic) },
      discussion2: { theme: t2.label, questions: qOf(topicOf(t2)) },
      discussion3: { theme: t3.label, questions: qOf(topicOf(t3)) },
    },
  };
}

export default function MockOral({ onClose }) {
  const exam = useMemo(buildExam, []);
  const accent = exam.accent;
  const [phase, setPhase] = useState("setup"); // setup | live | done
  const [secIdx, setSecIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [checked, setChecked] = useState(() => new Set());
  const [subRemain, setSubRemain] = useState(null);
  const [rec, setRec] = useState(false);
  const [recUrl, setRecUrl] = useState(null);
  const [recSec, setRecSec] = useState(0);
  const [micError, setMicError] = useState(false);
  const [ratings, setRatings] = useState({ Language: 0, Message: 0, Interaction: 0 });

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const section = ORAL_SECTIONS[secIdx];
  const ctx = exam.ctx[section.id] || {};

  // main clock
  useEffect(() => {
    if (phase !== "live") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // description sub-timer (1:30)
  useEffect(() => {
    if (subRemain == null || subRemain <= 0) return;
    const id = setInterval(() => setSubRemain((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [subRemain]);

  // recording timer
  useEffect(() => {
    if (!rec) return;
    const id = setInterval(() => setRecSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [rec]);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const toggleRec = async () => {
    if (rec) {
      recorderRef.current?.stop();
      setRec(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecUrl((u) => {
          if (u) URL.revokeObjectURL(u);
          return URL.createObjectURL(blob);
        });
        stopStream();
      };
      recorderRef.current = mr;
      mr.start();
      setRecSec(0);
      setRec(true);
      setMicError(false);
    } catch {
      setMicError(true);
    }
  };

  useEffect(() => () => { recorderRef.current?.state === "recording" && recorderRef.current.stop(); stopStream(); }, []);

  const start = () => { setPhase("live"); setElapsed(0); setSecIdx(0); };
  const next = () => {
    if (secIdx < ORAL_SECTIONS.length - 1) setSecIdx((i) => i + 1);
    else { if (rec) toggleRec(); setPhase("done"); }
  };
  const restart = () => {
    setPhase("setup"); setSecIdx(0); setElapsed(0); setChecked(new Set());
    setSubRemain(null); setRecSec(0); setRatings({ Language: 0, Message: 0, Interaction: 0 });
    if (recUrl) { URL.revokeObjectURL(recUrl); setRecUrl(null); }
  };
  const toggleStep = (label) =>
    setChecked((s) => { const n = new Set(s); n.has(label) ? n.delete(label) : n.add(label); return n; });

  return (
    <motion.div
      className="mock"
      style={{ "--accent": accent }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mock-head">
        <span className="mock-tag" style={{ color: accent }}>
          <Microphone size={15} weight="fill" /> Mock oral
        </span>
        {phase === "live" && (
          <span className="mock-clock">
            <Clock size={15} weight="fill" /> {fmt(elapsed)}
            <span className="mock-clock-sub"> / {section.target}</span>
          </span>
        )}
        <button className="mock-close" onClick={onClose} aria-label="Close">
          <X size={16} weight="bold" />
        </button>
      </div>

      {phase === "live" && (
        <div className="mock-segs">
          {ORAL_SECTIONS.map((s, i) => (
            <div
              key={s.id}
              className="mock-seg"
              style={{ background: i <= secIdx ? accent : undefined, flex: s.targetSec }}
            />
          ))}
        </div>
      )}

      <div className="mock-body">
        {phase === "setup" && (
          <div className="mock-setup">
            <p className="mock-kicker" style={{ color: accent }}>Your stimulus</p>
            <div className="mock-stim mock-stim-big">
              <img src={exam.stimulus.photo} alt="stimulus" />
              <span className="mock-stim-theme">Theme · {exam.stimulus.theme}</span>
            </div>
            <p className="mock-setup-note">
              In the real oral you get 15 min to prepare. When you're ready, run it
              like the exam: present, then discuss. The coach keeps you on track.
            </p>
            <button className="mock-start" onClick={start} style={{ background: accent }}>
              <Play size={17} weight="fill" /> Start the oral
            </button>
          </div>
        )}

        {phase === "live" && (
          <div className="mock-live">
            <div className="mock-stim">
              <img src={exam.stimulus.photo} alt="stimulus" />
              <span className="mock-stim-theme">{exam.stimulus.theme}</span>
            </div>

            <div className="mock-coach">
              <div className="mock-coach-head">
                <span className="mock-sec-name">{section.name}</span>
                <span className="mock-sec-basis">{section.basis}</span>
              </div>

              {section.steps && (
                <div className="mock-steps">
                  {section.steps.map((st) => {
                    const on = checked.has(st.label);
                    return (
                      <button key={st.label} className={`mock-step${on ? " on" : ""}`} onClick={() => toggleStep(st.label)}>
                        {on ? <CheckCircle size={18} weight="fill" style={{ color: accent }} /> : <Circle size={18} />}
                        <span>
                          <span className="mock-step-label">{st.label}</span>
                          <span className="mock-step-hint">{st.hint}</span>
                        </span>
                        {st.sub && (
                          <span
                            className="mock-substep"
                            onClick={(e) => { e.stopPropagation(); setSubRemain(st.sub); }}
                          >
                            {subRemain != null ? fmt(subRemain) : "1:30"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {section.framework && (
                <>
                  <div className="mock-aeed">
                    {AEED.map((a) => (
                      <div key={a.k} className="mock-aeed-item">
                        <span className="mock-aeed-k" style={{ color: accent }}>{a.k}</span>
                        <span className="mock-aeed-h">{a.hint}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mock-coach-sub">Likely questions — {ctx.theme}</p>
                  <div className="mock-qs">
                    {(ctx.questions || []).map((q, i) => (
                      <div key={i} className="mock-q">{q}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="mock-done">
            <div className="mock-done-time">
              <Flag size={22} weight="fill" style={{ color: accent }} />
              <div>
                <span className="mock-done-big">{fmt(elapsed)}</span>
                <span className="mock-done-small">target 14:30 · aim for the full time</span>
              </div>
            </div>

            {recUrl && (
              <div className="mock-playback">
                <span className="mock-playback-l"><Play size={15} weight="fill" /> Listen back</span>
                <audio src={recUrl} controls style={{ width: "100%" }} />
              </div>
            )}

            <p className="mock-coach-sub">Rate yourself against the IB criteria</p>
            <div className="mock-rate">
              {IO_CRITERIA.map((c) => (
                <div key={c.k} className="mock-rate-row">
                  <span className="mock-rate-k">{c.k}<span className="mock-rate-h">{c.hint}</span></span>
                  <span className="mock-stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} aria-label={`${c.k} ${n}`} onClick={() => setRatings((r) => ({ ...r, [c.k]: n }))}>
                        <Star size={18} weight={n <= ratings[c.k] ? "fill" : "regular"} style={{ color: n <= ratings[c.k] ? accent : "#555" }} />
                      </button>
                    ))}
                  </span>
                </div>
              ))}
            </div>

            <div className="mock-done-actions">
              <button className="mock-again" onClick={restart}><ArrowsClockwise size={16} weight="bold" /> Practice again</button>
              <button className="mock-finish" onClick={onClose} style={{ background: accent }}>Done</button>
            </div>
          </div>
        )}
      </div>

      {phase === "live" && (
        <div className="mock-controls">
          <button className={`mock-rec${rec ? " on" : ""}`} onClick={toggleRec}>
            {rec ? <Stop size={16} weight="fill" /> : <Microphone size={16} weight="fill" />}
            {rec ? `Rec ${fmt(recSec)}` : "Record"}
          </button>
          <span className="mock-rec-note">
            {micError ? "mic blocked — runs fine without it" : "stays on your device"}
          </span>
          <button className="mock-next" onClick={next} style={{ background: accent }}>
            {secIdx < ORAL_SECTIONS.length - 1 ? <>Next section <ArrowRight size={15} weight="bold" /></> : <>Finish <Flag size={15} weight="bold" /></>}
          </button>
        </div>
      )}
    </motion.div>
  );
}
