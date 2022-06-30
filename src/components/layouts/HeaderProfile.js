import React, { useState, useEffect } from "react";
import { Avatar, IconButton, Grid, Typography, Badge } from "@mui/material";
import { makeStyles } from "@mui/styles";
import displayPhoto from "assets/images/avatar.png";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Notifications from "components/layouts/Notifications";
import { useLazyQuery } from "@apollo/client";
import { getPartner, getNotifications } from "components/graphQL/useQuery";
import { useActions } from "components/hooks/useActions";

const useStyles = makeStyles((theme) => ({
  role: {
    fontSize: "clamp(1rem, 1vw, 1.5rem)",
    color: theme.palette.common.lightGrey,
  },

  name: {
    fontWeight: "normal",
    fontSize: "clamp(1.6rem, 2vw, 1.2rem)",
  },

  notification: {
    fontSize: "clamp(2rem, 2vw, 1.2rem)",
  },
  HeaderProfile: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  head: {
    "@media(max-width:600px)": {
      "&.MuiGrid-root": {
        display: "none",
      },
    },
  },
}));

const HeaderProfile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { userDetail } = useActions();
  const classes = useStyles();
  function notificationsLabel(count) {
    if (count === 0) {
      return "no notifications";
    }
    if (count > 99) {
      return "more than 99 notifications";
    }
    return `${count} notifications`;
  }
  const id = localStorage.getItem("AppId");
  const [num, setNum] = useState(null);
  const [pharmacyData, setPharmacyData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pharmacy, { data }] = useLazyQuery(getPartner, {
    variables: { id },
  });
  const [notify, { data: notData }] = useLazyQuery(getNotifications, {
    variables: { user: id },
  });
  useEffect(() => {
    setNum(notifications && notifications?.length);

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    (async () => {
      setTimeout(notify, 300);
    })();
    if (notData) {
      setNotifications(notData.getNotifications.data);
    }
    //eslint-disable-next-line
  }, [notData]);
  const handleNotification = (event) => {
    setAnchorEl(event.currentTarget);
    setNum(0);
  };
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
    <header className={classes.HeaderProfile}>
      <Grid
        container
        alignItems="center"
        gap="3px"
        justifyContent="space-between"
        flexWrap="nowrap"
      >
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
        <Grid
          className={classes.head}
          item
          style={{ marginRight: "3em", marginLeft: "1em" }}
        >
          <Grid container direction="column" justifyContent="center">
            <Grid item>
              <Typography variant="body1" className={classes.name}>
                {pharmacyData?.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                className={classes.role}
                style={{ fontWeight: 300 }}
              >
                {pharmacyData?.category}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.head} item>
          <IconButton
            aria-label={notificationsLabel(num)}
            onClick={(event) => handleNotification(event)}
          >
            <Badge badgeContent={num} color="error">
              <NotificationsActiveIcon
                color="primary"
                sx={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
              />
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

export default HeaderProfile;
