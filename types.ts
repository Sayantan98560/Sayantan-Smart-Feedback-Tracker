
export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

export enum FeedbackStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
}

export interface User {
  id: number;
  name: string;
  role: UserRole;
  username: string;
}

export interface Feedback {
  id: number;
  employeeId: number;
  employeeName: string;
  title: string;
  category: string;
  description: string;
  status: FeedbackStatus;
  submittedAt: Date;
  adminResponse?: string;
}
