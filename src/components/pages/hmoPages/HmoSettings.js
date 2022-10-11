import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import SwipeableViews from "react-swipeable-views";
import { Grid, Typography, Box, Tab, Tabs, AppBar } from "@mui/material";
import EditProfileForm from "components/Forms/EditProfileForm";
import EmailChangeForm from "components/Forms/EmailChangeForm";
import ChangePasswordForm from "components/Forms/ChangePasswordForm";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number,
  value: PropTypes.number,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const HmoSettings = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  React.useEffect(() => {
    ["account_id", "email", "heala_id", "profile_id", "token"].map((text) =>
      localStorage.setItem(text, "")
    );
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Box
          sx={{
            bgcolor: "background.paper",
            width: 500,
            margin: "2rem 0rem",
            borderRadius: "5px",
          }}
        >
          <AppBar position="static" sx={{ borderRadius: "5px" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="PROFILE" {...a11yProps(0)} />
              <Tab label="EMAIL" {...a11yProps(1)} />
              <Tab label="SECURITY" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <EditProfileForm />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <EmailChangeForm />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <ChangePasswordForm />
            </TabPanel>
          </SwipeableViews>
        </Box>
      </Grid>
    </>
  );
};

HmoSettings.propTypes = {
  handleNext: PropTypes.func,
  handleNext2: PropTypes.func,
  step: PropTypes.string,
};

export default HmoSettings;
