# Alpha Portal - Student Management System

A premium, modern Student Management Dashboard built for the DekNek Round 2 Assignment.

## Tech Stack
- **Backend**: Java 21+ with Spring Boot 3.2.5
  - Spring Security (JWT Authentication)
  - Spring Data JPA
  - H2 In-Memory Database (with Console)
- **Frontend**: React (Vite)
  - Vanilla CSS (Modern Design System)
  - Lucide React Icons
  - Glassmorphism UI

## Getting Started

### Prerequisites
- JDK 17 or higher (Java 21/26 recommended)
- Node.js & npm

### 1. Run the Backend
Since Maven is not in your system path, you can use the Maven Wrapper or just install Maven.
From the `backend` directory:
```bash
./mvnw spring-boot:run
```
*The backend will run on `http://localhost:8080`.*

### 2. Run the Frontend
From the `frontend` directory:
```bash
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`.*

## Features
- **Real Authentication**: Secure Signup and Login using JWT.
- **Student CRUD**: Add, View, and Delete student records.
- **Modern Dashboard**: Responsive layout with stats, search, and animations.
- **Database Console**: Access the H2 console at `http://localhost:8080/h2-console` (User: `sa`, Pass: `password`).

## Deployment Instructions
To deploy this project to a live server:
1. **Render**: Create a Web Service and connect your repository. Use the `Dockerfile` provided.
2. **Railway**: Deploy directly by connecting your GitHub repo.
3. **Vercel/Netlify**: For the frontend only (requires changing the API URL to a live backend).
