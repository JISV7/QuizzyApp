Quizzy - Interactive Quiz Platform
Quizzy is a full-stack web application designed to provide an interactive and engaging learning experience for both teachers and students. Teachers can create courses, design quizzes, and track student performance in real-time, while students can join courses and complete assignments with instant feedback.

Live Demo: https://quizzy-client-k142.onrender.com

(Suggestion: Take a screenshot of your landing page and replace the URL above)

Features
For Teachers 🧑‍🏫
Course Management: Create, update, and delete courses with unique descriptions.

Student Enrollment: Invite students to courses via username or by generating a temporary invite link.

Quiz Creation: Build quizzes with multiple-choice questions, assign points, and set availability dates.

Real-time Analytics: View student submissions and grades as they come in.

Calendar View: See all assignment deadlines for all courses in a convenient calendar.

For Students 🧑‍🎓
Join Courses: Easily enroll in courses using an invite link.

Interactive Quiz Interface: A clean and intuitive UI for taking quizzes.

Instant Feedback: Receive your grade and see your results immediately after submission.

Assignment Planner: View all your pending assignments and deadlines in a personal calendar.

Tech Stack
This project is a monorepo containing a separate client and server.

Frontend (Client):

Framework: React 19 with TypeScript

Bundler: Vite

Routing: React Router

Styling: Plain CSS with a modular approach

Runtime: Bun

Backend (Server):

Framework: Express.js

Language: JavaScript (Node.js)

Authentication: JSON Web Tokens (JWT)

Validation: Zod

Runtime: Bun

Database:

Type: MySQL

Schema: The full database schema can be found in quizzy.sql.

Local Development Setup
To run this project on your local machine, you will need to run both the client and server simultaneously.

Prerequisites
Bun installed on your machine.

A local MySQL server instance.

1. Clone the Repository
git clone https://github.com/your-username/QuizzyApp.git
cd QuizzyApp

2. Backend Setup
# Navigate to the server directory
cd server

# Install dependencies
bun install

# Create a .env file and add your database credentials and a JWT secret
# See .env.example for a template
cp .env.example .env

# Start the development server
bun run dev

The server will be running at http://localhost:3000.

3. Frontend Setup
# From the root directory, navigate to the client
cd client

# Install dependencies
bun install

# Create a .env file for local environment variables
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# Start the development server
bun run dev

The client will be running at http://localhost:5173.

Deployment
The live version of this application is deployed using the following services:

Database: The MySQL database is hosted on Railway.

Backend: The Express.js server is deployed as a Web Service on Render.

Frontend: The React application is deployed as a Static Site on Render, configured to handle client-side routing with rewrites.

Continuous deployment is enabled via GitHub. Any push to the main branch will automatically trigger new builds and deployments on Render.

License
This project is licensed under the MIT License - see the LICENSE file for details.