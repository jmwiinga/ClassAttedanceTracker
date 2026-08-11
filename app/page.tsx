"use client";

import { useState } from "react";
import Image from "next/image";
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
    addStudent({ studentNumber: "223011234", name: "Naledi Amupolo", programme, yearOfStudy: 2, semester: "Semester 1" });
    addStudent({ studentNumber: "223019876", name: "Johannes Shikongo", programme, yearOfStudy: 2, semester: "Semester 1" });
    addStudent({ studentNumber: "223014567", name: "Ester Nangolo", programme, yearOfStudy: 2, semester: "Semester 1" });
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
      <header className="sticky top-0 z-10">
        <div className="bg-ink">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/nust-logo.png"
                alt="Namibia University of Science and Technology"
                width={246}
                height={46}
                priority
                className="h-9 w-auto rounded-[2px]"
              />
              <div className="hidden sm:block h-8 w-px bg-white/20" />
              <div className="hidden sm:block">
                <p className="text-[10px] uppercase tracking-[0.22em] text-brass font-medium">
                  Class Attendance 
                </p>
                <h1 className="font-serif text-lg font-semibold text-white leading-tight">
                  Register
                </h1>
              </div>
            </div>
            {students.length === 0 && (
              <button
                onClick={seedDemoData}
                className="text-xs border border-white/25 rounded-sm px-3 py-2 text-white/80 hover:border-white/50 hover:text-white transition-colors focus-ring"
              >
                Load sample data
              </button>
            )}
          </div>
          <nav className="max-w-6xl mx-auto px-6 flex gap-1 border-t border-white/10">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus-ring",
                  tab === t.id
                    ? "border-brass text-white"
                    : "border-transparent text-white/60 hover:text-white",
                ].join(" ")}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="h-1 bg-nustred" />
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
