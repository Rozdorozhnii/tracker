import { prisma } from "../index";

export async function createEntry(data: {
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
