"use client";

import { useState } from "react";
import { useData } from "@/lib/data-context";
import { Semester } from "@/lib/types";

const SEMESTERS: Semester[] = ["Semester 1", "Semester 2", "Semester 3"];

export default function StudentsTab() {
  const { students, addStudent, removeStudent } = useData();
  const [studentNumber, setStudentNumber] = useState("");
  const [name, setName] = useState("");
  const [programme, setProgramme] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState(1);
  const [semester, setSemester] = useState<Semester>("Semester 1");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNumber.trim() || !name.trim() || !programme.trim()) {
      setError("Enter the student number, name and programme of study.");
      return;
    }
    if (students.some((s) => s.studentNumber.toLowerCase() === studentNumber.trim().toLowerCase())) {
      setError("A student with this student number is already enrolled.");
      return;
    }
    addStudent({
      studentNumber: studentNumber.trim(),
      name: name.trim(),
      programme: programme.trim(),
      yearOfStudy,
      semester,
    });
    setStudentNumber("");
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
        <h2 className="font-serif text-lg font-semibold mb-4">Enrol a student</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">
              Student number
            </label>
            <input
              className="w-full border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring font-mono"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              placeholder="e.g. 224333444"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">
              Full name
            </label>
            <input
              className="w-full border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Naledi Amupolo"
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
              placeholder="e.g. BSc Computer Science"
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
            Add student
          </button>
        </div>
      </form>

      <div className="bg-paper-card border border-ink/10 rounded-md overflow-hidden">
        <div className="px-5 py-4 border-b border-ink/10 flex items-baseline justify-between">
          <h2 className="font-serif text-lg font-semibold">Class roll</h2>
          <span className="text-xs text-ink-faint font-mono">
            {students.length} enrolled
          </span>
        </div>
        {students.length === 0 ? (
          <p className="p-6 text-sm text-ink-faint">
            No students yet. Add the first one using the form.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-faint border-b border-ink/10">
                <th className="px-5 py-3 font-medium">Student No.</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Programme</th>
                <th className="px-5 py-3 font-medium">Year</th>
                <th className="px-5 py-3 font-medium">Semester</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3 font-mono text-xs">{s.studentNumber}</td>
                  <td className="px-5 py-3 font-medium">{s.name}</td>
                  <td className="px-5 py-3 text-ink-light">{s.programme}</td>
                  <td className="px-5 py-3 text-ink-light">{s.yearOfStudy}</td>
                  <td className="px-5 py-3 text-ink-light">{s.semester}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => removeStudent(s.id)}
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
