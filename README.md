# NITT ID Card Re-issue – Setup

Official-style portal: Apply as Student, Faculty/Staff, or Admin login. OTP verification via institute webmail (@nitt.edu), payment instructions (SBI Collect), and Firebase Storage for documents.

## Project Structure

```
backend/   → Express + MongoDB API (nodemailer OTP, optional Firebase Storage)
frontend/  → React + Vite frontend
```

## Home page options

1. **Apply as Student** – Roll number → OTP to rollno@nitt.edu → 4 steps: Verification, Fill form + photo, Payment & docs (FIR + SBI receipt), Preview → Submit & download PDF.
2. **Apply as Faculty/Staff** – Institute webmail (@nitt.edu) → OTP → Fill form (no docs) → Preview → Submit & download PDF.
3. **Admin Login** – No registration; forgot password via OTP to admin email. After login: add new admin, view/verify applications, download documents (local or Firebase URLs).

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

- **MONGODB_URI** – MongoDB connection string.
- **JWT_SECRET** – Long random secret for tokens.
- **NODEMAILER_USER**, **NODEMAILER_PASSWORD** – SMTP credentials (OTP to rollno@nitt.edu and institute webmail).
- **Firebase (optional)** – Set `GOOGLE_APPLICATION_CREDENTIALS_JSON` (minified service account JSON) and optionally `FIREBASE_STORAGE_BUCKET`. If not set, files are stored in `./uploads`.

First admin: no public registration. Create manually or run:

```bash
node scripts/seedAdmin.js
```

(Requires ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD in `.env`.)

Start API:

```bash
npm start
```

API base: `http://localhost:5000/api`.

## 2. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env` (or `.env.local`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_API_BASE=http://localhost:5000
```

Start app:

```bash
npm run dev
```

## 3. Main API endpoints

- **Auth:** `POST /api/auth/send-otp` (body: `rollNo` + `userType: 'student'` or `email` + `userType: 'faculty'|'staff'`), `POST /api/auth/verify-email`, `POST /api/auth/admin-login`, `POST /api/auth/admin-forgot-password`, `POST /api/auth/admin-reset-password`.
- **Applications:** `POST /api/applications/submit` (Bearer applicant token, multipart: form + photo, fir, payment), `GET /api/applications/status/:id`, `GET /api/applications/all` (admin only).
- **Admin:** `GET /api/admin/stats`, `PUT /api/admin/approve/:id`, `PUT /api/admin/reject/:id`, `POST /api/admin/add` (add new admin).

Once `.env` is set and both servers run, the app is ready to use.
