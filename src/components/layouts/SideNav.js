import React, { useEffect, createElement, useState, useMemo } from "react";
import { makeStyles } from "@mui/styles";
import { HiLogout } from "react-icons/hi";
import { useMutation } from "@apollo/client";
import { Link, useLocation } from "react-router-dom";
import {
  ListItemButton,
  List,
  ListItemIcon,
  Grid,
  ListItemText,
} from "@mui/material";

import logo from "assets/images/logo.svg";
import { setSideNav } from "helpers/func";
import useAppType from "../hooks/useAppType";
import { useActions } from "components/hooks/useActions";
import { LOGOUT_USER } from "components/graphQL/Mutation";
import DeleteOrDisable from "components/modals/DeleteOrDisable";
import {
  hospitalMenu,
  pharmacyMenu,
  diagnosticsMenu,
} from "helpers/asideMenus";

import { useAlert } from "components/hooks";
const SideNav = ({ types, drawerWidth, handleDrawerToggle }) => {
  const useStyles = makeStyles((theme) => ({
    aside: {
      width: `${drawerWidth}`,
      background: "#fff",
      paddingLeft: "2.5em",
      paddingRight: "2.5em",
      paddingTop: "1em",
      minHeight: "100vh",
      height: "100%",
      position: "fixed",
      overflowY: "hidden",
      zIndex: theme.zIndex.appBar + 1,

      "&:hover": {
        overflowY: "scroll",
      },

      "& .MuiListItemButton-root": {
        marginBottom: "2em",

        "&:hover": {
          background: theme.palette.common.lightRed,

          "& .MuiSvgIcon-root": {
            color: theme.palette.common.red,
          },

          "& .MuiTypography-root": {
            color: theme.palette.common.red,
          },

          "& .message-icon": {
            color: theme.palette.common.red,
          },
        },
      },

      "& .MuiListItemIcon-root": {
        minWidth: 50,
      },

      "& .MuiSvgIcon-root": {
        fontSize: "2rem",

        "&:hover": {
          color: theme.palette.common.red,
        },
      },

      "& .MuiTypography-root": {
        fontSize: "1.45rem",
      },

      "& .MuiListItemButton-root.Mui-selected": {
        backgroundColor: theme.palette.common.lightRed,
        color: theme.palette.common.red,
        borderRadius: ".5rem",

        "&:hover": {
          backgroundColor: theme.palette.common.lightRed,
        },

        "& .MuiListItemIcon-root": {
          color: theme.palette.common.red,
        },

        "& .MuiTypography-root": {
          color: theme.palette.common.red,
        },
      },

      "&::-webkit-scrollbar": {
        width: ".85rem",
      },

      "&::-webkit-scrollbar-track": {
        boxShadow: "inset 0 0 1rem rgba(0, 0, 0, 0.2)",
      },

      "&::-webkit-scrollbar-thumb": {
        borderRadius: ".5rem",
        background: theme.palette.common.lightGrey,
      },
    },
    logoWrapper: {
      paddingTop: "3em",
      paddingBottom: "2em",
      paddingLeft: "1em",
    },
    logout: {
      "&.MuiListItemButton-root": {
        marginTop: "2.5rem",

        "& .MuiListItemIcon-root": {
          color: theme.palette.common.red,
        },

        "& .MuiTypography-root": {
          color: theme.palette.common.red,
        },
      },
    },
  }));
  const classes = useStyles();
  const { type } = useAppType();
  const location = useLocation();
  const { logout } = useActions();
  const { displayMessage } = useAlert();
  const [logout_user] = useMutation(LOGOUT_USER);
  const [Logout, setLogout] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(0);

  const sideNavData = useMemo(() => {
    return type === "hospital"
      ? hospitalMenu
      : type === "pharmacy"
      ? pharmacyMenu
      : type === "diagnostics"
      ? diagnosticsMenu
      : [];
  }, [type]);

  const handleLogout = async () => {
    try {
      await logout_user({
        variables: {
          user: localStorage.getItem("AppId"),
        },
      });

      logout();
      displayMessage("success", "Logout Successfully");
    } catch (err) {
      displayMessage("error", "Logout Failed");
      console.error(err.message);
    }
  };
  const handleClick = (menu) => {
    if (types === "temporary") {
      handleDrawerToggle();
    }
    setSelectedMenu(menu?.id);
  };
  useEffect(() => {
    setSideNav(sideNavData, location?.pathname, setSelectedMenu);
  }, [location?.pathname, sideNavData]);

  return (
    <>
      <Grid
        className={classes.aside}
        boxShadow={{ sm: "5px -5px 7px #eee", xs: "none" }}
      >
        <div className={classes.logoWrapper}>
          <img src={logo} alt="logo" />
        </div>
        <List>
          {sideNavData.map((menu) => (
            <ListItemButton
              disableRipple
              key={menu?.id}
              onClick={handleClick}
              selected={selectedMenu === menu.id}
              component={Link}
              to={menu.path}
            >
              <ListItemIcon>
                {createElement(
                  menu?.icon,
                  menu?.id === 5 ? { size: 20, className: "message-icon" } : {}
                )}
              </ListItemIcon>

              <ListItemText>{menu?.title}</ListItemText>
            </ListItemButton>
          ))}
          <ListItemButton
            disableRipple
            classes={{ root: classes.logout }}
            onClick={() => setLogout(true)}
          >
            <ListItemIcon>
              <HiLogout size={20} />
            </ListItemIcon>

            <ListItemText>Logout</ListItemText>
          </ListItemButton>
        </List>
      </Grid>
      <DeleteOrDisable
        open={Logout}
        setOpen={setLogout}
        title="Logout"
        confirmationMsg="logout"
        btnValue="Logout"
        type="logout"
        onConfirm={handleLogout}
      />
    </>
  );
};

export default SideNav;
