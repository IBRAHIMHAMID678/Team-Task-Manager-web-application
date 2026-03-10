# 🚀 Team Task Manager

A high-performance, collaborative task management application built with a modern **Django REST Framework** backend and a **React (Vite)** frontend. This platform enables teams to organize work, track progress, and communicate effectively through a structured workspace system.

---

## 🏗️ Project Architecture & Modules

### 1. Backend (`/backend`)
Built using Python 3.11 and Django REST Framework, the backend follows a clean, decoupled architecture:
- **`core/`**: Central project configuration.
  - `authentication.py`: Contains a custom `CsrfExemptSessionAuthentication` class to handle secure, session-based auth across origins.
  - `settings.py`: Configured for both local development (SQLite) and production (PostgreSQL via `dj-database-url`).
- **`users/`**: Manages the authentication lifecycle.
  - Implements an **Email-or-Username** login backend.
  - Uses **Bcrypt** for secure password hashing.
  - Provides registration, login, logout, and user profile endpoints.
- **`teams/`**: The core organizational unit.
  - Supports team creation and member invitations.
  - Implements **Role-Based Access Control (RBAC)**: Only the creator can delete a team or invite members.
- **`tasks/`**: Fine-grained task management.
  - Features status tracking (`Pending`, `In Progress`, `Completed`) and priority levels (`Low`, `Medium`, `High`).
  - Includes an endpoint for **Upcoming Due-Date Reminders** (tasks due within 3 days).

### 2. Frontend (`/frontend`)
A modern, responsive SPA built with React 19 and Tailwind CSS:
- **`src/context/`**: Contains the `AuthContext` which manages global user state and configures `Axios` defaults (Base URL, CSRF headers, withCredentials).
- **`src/pages/`**:
  - `Dashboard.jsx`: The main application hub featuring specialized sidebar navigation and task filtering.
  - `Login.jsx` & `Register.jsx`: Minimalist, glassmorphic auth forms.
- **`src/components/`**:
  - `TaskList.jsx`: Handles complex filtering, search, and dynamic task CRUD operations.
  - `TeamList.jsx`: Manages workspace switching and team administration (invites/deletions).

---

## 🛠️ Detailed Setup Instructions

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **npm** or **yarn**

### 1. Backend Initialization
1.  **Navigate & Virtual Env:**
    ```bash
    cd backend
    python -m venv venv
    ```
2.  **Activate Virtual Env:**
    - *Windows:* `venv\Scripts\activate`
    - *macOS/Linux:* `source venv/bin/activate`
3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Database Migration:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
5.  **Create Admin User (Optional):**
    ```bash
    python manage.py createsuperuser
    ```
6.  **Run Server:**
    ```bash
    python manage.py runserver
    ```
    *The API will be accessible at `http://localhost:8000/api/`.*

### 2. Frontend Initialization
1.  **Navigate & Install:**
    ```bash
    cd ../frontend
    npm install
    ```
2.  **Environment Configuration:**
    Create a `.env` file in the `frontend/` directory (if not already present):
    ```env
    VITE_API_URL=http://localhost:8000/api
    ```
3.  **Run Dev Server:**
    ```bash
    npm run dev
    ```
    *The application will launch at `http://localhost:5173`.*

---

## 🔐 Security & Features
- **Session-Based Auth**: Secure cookie handling with `SameSite=Lax`.
- **RBAC (Role-Based Access Control)**:
    - **Team Creator**: Has full administrative rights (Invite members, Delete Team, Delete any Task).
    - **Team Member**: Can view all tasks and update status/details of tasks assigned to them.
- **Modern UI**: Dark mode by default, utilizing a custom Tailwind palette (`brandLime`, `darkBg`, `cardBg`) and `Inter` typography.
- **Responsive Filtering**: Filter tasks instantly by status, priority, or assignee without page reloads.

---

## 🚀 Deployment (Railway/Docker)
The project includes `Dockerfile` configurations for both backend and frontend, as well as `railway.toml` for seamless deployment to the **Railway** platform.
- **Backend**: Uses Gunicorn as the WSGI server.
- **Frontend**: Nginx-based build for serving the static Vite bundle.
