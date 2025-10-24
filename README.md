# AI Job/Salary Chatbot for HR

### Pascal Baumann

## How to run the application locally?

1. Install dependencies

- npm install

2. Setup environment variables

- Create a file named .env.local in the project root
- Add your OpenAI API key: OPENAI_API_KEY=your_api_key

3. Run the development server

- npm run dev

## Technologies Used

- OpenAI API
- Fuse.js
- React, Next.js, Typescript, TailwindCSS

## My Approach

1. Server Action - The users' message is sent to a server action, which then involves data processing and filtering before passing it to the LLM

2. Regex for Codes - Used in case the user included a job code within their message. This allowed for stricter matching for codes, as job codes are unique identifiers for the data.

3. Fuse.js for NLP - Was used for parsing through and filtering the data via "Fuzzy Search". Fuzzy search allows for approximate matches, allowing for typos, spelling errors, substrings, or partial matches. This was chosen over other solutions such as Vector Embeddings as Fuse was deemed feasible for the scope of this project, since it has a fairly constrained domain. As well, it allowed to get a system up and running quicker as it requires less setup than Vector Embeddings.

4. OpenAI - The data returned from Fuse was then integrated with the OpenAI API LLM using context to give the LLM context of the important variables, as well as rules and constraints for completion. This ensured accurate and controlled responses, narrowing the model down to what was absolutely necessary.

5. Returning Data to Frontend - Finally, the data was the returned back to the chat page which updated the messages state once the server action completed execution

## Challenges Faced

1. Finding the balance for "steering" the LLM between open-ended robustness and the degree of constraining it to the dataset.

- I felt that when I attempted to constrain and structure the LLM more so, it would start behaving far too rigidly, thus sacrificing some dynamic intelligence. And when I attempted to allow for more robustness, the LLM would either not find the correct answer or answer slightly incorrectly/
- Thus I believe that this was the most challenging thing when working with such a system, and perhaps using Vector Embeddings may alleviate these balancing pains.
- Creating a system that can operate between the two modes in a hybrid approach may also be a solution.

2. Choosing between the new AI-SDK and useChat hook or custom server-side handling

- The useChat hook seemed quite nice at first, and I did experiment with it, however I quickly realized that it abstracted a lot of state/data flow away from me, and also introduced some confusing or "over-complicated for this task" methods.
- This led me to choosing a more manual approach, in which I could showcase my skills and also practice more "under the hood" workflows.
- The main benefit of the useChat and AI-SDK approach was that it would include text streaming which allows the assistant messages to appear dynamically as they are typing out their response.

# ORIGINAL CHALLENGE INSTRUCTIONS BELOW

# Holly Engineering Take-Home Assignment

## Overview

This take-home assignment is designed to evaluate your technical skills across several areas important to our engineering team. Please spend no more than 2-3 hours on this task. It's completely fine if you don't finish everything - we're more interested in understanding your approach and thought process.

## Goals

This assignment evaluates your skills in:

1. Data processing
2. Next.js development
3. LLM integration
4. TypeScript

## The Challenge

You'll build a simple chat interface that allows users to query job and salary information stored in JSON files. Think of it as a basic HR assistant that can answer questions about job descriptions and compensation. The interface doesn't have to be anything fancy.

## Requirements

### 1. Chat Interface (~30 mins)

- Create a dedicated chat page (`/chat`) with a message interface
- Style the interface so AI messages appear on the right and human messages on the left
- The UI doesn't need to be elaborate - focus on functionality over aesthetics

![Sample Application](public/sample.png)

### 2. LLM Integration (~1 hr 30 mins)

- Integrate with an LLM of your choice
- The LLM should be able to answer questions about the data in your matched dataset
- **Important**: Your implementation should parse the user's query to identify which specific job they're asking about, and only pass the relevant job information to the LLM - do not pass the entire dataset to the LLM with each request
- Example queries and responses:
  - "What are the knowledge, skills, and abilities for the Assistant Sheriff San Diego County position?"
    - "The Assistant Sheriff in San Diego County should have knowledge of: local law enforcement agencies in San Diego County, local/state/federal laws, law enforcement rules and regulations, community-based policing..."
  - "What is the salary for the Assistant Chief Probation Officer in San Bernardino?"
    - "The Assistant Chief Probation Officer in San Bernardino has a salary range from $70.38 to $101.00 per hour (salary grades 1 and 2)."

## Technical Requirements

- Use Next.js for the application framework
- Implement proper TypeScript typing throughout the application
- Implement server actions where appropriate
- Do not use a dedicated backend server or database - all data should be stored and retrieved from the JSON files
  - By dedicated backend server, we mean not setting up separate Node.js, Flask, or other backend services. You are permitted to use Next.js built-in server capabilities.
  - By dedicated database, we mean not setting up a MongoDB, PostgreSQL, MySQL or similar database system. All data should be stored and retrieved from JSON files.
- Clean, maintainable code with clear organization

## Submission

Please submit:

1. The complete codebase in a public GitHub repository
2. Instructions for running the application locally
3. A brief writeup explaining your approach, technologies used, and any challenges you faced

## Notes

- You're free to use any NLP approach (vector embeddings, regex, etc.) to enable querying the data
- Focus on demonstrating your understanding of Next.js patterns, TypeScript, and clean code organization
- Don't spend too much time on UI aesthetics - functionality is the priority
- Use JSON files as your database - no need for external data storage
- We'll be evaluating how efficiently you process and filter data before sending to the LLM
