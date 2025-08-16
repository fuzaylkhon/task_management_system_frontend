import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  action,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300"
      sx={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)",
        backdropFilter: "blur(10px)",
      }}
    >
      <CardContent>
        <Box className="flex justify-between items-start mb-4">
          <Box>
            <Typography variant="h6" className="font-semibold">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action ? (
            action
          ) : (
            <>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>Export as PNG</MenuItem>
                <MenuItem onClick={handleMenuClose}>Export as CSV</MenuItem>
                <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
              </Menu>
            </>
          )}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};
