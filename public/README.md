# Saycret Frontend

Static frontend for Saycret auth (sign in, register, email verification). Served by the Express backend from `/`.

## Structure

- **index.html** – Shell: sign-in form, register form, post-register “verify email” notice.
- **verify.html** – Email verification: reads `?token=...` from URL, POSTs to `/api/users/confirm`, shows success or error.
- **css/style.css** – Saycret styles (dark theme, orange gradient `#E67E22` / `#F39C12`).
- **js/config.js** – API base URL and endpoints (`/api/users/login`, `/api/users/register`, etc.).
- **js/ui.js** – UI helpers: `showError`, `showSuccess`, `switchForm`, `togglePassword`, `setLoading`, `showVerifyEmailNotice`.
- **js/auth.js** – Auth actions: `handleSignIn`, `handleRegister`, `handleResendVerification`.
- **js/main.js** – Entry: wires form submit handlers and links.

## API

When served from the same origin, requests go to relative paths (e.g. `/api/users/login`). To point to another host (e.g. API on port 5000, frontend elsewhere), set `window.API_BASE_URL = 'http://localhost:5000'` before loading the app.

## Verification email

Verification emails use the same Saycret palette (black background, orange gradient button) and link to `APP_URL/verify.html?token=...`, which POSTs the token to `/api/users/confirm`.
