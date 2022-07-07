import React, { useState, useEffect } from "react";
import { Avatar, IconButton, Grid, Typography, Badge } from "@mui/material";
import { makeStyles } from "@mui/styles";
// import { useTheme } from "@mui/material/styles";
import displayPhoto from "assets/images/avatar.png";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Notifications } from "components/layouts";
import { useLazyQuery } from "@apollo/client";
import { getPartner, getNotifications } from "components/graphQL/useQuery";

import { useActions } from "components/hooks/useActions";

const useStyles = makeStyles((theme) => ({
  role: {
    fontSize: "1.5rem",
    color: theme.palette.common.lightGrey,
  },

  name: {
    fontWeight: "normal",
  },
  notification: {
    fontSize: "2rem",
  },
}));

const HospitalHeaderProfile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { userDetail } = useActions();
  const id = localStorage.getItem("AppId");
  const classes = useStyles();
  const [notifications, setNotifications] = useState([]);
  const [notify, { data: notData }] = useLazyQuery(getNotifications, {
    variables: { user: id },
  });
  function notificationsLabel(count) {
    if (count === 0) {
      return "no notifications";
    }
    if (count > 99) {
      return "more than 99 notifications";
    }
    return `${count} notifications`;
  }
  const [pharmacyData, setPharmacyData] = useState([]);

  const [pharmacy, { data }] = useLazyQuery(getPartner, {
    variables: { id },
  });

  useEffect(() => {
    (async () => {
      setTimeout(notify, 300);
    })();
    if (data) {
      setNotifications(notData.getNotifications.data);
    }
    //eslint-disable-next-line
  }, [notData]);
  useEffect(() => {
    (async () => {
      setTimeout(pharmacy, 300);
    })();
    if (data) {
      setPharmacyData(data?.getPartner);
      userDetail({
        data: data?.getPartner.category,
      });
    }
    //eslint-disable-next-line
  }, [pharmacy, data]);

  return (
    <header>
      <Grid container alignItems="center">
        <Grid item>
          <Avatar
            alt={pharmacyData.name}
            src={
              pharmacyData.logoImageUrl
                ? pharmacyData.logoImageUrl
                : displayPhoto
            }
          />
        </Grid>
        <Grid item style={{ marginRight: "3em", marginLeft: "1em" }}>
          <Grid container direction="column" justifyContent="center">
            <Grid item>
              <Typography variant="body1" className={classes.name}>
                {pharmacyData && pharmacyData.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                className={classes.role}
                style={{ fontWeight: 300 }}
              >
                {pharmacyData && pharmacyData.category}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <IconButton
            aria-label={notificationsLabel(
              notifications && notifications.length
            )}
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <Badge
              badgeContent={notifications && notifications.length}
              color="error"
            >
              <NotificationsActiveIcon color="primary" fontSize="large" />
            </Badge>
          </IconButton>
          <Notifications
            anchorEl={anchorEl}
            Notifications={notifications}
            setNotifications={setNotifications}
            setAnchorEl={setAnchorEl}
          />
        </Grid>
      </Grid>
    </header>
  );
};

export default HospitalHeaderProfile;
