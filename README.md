---

# 🏢 StallSpot: Interactive Exhibition Management Platform

```text
  ____  _        _ _  ____             _   
 / ___|| |_ __ _| | |/ ___|_ __   ___ | |_ 
 \___ \| __/ _` | | |\___ \| '_ \ / _ \| __|
  ___) | || (_| | | | ___) | |_) | (_) | |_ 
 |____/ \__\__,_|_|_||____/| .__/ \___/ \__|
                           |_|              
```

> 🚧 Currently in active development – contributions and feedback are welcome!

---

## 🌟 Project Overview

**StallSpot** is a powerful and user-friendly web platform built to **streamline stall booking and exhibition space management**. Designed for **organizers, vendors, and exhibitors**, this platform combines real-time interaction with a modern tech stack to make managing exhibitions a breeze.

Whether you're booking a stall, planning an entire event, or monitoring exhibitor activity, StallSpot simplifies it all.

---

## 🎯 Core Features

### 🎫 Stall Booking System

- 🔄 **Real-Time Stall Availability** – Instantly see which stalls are booked or available.
- ⚡ **One-Click Booking** – Just like ticketing apps; reserve stalls in seconds.
- 💰 **Transparent Pricing** – Know exactly what you pay, no hidden fees.

### 👥 Role-Based User Management

- **Vendor Dashboard** – View & manage stall bookings.
- **Exhibitor Dashboard** – Coordinate with vendors and monitor event flow.
- **Organizer Dashboard** – Design stall layouts, approve bookings, manage revenue.
- 🔐 **Secure JWT-Based Authentication**
- ⚙️ **Role-based Access Controls**

---

## 🛠️ Tech Stack

### 💻 Frontend

| Tech       | Description                      |
|------------|----------------------------------|
| **Next.js** | SSR support with React framework |
| **TypeScript** | Type-safe, robust front-end code |
| **Konva.js** | Interactive floor plan canvas rendering |

Badges:

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Konva](https://img.shields.io/badge/Konva-F16A5E?style=for-the-badge)

### 🔧 Backend

| Tech        | Description                          |
|-------------|--------------------------------------|
| **Node.js** | Backend runtime environment          |
| **Express.js** | API and server logic handling     |
| **MongoDB (Atlas)** | NoSQL database for stall data |

Badges:

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## ⚙️ Getting Started

### ✅ Prerequisites

Ensure the following are installed:

- [Node.js](https://nodejs.org/) (v18.15.0+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or Local Mongo
- [Git](https://git-scm.com/)

---

### 📦 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Parth-12pm/next-stallSpot.git
cd next-stallSpot

# 2. Install dependencies
npm install

# 3. Create environment config
cp .env.example .env.local

# 4. Update .env.local with your credentials

# 5. Run the development server
npm run dev


---

📁 Project Structure

next-stallSpot/
├── components/      # Reusable UI components
├── pages/           # Next.js route handlers
├── public/          # Static assets
├── styles/          # CSS & Tailwind styles
├── lib/             # Helper functions, APIs
├── models/          # Mongoose schemas
└── api/     # Server-side logic & routes


---

🔐 Environment Variables Setup

To run locally, configure the following in .env.local:

> Refer to the Environment Setup Guide for full details.



MongoDB

MONGODB_URI=

NextAuth

NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_PUBLIC_URL=http://localhost:3000


Cloudinary (Media Uploads)

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Razorpay (Payments)

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

Nodemailer SMTP (Email via Gmail)

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=
SMTP_PASS=


---

🤝 Contributing

We welcome all kinds of contributions – bug reports, feature suggestions, code improvements.

How to contribute:

1. 🍴 Fork the repository


2. 🌱 Create a feature branch

git checkout -b feature/your-feature-name


3. ✅ Make your changes & commit

git commit -m "Add your message"


4. 🚀 Push your branch

git push origin feature/your-feature-name


5. 🔃 Create a Pull Request on GitHub

---


⚖️ License & Usage Terms
© 2025 Parth Mahadik. All Rights Reserved.

This project and its source code are protected under a Custom License:

❌ You may NOT copy, publish, distribute, upload, or post this code (in full or in part) on any public or private platform without explicit written permission from the author.

🧩 Usage is strictly limited to local testing, learning, and evaluation purposes only.

🚫 Commercial, academic, or public redistribution is prohibited.

⚙️ You may run, test, or modify the project on your local machine for personal learning only.

⚖️ Any violation will be treated as a copyright infringement under applicable law.

For special permissions or collaborations, contact the author at parthsmahadik12027@gmail.com.

---

📧 Contact

Maintained by Parth Mahadik

GitHub: @Parth-12pm

Email: parthsmahadik12027@gmail.com



---

⭐ If you like this project, don’t forget to star it on GitHub!


---
