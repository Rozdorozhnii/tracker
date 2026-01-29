import { Router } from "express";
import { z } from "zod";

import { prisma } from "../index";
import { createEntry } from "../services/entry.service";

type TimeEntry = {
  id: number;
  date: Date;
  project: string;
  hours: number;
  description: string;
  createdAt: Date;
};

interface GroupedEntry {
  date: string;
  totalHours: number;
  entries: {
    id: number;
    project: string;
    hours: number;
    description: string;
  }[];
}

const router = Router();

const createEntrySchema = z.object({
  date: z.string().date(),
  project: z.string().min(1),
  hours: z.number().positive().max(24),
  description: z.string().min(1),
});

router.post("/", async (req, res) => {
  try {
    const data = createEntrySchema.parse(req.body);

    const entry = await createEntry({
      ...data,
      date: new Date(data.date),
    });

    res.status(201).json(entry);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (_, res) => {
  try {
    const entries: TimeEntry[] = await prisma.timeEntry.findMany({
      orderBy: { date: "desc" },
    });

    let grandTotal = 0;

    const grouped = entries.reduce<Record<string, GroupedEntry>>(
      (acc, entry) => {
        const dateKey = entry.date.toISOString().split("T")[0];
        if (!acc[dateKey]) {
          acc[dateKey] = { date: dateKey, totalHours: 0, entries: [] };
        }
        acc[dateKey].entries.push({
          id: entry.id,
          project: entry.project,
          hours: entry.hours,
          description: entry.description,
        });
        acc[dateKey].totalHours += entry.hours;
        grandTotal += entry.hours;
        return acc;
      },
      {},
    );

    res.json({ grouped: Object.values(grouped), grandTotal });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
