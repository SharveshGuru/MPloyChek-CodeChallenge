# MPloyChek Code Challenge

## Project Overview
This is a Single Page Application (SPA) developed for the code challenge presented by MPloyChek for the Software Intern postion. The application demonstrates user authentication, role-based access control, and user management capabilities using Angular and Node.js with Express.js.

Visit the hosted application: [MPloyChek-Code Challenge](https://mploychek-codechallenge.netlify.app/)

Since it's hosted on a free tier, the initial response time may be delayed by a few minutes.

## Key Features
- **Authentication System**
  - Login page with UserID and Password
  - Role-based access (General User and Admin roles)

- **User Dashboard**
  - User profile details display
  - Role-based record list retrieval

- **Admin Management**
  - User management capabilities
  - Record management capabilities

## Technical Stack
- Frontend: Angular 19.2.4
- Backend: Node.js(v20.17.0) with Express.js(v4.21.2)
- Database: MongoDB Atlas

## Key Implementation Details
- Modular code architecture
- Asynchronous service implementation
- Responsive and clean UI design

## Project Structure

```bash
├───backend
│   ├───middleware
│   ├───models
│   └───routes
└───frontend
    ├───public
    └───src
        ├───app
        │   ├───admin
        │   │   └───user-database
        │   ├───auth
        │   │   ├───login
        │   │   └───register
        │   ├───dashboard
        │   ├───guards
        │   └───services
        └───environments
```

## Installation Steps
To set up and run this project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/SharveshGuru/MPloyChek-CodeChallenge.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd MPloyChek-CodeChallenge
   ```

3. **Install dependencies for the backend**:

   ```bash
   cd backend
   npm install
   ```

4. **Start the backend server**:

   ```bash
   npm start
   ```

5. **Install dependencies for the frontend**:

   ```bash
   cd ../frontend
   npm install
   ```

6. **Start the frontend application**:

   ```bash
   ng serve
   ```
