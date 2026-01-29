import { Router } from "express";
import { z } from "zod";

import { entryService } from "../services/entry.service";

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

    const entry = await entryService.create({
      ...data,
      date: new Date(data.date),
    });

    res.status(201).json(entry);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        message: "Validation failed",
        errors: error.issues.reduce<Record<string, string>>((acc, issue) => {
          const path = issue.path[0].toString();
          acc[path] = issue.message;
          return acc;
        }, {}),
      });
    }
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (_, res) => {
  try {
    const data = await entryService.getGroupedEntries();

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
