const CLASS_THEMES = [
  { gradient: "from-primary-600 to-primary-700", solidLight: "bg-primary-100 text-primary-700" },
  { gradient: "from-blue-600 to-blue-700", solidLight: "bg-blue-100 text-blue-700" },
  { gradient: "from-purple-600 to-purple-700", solidLight: "bg-purple-100 text-purple-700" },
  { gradient: "from-amber-600 to-amber-700", solidLight: "bg-amber-100 text-amber-700" },
  { gradient: "from-rose-600 to-rose-700", solidLight: "bg-rose-100 text-rose-700" },
  { gradient: "from-teal-600 to-teal-700", solidLight: "bg-teal-100 text-teal-700" },
];

export const getClassTheme = (classId) => {
  if (!classId) return CLASS_THEMES[0];
  const hash = classId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CLASS_THEMES[hash % CLASS_THEMES.length];
};