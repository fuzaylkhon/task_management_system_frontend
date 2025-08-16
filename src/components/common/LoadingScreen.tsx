import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  fullScreen = true,
}) => {
  const content = (
    <Box
      className="flex flex-col items-center justify-center gap-4"
      sx={{
        minHeight: fullScreen ? "100vh" : 400,
      }}
    >
      <Box className="relative">
        <CircularProgress
          size={48}
          thickness={4}
          sx={{
            color: "primary.main",
          }}
        />
        <Box
          className="absolute inset-0 flex items-center justify-center"
          sx={{
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            "@keyframes pulse": {
              "0%, 100%": {
                opacity: 1,
              },
              "50%": {
                opacity: 0.5,
              },
            },
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "4px solid",
              borderColor: "primary.light",
              opacity: 0.2,
            }}
          />
        </Box>
      </Box>
      <Typography
        variant="body1"
        color="text.secondary"
        className="animate-pulse"
      >
        {message}
      </Typography>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 z-50">
        {content}
      </Box>
    );
  }

  return content;
};
