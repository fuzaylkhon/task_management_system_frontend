import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { LoginCredentials } from "@/types";
import { useNotification } from "@/hooks/useNotification";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError("");
    try {
      await login(data);
      showSuccess("Login successful!");
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Paper
        elevation={0}
        className="w-full max-w-md p-8 space-y-6 glass-morphism animate-fade-in"
      >
        <Box className="text-center">
          <Typography
            variant="h4"
            className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-2">
            Sign in to continue to your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="animate-slide-down">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            className="animate-slide-up"
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className="animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            className="gradient-primary text-white hover:shadow-lg transition-all duration-300 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <Box
          className="text-center animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium no-underline"
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
