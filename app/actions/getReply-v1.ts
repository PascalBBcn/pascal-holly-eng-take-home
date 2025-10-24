"use server";

import { jobs, salaries } from "@/data";
import {
  fuzzySearch,
  extractJurisdiction,
  getAvailableSalaries,
} from "@/lib/utils";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function getReply(userMsg: string): Promise<string | null> {
  // 1 - If job code exists, extract via regex (4-5 digit long number)
  const codeMatch = userMsg.match(/\b\d{4,5}\b/);
  const jobCode = codeMatch ? codeMatch[0] : null;

  // 2 - Extract any mentions of jurisdictions from userMsg
  const extractedJurisdiction = extractJurisdiction(userMsg);

  // 3 - Search for jobs. Prioritize exact code match, else use fuzzy search
  let allMatches;

  // Code in userMsg exists
  if (jobCode) {
    // Try to find exact match via code first
    const exactMatches = jobs.filter((job) => job.code === jobCode);

    if (exactMatches.length > 0) allMatches = exactMatches;
    else {
      // If no exact code matches, fallback to fuzzy search
      allMatches = fuzzySearch(userMsg)
        .slice(0, 8)
        .map((r) => r.item);
    }
  }
  // No code in userMsg, use fuzzy search
  else {
    allMatches = fuzzySearch(userMsg)
      .slice(0, 8)
      .map((r) => r.item);
  }

  // 4 - Search for salaries via code
  let lookupCode = null;
  console.log(allMatches[0].code);

  // A code exists in the userMsg
  if (jobCode) lookupCode = jobCode;
  // No code, only 1 match
  else if (allMatches.length === 1) lookupCode = allMatches[0].code;
  // A jurisdiction was extracted from userMsg
  else if (extractedJurisdiction) {
    // Match by jurisdiction from userMsg
    const matched = allMatches.find(
      (match) =>
        match.jurisdiction.toLowerCase() === extractedJurisdiction.toLowerCase()
    );

    lookupCode = matched ? matched.code : null;
    console.log(allMatches.length);

    console.log(lookupCode);
  }

  const salary = salaries.find((s) => s["Job Code"] === lookupCode);
  const availableSalaries = salary ? getAvailableSalaries(salary) : [];

  console.log(availableSalaries);

  const context = `
    User asked: "${userMsg}"

    Job code: ${jobCode ?? "none found"}

    ${
      allMatches.length > 0
        ? allMatches
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
        ? `Available salaries:\n${availableSalaries.join("\n")}`
        : "No salary information is available"
    }
    `;

  // 5 - Setup OpenAi and get response
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

  //   // TESTING
  //   const answer = `TEST. Your context was: ${context}`;
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  const answer = completion.choices[0]?.message?.content;
  return answer || "Sorry, I could not find anything";
}
