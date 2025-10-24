import { jobs } from "@/data";
import { Salary } from "@/types/salary";
import Fuse from "fuse.js";

// Helper function to perform fuzzy search
export function fuzzySearch(userMsg: string) {
  const lowerMsg = userMsg.toLowerCase();
  const fuse = new Fuse(jobs, {
    keys: ["jurisdiction", "title", "description"],
    threshold: 0.4,
    ignoreLocation: true,
    isCaseSensitive: false,
  });
  const results = fuse.search(lowerMsg);
  return results;
}

// Helper function to extract only available salary grades
export function getAvailableSalaries(salary: Salary) {
  const maxNumGrades = 14;
  const grades: string[] = [];

  for (let i = 1; i <= maxNumGrades; i++) {
    const key = `Salary grade ${i}` as keyof Salary;
    const rawValue = salary[key];

    // Remove whitespace
    const value = rawValue?.trim();
    if (value && value !== "") grades.push(`${key}: ${value}`);
  }

  return grades;
}
