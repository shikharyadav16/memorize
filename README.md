# MemoRize — Passage Memorization & Evaluation Platform

MemoRize is a full-stack web application designed to test, train, and evaluate human textual memorization. Users are presented with a passage to memorize within a 25-second window, after which the passage disappears and a 30-second recall timer unlocks a text field for recall entry. Submissions are evaluated using Groq AI (`llama-3.3-70b-versatile`), which scores accuracy out of 10 and provides structured feedback on key facts remembered versus missed.

The platform includes user authentication, recall history tracking, dark mode support, and an administrator passage manager.

---

## Features

- Passage Memorization Challenge: 25-second timed reading window followed by a 30-second recall entry period with dynamic progress timers.
- Input Locking: Textarea remains strictly disabled during the memorization phase to ensure valid recall testing.
- Groq AI Evaluation: Submissions are graded out of 10 by Groq LLM (`llama-3.3-70b-versatile`) based on key information, accuracy, completeness, and semantic fidelity without requiring strict word-for-word duplication.
- User Authentication: Registration and login using Name, Email, and Password with bcrypt password hashing and JSON Web Token (JWT) session authorization.
- Submission History: Logged-in users can review past recall attempts, scores out of 10, original text, user recall, and AI feedback.
- Detailed Evaluation View: Clicking any historical submission opens a side-by-side comparison page.
- Admin Passage Manager: Password-protected administrator view at `/admin` to add and delete passages stored in MongoDB.
- Theme Support: Light and Dark mode interface toggle with system preference auto-detection and persistence.
- Apple/Google Design Language: Clean typography using the Inter font family, subtle borders, low border radii, and Phosphor icons.

---

## Tech Stack

### Frontend
- React 18
- React Router v6
- Vite
- CSS3 (Vanilla CSS with Custom Properties and Theme Switching)
- Phosphor Icons Web Library

### Backend
- Node.js & Express
- MongoDB & Mongoose ORM
- Groq SDK (`groq-sdk`)
- JSON Web Token (`jsonwebtoken`)
- Password Hashing (`bcryptjs`)
- Dotenv (`dotenv`)
- CORS (`cors`)

---

## Project Architecture

```
passage-recall/
├── client/                     # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── Overlay.jsx     # Pre-challenge start overlay
│   │   │   ├── PassageDisplay.jsx  # Passage view & 25s timer
│   │   │   ├── Timer.jsx       # Progress bar countdown timer
│   │   │   └── WritingArea.jsx # Text input field & 30s timer
│   │   ├── context/
│   │   │   └── AuthContext.jsx # JWT Auth state manager
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx   # Admin passage manager & auth guard
│   │   │   ├── EvaluationPage.jsx # Score & side-by-side comparison
│   │   │   ├── HistoryPage.jsx # Submission history list
│   │   │   ├── LoginPage.jsx   # User login page
│   │   │   ├── MainPage.jsx    # Game state controller
│   │   │   └── SignupPage.jsx  # User registration page
│   │   ├── App.jsx             # Router shell & navbar
│   │   ├── App.css             # Component-level stylesheets
│   │   ├── index.css           # Global theme tokens (Light/Dark)
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── server/                     # Node.js Express API
│   ├── middleware/
│   │   └── auth.js             # JWT verification & admin guard
│   ├── models/
│   │   ├── Passage.js          # Mongoose passage schema
│   │   ├── Submission.js       # Mongoose recall submission schema
│   │   └── User.js             # Mongoose user schema
│   ├── routes/
│   │   ├── auth.js             # Signup, login, admin login endpoints
│   │   ├── evaluate.js         # Groq AI evaluation endpoint
│   │   ├── passages.js         # CRUD & random passage endpoints
│   │   └── submissions.js      # User history endpoints
│   ├── .env                    # Environment variables (git-ignored)
│   ├── package.json
│   └── server.js               # Express entry point & MongoDB connector
├── .gitignore
├── PROMPT.md
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- MongoDB instance (Local MongoDB or MongoDB Atlas)
- Groq API Key (from console.groq.com)

---

### Installation & Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/passage-recall.git
   cd passage-recall
   ```

2. Configure Server Environment Variables:
   Create a file named `.env` inside the `server/` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

3. Install Server Dependencies:
   ```bash
   cd server
   npm install
   ```

4. Install Client Dependencies:
   ```bash
   cd ../client
   npm install
   ```

---

## Running the Application

### Option A: Running Development Servers

1. Start the Express Backend:
   ```bash
   cd server
   npm start
   ```
   The backend API runs at `http://localhost:5000`.

2. Start the React Frontend:
   ```bash
   cd client
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

### Option B: Building for Production

To create an optimized production build of the React client:
```bash
cd client
npm run build
```

---

## API Reference

### Authentication Endpoints
- `POST /api/auth/signup` — Registers a new user (`name`, `email`, `password`).
- `POST /api/auth/login` — Authenticates a user and returns a JWT token.
- `POST /api/auth/admin-login` — Authenticates an administrator.
- `GET /api/auth/me` — Fetches current user profile details.

### Passage Endpoints
- `GET /api/passages/random` — Fetches a random passage for the memorization game.
- `GET /api/passages` — Fetches all passages (Admin).
- `POST /api/passages` — Creates a new passage (Admin).
- `DELETE /api/passages/:id` — Deletes a passage (Admin).

### Evaluation & Submission Endpoints
- `POST /api/evaluate` — Evaluates a recalled passage using Groq AI (`llama-3.3-70b-versatile`). Automatically saves to user submission history if an authorization token is present.
- `GET /api/submissions` — Fetches the submission history for the authenticated user.
- `GET /api/submissions/:id` — Fetches a single submission by ID.

---

## License

This project is open source under the MIT License.
