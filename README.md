<div align="center">
  <img width="1200" height="400" alt="HRIS Banner" src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" style="object-fit: cover; border-radius: 20px; margin-bottom: 20px;"/>
  
  <h1 style="margin: 0;">🌟 Next-Generation HRIS System</h1>
  <p><strong>A beautifully designed, highly modular Human Resource Information System for the modern workplace.</strong></p>

  <p>
    <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
    <img alt="TailwindCSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img alt="Laravel" src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" />
    <img alt="MySQL" src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" />
  </p>
</div>

---

Welcome to the future of Human Resource Management! This system was built to completely modernize the HR experience. Say goodbye to clunky, outdated interfaces—our HRIS features a **stunning, glassmorphism-inspired UI**, deeply interactive data visualization dashboards, and an incredibly robust backend architecture.

Whether you're managing personnel, tracking dynamic workflows, generating live analytical reports, or maintaining secure audit trails, this system makes every action feel intuitive and premium.

## ✨ Key Features

- 🎨 **Breathtaking UI/UX**: Built with React, Tailwind CSS, and Framer Motion. Every button, panel, and table features soft shadows, beautiful transitions, and modern glassmorphism.
- 📊 **Dynamic Data Dashboards**: Gorgeous, real-time Recharts integrations providing insights on filled vs. unfilled positions, deployment rates, and workforce demographics.
- 🏗 **Modular Laravel Backend**: The API is fully modularized by domain (`Auth`, `Personnel`, `Recruitment`, `Workflow`, `Reports`) for extreme scalability and clean architecture.
- 🔒 **Enterprise-Grade Security**: Fully tracked Audit Trails, strict Role-Based Access Control (RBAC), and beautifully integrated user management.

---

## 🚀 Getting Started

Ready to experience it yourself? Setting up the project locally is a breeze. The system is split into a **Frontend (Client)** and a **Backend (Server)**. 

### Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [PHP](https://www.php.net/) (v8.1 or higher)
* [Composer](https://getcomposer.org/)
* A local database server (e.g., MySQL via XAMPP/Herd/Valet)

### 1️⃣ Backend Setup (Laravel API)

The backend provides all the data via a fast, secure REST API.

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the required PHP dependencies:
   ```bash
   composer install
   ```
3. Set up your environment file. Duplicate `.env.example`, rename it to `.env`, and update your database credentials (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`):
   ```bash
   cp .env.example .env
   ```
4. Generate your unique application key:
   ```bash
   php artisan key:generate
   ```
5. Run the database migrations (this will set up all your tables!):
   ```bash
   php artisan migrate
   ```
6. Start the backend server! 🚀
   ```bash
   php artisan serve
   ```
   *Your API will now be running on `http://localhost:8000`.*

### 2️⃣ Frontend Setup (React/Vite)

The frontend is the gorgeous interface where all the magic happens.

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install the necessary JavaScript packages:
   ```bash
   npm install
   ```
3. (Optional) If your backend is running on a different port than `8000`, duplicate `client/.env.example` to `client/.env` and update the `VITE_API_URL` variable.
4. Launch the lightning-fast Vite development server! ⚡
   ```bash
   npm run dev
   ```
   *Your app will launch in your browser (usually `http://localhost:5173`).*

---

## 💡 What's Next?

Log in with your administrator credentials (or register a new user if you seeded your database) and explore! Head over to the **Dashboard** to see the stunning glass UI, check out the **Reports** tab for interactive analytics, and manage your team under **User Management**.

Have fun exploring and expanding the system! If you find it helpful, don't forget to ⭐ this repository. Happy coding! 🎉
