// Import required packages
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Allow cross-origin requests

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
});

// Create User Model
const User = mongoose.model('User', userSchema);

// Endpoint to add a user
app.post('/adduser', (req, res) => {
    const newUser = new User(req.body);
    newUser.save()
        .then(() => res.status(201).send("User created"))
        .catch(err => res.status(400).send("Error creating user"));
});

// Endpoint to get all users
app.get('/users', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(500).send("Error retrieving users"));
});

// Endpoint to update a user
app.put('/users/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedUser => res.json(updatedUser))
        .catch(err => res.status(400).send("Error updating user"));
});

// Endpoint to delete a user
app.delete('/users/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.send("User deleted"))
        .catch(err => res.status(500).send("Error deleting user"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});