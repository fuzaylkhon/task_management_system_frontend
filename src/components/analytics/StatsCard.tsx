import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "success" | "warning" | "info" | "error";
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  trendDirection,
  subtitle,
}) => {
  return (
    <Card
      className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      sx={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent>
        <Box className="flex items-start justify-between mb-3">
          <Avatar
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              width: 48,
              height: 48,
            }}
            className="shadow-lg"
          >
            {icon}
          </Avatar>
          {trend && (
            <Chip
              size="small"
              label={trend}
              icon={trendDirection === "up" ? <TrendingUp /> : <TrendingDown />}
              color={trendDirection === "up" ? "success" : "error"}
              variant="outlined"
              sx={{ fontSize: "0.75rem" }}
            />
          )}
        </Box>

        <Typography
          color="text.secondary"
          variant="caption"
          className="block mb-1 uppercase tracking-wider"
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          className="font-bold mb-1"
          sx={{ color: `${color}.main` }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            color="text.secondary"
            className="block mt-1"
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
