// Notes data + Supabase config.
//
// Copied from the profile site (diptidhawade/src/constants/index.js), keeping
// only the Plaksha category. Keep the subjects in step when they change.
//
// The anon key is a publishable key: it is already served in plain text by the
// profile site's own bundle, and the Notes bucket is read-only to it (upload and
// delete both return 400). Security here comes from Supabase Row Level Security,
// not from hiding this string. Never put the service_role key in this file.
const SUPABASE_URL = 'https://jlmzxsaysnvoxbutfkxw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbXp4c2F5c252b3hidXRma3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNDA2NTcsImV4cCI6MjA4NzYxNjY1N30.VvBgtpcmwuhoBSdjUKE5A3_9At-S2cCznCqfS_ECUkg';
const NOTES_BUCKET = 'Notes';

const FOLDER_TYPES = ["Class Notes", "Tutorials/Assignments", "Exam Practice", "Past Papers"];
const FOLDER_SLUGS = {
  "Class Notes": "class-notes",
  "Tutorials/Assignments": "tutorials-assignments",
  "Exam Practice": "exam-practice",
  "Past Papers": "past-papers",
};
const SLUG_TO_FOLDER = Object.fromEntries(
  Object.entries(FOLDER_SLUGS).map(([name, slug]) => [slug, name])
);

const notesCategories = [
  {
    id: "plaksha-university",
    title: "Plaksha University | CSAI",
    subheading: null,
    image: "/assets/notes/plaksha.png",
    subjectLabels: ["Machine Learning", "Deep Learning", "Design and Analysis of Algorithms", "Theory of Computation", "Foundations of Computer Systems", "Computer Networks", "Discrete Maths"],
    subjects: [
      {
        id: "design-analysis-algorithms",
        name: "Design and Analysis of Algorithms",
        folders: { "Class Notes": [], "Tutorials/Assignments": [], "Exam Practice": [], "Past Papers": [] },
      },
      {
        id: "database-management-systems",
        name: "Database Management Systems",
        folders: { "Class Notes": [], "Tutorials/Assignments": [], "Exam Practice": [], "Past Papers": [] },
      },
      {
        id: "discrete-maths",
        name: "Discrete Maths",
        folders: { "Class Notes": [], "Tutorials/Assignments": [], "Exam Practice": [], "Past Papers": [] },
      },
      {
        id: "theory-of-computation",
        name: "Theory of Computation",
        folders: { "Class Notes": [], "Tutorials/Assignments": [], "Exam Practice": [], "Past Papers": [] },
      },
      {
        id: "foundations-computer-systems",
        name: "Foundations of Computer Systems",
        folders: { "Class Notes": [], "Tutorials/Assignments": [], "Exam Practice": [], "Past Papers": [] },
      },
      {
        id: "machine-learning",
        name: "Machine Learning",
        folders: { "Class Notes": [], "Tutorials/Assignments": [], "Exam Practice": [], "Past Papers": [] },
      },
      {
        id: "computer-networks",
        name: "Computer Networks",
        folders: { "Class Notes": [], "Tutorials/Assignments": [], "Exam Practice": [], "Past Papers": [] },
      },
      {
        id: "deep-learning",
        name: "Deep Learning",
        folders: { "Class Notes": [], "Tutorials/Assignments": [], "Exam Practice": [], "Past Papers": [] },
      },
      {
        id: "operating-systems",
        name: "Operating Systems",
        folders: { "Class Notes": [], "Tutorials/Assignments": [], "Exam Practice": [], "Past Papers": [] },
      },
      {
        id: "Reinforcement Learning",
        name: "Reinforcement Learning",
        folders: { "Class Notes": [], "Tutorials/Assignments": [], "Exam Practice": [], "Past Papers": [] },
      }
    ],
  },
];
