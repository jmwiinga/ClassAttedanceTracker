"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuid } from "uuid";
import {
  ATTENDANCE_THRESHOLD,
  AttendanceRecord,
  Course,
  Student,
  StudentCourseStat,
} from "./types";

const STORAGE_KEY = "attendance-tracker:v1";

interface StoredData {
  students: Student[];
  courses: Course[];
  records: AttendanceRecord[];
}

interface DataContextValue {
  students: Student[];
  courses: Course[];
  records: AttendanceRecord[];
  addStudent: (s: Omit<Student, "id">) => void;
  removeStudent: (id: string) => void;
  addCourse: (c: Omit<Course, "id">) => void;
  removeCourse: (id: string) => void;
  markAttendance: (
    courseId: string,
    date: string,
    entries: { studentId: string; present: boolean }[]
  ) => void;
  removeSession: (courseId: string, date: string) => void;
  stats: StudentCourseStat[];
  loaded: boolean;
}

const DataContext = createContext<DataContextValue | null>(null);

function loadInitial(): StoredData {
  return { students: [], courses: [], records: [] };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredData = JSON.parse(raw);
        setStudents(parsed.students ?? []);
        setCourses(parsed.courses ?? []);
        setRecords(parsed.records ?? []);
      }
    } catch (e) {
      console.error("Failed to load stored data", e);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const data: StoredData = { students, courses, records };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [students, courses, records, loaded]);

  const addStudent = (s: Omit<Student, "id">) => {
    setStudents((prev) => [...prev, { ...s, id: uuid() }]);
  };

  const removeStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setRecords((prev) => prev.filter((r) => r.studentId !== id));
  };

  const addCourse = (c: Omit<Course, "id">) => {
    setCourses((prev) => [...prev, { ...c, id: uuid() }]);
  };

  const removeCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setRecords((prev) => prev.filter((r) => r.courseId !== id));
  };

  const markAttendance = (
    courseId: string,
    date: string,
    entries: { studentId: string; present: boolean }[]
  ) => {
    setRecords((prev) => {
      const withoutSession = prev.filter(
        (r) => !(r.courseId === courseId && r.date === date)
      );
      const newRecords = entries.map((e) => ({
        id: uuid(),
        courseId,
        date,
        studentId: e.studentId,
        present: e.present,
      }));
      return [...withoutSession, ...newRecords];
    });
  };

  const removeSession = (courseId: string, date: string) => {
    setRecords((prev) =>
      prev.filter((r) => !(r.courseId === courseId && r.date === date))
    );
  };

  const stats = useMemo<StudentCourseStat[]>(() => {
    const result: StudentCourseStat[] = [];
    students.forEach((student) => {
      const studentCourses = courses.filter(
        (c) =>
          c.programme === student.programme &&
          c.yearOfStudy === student.yearOfStudy &&
          c.semester === student.semester
      );
      studentCourses.forEach((course) => {
        const courseRecords = records.filter(
          (r) => r.courseId === course.id && r.studentId === student.id
        );
        const sessionsHeld = courseRecords.length;
        const sessionsAttended = courseRecords.filter((r) => r.present).length;
        const attendancePct =
          sessionsHeld === 0
            ? 100
            : Math.round((sessionsAttended / sessionsHeld) * 1000) / 10;
        result.push({
          studentId: student.id,
          studentName: student.name,
          programme: student.programme,
          yearOfStudy: student.yearOfStudy,
          semester: student.semester,
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
          sessionsHeld,
          sessionsAttended,
          attendancePct,
          flagged: sessionsHeld > 0 && attendancePct < ATTENDANCE_THRESHOLD,
        });
      });
    });
    return result;
  }, [students, courses, records]);

  const value: DataContextValue = {
    students,
    courses,
    records,
    addStudent,
    removeStudent,
    addCourse,
    removeCourse,
    markAttendance,
    removeSession,
    stats,
    loaded,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
