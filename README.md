<img width="150" height="150" alt="Mascot" src="https://github.com/user-attachments/assets/99eca932-c237-4750-becb-d3492c89dd7b" align="right" />
# Quizzy - Interactive Quiz Platform

Quizzy is a full-stack web application designed to provide an interactive and engaging learning experience for both teachers and students. Teachers can create courses, design quizzes, and track student performance in real-time, while students can join courses and complete assignments with instant feedback.

**Live Demo:** https://quizzy-client-k142.onrender.com

![Quizzy Landing Page](https://github.com/user-attachments/assets/8a4c3b16-dd64-44a6-8d3a-c4fb0de43b2c)

## Features

### For Teachers 🧑‍🏫
- **Course Management**: Create, update, and delete courses with unique descriptions
- **Student Enrollment**: Invite students via username or generate temporary invite links
- **Quiz Creation**: Build quizzes with multiple-choice questions, assign points, and set availability dates
- **Real-time Analytics**: View student submissions and grades as they come in
- **Calendar View**: See all assignment deadlines across courses in a convenient calendar

### For Students 🧑‍🎓
- **Join Courses**: Easily enroll in courses using invite links
- **Interactive Quiz Interface**: Clean and intuitive UI for taking quizzes
- **Instant Feedback**: Receive grades and see results immediately after submission
- **Assignment Planner**: View pending assignments and deadlines in a personal calendar

## Tech Stack

This project is a monorepo containing separate client and server components:

### Frontend (Client)
- **Framework**: React 19 with TypeScript
- **Bundler**: Vite
- **Routing**: React Router
- **Styling**: Plain CSS with modular approach
- **Runtime**: Bun

### Backend (Server)
- **Framework**: Express.js
- **Language**: JavaScript (Node.js)
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Zod
- **Runtime**: Bun

### Database
- **Type**: MySQL
- **Schema**: Full database schema available in `quizzy.sql`

## Local Development Setup

To run this project locally, you need to run both client and server simultaneously.

### Prerequisites
- Bun installed on your machine
- A local MySQL server instance

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/QuizzyApp.git
cd QuizzyApp
```

### 2. Backend Setup
```bash
# Navigate to the server directory
cd server

# Install dependencies
bun install

# Create a .env file and add your database credentials and JWT secret
# See .env.example for a template
cp .env.example .env

# Start the development server
bun run dev
```
The server will run at http://localhost:3000

### 3. Frontend Setup
```bash
# From the root directory, navigate to the client
cd client

# Install dependencies
bun install

# Create environment variables
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# Start the development server
bun run dev
```
The client will run at http://localhost:5173

## Deployment

The live version is deployed using:
- **Database**: MySQL hosted on Railway
- **Backend**: Express.js server deployed as a Web Service on Render
- **Frontend**: React application deployed as a Static Site on Render

Continuous deployment is enabled via GitHub - pushes to the main branch automatically trigger new builds and deployments on Render.

## License

This project is licensed under the MIT License