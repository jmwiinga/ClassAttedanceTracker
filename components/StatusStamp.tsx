import { ATTENDANCE_THRESHOLD } from "@/lib/types";

export default function StatusStamp({ pct }: { pct: number }) {
  const flagged = pct < ATTENDANCE_THRESHOLD;
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium tracking-wide rounded-sm border",
        flagged
          ? "-rotate-2 border-bad text-bad bg-bad/5"
          : "border-good/50 text-good bg-good/5",
      ].join(" ")}
      style={
        flagged
          ? { boxShadow: "0 0 0 1px rgba(163,61,61,0.15) inset" }
          : undefined
      }
    >
      {flagged ? "BELOW 80%" : "ON TRACK"}
    </span>
  );
}
