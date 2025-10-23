import jobsJson from "@/data/job-descriptions.json";
import salariesJson from "@/data/salaries.json";

import type { Job } from "@/types/job";
import type { Salary } from "@/types/salary";

// Can now import these anywhere from @/data
export const jobs = jobsJson as Job[];
export const salaries = salariesJson as Salary[];
