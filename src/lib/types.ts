import { ReactNode } from "react";

export type Department = 'Sales' | 'Technical' | 'Finance';

export type MemberStatus = 'active' | 'inactive';

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: Department;
  status: MemberStatus;
  phone: string;
  telegram: string;
  tasks: Task[];
}

export interface ModalState {
  content: ReactNode;
  title?: string;
  props?: Record<string, unknown>;
}