"use client";

import { Tracker, User, Attendance } from "@/app/constant/DataType";
import { Flex } from "antd";
import { useEffect, useState } from "react";

export default function Notification() {
  const [user, setUser] = useState<User[]>([]);
  const [tracker, setTracker] = useState<Tracker[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch("http://192.168.1.80:4455/api/v1/users/?limit=5");
        const res2 = await fetch(
          "http://192.168.1.80:4455/api/v1/trackers/user/6821d484d7dbf1cbee7c2a39?groupBy=day&gte=Fri%20May%2021%202021%2000:00:00%20GMT+0700%20(Indochina%20Time)&lte=Wed%20May%2021%202025%2023:59:59%20GMT+0700%20(Indochina%20Time)&limit=30"
        );
        if (!res1.ok || !res2.ok) throw new Error("Failed to fetch");

        const data1 = await res1.json();
        const data2 = await res2.json();

        console.log(data1.data);
        console.log(data2.data);

        const filteredUsers = data1.data.map((user: User) => ({
          _id: user._id,
          displayName: user.displayName,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          role: user.role,
        }));
        const filteredTrackers = data2.data.flatMap((tracker: Attendance) => tracker.trackers);

        setUser(filteredUsers);
        setTracker(filteredTrackers);
      } catch (err) {
        console.error("API error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <Flex vertical style={{ height: "650px", overflowY: "auto" }}>
      {user.map((u) => {
        const userTrackers = tracker.filter((t) => t.user === u._id);

        return (
          <div key={u._id} style={{ border: "1px solid #ccc", padding: 10, borderRadius: 6 }}>
            <h3>
              {u.displayName} ({u.role})
            </h3>
            <p>
              Name: {u.firstName} {u.lastName} <br />
              Created at: {new Date(u.createdAt).toLocaleString()} <br />
              Updated at: {new Date(u.updatedAt).toLocaleString()}
            </p>
            <h4>Trackers:</h4>
            {userTrackers.length > 0 ? (
              <ul>
                {userTrackers.map((t) => (
                  <li key={t._id}>
                    [{t.type}] at {new Date(t.time).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No trackers found.</p>
            )}
          </div>
        );
      })}
    </Flex>
  );
}
