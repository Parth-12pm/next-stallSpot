# Next StallSpot

Next StallSpot is a web-based platform designed to manage exhibitions with an interactive 2D floor plan. The platform allows vendors to apply for, manage, and book stalls. It enables event organizers to create floor plans, assign pricing, and track stall availability and booking status. The interactive nature of the floor plan is achieved using React, Konva, and other powerful web technologies. The system includes features for real-time booking, user authentication, and a comprehensive dashboard for vendors, exhibitors, and organizers.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Main Libraries](#main-libraries)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Interactive 2D Floor Plan**: Users can create and manage floor plans with ease using drag-and-drop features powered by Konva.
- **Real-Time Stall Booking**: Vendors can view and book stalls in real-time, just like ticket booking on platforms like BookMyShow.
- **User Authentication**: Supports user authentication for vendors, exhibitors, and organizers with separate dashboards for each role.
- **Vendor Dashboard**: Vendors can track their bookings, manage stalls, and view event details.
- **Organizer Dashboard**: Organizers can create and manage events, assign stalls, and view detailed analytics.
- **Exhibition Info**: Detailed pages for exhibition information and pricing.
- **Admin Dashboard**: For managing users, events, and monitoring activities across the platform.

## Tech Stack

### Frontend:
- **React** (v18.2.0) – JavaScript library for building user interfaces.
- **Next.js** (v15.1.2) – React framework for server-side rendering and building scalable applications.
- **TypeScript** – A typed superset of JavaScript for enhanced development experience and code quality.
- **Konva** (v9.3.0) – A 2D canvas library used for interactive elements in the floor plan.
- **Shadcn UI** – Component library for building UI elements like buttons and inputs.

### Backend:
- **Node.js** (v18.15.0) – JavaScript runtime built on Chrome's V8 engine for building scalable server-side applications.
- **Express.js** – Web framework for Node.js to manage HTTP requests and handle backend logic.
- **MongoDB** – NoSQL database for storing exhibition, stall, and user data.
- **Mongoose** – MongoDB object modeling tool for Node.js.

### Authentication:
- **JWT** – JSON Web Tokens for secure authentication and authorization.
- **Passport.js** – Authentication middleware for handling user login and session management.

## Installation

To get this project up and running locally, follow these steps:

1. **Clone the repository**:
```bash
git clone https://github.com/Parth-12pm/next-stallSpot.git
cd next-stallSpot
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**:
Create a `.env.local` file in the root directory and add the following environment variables:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Run the application**:
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

- **Login as an Exhibitor/Vendor**: Use the login page to authenticate as an exhibitor or vendor. Vendors can then view and book stalls, while exhibitors can manage their events and booths.
  
- **Create a Floor Plan**: Organizers can navigate to the **Floor Plan Editor Page**, where they can create and modify floor plans, define stall availability, and manage pricing.

- **Dashboard**: After logging in, users will be redirected to their respective dashboards based on their role. Exhibitors can see the status of their booked stalls, while vendors can manage their bookings.

## File Structure

The project follows a well-structured file system for scalability:

```
/next-stallSpot
  ├── /components       # Reusable components (UI elements, buttons, etc.)
  ├── /pages           # Next.js page components (e.g., Home, Login, Dashboard)
  ├── /public          # Public assets like images, icons, etc.
  ├── /styles          # Global styles (CSS/SCSS)
  ├── /lib             # Helper functions, utilities, database models
  ├── /models          # Mongoose models for MongoDB collections
  ├── /controllers     # Backend logic (API routes handling)
  ├── /hooks           # Custom React hooks
  └── .env.local       # Local environment variables
```

## Main Libraries

### React (v18.2.0)
React is used as the primary library for building the user interface. It enables efficient UI rendering with a component-based architecture. React's state management and hooks provide a streamlined development process.

### Next.js (v15.1.2)
Next.js is used for server-side rendering, making the app SEO-friendly and providing faster load times. It also handles routing and optimizes the development experience with automatic code splitting.

### Konva (v9.3.0)
Konva is utilized to create the interactive 2D floor plan. Its rich set of canvas drawing tools allows for drag-and-drop features to manipulate the layout, creating a dynamic and interactive user experience.

### Mongoose and MongoDB
Mongoose is used to interact with MongoDB, storing and querying data related to exhibitions, users, and stall bookings. MongoDB provides flexibility in managing the structure of floor plan data.

## Contributing

We welcome contributions to improve the project. To get started:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For more information, issues, or inquiries, feel free to open an issue or contact the project owner directly.
