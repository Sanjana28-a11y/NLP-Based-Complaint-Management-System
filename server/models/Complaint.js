const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  Complaint_Text: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  Urgency: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  Department: {
    type: String,
    required: true,
  },
  Year_of_Study: {
    type: String,
    required: true,
  },
  Date_Submitted: {
    type: Date,
    default: Date.now,
  },
  Status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  Assigned_To: {
    type: String,
    default: 'Unassigned',
  },
  Assigned_Email: {
    type: String,
    default: '',
  },
  Remarks: {
    type: String,
    default: '',
  },
  User_Id: {
    type: String,
    required: true,
    default: 'student123'
  }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
