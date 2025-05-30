export type User = {
  createdAt: string;
  displayName: string;
  dob: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  updatedAt: string;
  _id: string;
};

export type Tracker = { _id: string; user: string; type: string; time: string };

export type UserTrackerRecord = {
  userId: string;
  records: {
    dateStr: string;
    checkIn: string;
    checkOut: string;
  }[];
};

export type MistakeRecordType = {
  userId: string;
  displayName: string;
  email: string;
  role: string;
  createdAt: string;
  checkInLateCount: number;
  checkOutEarlyCount: number;
  trackRecord: MistakeTrackRecord;
};

export type MistakeTrackRecord = {
  date: string;
  checkIn: string;
  checkOut: string;
  typeMistake: string;
}[];
