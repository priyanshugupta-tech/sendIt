<a id="readme-top"></a>

<div align="center">
  <img src="frontend/public/favicon.png" alt="SendIt logo" width="128">

  <h1>SendIt</h1>

  <p>This is simple app for messaging and chatting, one on chatting and group chats powered by Nodejs, expressjs, mongoDB and React.</p>

  <p>
    <a href="#about">About</a> ·
    <a href="#features">Features</a> ·
    <a href="#getting-started">Getting started</a> ·
    <a href="#api">API</a>
  </p>
</div>

## About

SendIt is a real-time chat application. The current implementation includes a React authentication interface and an Express API for account registration, email OTP verification, login, and session refresh. Messaging features are still in development.

## Features

- Sign up with a username, email, password, and password confirmation
- Verify a new account with a one-time email code
- Sign in with a username and password
- Short-lived access tokens and rotating refresh tokens
- HTTP-only refresh-token cookies and server-side session records
- React, TypeScript, Chakra UI, and Redux frontend
- Express, MongoDB, and Mongoose backend

## Built with

<div align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://chakra-ui.com/"><img src="https://img.shields.io/badge/Chakra_UI-319795?style=for-the-badge&logo=chakraui&logoColor=white" alt="Chakra UI"></a>
  <a href="https://redux-toolkit.js.org/"><img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"></a>
  <a href="https://mongoosejs.com/"><img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose"></a>
  <a href="https://resend.com/"><img src="https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white" alt="Resend"></a>
</div>

## Getting started

### Prerequisites

- Node.js and npm
- Access to a MongoDB database
- A Resend API key and a sender domain configured with Resend

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/priyanshugupta-tech/sendIt.git
   cd sendIt
   ```

2. Install backend dependencies from the repository root:

   ```sh
   npm install
   ```

3. Install frontend dependencies:

   ```sh
   cd frontend
   npm install
   cd ..
   ```

4. Create a `.env` file in the repository root:

   ```env
   PORT=5000
   DB_PASSWORD=your_mongodb_password
   JWT_SECRET=your_long_random_secret
   RESEND_API_KEY=your_resend_api_key
   NODE_ENV=development
   ```

   The backend requires all three credentials. The MongoDB Atlas connection string is currently assembled in `server.js`; update its cluster and database username there if you are using a different database account. Never commit your `.env` file or share its values.

5. Start the backend from the repository root:

   ```sh
   npm start
   ```

6. In a second terminal, start the frontend:

   ```sh
   cd frontend
   Copy-Item .env.example .env.local
   npm run dev
   ```

   Set `VITE_API_BASE_URL` in `frontend/.env.local` to your backend URL (for example, `https://your-backend.example.com`). The Vite development server calls this API directly; it does not proxy `/api` requests.

   For Vercel, add `VITE_API_BASE_URL` with the deployed backend URL in the project's Environment Variables, then redeploy. Vite variables are included in browser code and are not secrets.

## Available scripts

Run these commands from the indicated directory:

| Directory       | Command           | Description                           |
| --------------- | ----------------- | ------------------------------------- |
| Repository root | `npm start`       | Start the backend with nodemon        |
| `frontend/`     | `npm run dev`     | Start the Vite development server     |
| `frontend/`     | `npm run build`   | Type-check and build the frontend     |
| `frontend/`     | `npm run lint`    | Lint the frontend                     |
| `frontend/`     | `npm run preview` | Preview the production frontend build |

## API

The backend runs on port `5000` by default.

| Method | Endpoint                     | Purpose                                                     |
| ------ | ---------------------------- | ----------------------------------------------------------- |
| `POST` | `/api/auth/signup`           | Create an unverified account and send its verification code |
| `POST` | `/api/auth/verify-otp`       | Verify a new account and create a session                   |
| `POST` | `/api/auth/login`            | Sign in with username and password                          |
| `GET`  | `/api/auth/newtoken`         | Rotate the refresh token and issue a new access token       |
| `POST` | `/api/auth/logout`           | Revoke the current session                                  |
| `POST` | `/api/auth/logout/logoutall` | Revoke all sessions for the current account                 |
| `POST` | `/api/auth/getuser`          | Get the user associated with an access token                |

## Project assets

- Main logo and favicon: [`frontend/public/favicon.png`](frontend/public/favicon.png)
- Wordmark: [`frontend/src/assets/logoComp.png`](frontend/src/assets/logoComp.png)

## Current status

Authentication is implemented; chat and messaging functionality is still in progress. The project does not currently include an automated backend test suite.

<p align="right"><a href="#readme-top">Back to top</a></p>
