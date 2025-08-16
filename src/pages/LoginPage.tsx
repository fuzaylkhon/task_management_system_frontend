import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Box } from "@mui/material";

const LoginPage: React.FC = () => {
  return (
    <Box className="min-h-screen">
      <LoginForm />
    </Box>
  );
};

export default LoginPage;
