import React, { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Typography, Toolbar, Grid } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PropTypes from "prop-types";
import useApptype from "hooks/useAppType";
import HeaderProfile from "./HeaderProfile";
import { useTheme } from "@mui/material/styles";
import { getAppPattern } from "helpers/filterHelperFunctions";
import { predicateBreadcrumbFromUrl } from "helperFunctions/breadcrumb";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    alignItems: "center",
    // width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "space-between",
  },
  text: {
    color: theme.palette.common.lightGrey,
    fontSize: "clamp(1rem, 1.2vw, 1.5rem)",
    fontWeight: 300,
  },
  name: {
    fontSize: "clamp(1.5rem, 1.5vw, 2rem)", //clamp(1.5rem, 1.5vw, 2.25rem)
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
    // fontSize: "clamp(1.2rem, 1vw+1rem, 2.4rem )",
    fontSize: "clamp(1.5rem, 1.5vw, 2.25rem)",
    color: theme.palette.common.red,
    "&.MuiTypography-root": {
      marginRight: ".5rem",
    },
  },
  subtitle: {
    color: theme.palette.common.green,
    "&.MuiTypography-root": {
      fontSize: "clamp(0.6rem, 1vw + .5rem, 1.25rem)",
      marginLeft: ".5rem",
      alignSelf: "flex-end",
    },
  },
  customSubHeaderWrapper: {
    display: "flex",
    alignItems: "center",
  },
}));
const CustomHeaderTitle = ({ title, path, onClick = null, variant }) => {
  const classes = useStyles();

  return (
    <div className={classes.titleWrapper}>
      {!onClick ? (
        <Link to={`/${path}`} className={classes.link}>
          <Typography>{title}</Typography>
        </Link>
      ) : (
        <Typography
          sx={{
            cursor: "pointer",
          }}
          onClick={onClick}
          variant="h3"
          classes={{ root: classes.title }}
        >
          {title}
        </Typography>
      )}
    </div>
  );
};

//

CustomHeaderTitle.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
  path: PropTypes.string,
  variant: PropTypes.string,
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
const HeaderText = ({ pharmacyData }) => {
  const { type } = useApptype();
  const classes = useStyles();
  const { pathname } = useLocation();
  const appPattern = getAppPattern(type);

  const breadcrumbs = useMemo(() => {
    return predicateBreadcrumbFromUrl(appPattern, pathname.substring(1));
  }, [appPattern, pathname]);

  const counts = {
    Doctors: null,
    Patients: null,
  };

  switch (pathname) {
    case "/dashboard":
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

    default:
      return (
        <div>
          <Breadcrumb breadcrumbs={breadcrumbs} counts={counts} />
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

const Breadcrumb = ({ breadcrumbs = [], counts = {} }) => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();

  // Patients Doctors

  return (
    <Grid container justifyContent="flex-start" alignItems="center">
      {breadcrumbs.map((text, index) => {
        return (
          <Fragment key={index}>
            {breadcrumbs.length < 2 ? (
              <Grid container alignContent="center">
                <Grid item>
                  <CustomHeaderTitle
                    title={text}
                    variant="h2"
                    onClick={() => {
                      const page = index - (breadcrumbs.length - 1);
                      history.go(page);
                    }}
                  />
                </Grid>
                {counts[text] && (
                  <Grid
                    item
                    sx={{ marginLeft: "0.5rem", display: "flex" }}
                    alignContent="center"
                  >
                    <Grid container alignContent="center">
                      <ArrowUpwardIcon color="success" />
                      <Typography variant="h5" className={classes.subtitle}>
                        {counts[text]} total
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            ) : (
              <CustomHeaderTitle
                title={text}
                variant="h4"
                onClick={() => {
                  const page = index - (breadcrumbs.length - 1);
                  history.go(page);
                }}
              />
            )}
            {breadcrumbs.length > 0 && breadcrumbs.length - 1 > index ? (
              <KeyboardArrowRightIcon
                size={10}
                style={{
                  color: theme.palette.common.grey,
                }}
              />
            ) : null}
          </Fragment>
        );
      })}
    </Grid>
  );
};

Breadcrumb.propTypes = {
  breadcrumbs: PropTypes.array,
  counts: PropTypes.object,
};

const HeaderContent = ({ pharmacyData }) => {
  const classes = useStyles();
  return (
    <Toolbar className={classes.toolbar}>
      <HeaderText pharmacyData={pharmacyData} />
      <HeaderProfile pharmacyData={pharmacyData} />
    </Toolbar>
  );
};

export default HeaderContent;
