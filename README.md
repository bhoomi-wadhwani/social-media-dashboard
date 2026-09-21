# Social Media Dashboard

Live: https://social-media-dashboard-woad-five.vercel.app

A YouTube analytics dashboard that pulls real channel data and runs it through an AI to give you actual insights on what is and isnt working. Built with React on the frontend and a small Express server on the backend that handles the AI calls.

Demo is wired to Nikes YouTube channel by default.

## What it does

Connects to the YouTube Data API to pull a channels stats and recent video performance. That data then gets sent to Gemini which analyses it and returns specific insights, not generic tips, but ones that reference actual numbers from the channel like views, engagement rate, and comment count.

On the UI side you get KPI cards, engagement charts, audience growth graphs, a platform breakdown, content mix view and a top posts table.

## Stack

React 19 - UI framework. Used the latest version since this is a fresh project and the new concurrent features help with the async data fetching.

Vite - build tool and dev server. Much faster than webpack for a React project, especially for hot reloads during development.

Tailwind CSS v4 - utility-first styling. No separate CSS files, everything is inlined as classes directly in the components.

Recharts - charting library built on top of SVG. Used for the engagement charts, sparklines, audience growth graphs and the content mix chart.

Lucide React - icon library. Clean consistent icons without pulling in a heavy icon font.

YouTube Data API v3 - fetches real channel statistics, recent video metadata and per-video stats like views, likes and comments. Three separate API calls: channel stats, video list, and video details.

Express.js - small backend server that handles the AI insight generation. Kept it separate from the frontend so the Gemini API key stays server-side and isnt exposed in the browser.

Google Gemini - the AI model used to analyse the YouTube data. Gets sent the channel stats and recent video list, returns a structured JSON with 3 whats working and 3 needs attention insights, each tied to a specific number from the data.

Concurrently - runs the Vite dev server and the Express server at the same time with a single command instead of opening two terminals.

Oxlint - linter. Rust-based so its significantly faster than ESLint, which matters when the project has a lot of JSX files.

## Project structure

src/components - all the dashboard UI pieces, one file per chart or card

src/services/youtube.js - all YouTube API calls in one place, also handles parsing the ISO 8601 duration format that the API returns for video length

api-server.js - the Express backend, receives channel data from the frontend and returns Geminis analysis
