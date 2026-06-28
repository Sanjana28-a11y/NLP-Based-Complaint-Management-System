require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Complaint = require('./models/Complaint');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_complaint_analyzer';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// 1. Save a new complaint
app.post('/complaints', async (req, res) => {
  try {
    const { Complaint_Text, Category, Urgency, Department, Year_of_Study, User_Id } = req.body;
    
    const newComplaint = new Complaint({
      Complaint_Text,
      Category,
      Urgency,
      Department,
      Year_of_Study,
      User_Id: User_Id || "student123"
    });

    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error('Error saving complaint:', error);
    res.status(500).json({ error: 'Failed to save complaint' });
  }
});

// 2. Fetch all complaints
app.get('/complaints', async (req, res) => {
  try {
    const { department, status, startDate, endDate } = req.query;
    let filter = {};

    if (department) filter.Department = department;
    if (status) filter.Status = status;
    
    if (startDate && endDate) {
      filter.Date_Submitted = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    const complaints = await Complaint.find(filter).sort({ Date_Submitted: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// 2a. Fetch user specific complaints
app.get('/complaints/user/:userId', async (req, res) => {
  try {
    const complaints = await Complaint.find({ User_Id: req.params.userId }).sort({ Date_Submitted: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({ error: 'Failed to fetch user complaints' });
  }
});

// 3. Update complaint status along with assignments & remarks
app.put('/complaints/:id', async (req, res) => {
  try {
    const { status, assignedTo, assignedEmail, remarks } = req.body;
    const { id } = req.params;

    let updateData = {};
    if (status && ['Pending', 'In Progress', 'Resolved'].includes(status)) {
      updateData.Status = status;
    }
    if (assignedTo) updateData.Assigned_To = assignedTo;
    if (assignedEmail !== undefined) updateData.Assigned_Email = assignedEmail;
    if (remarks !== undefined) updateData.Remarks = remarks;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.status(200).json(updatedComplaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: 'Failed to update complaint' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
