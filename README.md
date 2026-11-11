# Smart Civic Fix System

## Project Overview

Smart Civic Fix System is a web-based civic complaint management platform designed to help citizens report common problems in their local areas. It provides a simple way to submit complaints and allows administrators to monitor and manage reported issues.

The main aim of this project is to improve communication between citizens and the administration through a simple digital platform.

## Objectives

- Provide an easy platform for reporting civic problems.
- Allow citizens to submit complaints online.
- Display submitted complaints in a community section.
- Help administrators manage complaints.
- Track complaint progress through status updates.
- Store complaint records for future reference.

## Key Features

### Citizen Module
- Submit civic complaints.
- Select complaint categories.
- Enter problem descriptions and locations.
- View complaints in the community section.
- Receive form validation messages.

### Admin Module
- Secure admin login.
- View submitted complaints.
- Search and manage complaints.
- Update complaint status.
- Logout functionality.

### Data Management
- Store complaint records in a JSON file.
- Maintain complaint data after server restart.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Webpage structure |
| CSS | Styling and responsive design |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| JSON | Complaint data storage |
| Express Session | Admin session management |

## Project Architecture

The project follows a client-server architecture.

1. Citizens interact with the frontend interface.
2. JavaScript sends requests to the backend APIs.
3. The Express.js server processes complaint requests.
4. Complaint records are stored in a JSON file.
5. Administrators access the dashboard to manage complaints.

## Project Folder Structure

```text
Smart-Civic-Fix-System/
│
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── admin.html
│   └── admin-login.html
│
├── data/
│   └── complaints.json
│
├── server.js
├── package.json
├── package-lock.json
├── README.md
├── .env
└── .gitignore
```

## Installation and Setup

1. Install Node.js.
2. Open the project folder in VS Code.
3. Open the terminal.
4. Install the required dependencies:

```bash
npm install
```

5. Configure the environment variables in the `.env` file:

```env
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your_long_random_secret
```

6. Start the backend server:

```bash
node server.js
```

7. Open `public/index.html` using VS Code Live Server.

## Testing

The following functionalities have been tested:

- Complaint form validation.
- Successful complaint submission.
- Community complaint display.
- Admin login and authentication.
- Unauthorized dashboard access prevention.
- Complaint status updates.
- Admin logout.
- JSON data persistence after server restart.
- Responsive mobile layout.

## Future Scope

- Integration with a real government complaint management system.
- Database integration for scalable storage.
- Image uploads for complaint evidence.
- Complaint notifications.
- Location-based complaint tracking.
- Role-based access for multiple administrators.

## Conclusion

Smart Civic Fix System provides a simple digital platform for reporting and managing civic issues. It connects citizens and administrators through complaint submission, monitoring and status management. The project demonstrates the practical use of frontend and backend technologies in solving everyday civic problems.