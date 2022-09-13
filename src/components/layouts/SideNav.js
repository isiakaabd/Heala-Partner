import React, { useEffect, useState, useMemo } from "react";
import { makeStyles } from "@mui/styles";
import LogoutIcon from "components/Icons/LogoutIcon";
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
      /* width: `${drawerWidth}`, */
      width: "300px",
      background: "#fff",
      paddingLeft: "2em",
      paddingRight: "2em",
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
        display: "flex",
        borderRadius: "10px",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "0.5em",
        padding: "10px 14px",

        "&:hover": {
          background: theme.palette.common.lightBlue,

          "& .MuiSvgIcon-root": {
            stroke: "#3E5EA9",
            fill: "transparent",
          },

          "& .MuiTypography-root": {
            color: theme.palette.common.blue,
          },

          "& .message-icon": {
            color: theme.palette.common.blue,
          },
        },
      },

      "& .MuiListItemIcon-root": {
        display: "flex",
        alignItems: "center",
        minWidth: 22,
      },

      "& .MuiSvgIcon-root": {
        fontSize: "2rem",
        stroke: "#8D9091",
        fill: "transparent",

        "&:hover": {
          /* color: "#3E5EA9", */
          stroke: "#3E5EA9",
          fill: "transparent",
        },
      },

      "& .MuiTypography-root": {
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "20px",
        color: "#474951",
      },

      "& .MuiListItemButton-root.Mui-selected": {
        backgroundColor: theme.palette.common.lightBlue,
        color: theme.palette.common.blue,

        "& .MuiSvgIcon-root": {
          stroke: "#3E5EA9",
          fill: "transparent",
        },

        "&:hover": {
          backgroundColor: theme.palette.common.lightRed,
        },

        "& .MuiListItemIcon-root": {
          color: theme.palette.common.red,
        },

        "& .MuiTypography-root": {
          color: theme.palette.common.red,
          fontWeight: 500,
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
      paddingTop: "0.2rem",
      paddingBottom: "0.5em",
      paddingLeft: "1em",
    },
    logout: {
      "&.MuiListItemButton-root": {
        marginTop: "5rem",

        "& .MuiTypography-root": {
          color: "#ED3237 !important",
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
              <ListItemIcon sx={{ marginRight: "15px" }}>
                {menu.icon}
              </ListItemIcon>

              <ListItemText>{menu?.title}</ListItemText>
            </ListItemButton>
          ))}
          <ListItemButton
            disableRipple
            classes={{ root: classes.logout }}
            onClick={() => setLogout(true)}
          >
            <ListItemIcon sx={{ marginRight: "15px" }}>
              <LogoutIcon />
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
