"use client";

import { useMemo, useState } from "react";

export default function EntryForm({ onSaved }: { onSaved: () => void }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [project, setProject] = useState("");
  const [hours, setHours] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => {
    if (!date || !project || !description) return false;
    if (hours === "" || hours <= 0 || hours > 24) return false;
    return true;
  }, [date, project, hours, description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError(null);

    const res = await fetch("http://localhost:4000/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, project, hours, description }),
    });

    if (res.ok) {
      setProject("");
      setHours("");
      setDescription("");
      onSaved();
    } else {
      const data = await res.json();
      setError(data.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="self-center w-full max-w-md p-8 rounded-xl shadow-lg bg-white">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-center">Add Time Entry</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="font-medium">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray
              rounded-lg
              px-4 py-2
              text-lg
              focus:outline-none
              focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="project" className="font-medium">
            Project
          </label>
          <select
            id="project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="border rounded px-3 py-2 text-lg"
          >
            <option value="">Select project</option>
            <option>Viso Internal</option>
            <option>Client A</option>
            <option>Client B</option>
            <option>Personal Development</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="duration" className="font-medium">
            Hours
          </label>
          <input
            id="duration"
            type="number"
            min={0}
            max={24}
            value={hours}
            onChange={(e) =>
              setHours(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Must be between 0 and 24"
            className="border rounded px-3 py-2 text-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="font-medium">
            Work description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you worked on"
            className="border rounded px-3 py-2 text-lg resize-none"
            rows={3}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={!isValid || loading}
            className="
              px-6 py-2 rounded-lg font-semibold text-lg
              bg-blue-600 text-white
              hover:bg-blue-700
              disabled:bg-gray-300 disabled:cursor-not-allowed
              transition-colors
            "
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
