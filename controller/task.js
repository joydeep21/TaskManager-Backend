const Task = require('../model/task');

// Create a new task
exports.createTask = async (req, res) => {
  console.log("hiiii,hello");

  try {
    const { name, description, dueDate } = req.body;

    const task = new Task({
      name,
      description,
      dueDate,
      userId: req.id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.log(error, "error");

    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch tasks with date range
exports.getTasksByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    const tasks = await Task.find({
      userId: req.id,
      dueDate: { $gte: start, $lte: end },
      status: { $ne: "deleted" }
    });

    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const data ={
      pending:pendingTasks,
      successful:completedTasks
    }
    // console.log("data", data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update status for multiple tasks
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskIds, status } = req.body;
    if (status === 'removed') {
      // Delete tasks with status 'removed'
      await Task.deleteMany({ _id: { $in: taskIds } });
    } else {
      // Update status for 'completed' and 'deleted'
      const updateFields = { status };
      if (status === 'completed') {
        updateFields.completionDate = new Date(); // Set the current date for completionDate
      }

      await Task.updateMany(
        { _id: { $in: taskIds } },
        { $set: updateFields },
      );
    }
    res.status(200).json({ message: 'Tasks updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.dashboardData = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.id,
      status: { $ne: "deleted" }
    });
    const pending= await Task.find({
      userId: req.id,
      status: "pending"
    });
    const completed = await Task.find({
      userId: req.id,
      status: "completed"
    });

    const data ={
      tasksData:tasks,
      counts:{
        totalCount:tasks.length,
        pendingTasks:pending.length,
        completedTasks:completed.length
      }
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Update status for a single task
exports.updateSingleTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;
    await Task.findByIdAndUpdate(taskId, { status });
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
