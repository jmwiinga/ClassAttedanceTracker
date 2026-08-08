"use client";

import { useMemo, useState } from "react";
import { useData } from "@/lib/data-context";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AttendanceTab() {
  const { students, courses, records, markAttendance, removeSession } = useData();
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [date, setDate] = useState(todayISO());
  const [saved, setSaved] = useState(false);

  const course = courses.find((c) => c.id === courseId);

  const roster = useMemo(() => {
    if (!course) return [];
    return students.filter(
      (s) =>
        s.programme === course.programme &&
        s.yearOfStudy === course.yearOfStudy &&
        s.semester === course.semester
    );
  }, [students, course]);

  const existing = useMemo(() => {
    const map: Record<string, boolean> = {};
    records
      .filter((r) => r.courseId === courseId && r.date === date)
      .forEach((r) => (map[r.studentId] = r.present));
    return map;
  }, [records, courseId, date]);

  const [draft, setDraft] = useState<Record<string, boolean>>({});

  const presentMap = { ...roster.reduce((acc, s) => ({ ...acc, [s.id]: existing[s.id] ?? true }), {} as Record<string, boolean>), ...draft };

  const sessionsForCourse = useMemo(() => {
    const dates = new Set(
      records.filter((r) => r.courseId === courseId).map((r) => r.date)
    );
    return Array.from(dates).sort((a, b) => (a < b ? 1 : -1));
  }, [records, courseId]);

  if (courses.length === 0) {
    return (
      <div className="bg-paper-card border border-ink/10 rounded-md p-8 text-center text-sm text-ink-faint">
        Add at least one course before taking attendance.
      </div>
    );
  }

  const toggle = (studentId: string) => {
    setDraft((prev) => ({
      ...prev,
      [studentId]: !(presentMap[studentId] ?? true),
    }));
    setSaved(false);
  };

  const save = () => {
    if (!course) return;
    const entries = roster.map((s) => ({
      studentId: s.id,
      present: presentMap[s.id] ?? true,
    }));
    markAttendance(courseId, date, entries);
    setDraft({});
    setSaved(true);
  };

  const presentCount = roster.filter((s) => presentMap[s.id] ?? true).length;

  return (
    <div className="space-y-6">
      <div className="bg-paper-card border border-ink/10 rounded-md p-5">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">
              Course
            </label>
            <select
              className="border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring bg-white min-w-[260px]"
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setDraft({});
                setSaved(false);
              }}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-faint mb-1">
              Session date
            </label>
            <input
              type="date"
              className="border border-ink/20 rounded-sm px-3 py-2 text-sm focus-ring"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setDraft({});
                setSaved(false);
              }}
            />
          </div>
          <div className="ml-auto text-xs text-ink-faint font-mono">
            {presentCount}/{roster.length} present
          </div>
        </div>
      </div>

      {roster.length === 0 ? (
        <div className="bg-paper-card border border-ink/10 rounded-md p-8 text-center text-sm text-ink-faint">
          No students match this course&apos;s programme, year and semester
          yet. Enrol students under the Students tab first.
        </div>
      ) : (
        <div className="bg-paper-card border border-ink/10 rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-ink/10">
            <h2 className="font-serif text-lg font-semibold">
              Register — {course?.code} · {date}
            </h2>
          </div>
          <ul className="divide-y divide-ink/5">
            {roster.map((s) => {
              const present = presentMap[s.id] ?? true;
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span className="text-sm font-medium">{s.name}</span>
                  <button
                    onClick={() => toggle(s.id)}
                    className={[
                      "text-xs font-mono font-medium px-3 py-1.5 rounded-sm border transition-colors focus-ring",
                      present
                        ? "border-good/50 text-good bg-good/5 hover:bg-good/10"
                        : "border-bad/50 text-bad bg-bad/5 hover:bg-bad/10",
                    ].join(" ")}
                  >
                    {present ? "PRESENT" : "ABSENT"}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="px-5 py-4 border-t border-ink/10 flex items-center gap-3">
            <button
              onClick={save}
              className="bg-ink text-paper rounded-sm px-4 py-2 text-sm font-medium hover:bg-ink-light transition-colors focus-ring"
            >
              Save register
            </button>
            {saved && (
              <span className="text-xs text-good">Saved for {date}.</span>
            )}
          </div>
        </div>
      )}

      {sessionsForCourse.length > 0 && (
        <div className="bg-paper-card border border-ink/10 rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-ink/10">
            <h3 className="font-serif text-base font-semibold">
              Recorded sessions for {course?.code}
            </h3>
          </div>
          <ul className="divide-y divide-ink/5">
            {sessionsForCourse.map((d) => (
              <li
                key={d}
                className="flex items-center justify-between px-5 py-2.5 text-sm"
              >
                <span className="font-mono text-ink-light">{d}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDate(d)}
                    className="text-xs text-ink-faint hover:underline focus-ring"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeSession(courseId, d)}
                    className="text-xs text-bad hover:underline focus-ring"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
