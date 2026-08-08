"use client";

import { useState } from "react";
import { useData } from "@/lib/data-context";
import { Semester } from "@/lib/types";

const SEMESTERS: Semester[] = ["Semester 1", "Semester 2", "Semester 3"];

export default function CoursesTab() {
  const { courses, addCourse, removeCourse } = useData();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [programme, setProgramme] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [semester, setSemester] = useState<Semester>("Semester 1");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !programme.trim()) {
      setError("Enter the course code, course name and programme.");
      return;
    }
    addCourse({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      programme: programme.trim(),
      yearOfStudy,
      semester,
    });
    setCode("");
    setName("");
    setProgramme("");
    setError("");
  };

  return (
    <div className="grid gap-8 md:grid-cols-[340px_1fr]">
      <form
        onSubmit={submit}
        className="bg-paper-card border border-ink/10 rounded-md p-5 h-fit sticky top-6"
      >
        <h2 className="font-serif text-lg font-semibold mb-4">Add a course</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">
              Course code
            </label>
            <input
              className="w-full border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CSC301"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">
              Course name
            </label>
            <input
              className="w-full border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Database Systems"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">
              Programme of study
            </label>
            <input
              className="w-full border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring"
              value={programme}
              onChange={(e) => setProgramme(e.target.value)}
              placeholder="Must match a student's programme"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">
                Year of study
              </label>
              <input
                type="number"
                min={1}
                max={7}
                className="w-full border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring"
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-faint mb-1">
                Semester
              </label>
              <select
                className="w-full border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring bg-white"
                value={semester}
                onChange={(e) => setSemester(e.target.value as Semester)}
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="text-xs text-bad">{error}</p>}
          <button
            type="submit"
            className="w-full bg-ink text-paper rounded-sm py-2 text-sm font-medium hover:bg-ink-light transition-colors focus-ring"
          >
            Add course
          </button>
        </div>
      </form>

      <div className="bg-paper-card border border-ink/10 rounded-md overflow-hidden">
        <div className="px-5 py-4 border-b border-ink/10 flex items-baseline justify-between">
          <h2 className="font-serif text-lg font-semibold">Course list</h2>
          <span className="text-xs text-ink-faint font-mono">
            {courses.length} course{courses.length === 1 ? "" : "s"}
          </span>
        </div>
        {courses.length === 0 ? (
          <p className="p-6 text-sm text-ink-faint">
            No courses yet. Add the first one using the form. A course only
            appears for attendance-taking once students with a matching
            programme, year and semester are enrolled.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-faint border-b border-ink/10">
                <th className="px-5 py-3 font-medium">Code</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Programme</th>
                <th className="px-5 py-3 font-medium">Year</th>
                <th className="px-5 py-3 font-medium">Semester</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3 font-mono text-xs font-medium">
                    {c.code}
                  </td>
                  <td className="px-5 py-3 font-medium">{c.name}</td>
                  <td className="px-5 py-3 text-ink-light">{c.programme}</td>
                  <td className="px-5 py-3 text-ink-light">{c.yearOfStudy}</td>
                  <td className="px-5 py-3 text-ink-light">{c.semester}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => removeCourse(c.id)}
                      className="text-xs text-bad hover:underline focus-ring"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
