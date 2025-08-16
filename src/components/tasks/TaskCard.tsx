import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Edit,
  Delete,
  CheckCircle,
  RadioButtonUnchecked,
  Person,
  CalendarToday,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  showUser?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  showUser = false,
}) => {
  const userEmail = typeof task.userId === "object" ? task.userId.email : "";

  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300 hover:shadow-xl
        ${task.completed ? "opacity-75" : ""}
        hover:-translate-y-1 animate-slide-up
      `}
      sx={{
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: task.completed
            ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)"
            : "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
        },
      }}
    >
      <CardContent className="space-y-3">
        <Box className="flex items-start justify-between">
          <Typography
            variant="h6"
            component="h3"
            className={`font-semibold ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </Typography>
          <Chip
            size="small"
            label={task.completed ? "Completed" : "Pending"}
            color={task.completed ? "success" : "primary"}
            variant="outlined"
            className="ml-2"
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          className="line-clamp-2"
        >
          {task.description}
        </Typography>

        <Box className="flex items-center justify-between pt-2">
          <Box className="flex items-center gap-3 text-gray-500">
            {showUser && userEmail && (
              <Box className="flex items-center gap-1">
                <Avatar sx={{ width: 20, height: 20, fontSize: 12 }}>
                  {userEmail[0].toUpperCase()}
                </Avatar>
                <Typography variant="caption">{userEmail}</Typography>
              </Box>
            )}
            <Box className="flex items-center gap-1">
              <CalendarToday sx={{ fontSize: 16 }} />
              <Typography variant="caption">
                {format(new Date(task.createdAt), "MMM dd, yyyy")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>

      <CardActions className="px-4 pb-3">
        <Tooltip
          title={task.completed ? "Mark as pending" : "Mark as complete"}
        >
          <IconButton
            onClick={() => onToggle(task._id)}
            color={task.completed ? "success" : "default"}
            size="small"
          >
            {task.completed ? <CheckCircle /> : <RadioButtonUnchecked />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit task">
          <IconButton onClick={() => onEdit(task)} color="primary" size="small">
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete task">
          <IconButton
            onClick={() => onDelete(task._id)}
            color="error"
            size="small"
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};
