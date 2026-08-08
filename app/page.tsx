"use client";

import { useState } from "react";
import { useData } from "@/lib/data-context";
import StudentsTab from "@/components/StudentsTab";
import CoursesTab from "@/components/CoursesTab";
import AttendanceTab from "@/components/AttendanceTab";
import DashboardTab from "@/components/DashboardTab";

type Tab = "students" | "courses" | "attendance" | "dashboard";

const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "students", label: "Students" },
  { id: "courses", label: "Courses" },
  { id: "attendance", label: "Take Attendance" },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const { loaded, students, addStudent, addCourse } = useData();

  const seedDemoData = () => {
    const programme = "BSc Computer Science";
    addStudent({ name: "Naledi Amupolo", programme, yearOfStudy: 2, semester: "Semester 1" });
    addStudent({ name: "Johannes Shikongo", programme, yearOfStudy: 2, semester: "Semester 1" });
    addStudent({ name: "Ester Nangolo", programme, yearOfStudy: 2, semester: "Semester 1" });
    addCourse({ code: "CSC201", name: "Data Structures & Algorithms", programme, yearOfStudy: 2, semester: "Semester 1" });
    addCourse({ code: "CSC205", name: "Database Systems", programme, yearOfStudy: 2, semester: "Semester 1" });
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-ink-faint">
        Loading register…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-paper/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brass font-medium">
              Attendance Ledger
            </p>
            <h1 className="font-serif text-2xl font-semibold text-ink">
              Register
            </h1>
          </div>
          {students.length === 0 && (
            <button
              onClick={seedDemoData}
              className="text-xs border border-ink/20 rounded-sm px-3 py-2 text-ink-faint hover:border-ink/40 hover:text-ink transition-colors focus-ring"
            >
              Load sample data
            </button>
          )}
        </div>
        <nav className="max-w-6xl mx-auto px-6 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus-ring",
                tab === t.id
                  ? "border-brass text-ink"
                  : "border-transparent text-ink-faint hover:text-ink",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === "dashboard" && <DashboardTab />}
        {tab === "students" && <StudentsTab />}
        {tab === "courses" && <CoursesTab />}
        {tab === "attendance" && <AttendanceTab />}
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-8 text-xs text-ink-faint">
        Attendance target: 80%. Records are stored locally in this browser.
      </footer>
    </div>
  );
}
