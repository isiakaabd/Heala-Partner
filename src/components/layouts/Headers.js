import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";
import { AppBar, IconButton, Grid, Toolbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HeadersContents from "components/layouts/HeadersContents";

const useStyles = makeStyles((theme) => ({
  appBar: {
    "&.MuiToolbar-root": {
      display: "flex",
      justifyContent: "space-around",
      padding: "0px",
      alignItems: "center",
      paddingInline: "min(2.5rem,4vw)",
    },
  },
  toolbarMargin: {
    ...theme.mixins.toolbar,
  },
}));

const Headers = (props) => {
  const {
    selectedMenu,

    handleDrawerToggle,
    drawerWidth,
  } = props;
  const classes = useStyles();
  return (
    <AppBar
      position="fixed"
      padding="1rem"
      sx={{
        width: { md: `calc(100% - (${drawerWidth}px + 5em))` },
      }}
    >
      <Toolbar className={classes.appBar}>
        <Grid item marginInline={2.5}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              color: "white",
              fontSize: "3rem",
              background: "black",
              display: { md: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Grid>
        <HeadersContents
          selectedMenu={selectedMenu}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
        />
      </Toolbar>
    </AppBar>
  );
};

Headers.propTypes = {
  selectedMenu: PropTypes.number,
  selectedSubMenu: PropTypes.number,
  selectedPatientMenu: PropTypes.number,
  selectedHcpMenu: PropTypes.number,
  waitingListMenu: PropTypes.number,
  selectedAppointmentMenu: PropTypes.number,
  selectedScopedMenu: PropTypes.number,
};

export default Headers;
