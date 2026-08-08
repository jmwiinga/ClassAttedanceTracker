"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useData } from "@/lib/data-context";
import { ATTENDANCE_THRESHOLD, StudentCourseStat } from "@/lib/types";
import StatusStamp from "./StatusStamp";

const GOOD = "#2F6B4F";
const BAD = "#DC332E";

// Above this many rows, per-student bars get replaced with a distribution
// histogram so the chart stays readable regardless of class size.
const PER_STUDENT_CHART_LIMIT = 14;

const BUCKETS = [
  { label: "0–19%", min: 0, max: 19 },
  { label: "20–39%", min: 20, max: 39 },
  { label: "40–59%", min: 40, max: 59 },
  { label: "60–79%", min: 60, max: 79 },
  { label: "80–100%", min: 80, max: 100 },
];

function buildHistogram(rows: StudentCourseStat[]) {
  return BUCKETS.map((b) => ({
    label: b.label,
    count: rows.filter((r) => r.attendancePct >= b.min && r.attendancePct <= b.max).length,
    flagged: b.max < ATTENDANCE_THRESHOLD,
  }));
}

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

  // Scope used for the two charts: honours the course filter, always
  // excludes rows with no sessions logged yet (nothing to plot).
  const chartRows = useMemo(
    () => filtered.filter((s) => s.sessionsHeld > 0),
    [filtered]
  );

  const pieData = [
    { name: "On track", value: chartRows.filter((s) => !s.flagged).length, color: GOOD },
    { name: "Below 80%", value: chartRows.filter((s) => s.flagged).length, color: BAD },
  ];
  const hasPieData = pieData.some((d) => d.value > 0);

  const showPerStudentBars = chartRows.length > 0 && chartRows.length <= PER_STUDENT_CHART_LIMIT;
  const perStudentData = [...chartRows]
    .sort((a, b) => a.attendancePct - b.attendancePct)
    .map((s) => ({
      name: s.studentName.length > 16 ? s.studentName.slice(0, 15) + "…" : s.studentName,
      pct: s.attendancePct,
      flagged: s.flagged,
    }));
  const histogramData = buildHistogram(chartRows);

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

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-4">
        <div className="bg-paper-card border border-ink/10 rounded-md p-5">
          <h3 className="font-serif text-base font-semibold mb-1">
            On track vs. below target
          </h3>
          <p className="text-xs text-ink-faint mb-3">
            {courseFilter === "ALL" ? "All courses" : courses.find((c) => c.id === courseFilter)?.code}
            {" "}· student–course records with sessions logged
          </p>
          {hasPieData ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={pieData.every((d) => d.value > 0) ? 3 : 0}
                >
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={24} iconType="circle" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-ink-faint py-16 text-center">
              No sessions logged for this scope yet.
            </p>
          )}
        </div>

        <div className="bg-paper-card border border-ink/10 rounded-md p-5">
          <h3 className="font-serif text-base font-semibold mb-1">
            {showPerStudentBars ? "Attendance by student" : "Attendance distribution"}
          </h3>
          <p className="text-xs text-ink-faint mb-3">
            {showPerStudentBars
              ? "Sorted lowest to highest, dashed line marks the 80% target"
              : `Grouped into bands — ${chartRows.length} records is too many to plot individually, so this scales with class size`}
          </p>
          {chartRows.length === 0 ? (
            <p className="text-sm text-ink-faint py-16 text-center">
              No sessions logged for this scope yet.
            </p>
          ) : showPerStudentBars ? (
            <ResponsiveContainer width="100%" height={Math.max(220, perStudentData.length * 28)}>
              <BarChart data={perStudentData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Attendance"]} />
                <Bar dataKey="pct" radius={[0, 3, 3, 0]}>
                  {perStudentData.map((d, i) => (
                    <Cell key={i} fill={d.flagged ? BAD : GOOD} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={histogramData} margin={{ left: 0, right: 16 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v} student(s)`, "Count"]} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {histogramData.map((d, i) => (
                    <Cell key={i} fill={d.flagged ? BAD : GOOD} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-paper-card border border-ink/10 rounded-md overflow-hidden">
        <div className="px-5 py-4 border-b border-ink/10 flex flex-wrap items-center gap-3">
          <h2 className="font-serif text-lg font-semibold mr-auto">
            Detailed records
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
                <th className="px-5 py-3 font-medium">Student No.</th>
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
                  <td className="px-5 py-3 font-mono text-xs">{s.studentNumber}</td>
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
