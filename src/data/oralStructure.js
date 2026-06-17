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
  note: "SL Individual Oral · based on a visual stimulus · worth 30% of your grade",
  criteria: [
    {
      k: "A",
      name: "Language",
      marks: 12,
      measures:
        "How well you command spoken English — the range and accuracy of your vocabulary and grammar, plus fluency, pronunciation and register.",
      wins: [
        "Wide, precise and varied vocabulary",
        "Varied sentence structures, mostly accurate",
        "Clear pronunciation & intonation that aid meaning",
        "Natural, fluent delivery — not robotic or memorised",
      ],
      tip: "Mix short and complex sentences, choose precise words, and modulate your voice.",
    },
    {
      k: "B",
      name: "Message",
      marks: 12,
      measures:
        "How relevant, developed and well-supported your ideas are — about the picture and in the conversation — with clear links to the theme and Anglophone cultures.",
      wins: [
        "Describe AND interpret the stimulus (not just list what you see)",
        "Connect it to the theme with real examples",
        "Develop ideas in depth and take a clear stance",
        "Support with evidence and UK / USA / India contrasts",
      ],
      tip: "Describe → interpret → connect to the theme → opinion with 2 arguments (Answer · Evidence · Exemplify · Data).",
    },
    {
      k: "C",
      name: "Interactive skills",
      marks: 6,
      measures:
        "How well you understand the examiner and keep the conversation going on your own.",
      wins: [
        "Understand questions the first time",
        "Give full, developed answers — not one-liners",
        "Keep the conversation flowing and take initiative",
        "Ask for clarification politely when you need it",
      ],
      tip: "Build on your answers and help lead the conversation — don't wait to be pulled along.",
    },
  ],
};
