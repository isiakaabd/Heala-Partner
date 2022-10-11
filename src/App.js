import React, { useState, useEffect } from "react";
import "./App.css";
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { useLazyQuery, useMutation } from "@apollo/client";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Login } from "components/pages";
import { useApptype } from "components/hooks";
import { Header, SideNav } from "components/layouts";
import { Loader } from "components/Utilities";
import Routes from "components/routes/Routes";
import { muiTheme } from "components/muiTheme";
import { setAccessToken } from "./accessToken";
import Private from "components/routes/Private";
import Hospital from "components/routes/Hospital";
import { getPartner } from "components/graphQL/useQuery";
import { LOGOUT_USER } from "components/graphQL/Mutation";
import { useActions } from "components/hooks/useActions";
import { AppTypeProvider } from "store/contexts/AppTypeContext";
import { Box, Drawer, Toolbar, CssBaseline } from "@mui/material";
import Hmo from "components/routes/HmoRoutes";

const PreApp = ({ window }) => {
  const { changeAppType } = useApptype();
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const [state, setstate] = useState(true);
  const { userDetail, logout } = useActions();
  const [logout_user] = useMutation(LOGOUT_USER);
  const [mobileOpen, setMobileOpen] = useState(false);
  const id = localStorage.getItem("AppId");
  const [pharmacy, { data }] = useLazyQuery(getPartner, {
    variables: { id },
  });
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const drawerWidth = 200;
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  useEffect(() => {
    changeAppType(role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  useEffect(() => {
    const token = localStorage.getItem("App_Token");
    const d = async () => {
      if (token) {
        const { exp } = jwtDecode(token);
        const time = Date.now() >= exp * 1000;
        if (token && time) {
          logout();
          logout_user();
        }
        if (token && isAuthenticated && !time && state) {
          setstate(false);
          setAccessToken(token);
        } else if (token && isAuthenticated && !time && !state) {
          setAccessToken(token);
          try {
            await pharmacy();
          } catch (err) {
            console.error(err);
          }

          if (data) {
            const partnerData = data?.getPartner;
            userDetail({
              data: partnerData?.category,
            });
            localStorage.setItem("partnerData", JSON.stringify(partnerData));
          }
          setstate(false);
        }
      }
    };
    d();
    // eslint-disable-next-line
  }, [data, pharmacy, state, isAuthenticated]);
  return (
    <>
      <Router>
        <div className="container">
          {!isAuthenticated && (
            <Route
              path={["/login", "/"]}
              render={(props) => <Login {...props} />}
            />
          )}

          {isAuthenticated && role === "diagnostics" && state && (
            <Loader color="success" />
          )}
          {isAuthenticated && role === "pharmacy" && state && (
            <Loader color="success" />
          )}
          {isAuthenticated && role === "hospital" && state && (
            <Loader color="success" />
          )}
          {isAuthenticated && role === "hmo" && state && (
            <Loader color="success" />
          )}

          {/*  =========== DIAGNOSTICS VIEW ============  */}
          {isAuthenticated && role === "diagnostics" && !state && (
            <>
              <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <Header
                  handleDrawerToggle={handleDrawerToggle}
                  drawerWidth={drawerWidth}
                />

                {!isAuthenticated && (
                  <Route
                    path={["/", "/login"]}
                    render={(props) => <Login {...props} />}
                  />
                )}
                <Box
                  component="nav"
                  sx={{ width: { md: "300px" }, flexShrink: { md: 0 } }}
                  aria-label="sidebar_menu"
                >
                  <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                      display: { xs: "block", md: "none" },
                      "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                      },
                      "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <SideNav
                      types="temporary"
                      handleDrawerToggle={handleDrawerToggle}
                    />
                  </Drawer>
                  <Drawer
                    variant="permanent"
                    sx={{
                      display: { xs: "none", md: "block" },
                      "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                      },
                      "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      },
                    }}
                    open
                  >
                    <SideNav />
                  </Drawer>
                </Box>
                <Box
                  component="main"
                  sx={{
                    flex: 1,
                    p: 3,
                    width: { xs: `calc(100% - ${drawerWidth}px)` },
                  }}
                >
                  <Toolbar />
                  <Private />
                </Box>
              </Box>
            </>
          )}

          {/* =========== PHARMACY VIEW ============= */}
          {isAuthenticated && role === "pharmacy" && !state && (
            <>
              <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <Header
                  handleDrawerToggle={handleDrawerToggle}
                  drawerWidth={drawerWidth}
                />

                {!isAuthenticated && (
                  <Route
                    path={["/", "/login"]}
                    render={(props) => <Login {...props} />}
                  />
                )}
                <Box
                  component="nav"
                  sx={{ width: { md: "300px" }, flexShrink: { md: 0 } }}
                  aria-label="sidebar_menu"
                >
                  <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                      display: { xs: "block", md: "none" },
                      "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                      },
                      "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <SideNav
                      types="temporary"
                      handleDrawerToggle={handleDrawerToggle}
                    />
                  </Drawer>
                  <Drawer
                    variant="permanent"
                    sx={{
                      display: { xs: "none", md: "block" },
                      "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                      },
                      "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      },
                    }}
                    open
                  >
                    <SideNav handleDrawerToggle={handleDrawerToggle} />
                  </Drawer>
                </Box>
                <Box
                  component="main"
                  sx={{
                    flex: 1,
                    p: 3,
                    background: "#f8f8f8",
                    width: { xs: `calc(100% - ${drawerWidth}px)` },
                  }}
                >
                  <Toolbar />
                  <Routes />
                </Box>
              </Box>
            </>
          )}

          {/* ========= HOSPITAL VIEW =========== */}
          {isAuthenticated && role === "hospital" && !state && (
            <>
              <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <Header
                  handleDrawerToggle={handleDrawerToggle}
                  drawerWidth={drawerWidth}
                />

                {!isAuthenticated && (
                  <Route
                    path={["/", "/login"]}
                    render={(props) => <Login {...props} />}
                  />
                )}
                <Box
                  component="nav"
                  sx={{
                    width: { md: "30rem" },
                    backgroundColor: "#f8f8f8",
                    flexShrink: { md: 0 },
                  }}
                  aria-label="sidebar_menu"
                >
                  <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                      display: { xs: "block", md: "none" },
                      "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: "30rem",
                      },
                      "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <SideNav
                      types="temporary"
                      handleDrawerToggle={handleDrawerToggle}
                    />
                  </Drawer>
                  <Drawer
                    variant="permanent"
                    sx={{
                      display: { xs: "none", md: "block" },
                      "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                        backgroundColor: "#f8f8f8",
                      },
                      "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      },
                    }}
                    open
                  >
                    <SideNav />
                  </Drawer>
                </Box>
                <Box
                  component="main"
                  sx={{
                    flex: 1,
                    p: 3,
                    width: { xs: `calc(100% - ${drawerWidth}px)` },

                    backgroundColor: "#f8f8f8",
                  }}
                >
                  <Toolbar />
                  <Hospital />
                </Box>
              </Box>
            </>
          )}

          {/*======== HMO VIEW ======= */}
          {isAuthenticated && role === "hmo" && !state && (
            <>
              <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <Header
                  handleDrawerToggle={handleDrawerToggle}
                  drawerWidth={drawerWidth}
                />

                {!isAuthenticated && (
                  <Route
                    path={["/", "/login"]}
                    render={(props) => <Login {...props} />}
                  />
                )}
                <Box
                  component="nav"
                  sx={{
                    width: { md: "30rem" },
                    backgroundColor: "#f8f8f8",
                    flexShrink: { md: 0 },
                  }}
                  aria-label="sidebar_menu"
                >
                  <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                      display: { xs: "block", md: "none" },
                      "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: "30rem",
                      },
                      "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <SideNav
                      types="temporary"
                      handleDrawerToggle={handleDrawerToggle}
                    />
                  </Drawer>
                  <Drawer
                    variant="permanent"
                    sx={{
                      display: { xs: "none", md: "block" },
                      "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                        backgroundColor: "#f8f8f8",
                      },
                      "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      },
                    }}
                    open
                  >
                    <SideNav />
                  </Drawer>
                </Box>
                <Box
                  component="main"
                  sx={{
                    flex: 1,
                    p: 3,
                    width: { xs: `calc(100% - ${drawerWidth}px)` },

                    backgroundColor: "#f8f8f8",
                  }}
                >
                  <Toolbar />
                  <Hmo />
                </Box>
              </Box>
            </>
          )}
        </div>
      </Router>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <AppTypeProvider>
        <PreApp />
      </AppTypeProvider>
    </ThemeProvider>
  );
};

export default App;
