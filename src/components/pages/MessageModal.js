import React from "react";

import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
  Grid,
  Paper,
  Typography,
  Stack,
  Avatar,
  Modal,
  Box,
} from "@mui/material";
import TextChat from "components/Utilities/TextChat";
import displayPhoto from "assets/images/avatar.png";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  closeIcon: {
    "&.MuiSvgIcon-root": {
      fontSize: "2rem",
      cursor: "pointer",

      "&:hover": {
        color: "green",
      },
    },
    modal: {},
    paper: {
      //   width: '70%',
      //   height: '30vh',
      //   maxWidth: '90%',
      //   maxHeight: '700px',
      //   display: 'flex',
      //   alignItems: 'center',
      //   flexDirection: 'column',
      //   position: 'relative',
      //   marginTop: 'auto !important',
    },
    paper2: {
      width: "80vw",
      maxWidth: "500px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
    },
    container: {
      width: "100vw",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      overflowY: "scroll",
      height: "calc( 100% - 80px )",
    },
  },
}));

const MessageModal = ({
  isOpen,
  handleClose,
  title,
  color,
  children,
  rowSpacing,
  height,
  minHeight,
}) => {
  const style = {
    position: "absolute",
    bottom: "0%",
    left: "50%",
    width: 500,
    height: "60vh",
    minHeight,
    bgcolor: "background.paper",
    borderRadius: "2rem 2rem 0 0",
    p: 4,
  };

  const classes = useStyles();
  const { chat } = useSelector((state) => state.tables);

  return (
    <Stack>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Grid
            container
            className={classes.modal}
            flexDirection="column"
            flexWrap="nowrap"
            gap={2}
            sx={{ height: "100%" }}
          >
            <Grid
              item
              container
              justifyContent="space-between"
              flexWrap="nowrap"
              alignItems="flex-start"
            >
              <Grid item container alignItems="center" gap={2}>
                <Grid item>
                  <Avatar src={displayPhoto} />
                </Grid>
                <Grid item>
                  <Typography variant="h3">{title ? title : ""}</Typography>
                </Grid>
                <Grid item marginLeft="auto">
                  <CloseIcon
                    color={color ? color : "secondary"}
                    className={classes.closeIcon}
                    onClick={handleClose}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item container sx={{ overflowY: "scroll" }} flexGrow={2}>
              <Grid container sx={{ paddingTop: "1rem" }}>
                {chat.map((item, index) => {
                  return (
                    <Grid
                      item
                      container
                      key={index}
                      sx={{
                        margin: ".5rem",
                        minWidth: "10%",
                        maxWidth: "80%",
                        minHeight: "1.5rem",
                      }}
                    >
                      <Paper
                        className={classes.paper}
                        style={{
                          padding: "2rem",
                          background: "black",
                          textAlign: "justify",
                          textOverflow: "wrap",
                          color: "white",
                          overflow: "hidden",
                          overflowWrap: "break-word",
                          borderRadius: "3rem 0  3rem 3rem",
                        }}
                      >
                        <Typography variant="body2">{item}</Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item container sx={{ marginTop: "auto" }}>
              <TextChat />
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Stack>
  );
};
MessageModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  children: PropTypes.node,
  title: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.string,
  minHeight: PropTypes.string,
  rowSpacing: PropTypes.number,
};

MessageModal.defaultProps = {
  minHeight: "30vh",
};

export default MessageModal;
