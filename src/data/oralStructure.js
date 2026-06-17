// The real IO structure (English B SL) from the teacher's brief, used to drive
// the Mock Oral simulator: sections, target times, and on-screen coaching.
export const ORAL_SECTIONS = [
  {
    id: "presentation",
    name: "Presentation",
    target: "3–4 min",
    targetSec: 225,
    basis: "Based on the picture",
    steps: [
      { label: "Greeting", hint: "A warm hello to the examiner." },
      { label: "Name the theme, link it to the picture", hint: "State the theme and connect it to what you see." },
      { label: "Describe the picture", hint: "Nationality, age, emotions, place, objects, clothes…", sub: 90 },
      { label: "Personal opinion", hint: "What you think + what you already know about it." },
      { label: "Anglophone countries", hint: "Give 2 arguments and your view on each." },
    ],
  },
  {
    id: "discussion1",
    name: "Discussion 1",
    target: "8–9 min",
    targetSec: 300,
    basis: "Based on the picture · teacher asks, you answer",
    framework: true,
  },
  {
    id: "discussion2",
    name: "Discussion 2 · 2nd theme",
    target: "up to ~12 min",
    targetSec: 180,
    basis: "Based on a second theme",
    framework: true,
  },
  {
    id: "discussion3",
    name: "Discussion 3 · 3rd theme",
    target: "up to 14:30",
    targetSec: 150,
    basis: "Based on a third theme",
    framework: true,
  },
];

// The answer scaffold the teacher wants in every discussion answer.
export const AEED = [
  { k: "Answer", hint: "Respond to the question directly, first." },
  { k: "Evidence", hint: "Back it with a fact or a reason." },
  { k: "Exemplify", hint: "Give a concrete, real example." },
  { k: "Data", hint: "Add a statistic or a country contrast." },
];

export const IO_CRITERIA = [
  { k: "Language", hint: "Range, accuracy, fluency of your English." },
  { k: "Message", hint: "Ideas, relevance, depth, link to the theme." },
  { k: "Interaction", hint: "Conversation skills, responding, developing ideas." },
];

// English B SL Individual Oral rubric, paraphrased in plain English (the exact
// IB band descriptors are copyrighted — confirm wording with your teacher).
export const IO_RUBRIC = {
  total: 30,
  note: "SL Individual Oral · 12–15 min (+15 min prep) · visual stimulus · worth 25% of your grade",
  criteria: [
    {
      k: "A",
      name: "Language",
      marks: 12,
      measures:
        "How successfully you command spoken English — appropriate and varied vocabulary, varied grammar, accuracy that aids communication, and pronunciation & intonation.",
      wins: [
        "Varied, appropriate vocabulary (idiomatic at the top end)",
        "A mix of basic and more complex structures, used well",
        "Mostly accurate — minor slips don't block meaning",
        "Pronunciation & intonation easy to follow, helping convey meaning",
      ],
      tip: "Mix short and complex sentences, choose precise words, and let your intonation carry meaning.",
    },
    {
      k: "B1",
      name: "Message · visual stimulus",
      marks: 6,
      measures:
        "How relevant your presentation is to the picture, and how well you link it to the target (Anglophone) culture.",
      wins: [
        "Stay consistently relevant to the stimulus",
        "Go beyond surface details — describe AND interpret",
        "Make clear links to the target culture(s)",
        "Offer your own personal reading of the image",
      ],
      tip: "Don't just list what you see — interpret it and tie it to the theme and Anglophone cultures.",
    },
    {
      k: "B2",
      name: "Message · conversation",
      marks: 6,
      measures:
        "How relevant, appropriate and developed your answers are during the discussion.",
      wins: [
        "Answer the question directly and stay relevant",
        "Develop answers in scope and depth — not one-liners",
        "Add personal interpretation",
        "Engage the examiner back",
      ],
      tip: "Answer · Evidence · Exemplify · Data — develop every answer, don't stop at one sentence.",
    },
    {
      k: "C",
      name: "Interactive skills",
      marks: 6,
      measures:
        "How well you understand and sustain the conversation, on your own.",
      wins: [
        "Understand questions the first time (little need to repeat)",
        "Keep your participation sustained",
        "Make independent contributions and take initiative",
        "Express ideas clearly and keep the conversation going",
      ],
      tip: "Lead the conversation and add your own ideas — don't wait to be pulled along.",
    },
  ],
};
