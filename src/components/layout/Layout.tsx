import React, { ReactNode } from "react";
import { Box, Container } from "@mui/material";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Box component="main" sx={{ pt: 10 }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
};
