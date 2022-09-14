import React, { useState, useEffect } from "react";
import Copy from "components/Copy";
// import { ReactComponent as SearchIcon } from "assets/images/search.svg";
import {
  Avatar,
  IconButton,
  Grid,
  InputBase,
  Typography,
  Badge,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
// import BellIcon from "components/Icons/BellIcon";
import { ReactComponent as SearchIcon } from "assets/images/search.svg";
import displayPhoto from "assets/images/avatar.png";
// import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Notifications from "components/layouts/Notifications";
import { useLazyQuery } from "@apollo/client";
import { getPartner, getNotifications } from "components/graphQL/useQuery";
import { useActions } from "components/hooks/useActions";
import BellIcon from "components/Icons/BellIcon";
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
  iconContainer: {
    height: "inherit",
    backgroundColor: "#F8F8F8",
    borderRadius: "100%",
    display: "flex",
    width: "4.8rem",
    padding: "0 !important",
    alignItems: "center",
    justifyContent: "center",
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
  const returnString = (data) => {
    let string = data?.split("/");
    if (string) return string[string?.length - 1];
    return null;
  };
  // return (
  //   <header className={classes.HeaderProfile}>
  //     <Grid
  //       container
  //       alignItems="center"
  //       gap="1rem"
  //       justifyContent="space-between"
  //       flexWrap="nowrap"
  //       className={classes.head}
  //       spacing={1}
  //       sx={{ height: "4.8rem" }}
  //     >
  //       <Grid
  //         item
  //         className={classes.grid}
  //         sx={{
  //           height: "inherit",
  //           width: "40rem",
  //           background: "#F8F8F8",
  //           borderRadius: "4rem",
  //           display: "flex",
  //           alignItems: "center",
  //           padding: "1.4rem 1.6rem",
  //           paddingTop: 0,
  //         }}
  //       >
  //         <IconButton
  //           type="button"
  //           sx={{ color: "#F8F8F8" }}
  //           aria-label="search"
  //         >
  //           <SearchIcon />
  //         </IconButton>
  //         <InputBase
  //           sx={{ flex: 1, p: 0 }}
  //           size="large"
  //           placeholder="Search partners, patients, enrollees… "
  //         />
  //       </Grid>
  //       <Grid className={classes.iconContainer} item>
  //         <IconButton
  //           aria-label={notificationsLabel(num)}
  //           onClick={(event) => handleNotification(event)}
  //           sx={{
  //             borderRadius: "100%",
  //             backgroundColor: "#F8F8F8",
  //             padding: "1rem",
  //           }}
  //         >
  //           <Badge>
  //             <BellIcon sx={{ color: "transparent" }} />
  //           </Badge>
  //         </IconButton>
  //         <Notifications
  //           anchorEl={anchorEl}
  //           Notifications={notifications}
  //           setNotifications={setNotifications}
  //           setAnchorEl={setAnchorEl}
  //         />
  //       </Grid>
  //       <Grid item className={classes.iconContainer}>
  //         <Avatar
  //           alt="Display avatar"
  //           src={displayPhoto}
  //           sx={{ height: "100%", width: "100%" }}
  //         />
  //       </Grid>
  //     </Grid>
  //   </header>
  // );
  return (
    <header className={classes.HeaderProfile}>
      <Grid
        container
        alignItems="center"
        gap="2rem"
        justifyContent="space-between"
        flexWrap="nowrap"
        className={classes.head}
        spacing={1}
        sx={{ height: "4.8rem" }}
      >
        <Grid
          item
          className={classes.grid}
          sx={{
            height: "inherit",
            width: "40rem",
            background: "#F8F8F8",
            borderRadius: "4rem",
            display: "flex",
            alignItems: "center",
            padding: "1.4rem 1.6rem",
            paddingTop: 0,
          }}
        >
          <IconButton
            type="button"
            sx={{ color: "#F8F8F8" }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ flex: 1, p: 0 }}
            size="large"
            placeholder="Search , Patients, Doctors... "
          />
        </Grid>
        <Grid className={classes.iconContainer} item>
          <IconButton
            aria-label={notificationsLabel(num)}
            onClick={(event) => handleNotification(event)}
            sx={{
              borderRadius: "100%",
              backgroundColor: "#F8F8F8",
              padding: "1rem",
            }}
          >
            <Badge>
              <BellIcon sx={{ color: "transparent" }} />
            </Badge>
          </IconButton>
          <Notifications
            anchorEl={anchorEl}
            Notifications={notifications}
            setNotifications={setNotifications}
            setAnchorEl={setAnchorEl}
          />
        </Grid>
        <Grid item className={classes.iconContainer}>
          <Avatar
            alt="Display avatar"
            src={
              pharmacyData?.logoImageUrl
                ? pharmacyData?.logoImageUrl
                : displayPhoto
            }
            sx={{ height: "100%", width: "100%" }}
          />
        </Grid>
      </Grid>
    </header>
  );
  // return (
  //   <header className={classes.HeaderProfile}>
  //     <Grid
  //       container
  //       alignItems="center"
  //       gap="3px"
  //       justifyContent="space-between"
  //       flexWrap="nowrap"
  //     >
  //       <Grid
  //         className={classes.head}
  //         item
  //         style={{ marginRight: "3em", marginLeft: "1em" }}
  //       >
  //         <Grid container direction="column" justifyContent="center">
  //           {/* <Grid item>
  //             <Typography variant="body1" className={classes.name}>
  //               {pharmacyData?.name}
  //             </Typography>
  //           </Grid> */}
  //           {/*<Grid item>
  //         <Typography
  //               variant="body2"
  //               className={classes.role}
  //               style={{ fontWeight: 300 }}
  //             >
  //               {pharmacyData?.profileUrl !== null &&
  //               pharmacyData?.category === "hospital" ? (
  //                 <Grid item container alignItems="center">
  //                   {returnString(pharmacyData?.profileUrl)}
  //                   <Copy text={pharmacyData?.profileUrl} name="Profile URL" />
  //                 </Grid>
  //               ) : (
  //                 pharmacyData?.category
  //               )}
  //             </Typography>
  //           </Grid> */}
  //         </Grid>
  //       </Grid>
  //       <Grid className={classes.iconContainer} item>
  //         {/* <IconButton
  //           aria-label={notificationsLabel(num)}
  //           onClick={(event) => handleNotification(event)}
  //           sx={{
  //             borderRadius: "100%",
  //             backgroundColor: "#F8F8F8",
  //             padding: "1rem",
  //           }}
  //         >
  //           <Badge>
  //             <BellIcon sx={{ color: "transparent" }} />
  //           </Badge>
  //         </IconButton> */}
  //         <Grid item>
  //           <Avatar
  //             alt={pharmacyData?.name}
  //             src={
  //               pharmacyData?.logoImageUrl
  //                 ? pharmacyData?.logoImageUrl
  //                 : displayPhoto
  //             }
  //           />
  //         </Grid>
  //         <Notifications
  //           anchorEl={anchorEl}
  //           Notifications={notifications}
  //           setNotifications={setNotifications}
  //           setAnchorEl={setAnchorEl}
  //         />
  //       </Grid>
  //     </Grid>
  //   </header>
  // );
};

export default HeaderProfile;
