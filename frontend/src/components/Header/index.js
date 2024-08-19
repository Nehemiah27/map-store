import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  ArrowDropDown,
} from "@mui/icons-material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { post } from "../../services/ApiRequest";
import API_ROUTES from "../../constants/apiRoutes";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useLoader } from "../../contexts/LoaderContext";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null),
    [drawerOpen, setDrawerOpen] = useState(false),
    navigate = useNavigate(),
    location = useLocation(),
    { setLoading } = useLoader(),
    { showSnackbar } = useSnackbar(),
    handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget);
    },
    handleMenuClose = () => {
      setAnchorEl(null);
    },
    handleAdminClick = () => {
      handleMenuClose();
      navigate("/admin/view-users");
    },
    handleProfileClick = () => {
      handleMenuClose();
      navigate("/change-password");
    },
    handleDrawerOpen = () => {
      setDrawerOpen(true);
    },
    handleDrawerClose = () => {
      setDrawerOpen(false);
    },
    handleNavigation = (path) => {
      if (location.pathname !== path) navigate(path);
    },
    userName = localStorage.getItem("authUser"),
    handleLogout = async () => {
      const email = localStorage.getItem("authEmail");
      setLoading(true);
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
      localStorage.removeItem("authEmail");
      localStorage.removeItem("authID");
      try {
        const response = await post(API_ROUTES.LOGOUT, { email });
        if (response.success) {
          showSnackbar(response.message, "success");
          navigate("/login");
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
      handleMenuClose();
    };
  return (
    <>
      {location.pathname !== "/login" && (
        <>
          {" "}
          <AppBar position="sticky">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
              <Link to="/home" style={{ textDecoration: "none" }}>
                <HomeIcon style={{ marginLeft: 10, fill: "#ffffff" }} />
              </Link>
              <Typography variant="h6" style={{ flexGrow: 1, marginLeft: 10 }}>
                Map Store
              </Typography>
              <Box display="flex" alignItems="center">
                <Avatar onClick={handleMenuClick}>
                  {userName !== null ? userName.charAt(0) : "S"}
                </Avatar>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="admin-options"
                  onClick={handleMenuClick}
                >
                  <ArrowDropDown />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleAdminClick}>
                    <ListItemIcon>
                      <AdminPanelSettingsIcon />
                    </ListItemIcon>
                    Admin
                  </MenuItem>
                  <MenuItem onClick={handleProfileClick}>
                    <ListItemIcon>
                      <AccountCircleIcon />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </AppBar>
          <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
            <Box
              width={250}
              role="presentation"
              onClick={handleDrawerClose}
              onKeyDown={handleDrawerClose}
            >
              <List sx={{ paddingTop: 0 }}>
                {location.pathname.includes("/admin") ? (
                  <>
                    <ListItemButton
                      selected={location.pathname === "/admin/view-users"}
                      onClick={() => handleNavigation("/admin/view-users")}
                      sx={{
                        "&.Mui-selected": {
                          background: "#007bff",
                          "& span": {
                            color: "#f1f1f1",
                          },
                          "&:hover": {
                            background: "#0056b3",
                            "& span": {
                              color: "#f1f1f1",
                            },
                          },
                        },
                        "&:hover": {
                          background: "#0056b3",
                          "& span": {
                            color: "#f1f1f1",
                          },
                        },
                      }}
                    >
                      <ListItemText primary="View Users" />
                    </ListItemButton>
                    <ListItemButton
                      selected={location.pathname === "/admin/add-user"}
                      onClick={() => handleNavigation("/admin/add-user")}
                      sx={{
                        "&.Mui-selected": {
                          background: "#007bff",
                          "& span": {
                            color: "#f1f1f1",
                          },
                          "&:hover": {
                            background: "#0056b3",
                            "& span": {
                              color: "#f1f1f1",
                            },
                          },
                        },
                        "&:hover": {
                          background: "#0056b3",
                          "& span": {
                            color: "#f1f1f1",
                          },
                        },
                      }}
                    >
                      <ListItemText primary="Add User" />
                    </ListItemButton>
                  </>
                ) : (
                  <>
                    {" "}
                    <ListItemButton
                      selected={location.pathname === "/home"}
                      onClick={() => handleNavigation("/home")}
                      sx={{
                        "&.Mui-selected": {
                          background: "#007bff",
                          "& span": {
                            color: "#f1f1f1",
                          },
                          "&:hover": {
                            background: "#0056b3",
                            "& span": {
                              color: "#f1f1f1",
                            },
                          },
                        },
                        "&:hover": {
                          background: "#0056b3",
                          "& span": {
                            color: "#f1f1f1",
                          },
                        },
                      }}
                    >
                      <ListItemText primary="New Map" />
                    </ListItemButton>
                    <ListItemButton
                      selected={location.pathname === "/saved-maps"}
                      onClick={() => handleNavigation("/saved-maps")}
                      sx={{
                        "&.Mui-selected": {
                          background: "#007bff",
                          "& span": {
                            color: "#f1f1f1",
                          },
                          "&:hover": {
                            background: "#0056b3",
                            "& span": {
                              color: "#f1f1f1",
                            },
                          },
                        },
                        "&:hover": {
                          background: "#0056b3",
                          "& span": {
                            color: "#f1f1f1",
                          },
                        },
                      }}
                    >
                      <ListItemText primary="Saved Maps" />
                    </ListItemButton>
                    <ListItemButton
                      selected={location.pathname === "/top-three-captures"}
                      onClick={() => handleNavigation("/top-three-captures")}
                      sx={{
                        "&.Mui-selected": {
                          background: "#007bff",
                          "& span": {
                            color: "#f1f1f1",
                          },
                          "&:hover": {
                            background: "#0056b3",
                            "& span": {
                              color: "#f1f1f1",
                            },
                          },
                        },
                        "&:hover": {
                          background: "#0056b3",
                          "& span": {
                            color: "#f1f1f1",
                          },
                        },
                      }}
                    >
                      <ListItemText primary="Top 3 Views" />
                    </ListItemButton>
                  </>
                )}
              </List>
            </Box>
          </Drawer>
        </>
      )}
    </>
  );
};

export default Header;
