"use client";

import { useEffect, useState } from "react";

interface Entry {
  id: number;
  project: string;
  hours: number;
  description: string;
}

interface GroupedEntry {
  date: string;
  totalHours: number;
  entries: Entry[];
}

export default function EntryHistory({ refreshFlag }: { refreshFlag: number }) {
  const [data, setData] = useState<{
    grouped: GroupedEntry[];
    grandTotal: number;
  } | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/entries")
      .then((res) => res.json())
      .then(setData);
  }, [refreshFlag]);

  if (!data) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 flex flex-col gap-10">
      <h2 className="text-3xl font-bold text-center">Entry History</h2>

      {data.grouped.map((group) => (
        <div
          key={group.date}
          className="flex flex-col gap-4 border border-gray-300 rounded-xl shadow-md bg-white"
        >
          <div className="px-6 py-4 bg-gray-100 border-b border-gray-300 font-semibold text-lg">
            {group.date} — Total: {group.totalHours}h
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left border-b border-gray-300 min-w-[180px]">
                  Project
                </th>
                <th className="px-6 py-3 text-left border-b border-gray-300 min-w-[100px]">
                  Hours
                </th>
                <th className="px-6 py-3 text-left border-b border-gray-300">
                  Description
                </th>
              </tr>
            </thead>

            <tbody>
              {group.entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 border-b border-gray-200">
                    {entry.project}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-200">
                    {entry.hours}
                  </td>
                  <td className="px-6 py-3 border-b border-gray-200">
                    {entry.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="text-center text-xl font-semibold">
        Grand Total: {data.grandTotal}h
      </div>
    </div>
  );
}
