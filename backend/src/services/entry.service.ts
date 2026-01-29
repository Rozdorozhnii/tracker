import { prisma } from "../index";

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

async function createEntry(data: {
  date: Date;
  project: string;
  hours: number;
  description: string;
}) {
  const startOfDay = new Date(data.date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const totalHours = await prisma.timeEntry.aggregate({
    where: {
      date: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    _sum: {
      hours: true,
    },
  });

  const alreadyLogged = totalHours._sum.hours ?? 0;

  if (alreadyLogged + data.hours > 24) {
    throw new Error("Daily hour limit exceeded");
  }

  return prisma.timeEntry.create({ data });
}
async function getGroupedEntries() {
  const entries: TimeEntry[] = await prisma.timeEntry.findMany({
    orderBy: { date: "desc" },
  });

  let grandTotal = 0;

  const grouped = entries.reduce<Record<string, GroupedEntry>>((acc, entry) => {
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
  }, {});

  return { grouped: Object.values(grouped), grandTotal };
}

export const entryService = {
  create: createEntry,
  getGroupedEntries,
};
