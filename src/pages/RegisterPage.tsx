import React from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Box } from "@mui/material";

const RegisterPage: React.FC = () => {
  return (
    <Box className="min-h-screen">
      <RegisterForm />
    </Box>
  );
};

export default RegisterPage;
