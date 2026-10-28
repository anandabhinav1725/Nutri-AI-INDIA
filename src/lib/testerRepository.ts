import { db } from "@/lib/db";

export async function ensureTester(browserId: string) {
  return db.tester.upsert({
    where: { browserId },
    update: {},
    create: { browserId }
  });
}
