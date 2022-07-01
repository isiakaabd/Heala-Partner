import React, { useEffect, useState } from "react";
import DeleteOrDisable from "components/modals/DeleteOrDisable";

import {
  ListItemButton,
  List,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { menu } from "helpers/asideMenus";
import { makeStyles } from "@mui/styles";
import logo from "assets/images/logo.svg";
import { Link, useLocation } from "react-router-dom";
import { HiLogout } from "react-icons/hi";
import { useActions } from "components/hooks/useActions";
import { LOGOUT_USER } from "components/graphQL/Mutation";
import { useMutation } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  aside: {
    width: "max(24rem,22vw)",
    background: "#fff",
    paddingLeft: "2.5em",
    paddingRight: "2.5em",
    paddingTop: "5em",
    minHeight: "100vh",
    height: "100%",
    boxShadow: "5px -5px 7px #eee",
    position: "fixed",
    overflowY: "hidden",
    zIndex: theme.zIndex.appBar + 1,

    "&:hover": {
      overflowY: "scroll",
    },

    "& .MuiListItemButton-root": {
      marginBottom: "2em",

      "&:hover": {
        background: theme.palette.common.lightGreen,

        "& .MuiSvgIcon-root": {
          color: theme.palette.common.green,
        },

        "& .MuiTypography-root": {
          color: theme.palette.common.green,
        },

        "& .message-icon": {
          color: theme.palette.common.green,
        },
      },
    },

    "& .MuiListItemIcon-root": {
      minWidth: 50,
    },

    "& .MuiSvgIcon-root": {
      fontSize: "2rem",

      "&:hover": {
        color: theme.palette.common.green,
      },
    },

    "& .MuiTypography-root": {
      fontSize: "1.45rem",
    },

    "& .MuiListItemButton-root.Mui-selected": {
      backgroundColor: theme.palette.common.lightGreen,
      color: theme.palette.common.green,
      borderRadius: ".5rem",

      "&:hover": {
        backgroundColor: theme.palette.common.lightGreen,
      },

      "& .MuiListItemIcon-root": {
        color: theme.palette.common.green,
      },

      "& .MuiTypography-root": {
        color: theme.palette.common.green,
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
    paddingBottom: "5em",
    paddingLeft: "7em",
  },
  logout: {
    "&.MuiListItemButton-root": {
      marginTop: "2.5rem",

      "& .MuiListItemIcon-root": {
        color: theme.palette.common.green,
      },

      "& .MuiTypography-root": {
        color: theme.palette.common.green,
      },
    },
  },
}));

const SideMenus = (props) => {
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
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    menu.filter((men) => {
      switch (location.pathname) {
        case men.path:
          break;
        default:
          break;
      }
    });
    // eslint-disable-next-line
  }, [selectedMenu]);

  return (
    <>
      <aside className={classes.aside}>
        <div className={classes.logoWrapper}>
          <img src={logo} alt="logo" />
        </div>
        <List>
          {menu.map((men) => (
            <ListItemButton
              disableRipple
              key={men.id}
              component={Link}
              to={men.path}
            >
              <ListItemIcon>
                {React.createElement(
                  men.icon,
                  men.id === 5 ? { size: 20, className: "message-icon" } : {}
                )}
              </ListItemIcon>

              <ListItemText>{men.title}</ListItemText>
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

export default SideMenus;
