
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = 3000;

// JSON file location
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "complaints.json");

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(
  session({
    name: "civicfix.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 30 * 60 * 1000
    }
  })
);

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin === true) {
    return next();
  }

  return res.status(401).json({
    message: "Please log in as admin first."
  });
}



// Create data folder/file if missing
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

// Read complaints from JSON file
function readComplaints() {
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data);
}

// Save complaints to JSON file
function saveComplaints(complaints) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(complaints, null, 2),
    "utf8"
  );
}

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Civic Fix Backend is running successfully!"
  });
});
// Public API for Community Complaints
app.get("/api/public/complaints", (req, res) => {
  try {
    const complaints = readComplaints();

    const publicComplaints = complaints.map(c => ({
      id: c.id,
      title: c.title,
      category: c.category,
      description: c.description,
      location: c.location,
      status: c.status,
      createdAt: c.createdAt
    }));

    res.json(publicComplaints);
  } catch (error) {
    res.status(500).json({
      message: "Unable to load public complaints."
    });
  }
});

// Get all complaints
app.get("/api/complaints", requireAdmin, (req, res) => {
  try {
    res.json(readComplaints());
  } catch (error) {
    console.error("Error reading complaints:", error);
    res.status(500).json({ message: "Could not load complaints." });
  }
});

// Submit a complaint
app.post("/api/complaints", (req, res) => {
  try {
    const { title, category, description, location } = req.body;

    if (!category || !description || !location) {
      return res.status(400).json({
        message: "Please fill all required fields."
      });
    }

    const complaints = readComplaints();

    const complaint = {
      id: `CF-${Date.now()}`,
      title: title || "Civic Issue",
      category,
      description,
      location,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    complaints.push(complaint);
    saveComplaints(complaints);

    res.status(201).json({
      message: "Complaint submitted successfully!",
      complaint
    });
  } catch (error) {
    console.error("Error saving complaint:", error);
    res.status(500).json({
      message: "Could not save complaint."
    });
  }
});

 // Update complaint status

 // Update complaint status
app.patch(
  "/api/complaints/:id/status",
  requireAdmin,
  (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved"
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid complaint status."
        });
      }

      const complaints = readComplaints();

      const index = complaints.findIndex(
        (item) => item.id === req.params.id
      );

      if (index === -1) {
        return res.status(404).json({
          message: "Complaint not found."
        });
      }

      complaints[index].status = status;
      saveComplaints(complaints);

      res.json({
        message: "Complaint status updated successfully!",
        complaint: complaints[index]
      });
    } catch (error) {
      console.error("Status update error:", error);

      res.status(500).json({
        message: "Could not update complaint status."
      });
    }
  }
);


app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD ||
    !process.env.SESSION_SECRET
  ) {
    return res.status(500).json({
      message: "Admin login configuration is missing."
    });
  }

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      message: "Invalid username or password."
    });
  }

  req.session.isAdmin = true;

  res.json({ message: "Login successful!" });
});

app.get("/api/admin/check", (req, res) => {
  res.json({ authenticated: req.session.isAdmin === true });
});

app.post("/api/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Could not log out."
      });
    }

    res.clearCookie("civicfix.sid");
    res.json({ message: "Logout successful!" });
  });
});


app.listen(PORT, () => {
  console.log(`Civic Fix server running at http://localhost:${PORT}`);
});
