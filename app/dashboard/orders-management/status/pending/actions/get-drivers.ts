"use server";
import db from '@/lib/prisma';

export async function getDrivers() {
  console.log("Fetching drivers from the database...");
  try {
    const drivers = await db.driver.findMany();
    console.log("Fetching drivers from the database...", drivers);
    return drivers;
  } catch (error) {
    console.error("Error fetching drivers:", error);
    throw new Error("Failed to fetch drivers");
  }
}
