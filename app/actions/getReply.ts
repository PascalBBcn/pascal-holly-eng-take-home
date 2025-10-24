"use server";

import { jobs, salaries } from "@/data";
import { Job } from "@/types/job";

import { fuzzySearch, getAvailableSalaries } from "@/lib/utils";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function getReply(userMsg: string): Promise<string | null> {
  // 1 - EXTRACT JOB CODES from userMsg via regex (if they exist)
  const codeMatches = userMsg.match(/\b\d{4,5}\b/g); // (4-5 digit long number)

  // 2 - SEARCH FOR JOBS. Prioritize exact code match, else use fuzzy search
  let jobMatches: Job[] = [];
  let lookupCodes: string[] | null;

  // CODES present in userMsg
  if (codeMatches) {
    jobMatches = jobs.filter((job) => codeMatches.includes(job.code));
    lookupCodes = Array.from(new Set(jobMatches.map((m) => m.code)));
  }
  // NO CODES present in userMsg
  else {
    jobMatches = fuzzySearch(userMsg).map((r) => r.item);
    lookupCodes = Array.from(new Set(jobMatches.map((m) => m.code)));
  }

  // 3 - SEARCH FOR SALARIES
  const salaryMatches = salaries.filter((s) =>
    lookupCodes.includes(s["Job Code"])
  );
  // Eliminate missing salary grades
  const availableSalaries = salaryMatches.map((s) => ({
    code: s["Job Code"],
    salaries: getAvailableSalaries(s),
  }));

  // 4 - PREPARE DATA for LLM
  const context = `
    User asked: "${userMsg}"

    Job codes: ${codeMatches ?? "none found"}

    ${
      jobMatches.length > 0
        ? jobMatches
            .map(
              (match, index) => `
    Match ${index + 1}:
    Jurisdiction: ${match.jurisdiction}
    Code: ${match.code}
    Title: ${match.title}
    Description: ${match.description}
    `
            )
            .join("\n")
        : "No job matches found"
    }
    ${
      availableSalaries.length > 0
        ? `Available salaries:\n${availableSalaries
            .map(
              (s) => `
              Codes: ${s.code}
              Salaries: ${s.salaries.join(", ")}
              `
            )
            .join("\n")}`
        : "No salary information is available"
    }
    `;

  // 5 - SETUP OPENAI and get response
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant answering questions ONLY using the jobs and salaries data provided." +
          "You go straight to the point, your replies are under 500 characters." +
          "If the information is not in the dataset, respond with: `Sorry, I don't have that information`",
      },
      { role: "user", content: context },
    ],
    temperature: 0,
  });

  const answer = completion.choices[0]?.message?.content;
  return answer || "Sorry, I could not find anything";
}
