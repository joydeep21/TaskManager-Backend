const express = require('express');
const Router = express.Router();
const { createUser, loginUser, getUser, updateUser } = require('../controller/user');
const authenticateToken = require('../helper/check-auth');

// Create User (no token required)
Router.post('/create', createUser);

// Login User (no token required)
Router.post('/login', loginUser);

// Get User by ID (token required)
Router.get('/:id', authenticateToken, getUser);

// Update User by ID (token required)
Router.put('/:id', authenticateToken, updateUser);

module.exports = Router;
