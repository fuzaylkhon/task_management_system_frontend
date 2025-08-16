import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Dashboard,
  Task,
  Analytics,
  Settings,
  Logout,
  ChevronLeft,
  Person,
  Help,
  Notifications,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: "permanent" | "persistent" | "temporary";
  width?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  variant = "temporary",
  width = 280,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user, logout, isAdmin } = useAuth();

  const menuItems = [
    {
      title: "Tasks",
      icon: <Task />,
      path: "/",
      badge: null,
    },
    ...(isAdmin
      ? [
          {
            title: "Analytics",
            icon: <Analytics />,
            path: "/analytics",
            badge: "Admin",
          },
        ]
      : []),
    {
      title: "Dashboard",
      icon: <Dashboard />,
      path: "/dashboard",
      badge: "New",
    },
  ];

  const bottomMenuItems = [
    {
      title: "Settings",
      icon: <Settings />,
      path: "/settings",
    },
    {
      title: "Help",
      icon: <Help />,
      path: "/help",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (variant === "temporary") {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const drawerContent = (
    <Box className="h-full flex flex-col" sx={{ width }}>
      {/* Header */}
      <Box className="p-4 flex items-center justify-between">
        <Typography
          variant="h6"
          className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Task Manager
        </Typography>
        {variant !== "permanent" && (
          <IconButton onClick={onClose} size="small">
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* User Info */}
      <Box className="p-4">
        <Box className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 40,
              height: 40,
            }}
          >
            {user?.email[0].toUpperCase()}
          </Avatar>
          <Box className="flex-1 min-w-0">
            <Typography variant="body2" className="font-medium truncate">
              {user?.email}
            </Typography>
            <Chip
              label={user?.role.toUpperCase()}
              size="small"
              color={user?.role === "admin" ? "secondary" : "default"}
              sx={{ fontSize: "0.7rem", height: 20 }}
            />
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Main Menu */}
      <List className="flex-1 px-2 py-2">
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding className="mb-1">
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  },
                },
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  color={item.badge === "Admin" ? "secondary" : "primary"}
                  sx={{ fontSize: "0.7rem", height: 20 }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Bottom Menu */}
      <List className="px-2 py-2">
        {bottomMenuItems.map((item) => (
          <ListItem key={item.path} disablePadding className="mb-1">
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: "error.main",
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.05),
              },
            }}
          >
            <ListItemIcon sx={{ color: "error.main" }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: width,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
