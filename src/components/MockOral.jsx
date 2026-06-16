import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  X, Microphone, ArrowRight, ArrowsClockwise, Clock, NotePencil,
  Play, Star, Flag, CheckCircle, Circle, Bell,
} from "@phosphor-icons/react";
import { THEMES, DATA } from "../data/content.js";
import { STIMULI } from "../data/stimuli.js";
import { ORAL_SECTIONS, AEED, IO_CRITERIA } from "../data/oralStructure.js";

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, "0")}`;
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const PREP = 15 * 60; // 15:00 prep, like the real exam

// Absolute time boundaries for the continuous, auto-flowing oral.
const BOUNDS = (() => {
  let acc = 0;
  return ORAL_SECTIONS.map((s) => (acc += s.targetSec));
})();
const TOTAL = BOUNDS[BOUNDS.length - 1];
const sectionFor = (e) => {
  for (let i = 0; i < BOUNDS.length; i++) if (e < BOUNDS[i]) return i;
  return BOUNDS.length - 1;
};

function buildExam() {
  const stim = pick(STIMULI);
  const picT = THEMES.find((t) => t.label === stim.theme) || THEMES[0];
  const topicOf = (t) => pick(t.topics);
  const qOf = (topic) => DATA[topic]?.questions || [];
  const [t2, t3] = THEMES.filter((t) => t.label !== stim.theme).sort(() => Math.random() - 0.5);
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
  const [phase, setPhase] = useState("setup"); // setup | prep | oral | done
  const [prepRemain, setPrepRemain] = useState(PREP);
  const [notes, setNotes] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [secIdx, setSecIdx] = useState(0);
  const [checked, setChecked] = useState(() => new Set());
  const [recUrl, setRecUrl] = useState(null);
  const [recOn, setRecOn] = useState(false);
  const [micError, setMicError] = useState(false);
  const [ratings, setRatings] = useState({ Language: 0, Message: 0, Interaction: 0 });

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioRef = useRef(null);

  const section = ORAL_SECTIONS[secIdx];
  const ctx = exam.ctx[section.id] || {};

  // ── sound cues (Web Audio, unlocked on the first button press) ──
  const ensureAudio = () => {
    if (!audioRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioRef.current = new AC();
    }
    audioRef.current?.resume?.();
    return audioRef.current;
  };
  const chime = (notesArr, gap = 0.16) => {
    const ac = ensureAudio();
    if (!ac) return;
    let t = ac.currentTime;
    notesArr.forEach((f) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.value = f;
      o.connect(g);
      g.connect(ac.destination);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.start(t);
      o.stop(t + 0.32);
      t += gap;
    });
  };
  const cueWarn = () => chime([523, 392], 0.2);
  const cueSection = () => chime([659, 880]);
  const cueEnd = () => chime([784, 659, 523], 0.18);

  // ── recording ──
  const beginRec = async () => {
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
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      recorderRef.current = mr;
      mr.start();
      setRecOn(true);
    } catch {
      setMicError(true);
    }
  };
  const endRec = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    setRecOn(false);
  };

  // ── prep countdown ──
  useEffect(() => {
    if (phase !== "prep") return;
    const id = setInterval(() => setPrepRemain((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [phase]);
  useEffect(() => {
    if (phase !== "prep") return;
    if (prepRemain === 300 || prepRemain === 60) cueWarn();
    if (prepRemain <= 0) startOral();
  }, [prepRemain, phase]);

  // ── oral clock (continuous, auto-advancing) ──
  useEffect(() => {
    if (phase !== "oral") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);
  useEffect(() => {
    if (phase !== "oral") return;
    if (elapsed >= TOTAL) { finishOral(); return; }
    const idx = sectionFor(elapsed);
    if (idx !== secIdx) { setSecIdx(idx); cueSection(); }
  }, [elapsed, phase]);

  const startPrep = () => { ensureAudio(); setPhase("prep"); };
  const startOral = () => {
    ensureAudio();
    cueSection();
    setElapsed(0);
    setSecIdx(0);
    setPhase("oral");
    beginRec();
  };
  const finishOral = () => {
    endRec();
    cueEnd();
    setPhase("done");
  };
  const restart = () => {
    setPhase("setup");
    setPrepRemain(PREP);
    setNotes("");
    setElapsed(0);
    setSecIdx(0);
    setChecked(new Set());
    setRatings({ Language: 0, Message: 0, Interaction: 0 });
    if (recUrl) { URL.revokeObjectURL(recUrl); setRecUrl(null); }
  };
  const toggleStep = (label) =>
    setChecked((s) => { const n = new Set(s); n.has(label) ? n.delete(label) : n.add(label); return n; });

  useEffect(() => () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioRef.current?.close?.();
  }, []);

  const sectionPct = (() => {
    const start = secIdx === 0 ? 0 : BOUNDS[secIdx - 1];
    const span = BOUNDS[secIdx] - start;
    return Math.min(100, Math.max(0, ((elapsed - start) / span) * 100));
  })();

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
        {phase === "prep" && (
          <span className="mock-clock">
            <NotePencil size={15} weight="fill" /> Prep {fmt(prepRemain)}
          </span>
        )}
        {phase === "oral" && (
          <span className="mock-clock">
            <Clock size={15} weight="fill" /> {fmt(elapsed)}
            <span className="mock-clock-sub"> / {fmt(TOTAL)}</span>
          </span>
        )}
        <button className="mock-close" onClick={onClose} aria-label="Close">
          <X size={16} weight="bold" />
        </button>
      </div>

      {phase === "oral" && (
        <div className="mock-segs">
          {ORAL_SECTIONS.map((s, i) => (
            <div key={s.id} className="mock-seg" style={{ flex: s.targetSec }}>
              <span
                className="mock-seg-fill"
                style={{
                  width: i < secIdx ? "100%" : i === secIdx ? `${sectionPct}%` : "0%",
                  background: accent,
                }}
              />
            </div>
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
              Just like the real exam: you'll get <strong style={{ color: accent }}>15 minutes</strong> to
              plan, then the oral runs on its own — sections change automatically with a
              sound, no clicking. A chime warns you near the end of prep.
            </p>
            <button className="mock-start" onClick={startPrep} style={{ background: accent }}>
              <NotePencil size={17} weight="fill" /> Start prep (15 min)
            </button>
          </div>
        )}

        {phase === "prep" && (
          <div className="mock-live">
            <div>
              <div className="mock-stim">
                <img src={exam.stimulus.photo} alt="stimulus" />
                <span className="mock-stim-theme">{exam.stimulus.theme}</span>
              </div>
              <div className="mock-prep-guide">
                <span className="mock-coach-sub">Plan your presentation</span>
                {ORAL_SECTIONS[0].steps.map((st) => (
                  <div key={st.label} className="mock-guide-item">
                    <span style={{ color: accent }}>—</span> {st.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="mock-coach">
              <div className="mock-coach-head">
                <span className="mock-sec-name">Your notes</span>
                <span className="mock-sec-basis">Jot your outline — keywords, stats, 2 arguments…</span>
              </div>
              <textarea
                className="mock-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={"e.g.\n• Theme: " + exam.stimulus.theme + "\n• Description: …\n• Opinion: …\n• UK / USA / India: …"}
                autoFocus
              />
              <button className="mock-ready" onClick={startOral} style={{ background: accent }}>
                I'm ready — start the oral <ArrowRight size={15} weight="bold" />
              </button>
            </div>
          </div>
        )}

        {phase === "oral" && (
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
                        {st.sub && <span className="mock-substep">{fmt(st.sub)}</span>}
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
                <span className="mock-done-small">full oral · target {fmt(TOTAL)}</span>
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

      {phase === "prep" && (
        <div className="mock-controls">
          <span className="mock-prep-hint"><Bell size={15} weight="fill" /> Chime at 5 min &amp; 1 min left</span>
        </div>
      )}
      {phase === "oral" && (
        <div className="mock-controls">
          <span className={`mock-rec${recOn ? " on" : ""}`}>
            <Microphone size={15} weight="fill" /> {recOn ? "Recording" : micError ? "Mic off" : "—"}
          </span>
          <span className="mock-rec-note">sections change automatically</span>
          <button className="mock-next" onClick={finishOral} style={{ background: accent }}>
            Finish now <Flag size={15} weight="bold" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
