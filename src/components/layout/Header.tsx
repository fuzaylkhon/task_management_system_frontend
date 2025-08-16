import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Divider,
  ListItemIcon,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Logout,
  Dashboard,
  Task,
} from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";
import { ThemeContext } from "@/contexts/ThemeContext";

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const themeContext = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: "none",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar>
        {onMenuClick && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Task Manager
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Toggle theme">
            <IconButton onClick={themeContext?.toggleTheme} color="inherit">
              {themeContext?.isDark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <Tooltip title="Account settings">
                <IconButton onClick={handleMenu} size="small">
                  <Avatar
                    sx={{
                      width: 35,
                      height: 35,
                      bgcolor: "primary.main",
                    }}
                  >
                    {user.email[0].toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {user.email}
                  </Typography>
                  <Typography variant="caption" color="primary">
                    {user.role.toUpperCase()}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => handleNavigate("/")}>
                  <ListItemIcon>
                    <Task fontSize="small" />
                  </ListItemIcon>
                  Tasks
                </MenuItem>
                {isAdmin && (
                  <MenuItem onClick={() => handleNavigate("/analytics")}>
                    <ListItemIcon>
                      <Dashboard fontSize="small" />
                    </ListItemIcon>
                    Analytics
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/login")}
                className="hover:bg-white/10"
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/register")}
                className="ml-2"
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
