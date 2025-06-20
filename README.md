# 🐞 Bug Tracker App

A full-featured **Bug & Issue Tracking System** built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Inspired by tools like Jira and Linear, this app allows project teams to track bugs, assign tickets, manage sprints via a Kanban board, and collaborate effectively.

---

## 🔗 Live Demo

- 🌐 Frontend: [https://bug-tracker-yourname.vercel.app](bug-tracker-boap-25o7kai78-vishals-projects-dd38c9a3.vercel.app)
- ⚙️ Backend: [https://bug-tracker-api.onrender.com](https://bug-tracker-5yd2.onrender.com))

---

## 🚀 Features

### ✅ Authentication
- Login & Register with JWT
- Role-based access (Admin, Manager, Developer)

### 🧑‍💻 Project Management
- Create and manage multiple projects
- Invite team members by email

### 🪲 Ticketing System
- Create, assign, edit, and delete bug tickets
- Priority & status: Low, Medium, High / Open, In Progress, Closed
- Add comments to tickets (realtime discussion)

### 📊 Kanban Board
- Drag-and-drop ticket management across "To Do", "In Progress", and "Done"

### 🔍 Ticket Filtering & Sorting
- Search by title or description
- Filter by status, priority
- Sort by newest / oldest

### 🖼️ Attachments (optional)
- Upload screenshots or logs (Multer support)

---

## 🛠️ Tech Stack

| Frontend       | Backend        | Database     | Others         |
|----------------|----------------|--------------|----------------|
| React.js       | Node.js        | MongoDB Atlas| Tailwind CSS   |
| React Router   | Express.js     | Mongoose     | JWT Auth       |
| Context API    | Multer (optional) |            | Vercel (Frontend) |
| Axios          | CORS           |              | Render / Railway (Backend) |

---

## 🏁 Getting Started

### ⚙️ Backend Setup

```bash
cd server
npm install
