"use client";

import { useMemo, useState } from "react";
import { useData } from "@/lib/data-context";
import { ATTENDANCE_THRESHOLD } from "@/lib/types";
import StatusStamp from "./StatusStamp";

export default function DashboardTab() {
  const { stats, courses } = useData();
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const filtered = useMemo(() => {
    return stats
      .filter((s) => (courseFilter === "ALL" ? true : s.courseId === courseFilter))
      .filter((s) => (flaggedOnly ? s.flagged : true))
      .sort((a, b) => a.attendancePct - b.attendancePct);
  }, [stats, courseFilter, flaggedOnly]);

  const withSessions = stats.filter((s) => s.sessionsHeld > 0);
  const flaggedCount = withSessions.filter((s) => s.flagged).length;
  const overallAvg =
    withSessions.length === 0
      ? null
      : Math.round(
          (withSessions.reduce((sum, s) => sum + s.attendancePct, 0) /
            withSessions.length) *
            10
        ) / 10;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Records with sessions"
          value={String(withSessions.length)}
          hint="Student–course pairs with at least one session logged"
        />
        <SummaryCard
          label="Below 80% target"
          value={String(flaggedCount)}
          hint="Flagged student–course records"
          tone={flaggedCount > 0 ? "bad" : "good"}
        />
        <SummaryCard
          label="Average attendance"
          value={overallAvg === null ? "—" : `${overallAvg}%`}
          hint="Across all recorded sessions"
        />
      </div>

      <div className="bg-paper-card border border-ink/10 rounded-md overflow-hidden">
        <div className="px-5 py-4 border-b border-ink/10 flex flex-wrap items-center gap-3">
          <h2 className="font-serif text-lg font-semibold mr-auto">
            Attendance dashboard
          </h2>
          <select
            className="border border-ink/20 rounded-sm px-3 py-1.5 text-xs focus-ring bg-white"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="ALL">All courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs text-ink-faint">
            <input
              type="checkbox"
              checked={flaggedOnly}
              onChange={(e) => setFlaggedOnly(e.target.checked)}
              className="focus-ring"
            />
            Flagged only
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="p-6 text-sm text-ink-faint">
            No attendance data matches this filter yet. Record sessions under
            the Take Attendance tab, they will surface here once at least one
            session is logged.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-faint border-b border-ink/10">
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Programme</th>
                <th className="px-5 py-3 font-medium">Yr / Sem</th>
                <th className="px-5 py-3 font-medium">Course</th>
                <th className="px-5 py-3 font-medium">Sessions</th>
                <th className="px-5 py-3 font-medium">Attendance</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={`${s.studentId}-${s.courseId}`}
                  className={[
                    "border-b border-ink/5 last:border-0",
                    s.flagged ? "bg-bad/[0.035]" : "",
                  ].join(" ")}
                >
                  <td className="px-5 py-3 font-medium">{s.studentName}</td>
                  <td className="px-5 py-3 text-ink-light">{s.programme}</td>
                  <td className="px-5 py-3 text-ink-light">
                    Y{s.yearOfStudy} · {s.semester.replace("Semester ", "S")}
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs">{s.courseCode}</span>
                    <span className="text-ink-light"> — {s.courseName}</span>
                  </td>
                  <td className="px-5 py-3 text-ink-light font-mono text-xs">
                    {s.sessionsAttended}/{s.sessionsHeld}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-ink/10 rounded-full overflow-hidden">
                        <div
                          className={
                            s.attendancePct < ATTENDANCE_THRESHOLD
                              ? "h-full bg-bad"
                              : "h-full bg-good"
                          }
                          style={{ width: `${Math.min(100, s.attendancePct)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">{s.attendancePct}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <StatusStamp pct={s.attendancePct} />
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

function SummaryCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "good" | "bad";
}) {
  return (
    <div className="bg-paper-card border border-ink/10 rounded-md p-5">
      <p className="text-xs uppercase tracking-wide text-ink-faint mb-2">
        {label}
      </p>
      <p
        className={[
          "font-serif text-3xl font-semibold",
          tone === "bad" ? "text-bad" : tone === "good" ? "text-good" : "text-ink",
        ].join(" ")}
      >
        {value}
      </p>
      <p className="text-xs text-ink-faint mt-1">{hint}</p>
    </div>
  );
}
