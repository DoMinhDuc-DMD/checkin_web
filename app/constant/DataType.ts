export interface EmployeeTypeData {
    key: string;
    employee_code: string;
    employee_name: string;
    employee_department: string;
    employee_position: string;
    employee_email: string;
    employee_check_in: string[];
    employee_check_out: string[];
}

export type User = { createdAt: string; displayName: string; dob: string; email: string; firstName: string; lastName: string; role: string; updatedAt: string; _id: string; };
export type Tracker = { _id: string; user: string; type: string; time: string };
export type AttendanceType = { day: string; trackers: Tracker[] };