# SkillSwap — Cloud-Based Skill Exchange Platform

Peer-to-peer skill exchange. List what you can teach, find what you want to learn, and swap. No course fee, no tutor in between.

## What it does

- **My Skills** — list a skill with a title, category, proficiency (Beginner / Intermediate / Expert), description and tags. Edit or delete your own listings.
- **Explore Skills** — browse skills from other people, live. Search by title or description and filter by category.
- **Exchange Requests** — send a swap request with a message saying what you offer in return. The other side accepts or declines in one tap. Received and sent requests live in separate tabs with a pending / accepted / declined status.
- **Dashboard and profile** — a guarded dashboard with Stats, My Skills, Explore and Requests views, plus a profile page.

## Categories

Development, Design, Marketing, Business, Languages, Music, Photography, Cooking, Health & Fitness, Other.

## How it works

- Sign in with email and password, or with Google.
- Skills live in a Firestore `skills` collection. The Explore view listens live and shows everyone else's skills, newest first.
- A swap request is a document in a Firestore `requests` collection (`fromUserId`, `toUserId`, `skillId`, `skillTitle`, `message`, `status: pending`). Accepting or declining is a single status update.
- Auth is Firebase Auth. Firebase Storage is set up in the app config.

## Stack

React 19 + Vite, Firebase (Auth, Firestore, Storage), react-router-dom v7, lucide-react. Deployed as a Vite SPA on Vercel.

## Run it

```bash
npm install
npm run dev
```

## Notes

- The landing page shows placeholder stats (user counts and company names) as demo copy. They are not real figures.
- This is a student cloud mini-project. There is no payment system: the exchange itself is the deal.
