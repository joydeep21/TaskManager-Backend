const express = require('express');
const router = express.Router();
const taskController = require('../controller/task');
const authMiddleware = require('../helper/check-auth');


// Create a new task
router.post('/create', authMiddleware, taskController.createTask);

// Fetch tasks with date range
router.post('/fetch', authMiddleware, taskController.getTasksByDateRange);

// Update status for multiple tasks
router.post('/update/status', authMiddleware, taskController.updateTaskStatus);

router.post('/dashboard', authMiddleware, taskController.dashboardData);


// Update status for a single task
// router.put('/tasks/status/single', authMiddleware, taskController.updateSingleTaskStatus);

module.exports = router;
