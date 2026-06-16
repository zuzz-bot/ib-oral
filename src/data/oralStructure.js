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
