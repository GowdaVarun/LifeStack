# LifeStack

**LifeStack** is a comprehensive full-stack platform for personal productivity and wellness. It helps you organize your life by managing SMART goals, daily events, knowledge, and finances—all within a unified, intuitive interface.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, Email-based login

---

## Features

- **Task Tracker:** Create, track, and review SMART tasks and milestones
- **Daily Event Logger:** Record thoughts and daily reflections
- **Knowledge Vault:** Save articles, videos, and notes
- **Finance Tracker:** Log expenses and income
- **Dashboard:** Overview with cards and graphs

---

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/GowdaVarun/LifeStack.git
    cd LifeStack
    ```

2. **Install dependencies:**
    ```bash
    cd frontend
    npm install
    cd ../backend
    npm install
    ```

3. **Configure environment variables in `/backend/.env`:**
    ```ini
    MONGO_URI=your_mongodb_connection
    JWT_SECRET=your_secret_key
    ```

4. **Run the application:**

    **Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```

    **Backend:**
    ```bash
    cd backend
    nodemon server.js
    ```

---

Contributions are welcome! Open issues or pull requests to help improve LifeStack.
