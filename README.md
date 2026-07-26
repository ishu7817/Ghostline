# Ghostline

Send what you can't say. An anonymous messaging platform where anyone can drop you an honest, untraceable message — with AI-generated suggestions to help break the blank-page problem.

Built as a full-stack learning project, then designed and hardened into a portfolio-ready app.

---

## What it does

- Every user gets a unique public link (`/u/username`)
- Anyone with that link can send an anonymous message — no account, no login required to send
- Recipients read messages in a private dashboard with zero sender information attached
- An AI assistant (Google Gemini via the Vercel AI SDK) suggests short, witty, ready-to-send messages so senders never face a blank textbox
- Recipients can toggle whether they're currently accepting messages
- Full email-based signup verification (OTP) before an account goes live

---

## Tech stack

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod for form state and validation
- shadcn/ui component primitives

**Backend**
- Next.js Route Handlers (API routes)
- MongoDB + Mongoose
- NextAuth (Credentials provider, JWT sessions)
- bcryptjs for password hashing
- Nodemailer for transactional email (OTP delivery)

**AI**
- Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/google`)
- Google Gemini (`gemini-3.1-flash-lite`) for message suggestions
- Streamed via `streamText` + `toTextStreamResponse`, consumed on the client with `useCompletion`

---

## Core features

### Authentication & account lifecycle
- Email/password signup with Zod-validated forms
- Live username-availability checking (debounced, hits the DB on pause-in-typing)
- Email OTP verification before an account is considered active
- Unverified "ghost" accounts are handled gracefully — re-signing up with the same email updates the existing pending record instead of erroring
- NextAuth Credentials provider for sign-in, with custom JWT/session callbacks exposing `username`, `isVerified`, and `isAcceptingMessages` on the client session

### Messaging
- Public, no-auth-required send page at `/u/[username]`
- Server-side check on whether the recipient is currently accepting messages
- Messages stored as an embedded array on the recipient's user document, each with a timestamp
- Recipient dashboard to view, and toggle message-acceptance state

### AI-assisted message suggestions
- One-click "Suggest Messages" button generates three short, sarcastic, standalone anonymous messages
- Prompt engineered specifically for this use case: statements, not questions (since recipients can never reply), constrained to under 15 words, deliberately varied in topic and structure across both a single response and repeated requests
- Suggestions render as clickable pills that populate the message textarea directly

### Design system
- Fully custom, image-free visual language — no stock photography or external assets
- Dark, cinematic aesthetic built entirely from layered CSS: animated radial-gradient color fields, a hand-tuned halftone dot-matrix texture (`background-size` + `mix-blend-mode`), and glassmorphism cards (`backdrop-filter: blur`)
- Consistent single-accent color system (violet) applied with varying intensity — outline/ghost treatment for secondary actions, solid fill reserved for primary CTAs
- Serif italic display type paired with a geometric sans for body/UI text

---

## Project structure

```
src/
  app/
    (auth)/
      sign-in/
      sign-up/
      verify/[username]/
    api/
      auth/[...nextauth]/
      sign-up/
      verify-code/
      send-message/
      suggest-messages/
      check-username-unique/
      accept-messages/
      get-messages/
    u/[username]/          # public anonymous send page
  components/ui/           # shadcn primitives (button, field, input, sonner, etc.)
  helpers/
    sendVerificationEmail.ts
  lib/
    dbConnect.ts
  models/
    user.model.ts
  schemas/                 # Zod schemas: signUp, signIn, verify, message
  types/
    apiResponse.ts
    next-auth.d.ts         # extends NextAuth's built-in types with custom fields
```

---

## Environment variables

```
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_GENERATIVE_AI_API_KEY=
NODEMAILER_EMAIL=
NODEMAILER_PASSWORD=
```

---

## Running locally

```bash
npm install
npm run dev
```

Requires a MongoDB connection string, a Google AI Studio API key (Gemini), and a Gmail account with an App Password generated for Nodemailer.

---

## Notes on scope

This project intentionally does not include payment/monetization, content moderation tooling, or a growth/distribution mechanism — it was built primarily to practice full-stack fundamentals (auth flows, form handling, AI integration, and a from-scratch design system) rather than as a production SaaS candidate.