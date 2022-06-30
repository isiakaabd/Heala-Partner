import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Typography, Toolbar } from "@mui/material";
import { HospitalHeaderProfile } from ".";
import { makeStyles } from "@mui/styles";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useLazyQuery } from "@apollo/client";
import { getPartner } from "components/graphQL/useQuery";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  text: {
    color: theme.palette.common.lightGrey,
    fontSize: "1.5rem",
    fontWeight: 300,
  },
  name: {
    fontSize: "2rem",
    fontWeight: 300,
  },
  titleWrapper: {
    display: "flex",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
  },
  title: {
    fontSize: "2.4rem",
    color: theme.palette.common.green,
    "&.MuiTypography-root": {
      marginRight: ".5rem",
    },
  },
  subtitle: {
    color: theme.palette.common.green,
    "&.MuiTypography-root": {
      fontSize: "1.25rem",
      marginLeft: ".5rem",
      alignSelf: "flex-end",
    },
  },
  customSubHeaderWrapper: {
    display: "flex",
    alignItems: "center",
  },
}));

const CustomHeaderText = ({ title, path }) => {
  const classes = useStyles();

  return (
    <div className={classes.titleWrapper}>
      <Link to={`/${path}`} className={classes.link}>
        <Typography variant="h3" classes={{ root: classes.title }}>
          {title}
        </Typography>
      </Link>
    </div>
  );
};

CustomHeaderText.propTypes = {
  title: PropTypes.string,
  total: PropTypes.number,
  path: PropTypes.string,
};

const CustomHeaderTitle = ({ title, path }) => {
  const classes = useStyles();

  return (
    <div className={classes.titleWrapper}>
      <Link to={`/${path}`} className={classes.link}>
        <Typography variant="h3" classes={{ root: classes.title }}>
          {title}
        </Typography>
      </Link>
    </div>
  );
};

CustomHeaderTitle.propTypes = {
  title: PropTypes.string,
  path: PropTypes.string,
};

// SUBMENU HEADERS
const CustomSubHeaderText = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const {
    title,
    subTitle,
    subSubTitle,
    scopedSubTitle,
    scopedMenu,
    scopedSubMenu,
    titleColor = theme.palette.common.green,
  } = props;

  return (
    <div className={classes.customSubHeaderWrapper}>
      <Typography variant="h3" style={{ color: theme.palette.common.grey }}>
        {title}
      </Typography>
      <KeyboardArrowRightIcon
        style={{
          fontSize: "2rem",
          color: theme.palette.common.grey,
        }}
      />
      <Typography
        variant="h3"
        classes={{ root: classes.title }}
        style={{
          color: titleColor,
        }}
      >
        {subTitle}
      </Typography>
      {scopedMenu !== 0 && (
        <Fragment>
          <KeyboardArrowRightIcon
            style={{ fontSize: "2rem", color: theme.palette.common.grey }}
          />
          <Typography
            variant="h3"
            classes={{ root: classes.title }}
            style={{
              color:
                scopedSubMenu === 0
                  ? theme.palette.common.red
                  : theme.palette.common.grey,
            }}
          >
            {subSubTitle}
          </Typography>
        </Fragment>
      )}

      {scopedSubMenu !== 0 && (
        <Fragment>
          <KeyboardArrowRightIcon
            style={{ fontSize: "2rem", color: theme.palette.common.grey }}
          />
          <Typography
            variant="h3"
            classes={{ root: classes.title }}
            style={{ color: theme.palette.common.green }}
          >
            {scopedSubTitle}
          </Typography>
        </Fragment>
      )}
    </div>
  );
};

CustomSubHeaderText.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  subSubTitle: PropTypes.string,
  scopedSubTitle: PropTypes.string,
  titleColor: PropTypes.string,
  scopedMenu: PropTypes.number,
  scopedSubMenu: PropTypes.number,
};

// HEADER DYNAMIC RENDERING COMPONENT
const HeaderText = (props) => {
  const {
    selectedMenu,
    selectedSubMenu,
    selectedPatientMenu,
    selectedHcpMenu,
    selectedScopedMenu,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const id = localStorage.getItem("AppId");
  const [pharmacyData, setPharmacyData] = useState();

  const [pharmacy, { data }] = useLazyQuery(getPartner, {
    variables: { id },
  });

  useEffect(() => {
    (async () => {
      setTimeout(pharmacy, 200);
    })();
    if (data) {
      localStorage.setItem("partnerID", data.getPartner._id);
      setPharmacyData(data?.getPartner);
    }
  }, [pharmacy, data]);

  const { pathname } = useLocation();

  switch (selectedMenu) {
    case 0:
      return (
        <div>
          <Typography variant="h5" className={classes.text} gutterBottom>
            Welcome,
          </Typography>
          <Typography variant="h3" color="primary" className={classes.name}>
            {pharmacyData?.name}
          </Typography>
        </div>
      );
    case 1:
      if (selectedSubMenu === 2) {
        return (
          <CustomSubHeaderText
            title="Pending Orders"
            subTitle=" View Order"
            scopedMenu={0}
            scopedSubMenu={0}
            titleColor={
              selectedPatientMenu === 0
                ? theme.palette.common.green
                : theme.palette.common.grey
            }
            // selectedPatientMenu={selectedPatientMenu}
          />
        );
      }
      return <CustomHeaderText title="Pending Orders" path="pending" />;
    case 2:
      if (selectedSubMenu === 3) {
        return (
          <CustomSubHeaderText
            title="Processing Orders"
            path="processing-order"
            subTitle="View Order"
            scopedMenu={selectedHcpMenu}
            scopedSubMenu={selectedScopedMenu}
            titleColor={
              selectedPatientMenu === 0
                ? theme.palette.common.green
                : theme.palette.common.grey
            }
            selectedPatientMenu={selectedPatientMenu}
          />
        );
      }
      return (
        <CustomHeaderText title="Processing Orders" path="processing-order" />
      );
    case 3:
      if (selectedSubMenu === 4) {
        return (
          <CustomSubHeaderText
            title="Completed Orders"
            subTitle="View Completed Results"
            path="completed-order"
            scopedSubMenu={selectedScopedMenu}
            scopedMenu={0}
            titleColor={
              selectedPatientMenu === 0
                ? theme.palette.common.green
                : theme.palette.common.grey
            }
            selectedPatientMenu={selectedPatientMenu}
          />
        );
      }
      return (
        <CustomHeaderText title="Completed Orders" path="completed-order" />
      );
    case 5:
      if (selectedSubMenu === 6) {
        return (
          <CustomSubHeaderText
            title="Cancelled Orders"
            scopedMenu={0}
            scopedSubMenu={0}
          />
        );
      }
      return (
        <CustomHeaderTitle title="Cancelled Orders" path="cancelled-order" />
      );
    case 8:
      if (selectedSubMenu === 9) {
        return (
          <CustomSubHeaderText
            title="Scheduled Orders"
            scopedMenu={0}
            scopedSubMenu={0}
            subTitle="View Schedule Orders"
          />
        );
      }
      return (
        <CustomHeaderTitle title="Scheduled Orders" path="schedule-request" />
      );
    case 11:
      if (selectedSubMenu === 12) {
        return (
          <CustomSubHeaderText
            title="Settings"
            subTitle={pathname === "/settings/profile" ? "View profile" : ""}
            scopedMenu={0}
            scopedSubMenu={0}
          />
        );
      }
      return <CustomHeaderTitle title="Settings" path="settings" />;
    default:
      return (
        <div>
          <Typography variant="h5" className={classes.text} gutterBottom>
            Welcome,
          </Typography>
          <Typography variant="h3" color="primary" className={classes.name}>
            {pharmacyData?.name}
          </Typography>
        </div>
      );
  }
};

HeaderText.propTypes = {
  selectedMenu: PropTypes.number,
  selectedSubMenu: PropTypes.number,
  selectedPatientMenu: PropTypes.number,
  selectedHcpMenu: PropTypes.number,
  waitingListMenu: PropTypes.number,
  selectedAppointmentMenu: PropTypes.number,
  selectedScopedMenu: PropTypes.number,
};

const HeaderContents = (props) => {
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

  return (
    <Toolbar className={classes.toolbar}>
      <HeaderText
        selectedMenu={selectedMenu}
        selectedSubMenu={selectedSubMenu}
        selectedPatientMenu={selectedPatientMenu}
        selectedHcpMenu={selectedHcpMenu}
        waitingListMenu={waitingListMenu}
        selectedAppointmentMenu={selectedAppointmentMenu}
        selectedScopedMenu={selectedScopedMenu}
      />
      <HospitalHeaderProfile />
    </Toolbar>
  );
};

HeaderContents.propTypes = {
  selectedMenu: PropTypes.number,
  selectedSubMenu: PropTypes.number,
  selectedPatientMenu: PropTypes.number,
  selectedHcpMenu: PropTypes.number,
  waitingListMenu: PropTypes.number,
  selectedAppointmentMenu: PropTypes.number,
  selectedScopedMenu: PropTypes.number,
};

export default HeaderContents;
