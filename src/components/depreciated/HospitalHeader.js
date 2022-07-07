import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { AppBar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { HospitalHeaderContent } from "components/layouts";

const useStyles = makeStyles((theme) => ({
  appBar: {
    paddingLeft: "max(35rem,24vw)",
    paddingTop: "2em",
    paddingBottom: "2em",
  },
  toolbarMargin: {
    ...theme.mixins.toolbar,
  },
}));

const HospitalHeader = (props) => {
  const {
    selectedMenu,
    selectedSubMenu,
    selectedPatientMenu,
    selectedHcpMenu,
    waitingListMenu,
    selectedAppointmentMenu,
    selectedScopedMenu,
  } = props;
  const classes = useStyles();
  // useEffect(() => {
  //   const token = localStorage.getItem('App_Token')
  //   const { exp } = jwtDecode(token)
  //   ;(async () => {
  //     if (Date.now() < exp * 1000) {
  //       await logout_user()
  //       setSelectedMenu(13)
  //       logout()
  //     } else {
  //       // setAccessToken(token)
  //       // try {
  //       //   setTimeout(pharmacy, 300)
  //       //   setstate(false)
  //       // } catch (err) {
  //       //   console.error(err)
  //       // }
  //     }
  //   })()
  // }, [logout])

  return (
    <Fragment>
      <AppBar
        position="fixed"
        className={classes.appBar}
        classes={{ root: classes.appBar }}
      >
        <HospitalHeaderContent
          selectedMenu={selectedMenu}
          selectedSubMenu={selectedSubMenu}
          selectedPatientMenu={selectedPatientMenu}
          selectedHcpMenu={selectedHcpMenu}
          waitingListMenu={waitingListMenu}
          selectedAppointmentMenu={selectedAppointmentMenu}
          selectedScopedMenu={selectedScopedMenu}
        />
      </AppBar>
    </Fragment>
  );
};

HospitalHeader.propTypes = {
  selectedMenu: PropTypes.number,
  selectedSubMenu: PropTypes.number,
  selectedPatientMenu: PropTypes.number,
  selectedHcpMenu: PropTypes.number,
  waitingListMenu: PropTypes.number,
  selectedAppointmentMenu: PropTypes.number,
  selectedScopedMenu: PropTypes.number,
};

export default HospitalHeader;
