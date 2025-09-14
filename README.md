TaskManager

Group X Project

GitHub Repository: https://github.com/<your-username>/taskmanager

🌟 Project Overview

TaskManager is a modern React + Node.js + MySQL full-stack task management application. It demonstrates DevOps principles through containerization, CI/CD, automated testing, and monitoring. Users can create, edit, and manage tasks in a seamless, real-time interface.

👥 Team Members & DevOps Roles

Varun (23211A6778): release
Avinash (23211A6796): monitor/operate
Sudheshna (23211A6798): deploy
Nikhila (23211A67A3): test
Sanjani (23211A67B4): code
Aparajita (23211A67C0): code, build
Triveni (23211A67C7): build
Frontend & Backend Development by [Your Name] (React + Node.js + MySQL)
🏗️ Technical Implementation Details
Frontend Stack
React 18.x – Modern React with hooks
Vite – Fast development server and build tool
Material-UI – Component library for consistent design
Framer Motion – Smooth animations
CSS Modules – Scoped styling
Backend Stack
Node.js + Express – REST API server
MySQL – Database for users and tasks
JWT Authentication – Secure login/session management
Data Validation – Input sanitization and response validation
🛠️ Development Workflow
Getting Started
# Backend
cd backend
npm install
npm run dev      # start server

# Frontend
cd frontend
npm install
npm run dev      # start frontend

Project Structure
backend/
├── controllers/        # API request handlers
├── models/             # Database models
├── routes/             # API routes
├── middleware/         # Auth & error handling
├── app.js              # Express app entry point
└── server.js           # Server startup

frontend/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── TaskList.jsx
│   │   ├── TaskItem.jsx
│   │   ├── AddTaskForm.jsx
│   │   └── UserLogin.jsx
│   ├── styles/
│   └── assets/

🐳 Docker Containerization & Deployment

Branch: docker
Summary of Changes
Multi-stage Dockerfiles for frontend and backend
Docker Compose setup for orchestrating frontend, backend, and MySQL
Port mapping and auto-restart policies
Local run:
docker-compose up --build
DockerHub Integration
docker tag taskmanager-frontend <username>/taskmanager-frontend:latest
docker push <username>/taskmanager-frontend:latest
docker tag taskmanager-backend <username>/taskmanager-backend:latest
docker push <username>/taskmanager-backend:latest
Outcome: Fully containerized, portable app. Team members can run instantly using Docker.
🚀 Continuous Integration (CI) & Testing
Branch: ci
Tools
Vitest & React Testing Library – Unit & integration tests
GitHub Actions – Linting, testing, and security checks
Workflow
Install dependencies
Run linting (npm run lint)
Run all tests
Run security scan (npm audit)

Fail build if any step fails

Example Test Scenarios:

Adding, editing, deleting tasks

User authentication & authorization

Edge cases like empty task input or invalid login

🚀 Continuous Deployment (CD)

Branch: cd

Automated deployment triggered after successful CI

Deployed on Vercel / Render / Railway

Secrets stored securely in GitHub

Ensures production-ready deployment after each update

🖥️ Monitoring & Observability

Branch: monitoring

Tools & Access

Docker stats & logs – Quick container health check

cAdvisor – CPU, memory, and network metrics

Prometheus – Metrics collection

Grafana – Real-time dashboards

Outcomes:

Real-time app health monitoring

Logs & metrics for debugging

Foundation for future alerts & centralized logging

🌟 Future Enhancements

Email/SMS notifications for task deadlines

Centralized logs using ELK Stack

Advanced metrics and alerting

Real-time collaboration features
