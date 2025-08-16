import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Fab,
  Pagination,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { Task } from "@/types";
import { taskService } from "@/services/taskService";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotification";

const TasksPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    taskId: string | null;
  }>({
    open: false,
    taskId: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "pending"
  >("all");

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks(page);
      setTasks(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      showError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [page]);

  const handleCreateTask = async (data: Partial<Task>) => {
    try {
      const newTask = await taskService.createTask(data);
      setTasks([newTask, ...tasks]);
      showSuccess("Task created successfully");
    } catch (error) {
      showError("Failed to create task");
    }
  };

  const handleUpdateTask = async (data: Partial<Task>) => {
    if (!editingTask) return;

    try {
      const updatedTask = await taskService.updateTask(editingTask._id, data);
      setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      showSuccess("Task updated successfully");
    } catch (error) {
      showError("Failed to update task");
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      const updatedTask = await taskService.toggleTaskComplete(id);
      setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      showSuccess("Task status updated");
    } catch (error) {
      showError("Failed to update task status");
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteDialog.taskId) return;

    try {
      await taskService.deleteTask(deleteDialog.taskId);
      setTasks(tasks.filter((t) => t._id !== deleteDialog.taskId));
      showSuccess("Task deleted successfully");
    } catch (error) {
      showError("Failed to delete task");
    } finally {
      setDeleteDialog({ open: false, taskId: null });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed);
    return matchesSearch && matchesFilter;
  });

  return (
    <Box className="py-6">
      <Box className="mb-8">
        <Typography
          variant="h4"
          className="font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          My Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and track your daily tasks efficiently
        </Typography>
      </Box>

      <Box className="mb-6 flex flex-col sm:flex-row gap-4">
        <TextField
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          className="flex-1"
        />
        <FormControl className="min-w-[150px]">
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            label="Status"
          >
            <MenuItem value="all">All Tasks</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton
                variant="rectangular"
                height={200}
                className="rounded-lg"
              />
            </Grid>
          ))}
        </Grid>
      ) : filteredTasks.length === 0 ? (
        <Box className="text-center py-12">
          <Typography variant="h6" color="text.secondary" className="mb-4">
            {searchTerm || filterStatus !== "all"
              ? "No tasks found matching your criteria"
              : "No tasks yet. Create your first task!"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <TaskCard
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={(id) => setDeleteDialog({ open: true, taskId: id })}
                showUser={isAdmin}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {totalPages > 1 && (
        <Box className="mt-8 flex justify-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setDialogOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }}
        className="gradient-primary hover:scale-110 transition-transform"
      >
        <Add />
      </Fab>

      <TaskDialog
        open={dialogOpen}
        task={editingTask}
        onClose={handleCloseDialog}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDeleteTask}
        onCancel={() => setDeleteDialog({ open: false, taskId: null })}
      />
    </Box>
  );
};

export default TasksPage;
