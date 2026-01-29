"use client";

import { useState } from "react";
import EntryForm from "./ components/EntryForm";
import EntryHistory from "./ components/EntryHistory";

export default function Page() {
  const [refreshFlag, setRefreshFlag] = useState(0);

  const handleSaved = () => setRefreshFlag((prev) => prev + 1);

  return (
    <div className="bg-gray-50 min-h-screen p-12 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-12">
        <EntryForm onSaved={handleSaved} />
        <EntryHistory refreshFlag={refreshFlag} />
      </div>
    </div>
  );
}
