
# 🎨 Learning Platform - Frontend

This is the **frontend** of the Learning Platform project, built with **React (Vite)** and styled with **Bootstrap**.  
It runs locally and connects to the backend via a configurable base URL.

---

## 🚀 Features
- Responsive UI with Bootstrap.
- Centralized API calls via `utils/axios.js`.
- Environment variable support for easy configuration.

---

## 🏗 Tech Stack
- **React (Vite)**
- **Axios**
- **Bootstrap**

---

## 📦 Installation & Local Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/yourusername/frontend.git
cd frontend
2️⃣ Install dependencies
npm install
3️⃣ Set environment variables
Create a .env file in the root:
env
VITE_BACKEND_URL=http://localhost:3000
4️⃣ Run the app locally
npm run dev
The app will be available at:
arduino
http://localhost:5173
📂 Folder Structure
src/
├── api/          # (Legacy) API client files
├── components/   # Reusable UI components
├── pages/        # Page components
├── utils/        # axios.js and helpers
├── App.jsx
└── main.jsx

🛠 Development Notes
All API calls use ${import.meta.env.VITE_BACKEND_URL}.
Use utils/axios.js for Axios-based API calls.
If using fetch(), prepend the base URL manually:
fetch(`${import.meta.env.VITE_BACKEND_URL}/api/your-endpoint.php`)
