export type Semester = "Semester 1" | "Semester 2" | "Semester 3";

export interface Student {
  id: string;
  name: string;
  programme: string;
  yearOfStudy: number;
  semester: Semester;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  programme: string;
  yearOfStudy: number;
  semester: Semester;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  date: string; // ISO date, yyyy-mm-dd
  present: boolean;
}

export interface StudentCourseStat {
  studentId: string;
  studentName: string;
  programme: string;
  yearOfStudy: number;
  semester: Semester;
  courseId: string;
  courseCode: string;
  courseName: string;
  sessionsHeld: number;
  sessionsAttended: number;
  attendancePct: number;
  flagged: boolean;
}

export const ATTENDANCE_THRESHOLD = 80;
