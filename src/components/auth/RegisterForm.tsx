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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  PersonAdd,
  Person,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { RegisterCredentials } from "@/types";
import { useNotification } from "@/hooks/useNotification";

interface RegisterFormData extends RegisterCredentials {
  confirmPassword: string;
  agreeToTerms: boolean;
}

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: "user",
      agreeToTerms: false,
    },
  });

  const password = watch("password");
  const role = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const { confirmPassword, agreeToTerms, ...credentials } = data;

      if (!agreeToTerms) {
        setError("Please agree to the terms and conditions");
        setIsLoading(false);
        return;
      }

      await registerUser(credentials);
      showSuccess("Registration successful! Welcome aboard!");
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Paper
        elevation={0}
        className="w-full max-w-md p-8 space-y-6 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-2xl rounded-2xl animate-fade-in"
      >
        <Box className="text-center">
          <Box className="flex justify-center mb-4">
            <Box className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full">
              <PersonAdd sx={{ fontSize: 32, color: "white" }} />
            </Box>
          </Box>
          <Typography
            variant="h4"
            className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-2">
            Join us to start managing your tasks efficiently
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            className="animate-slide-down"
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            fullWidth
            label="Email Address"
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
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
                message:
                  "Password must contain uppercase, lowercase, and number",
              },
            })}
            error={!!errors.password}
            helperText={
              errors.password?.message ||
              "Min 6 chars, include uppercase, lowercase, and number"
            }
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
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className="animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className="animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          />

          <FormControl
            fullWidth
            className="animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <InputLabel>Account Type</InputLabel>
            <Select
              {...register("role")}
              defaultValue="user"
              label="Account Type"
              startAdornment={
                <InputAdornment position="start">
                  {role === "admin" ? (
                    <AdminPanelSettings color="action" />
                  ) : (
                    <Person color="action" />
                  )}
                </InputAdornment>
              }
            >
              <MenuItem value="user">
                <Box className="flex items-center gap-2">
                  <Person fontSize="small" />
                  <span>Regular User</span>
                </Box>
              </MenuItem>
              <MenuItem value="admin">
                <Box className="flex items-center gap-2">
                  <AdminPanelSettings fontSize="small" />
                  <span>Administrator</span>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                {...register("agreeToTerms", {
                  required: "You must agree to the terms",
                })}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </Link>
              </Typography>
            }
            className="animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          />
          {errors.agreeToTerms && (
            <Typography variant="caption" color="error">
              {errors.agreeToTerms.message}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transition-all duration-300 animate-slide-up"
            style={{ animationDelay: "0.5s" }}
            startIcon={!isLoading && <PersonAdd />}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <Divider className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Box
          className="text-center animate-slide-up"
          style={{ animationDelay: "0.7s" }}
        >
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium no-underline hover:underline"
            >
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
