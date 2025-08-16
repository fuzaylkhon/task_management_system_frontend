import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { Task } from "@/types";

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => void;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  task,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Task>>();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
      });
    } else {
      reset({
        title: "",
        description: "",
      });
    }
  }, [task, reset]);

  const handleFormSubmit = (data: Partial<Task>) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "backdrop-blur-md bg-white/95 dark:bg-gray-900/95",
      }}
    >
      <DialogTitle className="flex items-center justify-between">
        <span className="font-semibold">
          {task ? "Edit Task" : "Create New Task"}
        </span>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent className="space-y-4">
          <TextField
            fullWidth
            label="Title"
            {...register("title", {
              required: "Title is required",
              maxLength: {
                value: 100,
                message: "Title cannot exceed 100 characters",
              },
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
            autoFocus
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            {...register("description", {
              required: "Description is required",
              maxLength: {
                value: 500,
                message: "Description cannot exceed 500 characters",
              },
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </DialogContent>

        <DialogActions className="p-4">
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="gradient-primary text-white"
          >
            {task ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
