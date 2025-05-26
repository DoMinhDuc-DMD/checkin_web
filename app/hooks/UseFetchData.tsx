"use client";
import dayjs from "dayjs";
import axios from "axios";
import { Tracker, User } from "../constant/DataType";
import { useEffect, useState } from "react";

export default function UseFetchData() {
  const [user, setUser] = useState<User[]>([]);
  const [tracker, setTracker] = useState<Tracker[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await axios.get("http://192.168.1.80:4455/api/v1/users/?limit=120");
        const trackerData = await axios.get(
          `http://192.168.1.80:4455/api/v1/trackers/?gte=Fri%20May%2021%202021%2000:00:00%20GMT+0700%20(Indochina%20Time)&lte=${dayjs().format(
            "ddd"
          )}%20${dayjs().format("MMM")}%20${dayjs().date()}%20${dayjs().year()}%2023:59:59%20GMT+0700%20(Indochina%20Time)&limit=5000`
        );
        const users: User[] = userData.data.data.sort((a: User, b: User) => a.displayName.localeCompare(b.displayName));
        const trackers: Tracker[] = trackerData.data.data;

        setUser(users);
        setTracker(trackers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return { user, tracker };
}
