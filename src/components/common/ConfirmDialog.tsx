import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
} from "@mui/material";
import { Close, Warning, Info, Error, CheckCircle } from "@mui/icons-material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success";
  type?: "warning" | "error" | "info" | "success";
  showAlert?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  type = "warning",
  showAlert = true,
}) => {
  const getIcon = () => {
    switch (type) {
      case "warning":
        return <Warning />;
      case "error":
        return <Error />;
      case "success":
        return <CheckCircle />;
      default:
        return <Info />;
    }
  };

  const getAlertSeverity = () => {
    return type as "warning" | "error" | "info" | "success";
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "backdrop-blur-md bg-white/95 dark:bg-gray-900/95",
      }}
    >
      <DialogTitle>
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-2">
            <Box
              sx={{
                color: `${type}.main`,
                display: "flex",
                alignItems: "center",
              }}
            >
              {getIcon()}
            </Box>
            <Typography variant="h6">{title}</Typography>
          </Box>
          <IconButton onClick={onCancel} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {showAlert && (
          <Alert severity={getAlertSeverity()} className="mb-3">
            This action cannot be undone.
          </Alert>
        )}
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions className="p-4">
        <Button onClick={onCancel} color="inherit" variant="outlined">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
