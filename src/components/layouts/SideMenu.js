import React, { useEffect, useState } from "react";
import DeleteOrDisable from "components/modals/DeleteOrDisable";
import {
  ListItemButton,
  List,
  ListItemIcon,
  ListItemText,
  Grid,
} from "@mui/material";
import { menus } from "helpers/asideMenus";
import { makeStyles } from "@mui/styles";
import logo from "assets/images/logo.svg";
import { Link, useLocation } from "react-router-dom";
import { HiLogout } from "react-icons/hi";
import { useActions } from "components/hooks/useActions";
import { LOGOUT_USER } from "components/graphQL/Mutation";
import { useMutation } from "@apollo/client";
import LogoutIcon from "components/Icons/LogoutIcon";
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

const SideMenu = (props) => {
  const {
    selectedMenu,
    setSelectedMenu,
    setSelectedSubMenu,
    setWaitingListMenu,
  } = props;
  const { logout } = useActions();
  const classes = useStyles();
  const [logout_user] = useMutation(LOGOUT_USER);
  const [Logout, setLogout] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout_user({
        variables: {
          user: localStorage.getItem("AppId"),
        },
      });
      logout();
      setSelectedMenu(13);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    menus.filter((menu) => {
      switch (location.pathname) {
        case menu.path:
          if (menu.id !== selectedMenu) {
            setSelectedMenu(menu.id);
          }
          break;
        default:
          break;
      }
    });
    // eslint-disable-next-line
  }, [selectedMenu]);

  return (
    <>
      <Grid
        className={classes.aside}
        sx={{ borderRight: "1px solid rgba(229, 229, 229, 0.5)" }}
      >
        <div className={classes.logoWrapper}>
          <img src={logo} alt="logo" />
        </div>
        <List>
          {menus.map((menu) => {
            const { icon } = menu;

            return (
              <ListItemButton
                disableRipple
                key={menu.id}
                onClick={() => setSelectedMenu(menu.id)}
                selected={selectedMenu === menu.id}
                component={Link}
                to={menu.path}
              >
                <ListItemIcon sx={{ marginRight: "15px" }}>{icon}</ListItemIcon>

                <ListItemText>{menu.title}</ListItemText>
              </ListItemButton>
            );
          })}

          <ListItemButton
            disableRipple
            classes={{ root: classes.logout }}
            onClick={() => setLogout(true)}
          >
            <ListItemIcon sx={{ marginRight: "15px" }}>
              <LogoutIcon />
            </ListItemIcon>

            <ListItemText>Logoutsd</ListItemText>
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
      />{" "}
      <aside className={classes.aside}>
        <div className={classes.logoWrapper}>
          <img src={logo} alt="logo" />
        </div>
        <List>
          {menus.map((menu) => (
            <ListItemButton
              disableRipple
              key={menu.id}
              onClick={() => {
                setSelectedMenu(menu.id);
                setSelectedSubMenu(0);
                setWaitingListMenu(0);
              }}
              selected={selectedMenu === menu.id}
              component={Link}
              to={menu.path}
            >
              <ListItemIcon>
                {React.createElement(
                  menu.icon,
                  menu.id === 5 ? { size: 20, className: "message-icon" } : {}
                )}
              </ListItemIcon>

              <ListItemText>{menu.title}</ListItemText>
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
      </aside>
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

export default SideMenu;
