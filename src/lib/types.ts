
export type CourseType = "major" | "minor" | "elective";

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  instructor: string;
  department: string;
  semester: string;
  schedule: string; // e.g., "Mon, Wed 10:00 AM - 11:30 AM"
  deadline: string; // ISO date string
  type: CourseType;
}

export interface StudentProfile {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone?: string;
  address?: string;
  secondaryEmail?: string;
}

export interface ContactInfoProps {
  email: string;
  phone: string;
  office: string;
  hours: string;
}


export interface TranscriptItem {
  id: string;
  courseCode: string;
  courseName: string;
  semesterTaken: string;
  grade: string;
  creditsEarned: number;
}

export interface EnrolledCourse {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  schedule: string;
  instructor: string;
}

export interface CreditSummary {
  total: number;
  major: number;
  minor: number;
  elective: number;
}

export const MAX_CREDITS = {
  total: 18,
  major: 12,
  minor: 6,
  elective: 6,
};
