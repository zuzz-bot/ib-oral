// Stimulus image bank for the Mock Oral. These are people-in-context,
// describable, documentary-style photos (you can name nationality, age,
// emotions, place, objects, clothes) that connect to a theme + subtopic —
// the kind of image used in the English B Individual Oral.
const img = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=80&auto=format&fit=crop`;

export const STIMULI = [
  // Social Organization
  { theme: "Social Organization", topic: "Volunteering", photo: img("1599059813005-11265ba4b4ce") },
  { theme: "Social Organization", topic: "Volunteering", photo: img("1593113646773-028c64a8f1b8") },
  { theme: "Social Organization", topic: "Volunteering", photo: img("1615897570286-da936a5dfb81") },
  { theme: "Social Organization", topic: "Law & Order", photo: img("1602089097457-1badf4b7ffa7") },
  { theme: "Social Organization", topic: "Law & Order", photo: img("1645106849352-3923c48b27c3") },
  { theme: "Social Organization", topic: "Relationships", photo: img("1758612899162-7f9abfc0d6a3") },
  { theme: "Social Organization", topic: "Relationships", photo: img("1756982477754-2c05a288f4db") },
  { theme: "Social Organization", topic: "Relationships", photo: img("1641064496126-cf64a61c6fae") },

  // Identities
  { theme: "Identities", topic: "Subcultures", photo: img("1501386761578-eac5c94b800a") },
  { theme: "Identities", topic: "Subcultures", photo: img("1567942712661-82b9b407abbf") },
  { theme: "Identities", topic: "Subcultures", photo: img("1470229722913-7c0e2dbbafd3") },
  { theme: "Identities", topic: "Mental Health", photo: img("1473830394358-91588751b241") },
  { theme: "Identities", topic: "Mental Health", photo: img("1481467804160-3cdf91aa1ac4") },

  // Experiences
  { theme: "Experiences", topic: "Travel", photo: img("1517400508447-f8dd518b86db") },
  { theme: "Experiences", topic: "Travel", photo: img("1530521954074-e64f6810b32d") },
  { theme: "Experiences", topic: "Migration", photo: img("1735695314394-1a46134bb8fd") },
  { theme: "Experiences", topic: "Migration", photo: img("1722627268454-f54354af976c") },

  // Sharing the Planet
  { theme: "Sharing the Planet", topic: "Environment", photo: img("1552799446-159ba9523315") },
  { theme: "Sharing the Planet", topic: "Environment", photo: img("1570095378004-ce65d6c2d5bb") },
  { theme: "Sharing the Planet", topic: "Poverty", photo: img("1503443062224-9f77d743cf25") },
  { theme: "Sharing the Planet", topic: "Poverty", photo: img("1675965376382-05d9cb872eb5") },

  // Human Ingenuity
  { theme: "Human Ingenuity", topic: "Scientific Innovation", photo: img("1707944746058-4da338d0f827") },
  { theme: "Human Ingenuity", topic: "Scientific Innovation", photo: img("1748261347768-a32434751a9a") },
  { theme: "Human Ingenuity", topic: "Communication & Media", photo: img("1573152143286-0c422b4d2175") },
  { theme: "Human Ingenuity", topic: "Communication & Media", photo: img("1478301672914-6eba52f60d13") },
  { theme: "Human Ingenuity", topic: "Artistic Expressions", photo: img("1577538926052-eed14ba588dc") },
  { theme: "Human Ingenuity", topic: "Artistic Expressions", photo: img("1549499090-5fa12865059c") },
];
