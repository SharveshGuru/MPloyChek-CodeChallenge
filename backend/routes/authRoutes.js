const express = require('express');
const router = express.Router();
const { authenticateToken, verifyAdmin } = require('../middleware/authMiddleware'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const Record = require('../models/recordModel'); 

async function createSuperUser() {
    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const superUser = new User({
            username: 'superadmin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'Admin'
        });
        await superUser.save();
        // console.log('Superuser created: admin@example.com / admin123');
    } else {
        console.log('Superuser already exists.');
    }
}
createSuperUser();

router.post('/register', authenticateToken, verifyAdmin, async (req, res) => {
  try {
      // console.log("Request Body:", req.body); 

      const { email, password, username, role } = req.body;
      if (!email || !password || !username || !role) {
          console.log("Missing Fields");
          return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          console.log("User already exists:", existingUser.email);
          return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword, username, role });
      await newUser.save();
      // console.log("New User Registered:", newUser);

      res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
      console.error("Internal Server Error:", err);
      res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
    try {
  
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
  
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
  
        res.json({ token, user: { username: user.username, email: user.email, role: user.role } });
  
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: err.message });
    }
  });


router.get('/profile', authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('-password'); 
      res.json(user);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

router.get('/records', authenticateToken, async (req, res) => {
    try {
      const user = req.user;
      if (user.role === 'Admin') {
        const records = await Record.find();
        return res.json(records);
      } else {
        const records = await Record.find({ accessLevel: 'General' });
        return res.json(records);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
      res.status(500).json({ message: 'Failed to fetch records' });
    }
});


router.get('/users', authenticateToken, verifyAdmin, async (req, res) => {
  try {
      const users = await User.find().select('-password'); 
      res.json(users);
  } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.delete('/users/email/:email', authenticateToken, verifyAdmin, async (req, res) => {
  try {
      const userEmail = req.params.email;  
      const deletedUser = await User.findOneAndDelete({ email: userEmail });

      if (!deletedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
  } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Failed to delete user" });
  }
});

router.delete('/records/:id', authenticateToken, verifyAdmin, async (req, res) => {
  try {
      const recordId = req.params.id;
      const deletedRecord = await Record.findByIdAndDelete(recordId);

      if (!deletedRecord) {
          return res.status(404).json({ message: "Record not found" });
      }

      res.json({ message: "Record deleted successfully" });
  } catch (err) {
      console.error("Error deleting record:", err);
      res.status(500).json({ message: "Failed to delete record" });
  }
});


router.post('/records', authenticateToken, verifyAdmin, async (req, res) => {
  try {
      const { title, description, accessLevel } = req.body;

      if (!title || !description || !accessLevel) {
          return res.status(400).json({ message: "All fields are required" });
      }

      const newRecord = new Record({
          title,
          description,
          accessLevel,
          createdAt: new Date(),
      });

      await newRecord.save();
      res.status(201).json({ message: "Record added successfully", record: newRecord });

  } catch (err) {
      console.error("Error adding record:", err);
      res.status(500).json({ message: "Failed to add record" });
  }
});

router.put('/records/:id', authenticateToken, verifyAdmin, async (req, res) => {
  try {
      const { title, description, accessLevel } = req.body;
      const recordId = req.params.id;

      const updatedRecord = await Record.findByIdAndUpdate(recordId, {
          title,
          description,
          accessLevel
      }, { new: true });

      if (!updatedRecord) {
          return res.status(404).json({ message: "Record not found" });
      }

      res.json({ message: "Record updated successfully", record: updatedRecord });

  } catch (err) {
      console.error("Error updating record:", err);
      res.status(500).json({ message: "Failed to update record" });
  }
});

module.exports = router;
