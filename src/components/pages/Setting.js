import React from "react";
import { Grid } from "@mui/material";
import { ReactComponent as Administrator } from "assets/images/administrator.svg";
import { Card } from "components/Utilities";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

const Setting = () => {
  const theme = useTheme();
  return (
    <Grid
      container
      alignItems="space-between"
      gap="5rem"
      paddingY="2rem"
      justifyContent="flex-start"
    >
      <Grid item container md={5} mt={2} sm={5} xs={12}>
        <Grid item container flexDirection="column">
          <Link to="/setting/profile" style={{ textDecoration: "none" }}>
            <Card
              alt="A administrator icon used as a representation for the administrator "
              title="Diagnostics Profile"
              background={theme.palette.common.lightGreen}
            >
              <Administrator fill={theme.palette.common.green} />
            </Card>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Setting;
