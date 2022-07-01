import React, { useEffect, useState } from "react";
import { Grid, Typography, Avatar, Chip, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import displayPhoto from "assets/images/avatar.svg";
import { useQuery } from "@apollo/client";
import { getAMessage } from "components/graphQL/useQuery";
import { NoData } from "components/layouts";
import { Loader } from "components/Utilities";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  parentGrid: {
    background: "#fff",
    borderRadius: "1rem",
    boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.1)",
  },
  gridWrapper: {
    padding: "3rem 5rem",
  },
  badge: {
    "&.MuiChip-root": {
      border: `1px solid ${theme.palette.common.lighterGrey} !important`,
    },
    "& .MuiChip-label": {
      fontSize: "1.25rem",
      color: theme.palette.common.green,
    },
  },
}));

const ViewMessage = () => {
  const classes = useStyles();
  const { messageId } = useParams();
  const { loading, data, error } = useQuery(getAMessage, {
    variables: { id: messageId },
  });

  const [message, setMessage] = useState([]);

  useEffect(() => {
    if (data) {
      setMessage(data.getMessage);
    }
  }, [message, data]);
  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  const { body, recipient, subject, sender } = message;
  return (
    <Grid container direction="column">
      <Grid item container direction="column" className={classes.parentGrid}>
        <Grid item className={classes.gridWrapper}>
          <Typography variant="h3">{subject}</Typography>
        </Grid>
        <Divider />
        <Grid item style={{ padding: "1.5rem 5rem" }}>
          <Grid container alignItems="center">
            <Grid item>
              <Avatar src={displayPhoto} alt="Display photo of the sender" />
            </Grid>
            <Grid item style={{ margin: "0 3rem 0 1.5rem" }}>
              <Typography variant="h5">{sender}</Typography>
            </Grid>
            <Grid item>
              <Chip
                variant="outlined"
                label={recipient}
                className={classes.badge}
              />
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <Grid item className={classes.gridWrapper}>
          <Typography variant="body1" style={{ lineHeight: 1.85 }}>
            {body}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ViewMessage;
